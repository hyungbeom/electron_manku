import React, {useEffect, useRef, useState} from "react";
import {ModalInitList} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, MainCard, radioForm, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    CopyOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FolderOpenOutlined,
    FormOutlined
} from "@ant-design/icons";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import {DRInfo, TIInfo} from "@/utils/column/ProjectInfo";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {
    tableOrderReadColumns,
    tableSelectOrderReadColumns,
    tableSelectOrderReadColumnsForTax
} from "@/utils/columnList";
import {Actions} from "flexlayout-react";

const listType = 'list';

export default function TaxInvoiceUpdate({ updateKey, layoutRef, getCopyPage }: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef(null);
    const gridRef = useRef(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('tax_invoice_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const adminParams = {
        // managerAdminId: userInfo['adminId'],
        // managerAdminName: userInfo['name'],
        // createdId: userInfo['adminId'],
        // createdBy: userInfo['name'],
    }
    const getTaxInvoiceInit = () => {
        const copyInit = _.cloneDeep(TIInfo['defaultInfo'])
        return {
            ...copyInit,
            ...adminParams,
        }
    }
    const [info, setInfo] = useState(getTaxInvoiceInit());
    const [selectOrderList, setSelectOrderList] = useState([]);

    const [totalRow, setTotalRow] = useState(0);
    const isGridLoad = useRef(false);

    const getOrderInit = () => {
        return {
            documentNumberFull: '',
            uploadType: 5,
            folderId: ''
        }
    }
    const [orderInfo, setOrderInfo] = useState(getOrderInit());
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setLoading(true);

        setInfo(getTaxInvoiceInit());
        setSelectOrderList([]);

        setOrderInfo(getOrderInit());
        setFileList([]);

        getDataInfo().then(v => {})
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['tax_invoice_update']]);

    async function getDataInfo() {
        try {
            const res = await getData.post('invoice/getInvoiceInfo', updateKey['tax_invoice_update']);
            if (res?.data?.code !== 1) {
                return;
            }
            const { invoiceDetailInfo: selectOrderList, invoiceinfo: invoiceInfo = {} } = res?.data?.entity ?? {};
            console.log(invoiceInfo,'invoiceinfo::::')
            const findMember = adminList.find(v=> v.adminId === invoiceInfo.createdId);
            console.log(findMember,'::')
            setInfo({
                ...getTaxInvoiceInit(),
                ...invoiceInfo,
                createdBy : findMember?.name
            });
            modalSelected(selectOrderList, invoiceInfo?.['rfqNo']);
        } catch (err) {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        }
    }

    useEffect(() => {
        if(!isGridLoad.current) return;
        gridManage.resetData(gridRef, selectOrderList);
        setTotalRow(selectOrderList?.length ?? 0);
    }, [selectOrderList]);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: []});
        setTotalRow(0);
        isGridLoad.current = true;
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 송금 > 세금계산서 요청 수정
     */
    async function saveFunc() {
        if (!selectOrderList?.length) return message.warn('발주서 데이터가 1개 이상이여야 합니다.');

        const allData = [];
        gridRef.current.forEachNode(node => {
            allData.push(node.data);
        });
        const selectOrderNos = allData.map(item => item.orderDetailId)
        // @ts-ignore
        const documentNumberFullList = [...new Set(allData.map((item:any) => item.documentNumberFull))].join('\n');
        const copyInfo = {
            ...info,
            selectOrderList: JSON.stringify(selectOrderNos),
            supplyAmount: Number(String(info?.supplyAmount).replace(/,/g, '')),
            invoiceDetailList: allData,
            documentNumberFullList: documentNumberFullList
        }

        setLoading(true);
        try {
            const res = await getData.post('invoice/updateInvoice', copyInfo);
            if (res?.data?.code !== 1) {
                console.warn(res?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
                return;
            }
            window.postMessage({message: 'reload', target: 'tax_invoice_read'}, window.location.origin);
            notificationAlert('success', '💾 세금계산서 요청 수정완료',
                <>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , null, null, 2
            )
        } catch (err) {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        } finally {
            setLoading(false);
        }
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 송금 > 세금계산서 요청 수정
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('invoice/deleteInvoice', [ info['invoiceId'] ]).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'tax_invoice_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 세금계산서 요청 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'tax_invoice_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
                getCopyPage('tax_invoice_read', {});
            } else {
                console.log(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 조회 테이블 발주서 항목 더블클릭
     * 송금 > 세금계산서 요청 수정
     * 하단의 선택 발주서 리스크 항목 더블클릭시 발주서 상세 조회 > folderId, 파일 리스트 조회
     * @param orderDetail
     */
    async function getOrderFile(orderDetail) {
        if(!orderDetail['documentNumberFull']) {
            message.warn('선택한 발주서 정보를 확인해주세요.');
            return;
        }
        if(orderInfo['documentNumberFull'] === orderDetail['documentNumberFull']) return;

        setLoading(true);
        await getData.post('common/getFileList', orderDetail?.documentNumberFull)
            .then(v => {
                setOrderInfo({
                    documentNumberFull: orderDetail['documentNumberFull'],
                    uploadType: 5,
                    folderId: v?.data?.entity?.folderId
                });
                setFileList(fileManage.getFormatFiles(v?.data?.entity?.fileList));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /**
     * @description 수정 페이지 > Inquiry No. 검색 버튼 > 발주서 조회 Modal
     * 송금 > 세금계산서 요청 수정
     * 발주서 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 수정 페이지 > 발주서 조회 Modal
     * Return Function
     * 발주서 조회 Modal에서 선택한 항목 가져오기
     * @param list
     */
    function modalSelected(list= [], rfqNo = '') {
        if (!list?.length) return;

        setSelectOrderList(prevList => {
            // 발주서 Modal에서 같은 발주서 항목 필터
            const newItems = list.filter(
                newItem => !prevList.some(existing => existing.orderDetailId === newItem.orderDetailId)
            );
            const updatedList = [...prevList, ...newItems];

            // Inquiry No. 정리
            const connectInquiryNos = [];
            for (const item of updatedList || []) {
                const inquiryNo = item.documentNumberFull;
                if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                    connectInquiryNos.push(inquiryNo);
                }
            }
            // 항목 번호 정리
            const orderDetailIds = updatedList.map(row => row.orderDetailId).join(', ');

            // 발주서 총액 계산
            const supplyAmount = updatedList.reduce((sum, row) => sum + ((Number(row.quantity) || 0) * (Number(row.net) || 0)), 0);
            const tax = supplyAmount * 0.1 * 10 / 10;
            const totalAmount = supplyAmount + tax;

            setInfo(prevInfo => {
                return {
                    ...prevInfo,
                    rfqNo: rfqNo ? rfqNo : updatedList?.[0]?.rfqNo || '',
                    connectInquiryNo: connectInquiryNos.join(', '),
                    orderDetailIds,
                    yourPoNo: updatedList?.[0]?.yourPoNo || '',
                    customerName: updatedList?.[0]?.customerName || '',
                    sendEmail: updatedList?.[0]?.sendEmail ? updatedList?.[0]?.sendEmail : updatedList?.[0]?.customerManagerEmail || '',
                    customerManagerName: updatedList?.[0]?.customerManagerName || '',
                    supplyAmount: supplyAmount ? supplyAmount.toLocaleString() : '',
                    tax: tax ? tax.toLocaleString() : '',
                    totalAmount: totalAmount ? totalAmount.toLocaleString() : ''
                }
            });
            return updatedList;
        });
    }

    /**
     * @description 선택한 발주서 테이블 > 삭제 버튼
     * 송금 > 세금계산서 요청 수정
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 발주서 정보를 선택해주세요.');
        }
        const deleteList = gridManage.getFieldDeleteList(gridRef, {invoiceDetailId: 'invoiceDetailId'});
        const filterSelectList = selectOrderList.filter(selectOrder =>
            !deleteList.some(deleteItem => deleteItem.invoiceDetailId === Number(selectOrder.invoiceDetailId))
        );

        const invoiceDetailIdList = deleteList.map(v=> v.invoiceDetailId)

        setInfo(v=>{
            return {...v, deleteList : [...v.deleteList, ...invoiceDetailIdList]}
        })

        setSelectOrderList(filterSelectList);

        // Inquiry No. 정리
        const connectInquiryNos = [];
        for (const item of filterSelectList || []) {
            const inquiryNo = item.documentNumberFull;
            if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                connectInquiryNos.push(inquiryNo);
            }
        }
        // 항목 번호 정리
        const orderDetailIds = filterSelectList.map(row => row.orderDetailId).join(', ');

        // 발주서 총액 계산
        const supplyAmount = filterSelectList.reduce((sum, row) => sum + ((Number(row.quantity) || 0) * (Number(row.net) || 0)), 0);
        const tax = supplyAmount * 0.1 * 10 / 10;
        const totalAmount = supplyAmount + tax;

        setInfo(prevInfo => {
            return {
                ...prevInfo,
                rfqNo: filterSelectList?.[0]?.rfqNo || '',
                connectInquiryNo: connectInquiryNos.join(', '),
                orderDetailIds,
                yourPoNo: filterSelectList?.[0]?.yourPoNo || '',
                customerName: filterSelectList?.[0]?.customerName || '',
                sendEmail: filterSelectList?.[0]?.customerManagerEmail || '',
                customerManagerName: filterSelectList?.[0]?.customerManagerName || '',
                supplyAmount: supplyAmount ? supplyAmount.toLocaleString() : '',
                tax: tax ? tax.toLocaleString() : '',
                totalAmount: totalAmount ? totalAmount.toLocaleString() : ''
            }
        });
    }


    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        const copyInfo2 = _.cloneDeep(info);
        copyInfo2['documentNumberFull'] = '';
        copyInfo2['uploadType'] = 0;
        copyInfo2['folderId'] = '';

        const allData = [];
        gridRef.current.forEachNode(node => {
            allData.push(node.data);
        });



        copyInfo['invoiceinfo'] = copyInfo2;
        copyInfo['invoiceDetailInfo'] =allData;

        getCopyPage('tax_invoice_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    function updateFunc(){
        let supplyAmount = 0;
        gridRef.current.forEachNode(node => {
            const totalNet = parseFloat(node.data.net) * parseFloat(node.data.quantity);
            supplyAmount += !isNaN(totalNet) ? totalNet : 0
        });
        setInfo(v=>{
            return {...v, supplyAmount : supplyAmount.toLocaleString(), tax : (supplyAmount * 0.1).toLocaleString(), totalAmount : (supplyAmount + (supplyAmount * 0.1)).toLocaleString()}
        })
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'tax_invoice_update'}/>
        <SearchInfoModal info={selectOrderList} infoRef={infoRef} setInfo={setSelectOrderList}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen} returnFunc={modalSelected}/>

            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '490px' : '65px'} calc(100vh - ${mini ? 630 : 205}px)`,
                // overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'세금계산서 요청 수정'} list={[
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                    {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: ''}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div ref={infoRef}>
                        <TopBoxCard grid={'110px 70px 70px 120px 110px 110px 120px'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                <select name="languages" id="managerAdminId" onChange={e => {
                                    // 담당자 정보가 현재 작성자 정보가 나와야한다고 함
                                    const admin = adminList.find(v => v.adminId === parseInt(e.target.value))
                                    const adminInfo = {
                                        managerAdminId: admin['adminId'],
                                        managerAdminName: admin['name'],
                                    }
                                    setInfo(v => ({...v, ...adminInfo}))
                                }} style={{
                                    outline: 'none',
                                    border: '1px solid lightGray',
                                    height: 23,
                                    width: '100%',
                                    fontSize: 12,
                                    paddingBottom: 0.5
                                }} value={info?.managerAdminId ?? ''}>
                                    { adminList.map(admin => (
                                        <option key={admin.adminId} value={admin.adminId}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {inputForm({
                                title: '만쿠발주서 No.',
                                id: 'connectInquiryNo',
                                disabled: true,
                                suffix: <span style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('connectInquiryNo');
                                    }
                                }>🔍</span>,
                            })}
                            {datePickerForm({
                                title: '발행요청일자',
                                id: 'invoiceRequestDate',
                                onChange: onChange,
                                data: info
                            })}
                            {datePickerForm({
                                title: '발행지정일자',
                                id: 'invoiceDueDate',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: 'Project No.',
                                id: 'rfqNo',
                                onChange: onChange,
                                data: info,
                            })}
                        </TopBoxCard>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'발주서 정보'}>
                                    {inputForm({
                                        title: '발주서 No.',
                                        id: 'connectInquiryNo',
                                        onChange: onChange,
                                        data: info,
                                        disabled: true,
                                    })}
                                    {textAreaForm({title: '발주서 항목번호', rows: 4, id: 'orderDetailIds', onChange: onChange, data: info, disabled: true})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'고객사 정보'}>
                                    {inputForm({title: '고객사 발주서 No.', id: 'yourPoNo', onChange: onChange, data: info})}
                                    {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
                                    {inputForm({title: '발행 이메일 주소', id: 'sendEmail', onChange: onChange, data: info})}
                                    {inputForm({title: '고객사 담당자명', id: 'customerManagerName', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'금액 정보'}>
                                    <div style={{fontSize: 12, paddingBottom: 10}}>
                                        <div style={{paddingBottom: 12 / 2, fontWeight: 700}}>공급가액</div>
                                        <div style={{display: 'flex'}}>
                                            <input placeholder={''}
                                                   id={'supplyAmount'}
                                                   value={info ? info['supplyAmount'] : null}
                                                   onKeyDown={(e) => {
                                                       if(e.key === 'Enter') {
                                                           e.currentTarget.blur();
                                                       }
                                                   }}
                                                   onChange={onChange}
                                                   onFocus={(e) => {
                                                       setInfo(prev => ({
                                                           ...prev,
                                                           supplyAmount : Number((e.target.value || '0').toString().replace(/,/g, ''))
                                                       }));
                                                   }}
                                                   onBlur={(e) => {
                                                       setInfo(prev => {
                                                           const supplyAmount = Number((e.target.value || '0').toString().replace(/,/g, ''));
                                                           const tax = supplyAmount * 0.1 * 10 / 10;
                                                           const totalAmount = supplyAmount + tax;
                                                           return {
                                                               ...prev,
                                                               supplyAmount: supplyAmount ? supplyAmount.toLocaleString() : '',
                                                               tax: tax ? tax.toLocaleString() : '',
                                                               totalAmount: totalAmount ? totalAmount.toLocaleString() : ''
                                                           }
                                                       })
                                                   }}
                                            />
                                            <span style={{marginLeft: -22, paddingTop: 1.5}}></span>
                                        </div>
                                    </div>
                                    {inputForm({
                                        title: '부가세',
                                        id: 'tax',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        // formatter: numbFormatter,
                                        // parser: numbParser
                                    })}
                                    {inputForm({
                                        title: '합계',
                                        id: 'totalAmount',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {radioForm({
                                        title: '계산서 발행 여부',
                                        id: 'invoiceStatus',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: 'O', title: 'O'},
                                            {value: 'X', title: 'X'},
                                        ]
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'확인 정보'}>
                                    {inputForm({
                                        title: '사업소',
                                        id: 'company',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {textAreaForm({title: '비고란', rows: 10, id: 'remarks', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>드라이브 목록</div>
                                        {
                                            orderInfo['folderId'] ?
                                                <span style={{fontSize: 10, display: 'inline-flex', alignItems: 'center'}}>
                                                    <FolderOpenOutlined style={{paddingRight: 4}}/>{`${orderInfo['documentNumberFull']}`}
                                                </span>
                                                : <></>
                                        }
                                    </div>
                                } disabled={!userInfo['microsoftId'] || !orderInfo?.folderId}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         info={orderInfo} type={'tax'} key={orderInfo?.folderId}/>
                                    </div>
                                </BoxCard>
                            </Panel>
                        </PanelGroup>
                    </div> : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid
                    deleteComp={
                        <Popconfirm
                            title="삭제하시겠습니까?"
                            onConfirm={confirm}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                            <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                            </Button>
                        </Popconfirm>
                    }
                    totalRow={totalRow}
                    gridRef={gridRef}
                    columns={tableSelectOrderReadColumnsForTax}
                    customType={'Tax'}
                    onGridReady={onGridReady}
                    funcButtons={['agPrint']}
                    type={'write'}
                    tempFunc={getOrderFile}
                    updateFunc={updateFunc}
                />
            </div>
    </Spin>
}
