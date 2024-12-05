import Modal from "antd/lib/modal/Modal";
import React from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

export default function PreviewMailModal({data, isModalOpen, setIsModalOpen}) {
    const userInfo = useAppSelector((state) => state.user);

    function sendMail(){

    }

    return <>
        <Modal okText={'메일 전송'} cancelText={'취소'} onOk={sendMail}
               title={<div style={{lineHeight: 2.5, fontWeight: 550}}>견적의뢰 메일 발송</div>} open={isModalOpen}
               onCancel={() => setIsModalOpen(false)}>


            {data.map((v, idx) => {
                return <>
                    <div key={idx} style={{width: '100%', height: 'auto', paddingTop: 20}}>
                        [<span
                        // style={{fontWeight: 550}}>{v.agencyManagerName}</span>]님<br/><br/>안녕하십니까.
                        style={{fontWeight: 550}}>{v.managerName}</span>]님<br/><br/>안녕하십니까.
                        [<span style={{fontWeight: 550}}>만쿠무역 {userInfo.name}</span>]입니다.<br/>
                        아래 견적 부탁드립니다.
                    </div>

                    <div style={{
                        textAlign: 'center',
                        lineHeight: 2.2,
                        display: 'flex',
                        flexDirection: 'column',
                        flexFlow: 'column'
                    }}>
                        <div style={{
                            marginTop: 20,
                            width: '100%',
                            height: '35px',
                            fontSize: 15,
                            borderTop: '1px solid #121212',
                            borderBottom: '1px solid #A3A3A3',
                            textAlign : 'left',
                            paddingLeft : 10,
                            fontWeight : 700
                        }}>
                            {v.documentNumberFull}
                        </div>
                        <div style={{
                            width: '100%',
                            height: '35px',
                            borderBottom: '1px solid #A3A3A3',
                            display: 'flex'
                        }}>
                            <div style={{
                                fontSize: '13px',
                                backgroundColor: '#EBF6F7',
                                width: '102px',
                                height: '100%',
                                borderRight: '1px solid #121212'
                            }}>Maker
                            </div>
                            <div style={{lineHeight: 2, paddingLeft: 32}}>{v.maker}</div>
                        </div>
                        <div style={{width: '100%', height: 35, display: "flex", borderBottom: '1px solid #A3A3A3',}}>
                            <div style={{
                                fontSize: '13px',
                                backgroundColor: '#EBF6F7',
                                width: '102px',
                                height: '100%',
                                borderRight: '1px solid #121212'
                            }}>Item
                            </div>
                            <div style={{lineHeight: 2, paddingLeft: 32}}>{v.item}</div>
                        </div>


                        <div style={{
                            lineHeight: 1.9,
                            width: '100%',
                            height: 35,
                            fontSize: 18,
                            borderTop: '1px solid #121212',
                            borderBottom: '1px solid #A3A3A3',
                            backgroundColor: '#EBF6F7'
                        }}>
                            Model
                        </div>
                        {v.list.map((src, idx) => {
                            return <div
                                style={{
                                    width: '100%',
                                    height: 35,
                                    borderBottom: '1px solid #A3A3A3',
                                    display: 'flex'
                                }}>
                                <div style={{lineHeight: 2, textAlign : 'center', padding : '0px 10px'}}><span
                                    style={{fontWeight: 550}}>{idx + 1}</span> </div>
                                <div style={{
                                    fontSize: 13,
                                    letterSpacing: -1,
                                    lineHeight: 2.5,
                                    width: 340,
                                    height: '100%',
                                    borderRight: '1px solid #121212',
                                    borderLeft: '1px solid #121212'
                                }}>{src.model}</div>
                                <div style={{lineHeight: 2, paddingLeft: 30,}}><span
                                    style={{fontWeight: 550}}>{src.quantity}</span> {src.unit}</div>
                            </div>

                        })}
                    </div>
                </>
            })}
        </Modal>
    </>
}