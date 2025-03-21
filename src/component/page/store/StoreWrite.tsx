import React, {memo, useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, SaveOutlined} from "@ant-design/icons";
import {storeWriteColumn} from "@/utils/columnList";
import {orderDetailUnit, storeDetailUnit, storeWriteInitial} from "@/utils/initialList";
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
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import OrderListModal from "@/component/OrderListModal";
import {saveProject, saveStore} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import Table from "@/component/util/Table";
import {orderInfo, storeInfo} from "@/utils/column/ProjectInfo";
import {getData} from "@/manage/function/api";
import moment from "moment";

const listType = 'orderStatusDetailList'


function StoreWrite({copyPageInfo,notificationAlert = null, getPropertyId}:any) {
    const [ready, setReady] = useState(false);
    const router = useRouter();

    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태
    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        getMemberList();
    }, []);


    async function getMemberList() {
        // @ts-ignore
        return await getData.post('admin/getAdminList', {
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v => {
            setMemberList(v?.data?.entity?.adminList)
        })
    }

    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const copyInit = _.cloneDeep(storeWriteInitial)

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...storeInfo['defaultInfo'],
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
    }


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [info, setInfo] = useState<any>({...infoInit})
    const [mini, setMini] = useState(true);



    useEffect(() => {
        if(ready) {
            if(copyPageInfo['store_write'] && !isEmptyObj(copyPageInfo['store_write'])){
                setInfo(infoInit);
                gridManage.resetData(gridRef,[])
            }else{
                setInfo({...copyPageInfo['store_write']});
                gridManage.resetData(gridRef, copyPageInfo['store_write'][listType])
            }
        }
    }, [copyPageInfo['store_write'],ready]);

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo['store_write'])) {
            // copyPageInfo 가 없을시
            setInfo(infoInit);
            setTableData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({...copyPageInfo['store_write'], writtenDate: moment().format('YYYY-MM-DD')});
            setTableData(copyPageInfo['store_write'][listType])
        }
    }, [copyPageInfo['store_write']]);


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

        copyInfo[listType].forEach((v,idx) => {

            const processedItemDetailNo = Array.isArray(v.itemDetailNo)
                ? v.itemDetailNo.join(',') // 배열을 쉼표로 구분된 문자열로 변환
                : v.itemDetailNo; // 배열이 아니면 그대로 사용

            copyInfo[listType][idx]['itemDetailNo'] = processedItemDetailNo;

        })
        await saveStore({data: copyInfo, router: router})
    }



    function clearAll() {
        setInfo({...infoInit});
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
                console.log(v, 'v[\'net\']')
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



    return <>
        {isModalOpen ? <OrderListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} getRows={getSelectedRows}/> : <></>}
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '390px' : '65px'} calc(100vh - ${mini ? 530 : 195}px)`,
                rowGap: 10,
            }}>

                <MainCard title={'입고 등록'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard grid={'100px 120px 120px'}>
                                {datePickerForm({title: '입고일자', id: 'arrivalDate'})}
                                {inputForm({title: '운수사명', id: 'carrierName'})}
                                {inputForm({title: 'B/L No.', id: 'blNo'})}

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
                                    })}
                                    {inputNumberForm({
                                        title: '관세',
                                        id: 'tariff',
                                        placeholder: '매입처 담당자 입력 필요',
                                    })}
                                    {inputNumberForm({
                                        title: '운임비',
                                        id: 'shippingFee',
                                    })}
                                </BoxCard>
                                <BoxCard title={'매입금액 정보'}>

                                    {inputNumberForm({
                                        title: '합계',
                                        id: 'total',
                                        disabled: true,
                                    })}
                                    {inputNumberForm({
                                        title: '합계 (VAT포함)',
                                        id: 'totalVat',
                                        disabled: true,

                                    })}
                                </BoxCard>

                                <BoxCard title={'매출금액 정보'}>

                                    {inputNumberForm({
                                        title: '판매금액합계',
                                        id: 'saleTotal',
                                        disabled: true,
                                    })}
                                    {inputNumberForm({
                                        title: '판매금액 합계 (VAT포함)',
                                        id: 'saleVatTotal',
                                        disabled: true
                                    })}
                                    {inputNumberForm({
                                        title: '영업이익금',
                                        id: 'operationIncome',
                                        disabled: true
                                    })}
                                </BoxCard>

                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={storeInfo['write']} funcButtons={['print']} ref={tableRef} type={'order_write_column'}/>
            </div>
        </>
    </>
}

export default memo(StoreWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});