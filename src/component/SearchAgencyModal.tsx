import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";
import {ModalInitList, modalList} from "@/utils/initialList";
import moment from "moment";

export default function SearchAgencyModal({info, setInfo, open, setIsModalOpen}) {
    const [code, setCode] = useState();
    const [list, setList] = useState([])
    const [openCheck, setOpenCheck] = useState('')


    useEffect(() => {
        if (open) {
            const firstTrueKey = Object.keys(open).find(key => open[key]);
            setOpenCheck(firstTrueKey);
            if (!firstTrueKey) {
                setList([]);
                // setCode('')
            } else {
                if(firstTrueKey==='customerName'&&info.customerInfoList){
                    searchFunc(firstTrueKey, info[firstTrueKey]);
                    setCode(info[firstTrueKey])

                } else {
                    searchFunc(firstTrueKey, info[firstTrueKey]);
                    setCode(info[firstTrueKey])
                }
            }
        }
    }, [open, info])


    useEffect(() => {
        setCode(info);
    }, [info])

    // console.log(code, 'modal code~')


    async function searchFunc(v, text) {

        const resultList = await getData.post(modalList[v]?.url, {
            "searchType": "",
            "searchText": text,       // 대리점코드 or 대리점 상호명
            "page": 1,
            "limit": -1
        });
        setList(resultList?.data?.entity[modalList[v]?.list])
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchFunc(openCheck, code);
        }
    }

    return <>
        <Modal
            // @ts-ignored
            id={openCheck}
            title={modalList[openCheck]?.title}
            onCancel={() => setIsModalOpen(ModalInitList)}
            open={!!openCheck}
            width={'60vw'}
            onOk={() => setIsModalOpen(ModalInitList)}
        >
            <div style={{height: '50vh'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 15, marginBottom: 20}}>
                    <Input style={{width: '100%'}}
                           onKeyDown={handleKeyPress}
                           placeholder={modalList[openCheck]?.placeholder}
                           id={'agencyCode'} value={code}
                           onChange={(e:any) => setCode(e.target.value)}></Input>
                    <Button onClick={() => searchFunc(openCheck, code)}>조회</Button>
                </div>

                <AgGridReact containerStyle={{height: '93%', width: '100%'}} theme={tableTheme}
                             onCellClicked={(e) => {
                                 switch (openCheck) {
                                     case 'customerName' :
                                         setInfo(v => {
                                             return {
                                                 ...v,
                                                 phoneNumber: e.data.directTel,
                                                 customerManagerEmail: e.data.email,
                                                 ...e.data
                                             }
                                         });
                                         break;
                                     case 'maker' :
                                         setInfo(v => {
                                             return {
                                                 ...v, ...e.data, maker: e.data.makerName
                                             }
                                         })
                                         break;
                                     default :
                                         setInfo(v => {
                                             return {

                                                 ...v,
                                                 // documentNumberFull: `${e.data.agencyCode}-${moment().format('YY')}-${'일련번호 from back'}`,
                                                 ...e.data
                                             }
                                         })
                                         break;
                                 }
                                 setIsModalOpen(ModalInitList);
                             }}
                             rowData={list}
                             columnDefs={modalList[openCheck]?.column}
                             pagination={true}

                />
            </div>
        </Modal>
    </>
}