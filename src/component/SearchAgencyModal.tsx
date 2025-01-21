import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";
import {ModalInitList, modalList} from "@/utils/initialList";
import useEventListener from "@/utils/common/function/UseEventListener";
import message from "antd/lib/message";
import {checkInquiryNo} from "@/utils/api/mainApi";
import Drawer from "antd/lib/drawer";
import {useRouter} from "next/router";
import {commonManage, gridManage} from "@/utils/commonManage";


export default function SearchInfoModal({info, setInfo, open, setIsModalOpen, setValidate = null, type='', gridRef}:any) {
    const router = useRouter()
    const [code, setCode] = useState();
    const [list, setList] = useState([])
    const [page, setPage] = useState({x: null, y: null});
    const [openCheck, setOpenCheck] = useState('');
    const [windowOpenKey, setWindowOpenKey] = useState({key: '', value: '', router: '', deleteApi: ''});
    const [opens, setOpen] = useState(false);

    const ref = useRef(null);


    useEffect(() => {
        if (open) {
            const firstTrueKey = Object.keys(open).find(key => open[key]);
            setOpenCheck(firstTrueKey);
            if (!firstTrueKey) {
                setList([]);
                // setCode('')
            } else {
                if (firstTrueKey === 'customerName' && info.customerInfoList) {
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

    async function searchFunc(v, text) {
        try {
            const resultList = await getData.post(modalList[v]?.url, {
                searchType: "",
                searchText: text, // 대리점코드 or 대리점 상호명
                page: 1,
                limit: -1
            });

            setList(resultList?.data?.entity[modalList[v]?.list]);
        } catch (err) {
            console.error(err, '::::');
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchFunc(openCheck, code);
        }
    }

    async function deleteList(api, key, value) {
        const response = await getData.post(api, {
            [key]: value
        });
        console.log(response)
        if (response.data.code === 1) {
            message.success('삭제되었습니다.')
        } else {
            message.error('오류가 발생하였습니다. 다시 시도해주세요.')
        }

    }

    const handleCellRightClick = (e) => {

        const {clientX, clientY} = e.event;
        e.event.preventDefault();


        console.log(e.data, 'customerId')
        setPage({x: clientX, y: clientY})


        if (e.data.makerId)
            setWindowOpenKey({
                key: 'makerId',
                value: e.data.makerId,
                router: `/maker_update?makerName=${e.data.makerName}`,
                deleteApi: 'maker/deleteMaker'
            })
        else if (e.data.customerId)
            setWindowOpenKey({
                key: 'customerId',
                value: e.data.customerId,
                router: `/code_domestic_customer_update?customerCode=${e?.data?.customerCode}`,
                deleteApi: 'customer/deleteCustomer'
            })

        else if (e.data.overseasCustomerId)
            setWindowOpenKey({
                key: 'overseasCustomerId',
                value: e.data.overseasCustomerId,
                router: `/code_overseas_customer_update?customerCode=${e?.data?.customerCode}`,
                deleteApi: 'deleteOverseasCustomer'
            })

        else if (e.data.agencyId)
            setWindowOpenKey({
                key: 'agencyId',
                value: e.data.agencyId,
                router: `/code_domestic_agency_update?agencyCode=${e?.data?.agencyCode}`,
                deleteApi: 'agency/deleteAgency'
            })

        else if (e.data.overseasAgencyId)
            setWindowOpenKey({
                key: 'overseasAgencyId',
                value: e.data.overseasAgencyId,
                router: `/code_overseas_agency_update?agencyCode=${e?.data?.agencyCode}`,
                deleteApi: 'agency/deleteOverseasAgency'
            })
        else
            return null;
    };

    useEffect(() => {
        const handleContextMenu = (e: any) => {
            e.preventDefault();
        };

        const handleClick = (e: any) => {
            setPage({x: null, y: null});
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);

        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
        };
    }, []);


    useEventListener('contextmenu', (e: any) => {
        e.preventDefault()
    }, typeof window !== 'undefined' ? document : null)

    useEventListener('click', (e: any) => {
        setPage({x: null, y: null})
    }, typeof window !== 'undefined' ? document : null)


    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    function moveRouter(param) {

        switch (param) {
            case '국내' :
                router.push('/code_domestic_agency_write')
                break;
            case '해외' :
                router.push('/code_overseas_agency_write')
                break;
        }
        // router.push()
    }

    return <>
        {page.x ? <div style={{
            position: 'fixed',
            top: page.y,
            left: page.x,
            zIndex: 10000,
            fontSize: 11,
            backgroundColor: 'white',
            border: '1px solid lightGray',
            padding: 10,
        }} ref={ref} id={'right'}>
            <div onClick={() => {
                // alert('수정');
                const features = 'width=800,height=500,top=300,left=500,resizable=yes,scrollbars=yes';
                window.open(windowOpenKey.router, '_blank', features)
                setPage({x: null, y: null})
            }} id={'right'}>수정
            </div>
            <div style={{marginTop: 10}} onClick={() => {
                alert('삭제');
                deleteList(windowOpenKey.deleteApi, windowOpenKey.key, windowOpenKey.value)
                searchFunc(openCheck, code);
                setPage({x: null, y: null})
            }}
                 id={'right'}>삭제
            </div>
        </div> : <></>}
        <Modal
            // @ts-ignored
            id={openCheck}
            title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>
                {modalList[openCheck]?.title}
            </span>
                <div>
                    <Button style={{marginRight: 5}} onClick={() => moveRouter('국내')} id={'국내'}>국내생성</Button>
                    <Button style={{marginRight: 50}} onClick={() => moveRouter('해외')} id={'해외'}>해외생성</Button>
                </div>
            </div>}
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
                           onChange={(e: any) => setCode(e.target.value)}></Input>
                    <Button onClick={() => searchFunc(openCheck, code)}>조회</Button>
                </div>

                <AgGridReact containerStyle={{height: '93%', width: '100%'}} theme={tableTheme}
                             onCellClicked={async (e) => {
                                 switch (openCheck) {
                                     case 'customerName' :
                                         setInfo(v => {
                                             return {
                                                 ...v,
                                                 phoneNumber: e.data.directTel,
                                                 customerManagerEmail: e.data.email,
                                                 customerManagerName: e.data.managerName,
                                                 customerManagerPhone: e.data.directTel,
                                                 customerCode: e.data.customerCode,
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
                                     case 'orderList' :

                                         setInfo(v => {
                                             return {
                                                 ...v, ...e.data,
                                                 maker: e.data.makerName,
                                                 connectInquiryNo: e.data.documentNumberFull,
                                             }
                                         })
                                         break;
                                     default :

                                         await checkInquiryNo({data: {agencyCode: e.data.agencyCode, type : type}}).then(data => {
                                             setInfo(v => {
                                                 return {
                                                     ...v,
                                                     documentNumberFull:  data,
                                                     agencyManagerId: e.data.agencyId,
                                                     agencyCode: e.data.agencyCode,
                                                     agencyName: e.data.agencyName,
                                                     agencyManagerName: e.data.managerName,
                                                     agencyManagerPhoneNumber: e.data.phoneNumber
                                                 }
                                             });
                                             gridManage.updateAllFields(gridRef, 'currency', commonManage.changeCurr(e.data.agencyCode))
                                             setValidate(v => {
                                                 return {...v, agencyCode: true, documentNumberFull: true}
                                             })
                                         })

                                         break;
                                 }
                                 setIsModalOpen(ModalInitList);
                             }}
                             rowData={list}
                             columnDefs={modalList[openCheck]?.column}
                             pagination={true}
                             onCellContextMenu={handleCellRightClick}
                             gridOptions={{suppressContextMenu: true}}

                />
            </div>
        </Modal>
        <Drawer
            title="Basic Drawer"
            placement={'top'}
            closable={false}
            onClose={onClose}
            open={opens}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    </>
}