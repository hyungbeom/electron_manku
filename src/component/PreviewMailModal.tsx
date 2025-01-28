import Modal from "antd/lib/modal/Modal";
import React from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import MailFile from "@/component/MailFile";
import Checkbox from "antd/lib/checkbox/Checkbox";


const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',

    whiteSpace: 'nowrap'
};


export default function PreviewMailModal({data, isModalOpen, setIsModalOpen, fileList}) {
    const userInfo = useAppSelector((state) => state.user);

    console.log(data, 'data')
    console.log(fileList, 'fileList')

    function sendMail() {
        const groupedData = {};

        Object.keys(data).forEach(category => {
            data[category].forEach(record => {
                const docNumber = record.documentNumberFull || "unknown";
                if (!groupedData[docNumber]) {
                    groupedData[docNumber] = [];
                }
                groupedData[docNumber].push(record);
            });
        });

        console.log(groupedData);
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
                            src.map((source:any, index) => {


                                return <div>
                                    <div style={{fontSize: 18}}>첨부파일 리스트(실제 메일에는 들어가지 않는 text입니다.)</div>
                                    {
                                        fileList[source[0]?.estimateRequestId]?.map(v =>
                                            <div>
                                                <Checkbox style={{
                                                    fontSize: 16,
                                                    cursor: 'pointer',
                                                    color: 'blue'
                                                }}> {v.fileName}
                                                </Checkbox>
                                            </div>
                                        )
                                    }
                                    <table style={{width: '100%', marginTop: 30}}>
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
                                        {source.map((data:any, index) => {
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

                                // source.map(resource=>{
                                //
                                //     return <>
                                //         <div style={{paddingTop: 30}}>
                                //
                                //             <div style={{fontSize: 18}}>첨부파일 리스트(실제 메일에는 들어가지 않는 text입니다.)</div>
                                //             {/*{fileList[resource?.estimateRequestId].map(v => {*/}
                                //             {/*    return <div>*/}
                                //             {/*        <Checkbox style={{*/}
                                //             {/*            fontSize: 16,*/}
                                //             {/*            cursor: 'pointer',*/}
                                //             {/*            color: 'blue'*/}
                                //             {/*        }}> {v.fileName}*/}
                                //             {/*        </Checkbox></div>*/}
                                //             {/*})}*/}
                                //
                                //
                                //             <table style={{width: '100%', marginTop: 30}}>
                                //                 <thead>
                                //                 <tr style={{fontWeight: 'bold', height: 30}}>
                                //                     <th style={{
                                //                         ...headerStyle,
                                //                         textAlign: 'left',
                                //                         paddingLeft: 20,
                                //                         fontSize: 16
                                //                     }}>{resource.documentNumberFull}</th>
                                //                 </tr>
                                //                 </thead>
                                //             </table>
                                //             <table style={{width: '100%'}}>
                                //                 <thead>
                                //                 <tr style={{fontWeight: 'bold', height: 30}}>
                                //                     <th style={{
                                //                         ...headerStyle,
                                //                         width: 120,
                                //                         borderTop: "none",
                                //                         backgroundColor: '#ddd'
                                //                     }}>MAKER
                                //                     </th>
                                //                     <th style={{
                                //                         ...headerStyle,
                                //                         borderTop: "none",
                                //                         fontWeight: 500
                                //                     }}>{resource.maker}</th>
                                //                 </tr>
                                //                 <tr style={{fontWeight: 'bold', height: 30}}>
                                //                     <th style={{
                                //                         ...headerStyle,
                                //                         width: 120,
                                //                         backgroundColor: 'gray'
                                //                     }}>ITEM
                                //                     </th>
                                //                     <th style={{...headerStyle, fontWeight: 500}}>{resource.item}</th>
                                //                 </tr>
                                //                 </thead>
                                //             </table>
                                //             <table style={{width: '100%'}}>
                                //                 <thead>
                                //                 <tr style={{fontWeight: 'bold', height: 30}}>
                                //                     <th style={{
                                //                         ...headerStyle,
                                //                         borderTop: "none",
                                //                         backgroundColor: '#ddd'
                                //                     }}>MODEL
                                //                     </th>
                                //                 </tr>
                                //                 </thead>
                                //             </table>
                                //             <table style={{width: '100%'}}>
                                //                 <thead>
                                //                 {/*{datas[src.documentNumberFull].map((source, index) => {*/}
                                //                 {/*    return <tr style={{fontWeight: 'bold', height: 30}}>*/}
                                //                 {/*        <th style={{*/}
                                //                 {/*            ...headerStyle,*/}
                                //                 {/*            width: 40,*/}
                                //                 {/*            borderTop: "none"*/}
                                //                 {/*        }}>{index + 1}</th>*/}
                                //                 {/*        <th style={{*/}
                                //                 {/*            ...headerStyle,*/}
                                //                 {/*            borderTop: "none",*/}
                                //                 {/*            fontWeight: 500*/}
                                //                 {/*        }}>{src.model}</th>*/}
                                //                 {/*        <th style={{*/}
                                //                 {/*            ...headerStyle,*/}
                                //                 {/*            width: 100,*/}
                                //                 {/*            borderTop: "none",*/}
                                //                 {/*            fontWeight: 500*/}
                                //                 {/*        }}>{src.quantity} {source.unit}</th>*/}
                                //                 {/*    </tr>*/}
                                //                 {/*})}*/}
                                //
                                //
                                //                 </thead>
                                //
                                //
                                //             </table>
                                //         </div>
                                //     </>
                                // })
                            })
                        }


                        {/*    {v?.map((src, i) =>

                    {/*    return <div style={{paddingTop : 30}}>*/}
                        {/*        <div style={{fontSize : 18}}>첨부파일 리스트(실제 메일에는 들어가지 않는 text입니다.)</div>*/}
                        {/*        {fileList[src?.estimateRequestId].map(v=>{*/}
                        {/*            return <div>*/}
                        {/*                <Checkbox style={{fontSize: 16, cursor: 'pointer', color: 'blue'}}> {v.fileName}*/}
                        {/*                </Checkbox></div>*/}
                        {/*        })}*/}


                        {/*        <table style={{width: '100%', marginTop: 30}}>*/}
                        {/*            <thead>*/}
                        {/*            <tr style={{fontWeight: 'bold', height: 30}}>*/}
                        {/*                <th style={{*/}
                        {/*                    ...headerStyle,*/}
                        {/*                    textAlign: 'left',*/}
                        {/*                    paddingLeft: 20,*/}
                        {/*                    fontSize: 16*/}
                        {/*                }}>{src.documentNumberFull}</th>*/}
                        {/*            </tr>*/}
                        {/*            </thead>*/}
                        {/*        </table>*/}
                        {/*        <table style={{width: '100%'}}>*/}
                        {/*            <thead>*/}
                        {/*            <tr style={{fontWeight: 'bold', height: 30}}>*/}
                        {/*                <th style={{*/}
                        {/*                    ...headerStyle,*/}
                        {/*                    width: 120,*/}
                        {/*                    borderTop: "none",*/}
                        {/*                    backgroundColor: '#ddd'*/}
                        {/*                }}>MAKER*/}
                        {/*                </th>*/}
                        {/*                <th style={{*/}
                        {/*                    ...headerStyle,*/}
                        {/*                    borderTop: "none",*/}
                        {/*                    fontWeight: 500*/}
                        {/*                }}>{src.maker}</th>*/}
                        {/*            </tr>*/}
                        {/*            <tr style={{fontWeight: 'bold', height: 30}}>*/}
                        {/*                <th style={{...headerStyle, width: 120, backgroundColor: 'gray'}}>ITEM</th>*/}
                        {/*                <th style={{...headerStyle, fontWeight: 500}}>{src.item}</th>*/}
                        {/*            </tr>*/}
                        {/*            </thead>*/}
                        {/*        </table>*/}
                        {/*        <table style={{width: '100%'}}>*/}
                        {/*            <thead>*/}
                        {/*            <tr style={{fontWeight: 'bold', height: 30}}>*/}
                        {/*                <th style={{*/}
                        {/*                    ...headerStyle,*/}
                        {/*                    borderTop: "none",*/}
                        {/*                    backgroundColor: '#ddd'*/}
                        {/*                }}>MODEL*/}
                        {/*                </th>*/}
                        {/*            </tr>*/}
                        {/*            </thead>*/}
                        {/*        </table>*/}
                        {/*        <table style={{width: '100%'}}>*/}
                        {/*            <thead>*/}
                        {/*            {datas[src.documentNumberFull].map((source, index) => {*/}
                        {/*                return <tr style={{fontWeight: 'bold', height: 30}}>*/}
                        {/*                    <th style={{...headerStyle, width: 40, borderTop: "none"}}>{index + 1}</th>*/}
                        {/*                    <th style={{*/}
                        {/*                        ...headerStyle,*/}
                        {/*                        borderTop: "none",*/}
                        {/*                        fontWeight: 500*/}
                        {/*                    }}>{source.model}</th>*/}
                        {/*                    <th style={{*/}
                        {/*                        ...headerStyle,*/}
                        {/*                        width: 100,*/}
                        {/*                        borderTop: "none",*/}
                        {/*                        fontWeight: 500*/}
                        {/*                    }}>{source.quantity} {source.unit}</th>*/}
                        {/*                </tr>*/}
                        {/*            })}*/}


                        {/*            </thead>*/}


                        {/*        </table>*/}
                        {/*    </div>*/}

                        <div style={{borderBottom: '1px solid lightGray', paddingTop: 100}}/>
                    </div>
                })}

            </div>
        </Modal>
    </>
}