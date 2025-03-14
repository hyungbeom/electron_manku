import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Card from "antd/lib/card/Card";
import {getData} from "@/manage/function/api";
import _ from "lodash";
import {inputForm, textAreaForm} from "@/utils/commonForm";
import message from "antd/lib/message";
import {MinusCircleOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";


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


function generateFormattedOutputWithDocumentNumbers(data) {
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

    // 출력 형식 생성
    Object.keys(groupedData).forEach(docNumber => {
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
            output += `${index + 1}) ${model.model} ---${model.quantity}${model.unit}\n`;
        });

        // 줄 간격 추가 (각 항목 사이에 빈 줄 추가)
        output += '\n';
    });

    // documentNumberFull만 객체로 리턴
    return {
        output: output + '\n\n\n' + '감사합니다',
        documentNumbers: Object.keys(documentNumbers)
    };
}


export default function PreviewMailModal({data, isModalOpen, setIsModalOpen, fileList}) {
    const userInfo = useAppSelector((state) => state.user);
    const notificationAlert = useNotificationAlert();
    const [info, setInfo] = useState<any>();
    const [checkList, setCheckList] = useState<any>([]);
    useEffect(() => {
        const list = Object.values(data).map(src => {
            const {agencyManagerName, agencyManagerEmail, agencyManagerId} = Object.values(src)[0][0];

            const {output, documentNumbers} = generateFormattedOutputWithDocumentNumbers(Object.values(src))


            return {
                agencyManagerName: agencyManagerName,
                agencyManagerEmail: agencyManagerEmail,
                agencyManagerId: agencyManagerId,
                sendName: userInfo.name,
                detailList: Object.values(src),
                ccList: [],
                title: 'RFQ ' + formatDocumentNumbers(documentNumbers),
                contents: `${agencyManagerName}  \n\n아래 진행 부탁 드립니다.\n\n` + output
            }
        })

        setInfo(list)
    }, [data])

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    async function sendMail() {
        const result = info.map((v, idx) => {

            let sumDiv = ''
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

        const {name, contactNumber} = userInfo;

        const list = result.map(v => {
            v.content = v.content.replace(/\n/g, "<br>");
            return {
                ...v, content: `<div><div>${v.content}</div>
<div style="padding-top: 200px">
    <div style="font-size: 15px; font-weight: 800;">${name}</div>
    <div style="font-weight: normal;">President</div>
    <div style="color: #56cbdb; font-weight: 500;">Manku Trading Co., Ltd.</div>
    <div style="font-weight: 500;">B-802#, 114, Beobwon-ro, Songpa-gu, Seoul, Republic of Korea</div>
    <div style="font-weight: 500;">Post Code 05854</div>
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

                console.log(info['title'],'info:')
                notificationAlert('success', '💾메일전송 완료',
                    <>
                        <div>{info[0]['title']} {info.length > 1 ? ('외' + (info.length -1) + '건이 발송 완료되었습니다.') : ''} </div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                    {}
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


    const SubSend = ({idx}) => {

        const [count, setCount] = useState([])

        return <div id={`cc_${idx}`}>
            <div style={{paddingBottom : 10}}>참조</div>
            {count.map((src,numb) => {
                return <div style={{width: '100%', display : 'flex'}}>
                    <input type="text" style={{width: '50%', marginTop : 3}} onChange={e => {

                        e.target.style.border = ''
                    }}/>
                    <MinusCircleOutlined style={{color : 'red', fontSize : 15, fontWeight : 700, paddingLeft : 5, cursor : 'pointer', opacity : 0.7}} onClick={()=>{
                        setCount(v=>{
                            let copyArr = [...v]
                            copyArr.splice(numb, 1)
                            return copyArr
                        })
                    }}/>
                </div>
            })}

            <span style={{color: 'blue', cursor : 'pointer'}} onClick={() => {
                setCount(v => {
                    return [...v, '']
                })
            }}>추가<PlusSquareOutlined /></span>
        </div>
    }


    return <>
        <Modal okText={'메일 전송'} width={700} cancelText={'취소'} onOk={sendMail}
               title={<div style={{lineHeight: 2.5, fontWeight: 550}}>견적의뢰 메일 발송</div>} open={isModalOpen}
               onCancel={() => {
                   setIsModalOpen(false)
               }}>
            <div style={{margin: '0px auto', fontSize: 13}}>

                {info?.map((src, idx) => {


                    return <div>
                        <div>
                            {inputForm({
                                title: '수신자 이메일',
                                id: 'agencyManagerEmail',
                                onChange: e => onChange(e, idx),
                                data: src,
                                value: src.agencyManagerEmail,
                                size: 'middle',
                            })}</div>
                        <SubSend idx={idx}/>

                        <div style={{paddingTop: 15}}>
                            {inputForm({
                                title: '메일 제목',
                                id: 'title',
                                onChange: e => onChange(e, idx),
                                data: src,
                                value: src.title,
                                size: 'middle'
                            })}
                        </div>


                        {textAreaForm({
                            title: '발신 내용',
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
        </Modal>
    </>
}