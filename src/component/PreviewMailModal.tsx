import Modal from "antd/lib/modal/Modal";
import React, {memo, useEffect, useState} from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Card from "antd/lib/card/Card";
import {getData} from "@/manage/function/api";
import _ from "lodash";
import {inputForm, textAreaForm} from "@/utils/commonForm";
import message from "antd/lib/message";
import {SendOutlined} from "@ant-design/icons";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {SubSend} from "@/component/SubSend";
import Button from "antd/lib/button";

function formatDocumentNumbers(documentNumbersArray) {
    let output = '';
    let groupedNumbers = {};  // 공통 접두사로 그룹화

    // 배열의 각 documentNumber를 그룹화
    documentNumbersArray.forEach(num => {
        num = num.trim();  // 불필요한 공백 제거
        const prefix = num.split('-').slice(0, 2).join('-');  // 공통 접두사 추출
        if (!groupedNumbers[prefix]) {
            groupedNumbers[prefix] = [];
        }
        groupedNumbers[prefix].push(num.split('-')[2]);  // 접두사를 제외한 번호 부분만 저장
    });

    // 그룹화된 결과로 출력 생성
    Object.keys(groupedNumbers).forEach(prefix => {
        const numbers = groupedNumbers[prefix].sort().join(', ');  // 숫자 부분을 정렬하고, 한 줄로 결합
        output += `${prefix}-${numbers}\n`;  // K21-25-0001, 0002 형식으로 출력
    });

    return output.trim();  // 맨 끝에 불필요한 공백 제거
}


function generateFormattedOutputWithDocumentNumbers(data, code) {
    let output = '';
    let documentNumbers = {};  // documentNumberFull을 저장할 객체

    let groupedData = {};

    // 그룹화: 같은 documentNumberFull을 가진 항목들을 묶기
    data.forEach(arr => {
        arr.forEach(item => {
            if (!groupedData[item.documentNumberFull]) {
                groupedData[item.documentNumberFull] = {
                    maker: item.maker,
                    item: item.item,
                    models: []
                };
            }
            groupedData[item.documentNumberFull].models.push({
                model: item.model,
                quantity: item.quantity,
                unit: item.unit
            });

            // documentNumberFull을 객체에 저장
            documentNumbers[item.documentNumberFull] = true;
        });
    });


    const sortedKeys = Object.keys(groupedData).sort((a, b) => {
        const numA = parseInt(a.split('-')[2], 10); // "1103"
        const numB = parseInt(b.split('-')[2], 10); // "1102"
        return numA - numB; // 내림차순
    });


    // 출력 형식 생성
    sortedKeys.forEach(docNumber => {
        const {maker, item, models} = groupedData[docNumber];
        if (output) {
            // documentNumberFull 앞에 한 줄 띄우기
            output += '\n';
        }

        output += `${docNumber}`;
        output += `\nMaker : ${maker}\n`;
        output += `Item : ${item}\n`;
        output += `Model :\n`;

        models.forEach((model, index) => {

            let text = `${index + 1}) ${model.model}`; // ← 테스트할 문자열

            let lines = text.split('\n');
            lines.forEach((v, i) => {
                if (!i) {
                    lines[i] = lines[i].trimEnd() + `     ---${model.quantity}${model.unit}`;
                } else {
                    lines[i] = `    ${lines[i]}`;
                }
            })
            let result = lines.join('\n');

            output += `${result}\n`;
        });

        // 줄 간격 추가 (각 항목 사이에 빈 줄 추가)
        output += '\n';
    });

    let ment = ''
    if (code.startsWith('K')) {
        ment = '문의사항은 언제든지 연락 부탁 드립니다.\n' +
            '\n' +
            '감사합니다.'
    } else {
        ment = 'Best Regards'
    }

    // documentNumberFull만 객체로 리턴
    return {
        output: output + '\n\n' + ment,
        documentNumbers: Object.keys(documentNumbers)
    };
}


function PreviewMailModal({data, isModalOpen, setIsModalOpen, fileList}) {

    const userInfo = useAppSelector((state) => state.user);
    const notificationAlert = useNotificationAlert();
    const [info, setInfo] = useState<any>();
    const [checkList, setCheckList] = useState<any>([]);
    useEffect(() => {


        const list = Object.values(data).map(src => {
            const {
                agencyManagerName,
                agencyManagerEmail,
                agencyManagerId,
                agencyCode,
                managerAdminName,
                managerAdminId
            } = Object.values(src)[0][0];

            const {output, documentNumbers} = generateFormattedOutputWithDocumentNumbers(Object.values(src), agencyCode)


            let content = ''
            if (agencyCode.startsWith('K')) {
                content = `${agencyManagerName ? agencyManagerName : '직접입력'} 님  \n\n안녕하십니까 만쿠무역 ${managerAdminName} 입니다.\n아래 확인하시어 견적 부탁 드립니다.\n\n\n`
            } else {
                content = `Dear ${agencyManagerName ? agencyManagerName : '직접입력'}  \n\nPlease see below and let me know your quote\n\n\n`
            }

            return {
                agencyCode: agencyCode,
                agencyManagerName: agencyManagerName,
                agencyManagerEmail: agencyManagerEmail,
                agencyManagerId: agencyManagerId,
                sendName: userInfo.name,
                detailList: Object.values(src),
                ccList: [],
                title: 'RFQ ' + formatDocumentNumbers(documentNumbers),
                contents: content + output
            }
        })

        setInfo(list)
    }, [data])


    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    async function sendMail() {
        showModal();
    }

    async function sendEmail() {
        const result = info.map((v, idx) => {

            let detailList = []

            v.detailList.map(source => {
                {
                    source.forEach((data: any, index) => {
                        detailList.push(data.estimateRequestDetailId)
                    })
                }
            })

            const searchDom = document.getElementById(`cc_${idx}`)

            const list = searchDom.querySelectorAll('input')

            let bowl = []

            let checked = false;
            list.forEach(v => {
                if (isValidEmail(v.value)) {
                    bowl.push(v.value)
                } else {
                    checked = true
                    v.style.borderColor = 'red'
                }
            })

            if (checked) {
                message.error('올바른 형식의 이메일이 아닙니다.')
                return false;
            }

            return {
                email: v.agencyManagerEmail,
                name: v.sendName,
                fileIdList: checkList[idx] ? checkList[idx] : [],
                estimateRequestDetailIdList: detailList,
                content: v.contents,
                subject: v.title,
                ccList: bowl
            }
        })

        const {name, contactNumber, position, englishName, department} = userInfo;
        const list = result.map(v => {
            v.content = v.content.replace(/\n/g, "<br>");
            return {
                ...v, content: info[0].agencyCode.startsWith('K') ? `<div><div>${v.content}</div>
<div style="padding-top: 200px">
    <div style="font-size: 15px; font-weight: 800;">${name} ${position}(${englishName})/${department}</div>
    <div style="font-weight: normal;">Mobile ${contactNumber}</div>
    <div style="color: #56cbdb; font-weight: 500;">주식회사 만쿠무역(Manku Trading)</div>
    <div style="font-weight: 500;">서울시 송파구 충민로 52 가든파이브 웍스 B동 211,212호</div>
    <div style="font-weight: 500;">Post Code 05839</div>
    <div style="text-decoration: underline;">Tel: +82/2-465-7838</div>
    <div style="text-decoration: underline;">Fax: +82/2-465-7839</div>
    <a href="https://www.manku.co.kr" style="text-decoration: none; color: inherit;">www.manku.co.kr</a>
</div>
</div>` : `<div><div>${v.content}</div>
<div style="padding-top: 200px">
    <div style="font-size: 15px; font-weight: 800;">${englishName}</div>
    <div style="color: #56cbdb; font-weight: 500;">Manku Trading Co., Ltd.</div>
    <div style="font-weight: 500;">B- 211#, Garden Five Works, 52, Chungmin- ro , Songpa-gu, Seoul, South Korea</div>
    <div style="font-weight: 500;">Post Code 05839</div>
    <div style="text-decoration: underline;">Tel: +82/2-465-7838</div>
 <div style="text-decoration: underline;">HP: +82/${contactNumber}</div>
    <div style="text-decoration: underline;">Fax: +82/2-465-7839</div>
    <a href="https://www.manku.co.kr" style="text-decoration: none; color: inherit;">www.manku.co.kr</a>
</div>
</div>`
            }

        })

        await getData.post('estimate/sendMailEstimateRequests', {mailList: list}).then(v => {
            if (v.data.code === 1) {


                notificationAlert('success', '💾메일전송 완료',
                    <>
                        <div>{info[0]['title']} {info.length > 1 ? ('외' + (info.length - 1) + '건이 발송 완료되었습니다.') : ''} </div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                // message.success(v.data.message);
            } else {
                message.warning(v.data.message);
            }
            setIsModalOpen(false)
        }, err => console.log(err, '::::err'))
    }

    function preview(e, data) {
        if (e.ctrlKey && e.button === 0) {
            window.open(data.webUrl, '_blank');
        } else {
            window.open(data.downloadUrl, '_blank');
        }
    }

    function onChange(e, value) {

        let copyData = _.cloneDeep(info);
        copyData[value][e.target.id] = e.target.value;
        setInfo(copyData);

    }

    function onCheck(e, v, idx) {

        let copyList = _.cloneDeep(checkList)
        if (e.target.checked) {
            if (!copyList[idx]) {
                copyList[idx] = [];
            }
            copyList[idx] = [...copyList[idx], v.fileId]

            setCheckList(copyList)
        } else {
            copyList[idx] = copyList[idx]?.filter(data => data !== v.fileId)

            setCheckList(copyList)
        }
    }

    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        sendEmail()
        setIsModalOpen(false);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };


    function getAddress() {
        getData.post('account/getMyContactList').then(v => {
            console.log(v, ':::')
        })
    }

    return <>
        <Modal title="" open={open} cancelText={'취소'} okText={'확인'} onOk={handleOk} onCancel={handleCancel}>
            <p>메일을 전송하시겠습니까?</p>
        </Modal>
        <Modal okText={<><SendOutlined/> 메일 전송</>} width={1000} cancelText={'취소'} onOk={sendMail}
               title={<><div style={{height: 25, textAlign: 'center'}}>견적의뢰 메일 발송</div></>} open={isModalOpen}
               onCancel={() => {
                   setIsModalOpen(false)
               }}>
            <div>
                <div style={{margin: '0px auto', fontSize: 13}}>

                    {info?.map((src, idx) => {

                        return <div>
                            <div style={{display: 'grid', gridTemplateColumns: '100px 1fr', gap: 5}}>
                                <Button style={{fontSize : 12}} size={'small'} type={'dashed'} onClick={()=>{
                                    // @ts-ignore
                                    window.electron?.launchOutlook({to : src.agencyManagerEmail, subject : src.title, body : src['contents'], cc : ''});
                                }}>OUT LOOK</Button>
                                <div></div>
                                <Button type={'primary'} size={'small'} style={{fontSize: 12, marginTop: 5}}>보낸
                                    사람(M)</Button>
                                {inputForm({
                                    title: '',
                                    id: 'email',
                                    onChange: e => onChange(e, idx),
                                    data: userInfo,
                                    disable: true,
                                    size: 'middle',
                                })}
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '100px 1fr', gap: 5}}>
                                <Button type={'primary'} size={'small'} style={{fontSize: 12, marginTop: 5}}
                                        onClick={getAddress}>받는 사람(T)</Button>
                                {inputForm({
                                    title: '',
                                    id: 'agencyManagerEmail',
                                    onChange: e => onChange(e, idx),
                                    data: src,
                                    value: src.agencyManagerEmail,
                                    size: 'middle',
                                })}
                            </div>
                            <SubSend idx={idx}/>
                            <div style={{paddingTop: 15}}>
                                <div style={{display: 'grid', gridTemplateColumns: '100px 1fr', gap: 5}}>

                                    <Button type={'primary'} size={'small'}
                                            style={{fontSize: 12, marginTop: 5}}>제목(U)</Button>
                                    {inputForm({
                                        title: '',
                                        id: 'title',
                                        onChange: e => onChange(e, idx),
                                        data: src,
                                        value: src.title,
                                        size: 'middle'
                                    })}
                                </div>
                            </div>


                            {textAreaForm({
                                title: '',
                                id: 'contents',
                                data: src,
                                onChange: e => onChange(e, idx),
                                maxLength: 10000,
                                rows: 15
                            })}
                            <Card size={'small'} title={'첨부파일'} style={{marginTop: 15}}>
                                {src.detailList.map(v => {
                                    return <>
                                        {
                                            fileList[v[0].estimateRequestId]?.map(v =>
                                                <>
                                                    <div style={{display: 'flex'}}>
                                                        <Checkbox style={{paddingRight: 10}}
                                                                  onChange={e => onCheck(e, v, idx)}/>
                                                        <div style={{
                                                            fontSize: 12,
                                                            cursor: 'pointer',
                                                            color: 'blue'
                                                        }} onClick={e => preview(e, v)}> {v.fileName}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                        {!src.detailList.length ? <div></div> : <></>}
                                    </>
                                })
                                }
                            </Card>
                            <div style={{borderBottom: '1px solid lightGray', marginBottom: 50, paddingTop: 20}}/>
                        </div>
                    })}
                </div>
            </div>
        </Modal>
    </>
}

export default memo(PreviewMailModal, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});


