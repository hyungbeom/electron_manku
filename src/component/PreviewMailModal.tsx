import Modal from "antd/lib/modal/Modal";
import React from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import MailFile from "@/component/MailFile";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Card from "antd/lib/card/Card";


const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',

    whiteSpace: 'nowrap'
};


export default function PreviewMailModal({data, isModalOpen, setIsModalOpen, fileList}) {
    const userInfo = useAppSelector((state) => state.user);

    function sendMail() {

    }

    function preview(e, data) {
        if (e.ctrlKey && e.button === 0) {
            window.open(data.webUrl, '_blank');
        }else{
            window.open(data.downloadUrl, '_blank');
        }
    }


    return <>
        <Modal okText={'메일 전송'} width={800} cancelText={'취소'} onOk={sendMail}
               title={<div style={{lineHeight: 2.5, fontWeight: 550}}>견적의뢰 메일 발송</div>} open={isModalOpen}
               onCancel={() => setIsModalOpen(false)}>
            <div style={{margin: '0px auto', fontSize: 13}}>

                {Object.values(data).map((v: any) => {

                    const src = Object.values(v);

                    return <div>
                        <div style={{fontSize: 18}}>{src[0][0]?.agencyManagerName}</div>
                        <div style={{fontSize: 15, paddingTop: 20}}>안녕하세요 <span
                            style={{fontWeight: 600}}>{userInfo.name}</span>입니다
                        </div>
                        <div style={{fontSize: 15, paddingTop: 5}}>아래 견적 부탁드립니다.</div>

                        {
                            src.map((source: any, index) => {


                                return <div style={{marginTop: 30}}>
                                    <Card size={'small'}>
                                        {
                                            fileList[source[0]?.estimateRequestId]?.map(v =>

                                                <div style={{display : 'flex'}}>
                                                    <Checkbox style={{paddingRight : 10}}/>
                                                    <div  style={{
                                                        fontSize: 12,
                                                        cursor: 'pointer',
                                                        color: 'blue'
                                                    }} onClick={e=>preview(e,v)}> {v.fileName}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </Card>
                                    <table style={{width: '100%', marginTop: 10}}>
                                        <thead>
                                        <tr style={{fontWeight: 'bold', height: 30}}>
                                            <th style={{
                                                ...headerStyle,
                                                textAlign: 'left',
                                                paddingLeft: 20,
                                                fontSize: 16
                                            }}>{source[0].documentNumberFull}</th>
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
                                            }}>{source[0].maker}</th>
                                        </tr>
                                        <tr style={{fontWeight: 'bold', height: 30}}>
                                            <th style={{
                                                ...headerStyle,
                                                width: 120,
                                                backgroundColor: 'gray'
                                            }}>ITEM
                                            </th>
                                            <th style={{...headerStyle, fontWeight: 500}}>{source[0].item}</th>
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
                                        {source.map((data: any, index) => {
                                            return <tr style={{fontWeight: 'bold', height: 30}}>
                                                <th style={{
                                                    ...headerStyle,
                                                    width: 40,
                                                    borderTop: "none"
                                                }}>{index + 1}</th>
                                                <th style={{
                                                    ...headerStyle,
                                                    borderTop: "none",
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
                                </div>
                            })
                        }
                        <div style={{borderBottom: '1px solid lightGray', paddingTop: 100}}/>
                    </div>
                })}

            </div>
        </Modal>
    </>
}