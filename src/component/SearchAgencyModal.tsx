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
import {commonManage} from "@/utils/commonManage";


export default function SearchInfoModal({
                                            open,
                                            setIsModalOpen,
                                            infoRef,
                                            info,
                                            setInfo,
                                            gridRef = null,
                                            type = '',
                                            compProps,
                                            returnFunc = null
                                        }: any) {

    const [code, setCode] = useState();
    const [list, setList] = useState([])
    const [page, setPage] = useState({x: null, y: null});
    const [openCheck, setOpenCheck] = useState('');
    const [windowOpenKey, setWindowOpenKey] = useState({key: '', value: '', router: '', deleteApi: ''});
    const [opens, setOpen] = useState(false);

    const ref = useRef(null);
    const testRef = useRef(null);


    useEffect(() => {
        if (open) {
            console.log(open,'open');
            console.log(open,'open');
            const firstTrueKey = Object.keys(open).find(key => open[key]);
            console.log(firstTrueKey)
            const dom = infoRef?.current?.querySelector(`#${firstTrueKey}`) ?? '';
            switch (firstTrueKey) {
                case 'agencyCode' :
                case 'agencyCode_domestic' :
                case 'agencyCode_overSeas' :
                case 'customerName' :
                case 'maker' :
                case 'connectInquiryNoForDelivery' :
                case 'connectInquiryNo' :
                case 'connectInquiryNoForSource' :
                    searchFunc(firstTrueKey, dom.value);
                    setCode(dom.value);
                    break;
            }
            setOpenCheck(firstTrueKey);
        }
    }, [open])

    async function searchFunc(v, text) {
        if (!v) return;
        try {
            const result = await getData.post(modalList[v]?.url, {
                searchType: "",
                searchText: text, // 대리점코드 or 대리점 상호명
                page: 1,
                limit: -1
            });
            let resultList = result?.data?.entity?.[modalList[v]?.list] ?? [];

            // // 송금 발주서 조회 Modal 일때 이미 선택한 발주서 항목 제외
            // if (v === 'connectInquiryNo') {
            //     resultList = resultList.filter(result =>
            //         !info.some(info => info.orderDetailId === result.orderDetailId)
            //     );
            // }

            setList(resultList);
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

    /**
     * @description row를 선택할때 documentNumberFull 을 기준으로 같은 문서번호 row들은 동시 체크되게 하는 로직
     * @param event
     */
    const handleRowSelected = (event) => {
        if (type === 'write') {
            return false; // 'write' 타입일 경우 아무 작업도 하지 않음
        }

        const selectedNode = event.node; // 현재 선택된 노드
        const selectedData = selectedNode.data; // 선택된 데이터

        // documentNumberFull 필드가 없으면 패스
        if (!selectedData?.documentNumberFull) {
            return false;
        }

        let groupValueKey = 'documentNumberFull';

        const groupValue = selectedData?.[groupValueKey];
        const rowIndex = selectedNode.rowIndex;
        const previousData = event.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.[groupValueKey];

        // 이전 데이터와 그룹 값이 다를 때만 처리
        if (!previousData || previousData !== groupValue) {
            const isSelected = selectedNode.isSelected();

            // 동일한 groupValue를 가진 행들만 선택 상태 변경
            event.api.forEachNode((node) => {
                if (node.data?.[groupValueKey] === groupValue) {
                    node.setSelected(isSelected);
                }
            });
        }
    };

    /**
     * @description 조회 Modal > 테이블 클릭
     * 항목 클릭 이벤트 (onCellClicked 에서 호출)
     * 각 modal 마다 조건 걸어서 사용
     * @param params
     */
    function onRowClicked(params) {
        const modalName = Object.keys(open).find(key => open[key]);

        if (modalName === 'connectInquiryNoForSource') {
            params.api.deselectAll();
        }
        const isSelected = params.node.isSelected(); // 현재 선택 상태 확인
        params.node.setSelected(!isSelected); // 선택 상태 변경 (토글)
    }

    /**
     * @description 조회 Modal > Ok 버튼
     * 기본값 Modal 닫기
     * Modal 에 returnFunc 가 있으면 선택 항목 처리 (list)
     */
    function modalOk() {
        setIsModalOpen(ModalInitList);
        if (returnFunc) {
            const selectedRows = testRef.current.api.getSelectedRows();
            returnFunc(selectedRows);
        }
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
                {compProps}
            </div>}
            onCancel={() => setIsModalOpen(ModalInitList)}
            open={!!openCheck}
            width={'60vw'}
            onOk={modalOk}
        >
            <div style={{height: '50vh'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap: 15, marginBottom: 20}}>
                    <Input style={{width: '100%'}}
                           onKeyDown={handleKeyPress}
                           placeholder={modalList[openCheck]?.placeholder}
                           id={'agencyCode'} value={code}
                           onChange={(e: any) => setCode(e.target.value)}/>
                    <Button onClick={() => searchFunc(openCheck, code)}>조회</Button>
                </div>

                <AgGridReact containerStyle={{height: '93%', width: '100%'}} theme={tableTheme} ref={testRef}
                             rowSelection="multiple"
                             onRowSelected={handleRowSelected}
                             onCellClicked={async (e) => {
                                 console.log(openCheck)
                                 switch (openCheck) {
                                     case 'customerName' :
                                         setInfo(v => {
                                             return {
                                                 ...v,
                                                 customerName: e.data.customerName,
                                                 managerName: e.data.managerName,
                                                 phoneNumber: e.data.directTel,
                                                 faxNumber: e.data.faxNumber,
                                                 customerManagerEmail: e.data.email,
                                                 customerManagerName: e.data.managerName,
                                                 customerManagerFaxNumber: e.data.faxNumber,
                                                 customerManagerPhone: e.data.directTel,
                                                 customerManagerPhoneNumber: e.data.directTel,
                                                 customerCode: e.data.customerCode,
                                                 paymentTerms: e.data.paymentMethod ? e.data.paymentMethod : '발주시 50% / 납품시 50%',
                                             }
                                         })
                                         break;
                                     case 'maker' :
                                         setInfo(v => {
                                             return {
                                                 ...v,
                                                 maker: e.data.makerName,
                                                 item: e.data.item,
                                                 instructions: e.data.instructions,
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
                                     // 배송 등록/수정시 발주서 조회 후 클릭시
                                     case 'connectInquiryNoForDelivery':
                                         onRowClicked(e);
                                         return;
                                     // 송금 등록/수정시 발주서 조회 후 클릭시
                                     case 'connectInquiryNo':
                                         onRowClicked(e);
                                         return;
                                     // 재고 등록시 발주서 조회 후 클릭시
                                     case 'connectInquiryNoForSource':
                                         onRowClicked(e);
                                         return;
                                     default :
                                         await checkInquiryNo({
                                             data: {
                                                 agencyCode: e.data.agencyCode,
                                                 type: type
                                             }
                                         }).then(data => {
                                             setInfo(v => {
                                                 return {
                                                     ...v,
                                                     agencyManagerId: commonManage.checkValue(e.data.agencyId),
                                                     agencyCode: commonManage.checkValue(e.data.agencyCode),
                                                     agencyName: commonManage.checkValue(e.data.agencyName),
                                                     agencyTel: commonManage.checkValue(e.data.phoneNumber),
                                                     agencyManagerName: commonManage.checkValue(e?.data?.managerName),
                                                     agencyManagerEmail: commonManage.checkValue(e.data.email),
                                                     agencyManagerPhoneNumber: commonManage.checkValue(e.data.phoneNumber)
                                                 }
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
                             suppressRowClickSelection={true}
                />
            </div>
        </Modal>
    </>
}