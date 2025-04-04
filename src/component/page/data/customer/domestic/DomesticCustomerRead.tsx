import React, {memo, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableCodeDomesticSalesColumns,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import Button from "antd/lib/button";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {inputForm, MainCard} from "@/utils/commonForm";
import {searchDomesticCustomer} from "@/utils/api/mainApi";
import {gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import Popconfirm from "antd/lib/popconfirm";
import _ from "lodash";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";


function DomesticCustomerRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const router = useRouter();
    const copyInit = _.cloneDeep(codeDomesticPurchaseInitial)

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(copyInit);
    const [totalRow, setTotalRow] = useState(0);
    const [mini, setMini] = useState(true);
    // console.log(customerList,'saveInfo:')

    const onGridReady = async (params) => {
        setLoading(true)
        gridRef.current = params.api;
        await searchDomesticCustomer({
            data: {
                "searchType": "1",      // 1: 코드, 2: 상호명, 3: Maker
                "searchText": "",
                "page": 1,
                "limit": -1
            }
        }).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
            setLoading(false)
        })
    };

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }


    async function deleteList() {
        const api = gridRef.current;


        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('customer/deleteCustomer', {
                    customerId: item.customerId
                }).then(v => {
                    if (v.data.code === 1) {
                        message.success('삭제되었습니다.')

                    } else {
                        message.error(v.data.message)
                    }

                })

            }
        }
    }

    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }
        setLoading(true)

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => parseInt(v.customerId));

        await getData.post('customer/deleteCustomers', {customerIdList: filterList}).then(v => {
            if (v.data.code === 1) {
                searchInfo(true)
                notificationAlert('success', '🗑️ 국내 고객사 삭제완료',
                    <>
                        <div>고객사 상호
                            - {list[0].agencyName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            } else {
                message.error(v.data.message)
            }
            searchInfo(false)
        })
    }

    async function searchInfo(e) {

        if (e) {
            setLoading(true)
            await searchDomesticCustomer({
                data: {
                    "searchType": 0,      // 1: 코드, 2: 상호명, 3: Maker
                    "searchText": info['searchText'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {

                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)
    }

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    function moveRouter() {

        getCopyPage('domestic_customer_write', {})
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    return <Spin spinning={loading} tip={'국내 고객사 조회중...'}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내 고객사 조회'}
                // list={[{name: '조회', func: searchInfo, type: 'primary'},
                //     {name: '초기화', func: clearAll, type: 'danger'},
                //     {name: '신규생성', func: moveRouter}]}
                      list={[{name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>


                {/*{mini ? <div style={{display: 'flex', alignItems: 'center', padding: 10}}>*/}
                {mini ? <div style={{display: 'flex', alignItems: 'center'}}>
                    {/*{radioForm({*/}
                    {/*    title: '',*/}
                    {/*    id: 'searchType',*/}
                    {/*    onChange: onChange,*/}
                    {/*    data: info,*/}
                    {/*    list: [{value: 1, title: '코드'},*/}
                    {/*        {value: 2, title: '상호명'},*/}
                    {/*        {value: 3, title: 'item'},*/}
                    {/*        {value: 4, title: '국가'}]*/}
                    {/*})}*/}

                    {/*<div style={{width: 500, marginLeft: 20}}>*/}
                    <div style={{width: 500, marginLeft: 10}}>
                        {inputForm({
                            title: '검색어',
                            id: 'searchText',
                            onChange: onChange,
                            handleKeyPress: handleKeyPress,
                            data: info,
                            size: 'middle'
                        })}
                    </div>
                    <div style={{
                        marginTop: 14,
                        marginLeft: 20,
                        width: 88,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Button type={'primary'} style={{fontSize: 11}} size={'small'} onClick={searchInfo}>조회</Button>
                        <Button type={'primary'} danger style={{fontSize: 11}} size={'small'}
                                onClick={clearAll}>초기화</Button>
                    </div>

                </div> : <></>}
            </MainCard>
            <TableGrid

                deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={confirm}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                    </Popconfirm>
                }

                totalRow={totalRow}
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                onGridReady={onGridReady}
                columns={tableCodeDomesticSalesColumns}
                funcButtons={['agPrint']}
            />

        </div>
    </Spin>
}

export default memo(DomesticCustomerRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});