import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Card from "antd/lib/card/Card";
import {getData} from "@/manage/function/api";
import Input from "antd/lib/input";
import _ from "lodash";
import Button from "antd/lib/button";


const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap'
};


export default function PreviewMailModal({data, isModalOpen, setIsModalOpen, fileList}) {
    const userInfo = useAppSelector((state) => state.user);

    const [info, setInfo] = useState<any>();
    const [checkList, setCheckList] = useState<any>([]);
    useEffect(() => {
        const list = Object.values(data).map(src => {
            const {agencyManagerName, agencyManagerEmail, agencyManagerId} = Object.values(src)[0][0];


            return {
                agencyManagerName: (agencyManagerName && agencyManagerName !== 'null') ? agencyManagerName : '이형범 사원님',
                agencyManagerEmail: agencyManagerEmail ? agencyManagerEmail : 'hblee@progist.co.kr',
                agencyManagerId: agencyManagerId,
                sendName: userInfo.name,
                detailList: Object.values(src),

            }
        })
        setInfo(list)
    }, [data])


    async function sendMail() {


        const result = info.map((v, idx) => {
            let sumDiv = ''
            let detailList = []
            v.detailList.forEach(source => {

                source.map(data=>{
                    sumDiv += `<div>${data.model} ========= ${data.quantity} ${data.unit}</div>`;
                    detailList.push(data.estimateRequestDetailId)
                })
            })


            let sendDom = `<div>
                <div>${v.detailList[0][0].documentNumberFull}</div>
                <div>${v.detailList[0][0].maker}</div>
                <div>${v.detailList[0][0].item}</div>
                <div>====Model====</div>
                <div>${sumDiv}</div>
            </div>`


            return {
                email: v.agencyManagerEmail,
                name: v.sendName,
                fileIdList: checkList[idx] ? checkList[idx] : [],
                estimateRequestDetailIdList: detailList,
                content: sendDom,
                subject: `${v?.agencyManagerName} 안녕하세요`,
                ccList: null
            }
        })


        const list = result.map(v => {
            return {
                ...v, content: `<div>

        <div style="font-size : 15px; padding-top : 20px;">안녕하세요 <span style="font-weight: 600;">${v.name}</span>입니다.</div>
                           <div style="font-size: 15px; padding-top: 5px; padding-bottom: 30px">아래 견적 부탁드립니다.</div>${v.content}</div>`
            }
        })

        await getData.post('estimate/sendMailEstimateRequests', {mailList: list}).then(v => {
            console.log(v, ':::::')
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

    console.log(checkList, '::')
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

                            <div><Input prefix={<Button type={'primary'} size={'small'}  style={{marginRight : 10}}>수신자 이메일 : </Button>} style={{fontSize: 15, width: 400, padding : 5}}
                                        value={src.agencyManagerEmail}
                                        size={'small'}
                                        id={'agencyManagerEmail'}
                                        onChange={e => onChange(e, idx)}/>
                            </div>
                            <Input prefix={<Button type={'primary'} size={'small'} style={{marginRight : 10}} >수신자 이름 : </Button>} style={{fontSize: 15, width: 250, marginTop : 10, padding : 5}}
                                   size={'small'}
                                   value={src?.agencyManagerName}
                                   id={'agencyManagerName'}
                                   onChange={e => onChange(e, idx)}/></div>
                        <div style={{fontSize: 15, paddingTop: 20}}>안녕하세요 <Input size={'small'} style={{fontWeight: 600, width: 130}}
                                                                                 value={src.sendName}
                                                                                 onChange={e => onChange(e, idx)}
                                                                                 id={'sendName'}/>입니다
                        </div>
                        <div style={{fontSize: 15, paddingTop: 5}}>아래 견적 부탁드립니다.</div>


                        {src.detailList.map(v => {
                            return <><Card size={'small'} title={'첨부파일'} style={{marginTop : 30}}>
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
                            </Card>
                                <table style={{width: '100%', marginTop : 5}}>
                                    <thead>
                                    <tr style={{fontWeight: 'bold', height: 30}}>
                                        <th style={{
                                            ...headerStyle,
                                            textAlign: 'left',
                                            paddingLeft: 20,
                                            fontSize: 16
                                        }}>{v[0].documentNumberFull}</th>
                                    </tr>
                                    </thead>
                                </table>
                                <table style={{width: '100%'}}>
                                    <thead>
                                    <tr style={{fontWeight: 'bold', height: 30}}>
                                        <th style={{
                                            ...headerStyle,
                                            width: 120,
                                            borderTop: "none",
                                            backgroundColor: '#ddd'
                                        }}>MAKER
                                        </th>
                                        <th style={{
                                            ...headerStyle,
                                            borderTop: "none",
                                            fontWeight: 500
                                        }}>{v[0].maker}</th>
                                    </tr>
                                    <tr style={{fontWeight: 'bold', height: 30}}>
                                        <th style={{
                                            ...headerStyle,
                                            width: 120,
                                            backgroundColor: 'gray'
                                        }}>ITEM
                                        </th>
                                        <th style={{...headerStyle, fontWeight: 500}}>{v[0].item}</th>
                                    </tr>
                                    </thead>
                                </table>
                                <table style={{width: '100%'}}>
                                    <thead>
                                    <tr style={{fontWeight: 'bold', height: 30}}>
                                        <th style={{
                                            ...headerStyle,
                                            borderTop: "none",
                                            backgroundColor: '#ddd'
                                        }}>MODEL
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                                <table style={{width: '100%'}}>
                                    <thead>
                                    {v.map((data: any, index) => {
                                        return <tr style={{fontWeight: 'bold', height: 30}}>
                                            <th style={{
                                                ...headerStyle,
                                                width: 40,
                                                borderTop: "none"
                                            }}>{index + 1}</th>
                                            <th style={{
                                                ...headerStyle,
                                                borderTop: "none",
                                                whiteSpace : 'pre-wrap',
                                                wordWrap : 'break-word',
                                                overflowWrap : 'break-word',
                                                textAlign : 'left',
                                                fontWeight: 500
                                            }}>{data.model}</th>
                                            <th style={{
                                                ...headerStyle,
                                                width: 100,
                                                borderTop: "none",
                                                fontWeight: 500
                                            }}>{data.quantity} {data.unit}</th>
                                        </tr>
                                    })}


                                    </thead>
                                </table>
                            </>
                        })}

                        <div style={{borderBottom: '1px solid lightGray', paddingTop: 100}}/>
                    </div>
                })}
            </div>
        </Modal>
    </>
}