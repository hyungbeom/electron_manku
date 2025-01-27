import Modal from "antd/lib/modal/Modal";
import React from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',

    whiteSpace: 'nowrap'
};


export default function PreviewMailModal({data, isModalOpen, setIsModalOpen}) {
    const userInfo = useAppSelector((state) => state.user);

    function sendMail() {

    }

    console.log(userInfo,'userInfo:')


    return <>
        <Modal okText={'메일 전송'} width={800} cancelText={'취소'} onOk={sendMail}
               title={<div style={{lineHeight: 2.5, fontWeight: 550}}>견적의뢰 메일 발송</div>} open={isModalOpen}
               onCancel={() => setIsModalOpen(false)}>
            <div style={{margin: '0px auto', fontSize : 13}}>
                {Object.values(data).map((v:any) => {
                    return <div>
                        <div style={{fontSize : 18}}>{v[0].agencyManagerName}</div>
                        <div style={{fontSize : 15, paddingTop: 20}}>안녕하세요 <span style={{fontWeight : 600}}>{userInfo.name}</span>입니다</div>
                        <div style={{fontSize : 15, paddingTop: 5}}>아래 견적 부탁드립니다.</div>

                        <table style={{width: '100%', marginTop : 30}}>
                            <thead>
                            <tr style={{fontWeight: 'bold', height: 30}}>
                                <th style={{
                                    ...headerStyle,
                                    textAlign: 'left',
                                    paddingLeft: 20,
                                    fontSize : 16
                                }}>{v[0].documentNumberFull}</th>
                            </tr>
                            </thead>
                        </table>
                        <table style={{width: '100%'}}>
                            <thead>
                            <tr style={{fontWeight: 'bold', height: 30}}>
                                <th style={{...headerStyle, width: 120, borderTop: "none", backgroundColor : '#ddd'}}>MAKER</th>
                                <th style={{...headerStyle, borderTop: "none", fontWeight: 500}}>{v[0].maker}</th>
                            </tr>
                            <tr style={{fontWeight: 'bold', height: 30}}>
                                <th style={{...headerStyle, width: 120, backgroundColor : 'gray'}}>ITEM</th>
                                <th style={{...headerStyle, fontWeight: 500}}>{v[0].item}</th>
                            </tr>
                            </thead>
                        </table>
                        <table style={{width: '100%'}}>
                            <thead>
                            <tr style={{fontWeight: 'bold', height: 30}}>
                                <th style={{...headerStyle, borderTop: "none", backgroundColor : '#ddd'}}>MODEL</th>
                            </tr>
                            </thead>
                        </table>

                        {v?.map((src, i) => {
                            return <div >
                                <table style={{width: '100%'}}>
                                    <thead>
                                    <tr style={{fontWeight: 'bold', height: 30}}>
                                        <th style={{...headerStyle, width: 40, borderTop: "none"}}>{i + 1}</th>
                                        <th style={{...headerStyle, borderTop: "none", fontWeight: 500}}>{src.model}</th>
                                        <th style={{...headerStyle, width: 100, borderTop: "none", fontWeight: 500}}>{src.quantity} {src.unit}</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        })}
                        <div style={{borderBottom : '1px solid lightGray', paddingTop : 100}}/>
                    </div>
                })}

            </div>
        </Modal>
    </>
}