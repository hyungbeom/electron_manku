import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Card from "antd/lib/card/Card";
import {getData} from "@/manage/function/api";
import Input from "antd/lib/input";
import _ from "lodash";
import Button from "antd/lib/button";
import {inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import message from "antd/lib/message";


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
                title: 'Inquiry ' + formatDocumentNumbers(documentNumbers),
                contents: `${agencyManagerName}  \n\n아래 진행 부탁 드립니다.\n\n` + output
            }
        })

        setInfo(list)
    }, [data])


    async function sendMail() {


        const result = info.map((v, idx) => {

            let sumDiv = ''
            let detailList = []
            let firstResult = v.detailList.map(source => {


                {
                    source.forEach((data: any, index) => {
                        sumDiv += `<tr style="font-weight : bold; height : 30px" >
                            <th style="border : 1px solid lightgrey width: 40px; border-top: none">${index + 1})</th>
                            <th style="border : 1px solid lightgrey; border-top: none; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;text-align: left; font-weight: 500;">  ${data.model.replace(/\n/g, '<br>')}</th>
                            <th style="border : 1px solid lightgrey; width: 100px;border-top: none;font-weight: 500;">---- ${data.quantity} ${data.unit}</th>
                        </tr>`
                        detailList.push(data.estimateRequestDetailId)
                    })
                }

                let sendDom = `<thead>
                <div>${source[0].documentNumberFull}</div>
                <div>Maker : ${source[0].maker}</div>
                <div>Item : ${source[0].item}</div>
                <div>Model :</div>
                  <table style="border : 1px solid lightgrey">
                                    <thead>${sumDiv}</thead></table>
            </div>`
                sumDiv = ''
                return sendDom;
            })

            return {
                email: v.agencyManagerEmail,
                name: v.sendName,
                fileIdList: checkList[idx] ? checkList[idx] : [],
                estimateRequestDetailIdList: detailList,
                content: v.contents,
                subject: v.title,
                ccList: null
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
                message.success(v.data.message);
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

    return <>
        <Modal okText={'메일 전송'} width={700} cancelText={'취소'} onOk={sendMail}
               title={<div style={{lineHeight: 2.5, fontWeight: 550}}>견적의뢰 메일 발송</div>} open={isModalOpen}
               onCancel={() => {
                   setIsModalOpen(false)
               }}>
            <div style={{margin: '0px auto', fontSize: 13}}>

                {info?.map((src, idx) => {

                    console.log(src['contents'], ':::')
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
                        {inputForm({
                            title: '메일 제목',
                            id: 'title',
                            onChange: e => onChange(e, idx),
                            data: src,
                            value: src.title,
                            size: 'middle'
                        })}


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