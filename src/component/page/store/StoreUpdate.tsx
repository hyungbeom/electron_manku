import React, {memo, useEffect, useRef, useState} from "react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    radioForm,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {useRouter} from "next/router";
import {rfqInfo, storeInfo} from "@/utils/column/ProjectInfo";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {inboundColumn} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import {getData} from "@/manage/function/api";
import Popconfirm from "antd/lib/popconfirm";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import moment from "moment";

const listType = 'orderStatusDetailList'


function StoreUpdate({
                         updateKey = {},
                         getCopyPage = null,
                         getPropertyId = null,
                         layoutRef
                     }: any) {

    const {userInfo, adminList} = useAppSelector((state) => state.user);
    const [ready, setReady] = useState(false);
    const router = useRouter();

    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totalRow, setTotalRow] = useState(0);
    const isGridLoad = useRef(false);

    const adminParams = {
        ...storeInfo['defaultInfo'],
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }

    const getStoreInit = () => {
        const copyInit = _.cloneDeep(storeInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [info, setInfo] = useState<any>(getStoreInit())
    const [mini, setMini] = useState(true);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        // params.api.applyTransaction({add: []});
        // setTotalRow(0);
        isGridLoad.current = true;
    };

    console.log(updateKey,'updateKey[\'store_update\']:')

    // setTableData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000))
    async function getDataInfo() {
        const result = await getData.post('inbound/getInboundInfo', {
            "inboundId": updateKey['store_update']
        });


        const {entity} = result?.data;
        // const findMember = adminList.find(v=> v.adminId === invoiceInfo.createdId);
        // console.log(findMember,'::')

        gridManage.resetData(gridRef, entity?.inboundDetail ?? []);
        setTotalRow(entity?.inboundDetail?.length);
        setInfo({
            ...getStoreInit(),
            ...entity,
            createdDate : moment(entity.createdDate).format('YYYY-MM-DD')
        });


        updateCalc({shippingFee : entity.shippingFee, tariff : entity.tariff, etcPrice : entity.etcPrice, tax : entity.tax })
    }



    useEffect(() => {
        setLoading(true);

        setInfo(getStoreInit());
        getDataInfo().then(v => {})
            .finally(() => {
                setLoading(false);

            });
    }, [updateKey['store_update']]);


    async function saveFunc() {

        const allData = [];
        gridRef?.current?.forEachNode((node) => {
            allData.push(node.data);
        });

        return await getData.post('inbound/updateInbound', {
            ...info,
            inboundDetail: allData
        }).then(v => {
            console.log("sadasdasd")
        })
    }


    function clearAll() {
        getStoreInit()
    }

    useEffect(() => {
    }, []);

    function modalSelected(list = []) {

        const newList = list.map(v => {

            v['exchange'] = 1;
            const amount = parseInt(v['receivedQuantity']) * parseFloat(v['unitPrice']);
            v['amount'] = !isNaN(amount) ? amount : 0
            v['krw'] = !isNaN(amount) ? amount : 0
            const saleAmount = parseInt(v['receivedQuantity']) * parseFloat(v['net']);
            v['saleAmount'] = !isNaN(saleAmount) ? saleAmount : 0
            v['saleTaxAmount'] = !isNaN(saleAmount) ? saleAmount * 1.1 : 0
            return v
        })
        gridRef.current.applyTransaction({add: newList.length ? newList : []})
        updateCalc(info)
    }

    function updateCalc(info){
        const allData = {totalKrw: 0, totalTax: 0, saleTotal : 0 };
        gridRef?.current?.forEachNode((node) => {
            let krw = !isNaN(parseFloat(node.data.krw)) ? parseFloat(node.data.krw) : 0;
            let tax = !isNaN(parseFloat(node.data.tax)) ? parseFloat(node.data.tax) : 0;
            let saleAmount = !isNaN(parseFloat(node.data.saleAmount)) ? parseFloat(node.data.saleAmount) : 0;
            allData['totalKrw'] += krw
            allData['totalTax'] += tax
            allData['saleTotal'] += saleAmount

        });

        const shippingFee = !isNaN(parseFloat(info?.shippingFee)) ? parseFloat(info?.shippingFee) : 0;
        const tariff = !isNaN(parseFloat(info?.tariff)) ? parseFloat(info?.tariff) : 0;
        const etcPrice = !isNaN(parseFloat(info?.etcPrice)) ? parseFloat(info?.etcPrice) : 0;
        const tax = !isNaN(parseFloat(info?.tax)) ? parseFloat(info?.tax) : 0;

        const total = allData['totalKrw'] + allData['totalTax'] + shippingFee + tariff + etcPrice

        console.log(allData['saleTotal'],'allData[\'saleVatTotal\']????')
        console.log(allData['saleTotal'] * 1.1,'allData[\'saleVatTotal\']????')

        setInfo(v => {
            return {...v, ...allData, total : total, totalVat : total + tax, operationIncome :   allData['saleTotal'] - total, saleVatTotal : allData['saleTotal'] * 1.1}
        })
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
        if(e.target.id === 'tariff' ||e.target.id === 'shippingFee'  ||e.target.id === 'etcPrice' ){
            updateCalc(info)
        }
    }

    function updateFunc() {
        updateCalc(info)
    }


    async function confirm() {
        const list = gridRef.current.getSelectedRows();
        if (list.length < 1) {
            return message.error('삭제할 발주서 정보를 선택해주세요.');
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {inboundDetailId: 'inboundDetailId'});
        const inboundDetailIdList = deleteList.map(v=> v.inboundDetailId)


        const allData = [];
        gridRef?.current?.forEachNode((node) => {
            allData.push(node.data);
        });


        const updateList = allData.filter(v=> !inboundDetailIdList.includes(v.inboundDetailId))
        gridManage.resetData(gridRef, updateList)
        console.log(updateList,'updateList')



        // gridManage.resetData(gridRef, data?.data?.entity?.agencyList)

        setInfo(v=>{
            return {...v, deleteList : [...v.deleteList, ...inboundDetailIdList]}
        })

    }

    return <>
        {/*{isModalOpen ? <OrderListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}*/}
        {/*                               getRows={getSelectedRows}/> : <></>}*/}
        <SearchInfoModal infoRef={infoRef}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen} returnFunc={modalSelected}/>


        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
            // overflowY: 'hidden',
            rowGap: 10,
        }}>

            <MainCard title={<>매입 등록
                {/*<Button onClick={saveApi}>saveApi</Button>*/}
                {/*<Button onClick={updateApi}>updateApi</Button>*/}
            </>} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>
                        <TopBoxCard grid={'120px 120px 120px 120px 120px 120px 120px 120px'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'createdDate',
                                disabled: true,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                            <div>
                                {selectBoxForm({
                                    title: '담당자',
                                    id: 'managerAdminId',
                                    onChange: onChange,
                                    data: info,
                                    list: adminList?.map((item) => ({
                                        ...item,
                                        value: item.adminId,
                                        label: item.name,
                                    }))
                                })}
                            </div>
                            {inputForm({
                                title: '만쿠발주서 No.',
                                id: 'documentNumber',
                                onChange: onChange,
                                data: info,
                                disabled: true,
                                suffix: <span style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('connectInquiryNo');
                                    }
                                }>🔍</span>,
                            })}
                            {datePickerForm({title: '입고일자', id: 'inboundDate', data: info, onChange: onChange})}
                            {inputForm({title: '운수사명', id: 'carrierName', data: info, onChange: onChange})}
                            {inputForm({title: 'B/L No.', id: 'blNo', data: info, onChange: onChange})}
                            {datePickerForm({title: '도착일', id: 'arrivalDate', data: info, onChange: onChange})}
                        </TopBoxCard>
                        <div style={{height: 3}}/>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'비용 정보'}>
                                    {inputForm({
                                        title: '부가세',
                                        id: 'vatAmount',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {inputForm({
                                        title: '관세',
                                        id: 'tariff',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {inputForm({
                                        title: '운임비',
                                        id: 'shippingFee',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'매입금액 정보'}>
                                    {inputForm({
                                        title: '기타비용',
                                        id: 'etcPrice',
                                        data: info,
                                        onChange: onChange
                                    })}
                                    {inputForm({
                                        title: '합계',
                                        id: 'total',
                                        data: info,
                                        disabled: true,
                                    })}
                                    {inputForm({
                                        title: '합계 (VAT포함)',
                                        id: 'totalVat',
                                        data: info,
                                        disabled: true,

                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'매출금액 정보'}>

                                    {inputNumberForm({
                                        title: '판매금액합계',
                                        id: 'saleTotal',
                                        data: info,
                                        disabled: true,
                                    })}
                                    {inputNumberForm({
                                        title: '판매금액 합계 (VAT포함)',
                                        id: 'saleVatTotal',
                                        data: info,
                                        disabled: true
                                    })}
                                    {inputNumberForm({
                                        title: '영업이익금',
                                        id: 'operationIncome',
                                        data: info,
                                        disabled: true
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'기타'}>
                                    {radioForm({
                                        title: '운송수단',
                                        id: 'transport',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '항공', title: '항공'},
                                            {value: '해운', title: '해운'},
                                        ]
                                    })}
                                    {radioForm({
                                        title: '매입상태',
                                        id: 'inboundStatus',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '완료', title: '완료'},
                                            {value: '진행중', title: '진행중'},
                                            {value: '취소', title: '취소'},
                                            {value: '환불', title: '환불'}
                                        ]
                                    })}
                                    {textAreaForm({title: '비고란', id: 'remarks', onChange: onChange, data: info})}

                                </BoxCard>
                            </Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

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
                columns={inboundColumn}
                customType={'inbound'}
                onGridReady={onGridReady}
                funcButtons={['agPrint']}
                type={'write'}
                // tempFunc={getOrderFile}
                updateFunc={updateFunc}
            />
        </div>
    </>
}

export default memo(StoreUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});