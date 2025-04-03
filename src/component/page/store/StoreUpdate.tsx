import React, {memo, useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, SaveOutlined} from "@ant-design/icons";
import {storeReadColumn, storeWriteColumn} from "@/utils/columnList";
import {storeDetailUnit, storeWriteInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    numbFormatter,
    numbParser,
    TopBoxCard
} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import OrderListModal from "@/component/OrderListModal";
import {saveStore, updateStore} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import StoreRead from "@/component/page/store/StoreRead";

const listType = 'orderStatusDetailList'

function StoreUpdate({updateKey, getCopyPage}:any) {
    const router = useRouter();

    const gridRef = useRef(null);


    const userInfo = useAppSelector((state) => state.user);


    const infoInit = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name']
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        getDataInfo()
        updateMainInput()
    };

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v=>{
            const {orderStatusDetail} = v;
            setInfo(orderStatusDetail)
            gridManage.resetData(gridRef, orderStatusDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['store_update']]);

    async function getDataInfo() {
        return await getData.post('order/getOrderStatusDetail', {orderStatusId: updateKey['store_update']}).then(v=>{
            return  v?.data?.entity
        })
    }




    function getTotalTableValue() {
        const totalList = gridManage.getAllData(gridRef)

        const totals = totalList.reduce(
            (acc, curr) => {
                // `commissionFee`는 문자열이므로 ',' 제거 후 숫자로 변환
                const commissionFee = curr.commissionFee || 0;
                const returnAmount = curr.returnAmount || 0;
                const salesAmount = curr.salesAmount || 0;
                const salesAmountVat = curr.salesAmountVat || 0;

                acc.commissionFeeTotal += commissionFee;
                acc.returnAmountTotal += returnAmount;
                acc.salesAmountTotal += salesAmount;
                acc.salesAmountVatTotal += salesAmountVat;

                return acc;
            },
            {
                commissionFeeTotal: 0,
                returnAmountTotal: 0,
                salesAmountTotal: 0,
                salesAmountVatTotal: 0
            }
        );

        return totals;
    }


    function onCellEditingStopped() {
        updateMainInput()
    }


    function onChange(e) {
        updateMainInput()
        commonManage.onChange(e, setInfo)
    }


    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        if (!info['blNo']) {
            return message.warn('B/L No.가 누락되었습니다.')
        }
        const tableList = gridManage.getAllData(gridRef);

        if (!tableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        const totalList = gridManage.getAllData(gridRef)

        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        copyInfo[listType].forEach((v, idx) => {

            const processedItemDetailNo = Array.isArray(v.itemDetailNo)
                ? v.itemDetailNo.join(',') // 배열을 쉼표로 구분된 문자열로 변환
                : v.itemDetailNo; // 배열이 아니면 그대로 사용

            copyInfo[listType][idx]['itemDetailNo'] = processedItemDetailNo;

        })
        await updateStore({data: copyInfo, router: router})
    }

    async function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }

    function clearAll() {
        setInfo(storeWriteInitial);
        gridManage.deleteAll(gridRef)
    }


    const showModal = () => {
        setIsModalOpen(true);
    };

    function updateMainInput() {
        const {commissionFeeTotal, returnAmountTotal, salesAmountTotal, salesAmountVatTotal} = getTotalTableValue();
        setInfo(v => {
            return {
                ...v,
                total: returnAmountTotal + commissionFeeTotal + v.tariff + v.shippingFee,
                totalVat: returnAmountTotal + commissionFeeTotal + v.tariff + v.shippingFee + v.vatAmount,
                saleTotal: salesAmountTotal,
                saleVatTotal: salesAmountVatTotal,
                operationIncome: salesAmountTotal + (returnAmountTotal + commissionFeeTotal + v.tariff + v.shippingFee),
            }
        })
    }

    function getSelectedRows(ref) {
        if (ref.current) {
            const selectedRows = ref.current.getSelectedRows();

            const result = selectedRows.map(v => {

                let copyData = _.cloneDeep(storeDetailUnit);
                copyData['orderDocumentNumberFull'] = v['documentNumberFull'];
                copyData['orderDate'] = v['writtenDate'];
                copyData['orderDetailId'] = v['orderDetailId'];
                copyData['itemDetailNo'] = v['key'];
                copyData['customerName'] = v['customerName'];
                copyData['currencyUnit'] = v['currency'];
                copyData['exchangeRate'] = 1;
                copyData['commissionFee'] = 0;
                copyData['amount'] = v['receivedQuantity'] * v['net'];
                copyData['returnAmount'] = v['receivedQuantity'] * v['net'];
                copyData['salesAmount'] = v['receivedQuantity'] * v['unitPrice'];
                copyData['salesAmountVat'] = Math.round((v['receivedQuantity'] * v['unitPrice']) * 1.1);
                // copyData['agencyName'] = v['customerName'];
                return copyData;
            })

            const groupedData = result.reduce((acc, curr) => {
                const key = curr.orderDocumentNumberFull;

                // 기존 그룹이 있으면 합산
                if (acc[key]) {
                    acc[key].salesAmount += curr.salesAmount;
                    acc[key].salesAmountVat += curr.salesAmountVat;
                    acc[key].returnAmount += curr.returnAmount;
                    acc[key].amount += curr.amount;
                    acc[key].itemDetailNo.push(curr.orderDetailId)
                } else {
                    // 새로운 그룹 추가
                    acc[key] = {
                        ...storeDetailUnit,
                        orderDocumentNumberFull: curr.orderDocumentNumberFull,
                        customerName: curr.customerName, // 첫 번째 항목의 이름 사용
                        salesAmount: curr.salesAmount,
                        salesAmountVat: curr.salesAmountVat,
                        amount: curr.amount,
                        returnAmount: curr.returnAmount,
                        currencyUnit: curr.currencyUnit,
                        exchangeRate: curr.exchangeRate,
                        orderDate: curr.orderDate,
                        itemDetailNo: [curr.orderDetailId]
                    };
                }

                return acc;
            }, {});


            gridRef.current.applyTransaction({add: Object.values(groupedData)});

            updateMainInput();
        } else {
            console.warn('Grid API is not available.');
            return [];
        }
    }


    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        getCopyPage('store_write',copyInfo)
    }

    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
        {/*@ts-ignore*/}
        <Button onClick={showModal} type={'primary'} size={'small'} style={{marginLeft: 5}}>
            <SaveOutlined/>발주서 조회
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
    </div>

    return  <Spin spinning={loading} tip={'입고 수정중...'}>
        <OrderListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} getRows={getSelectedRows}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '420px' : '65px'} calc(100vh - ${mini ? 475 : 120}px)`,
                columnGap: 5
            }}>

                <MainCard title={'입고 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr'}>
                                {inputForm({title: 'B/L No.', id: 'blNo', onChange: onChange, data: info})}
                                {inputForm({title: '운수사명', id: 'carrierName', onChange: onChange, data: info})}
                                {datePickerForm({title: '입고일자', id: 'arrivalDate', onChange: onChange, data: info})}
                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "300px 300px 1fr  ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'비용 정보'}>
                                    {inputNumberForm({
                                        title: '부가세',
                                        id: 'vatAmount',
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '관세',
                                        id: 'tariff',
                                        placeholder: '매입처 담당자 입력 필요',
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '운임비',
                                        id: 'shippingFee',
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                </BoxCard>
                                <BoxCard title={'매입금액 정보'}>

                                    {inputNumberForm({
                                        title: '합계',
                                        id: 'total',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '합계 (VAT포함)',
                                        id: 'totalVat',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                </BoxCard>

                                <BoxCard title={'매출금액 정보'}>

                                    {inputNumberForm({
                                        title: '판매금액합계',
                                        id: 'saleTotal',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '판매금액 합계 (VAT포함)',
                                        id: 'saleVatTotal',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '영업이익금',
                                        id: 'operationIncome',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                </BoxCard>

                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={storeWriteColumn}
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={['storeUpload', 'delete', 'print']}
                    onCellEditingStopped={onCellEditingStopped}
                />
            </div>
        </LayoutComponent>
    </Spin>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {query} = ctx;

    const {orderStatusId} = query;

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));


    const result = await getData.post('order/getOrderStatusDetail', {orderStatusId: orderStatusId});


    const dataInfo = result?.data?.entity?.orderStatusDetail
    // result?.data?.entity?.estimateRequestList
    return {
        props: {dataInfo: dataInfo ? dataInfo : null}
    }

})

export default memo(StoreUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});