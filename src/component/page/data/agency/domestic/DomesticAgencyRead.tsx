import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined,} from "@ant-design/icons";
import message from "antd/lib/message";
import {tableCodeDomesticPurchaseColumns,} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import _ from "lodash";
import {codeDomesticPurchaseInitial} from "@/utils/initialList";
import {inputForm, MainCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {searchDomesticAgency} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Space from "antd/lib/space";

function DomesticAgencyRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(codeDomesticPurchaseInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        setLoading(true)
        gridRef.current = params.api;
        await searchDomesticAgency({
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
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            setIsSearch(true);
        }
    }

    async function moveRouter() {
        getCopyPage('domestic_agency_write', {})
    }

    async function searchInfo(e) {
        if (e) {
            setLoading(true)
            await searchDomesticAgency({
                data: {
                    "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: Maker
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
    }

    function clearAll() {
        gridRef.current.deselectAll();
        setInfo(copyInit);
        setIsSearch(true);
    }

    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 매입처를 선택해주세요.')
        }
        setLoading(true)

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => parseInt(v.agencyId));

        await getData.post('agency/deleteAgencies', {agencyIdList: filterList}).then(v => {
            if (v.data.code === 1) {
                searchInfo(true)
                notificationAlert('success', '🗑️ 국내매입처 삭제완료',
                    <>
                        <div>상호 : {list[0].agencyName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가) 삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 3
                )
            } else {
                message.error(v.data.message)
            }
            setLoading(false)
        })
    }

    return <Spin spinning={loading} tip={'국내 매입처 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 250 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'국내 매입처 조회'}
                          list={[{
                              name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                              func: moveRouter,
                              type: ''
                          }]}
                          mini={mini} setMini={setMini}>
                    {mini ?
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {/*<div style={{marginTop: -10, width: 150}}>*/}
                            {/*    {selectBoxForm({*/}
                            {/*        title: '유효기간', id: 'searchType', list: [*/}
                            {/*            {value: 1, label: '코드'},*/}
                            {/*            {value: 2, label: '상호명'},*/}
                            {/*            {value: 3, label: 'Maker'}*/}
                            {/*        ], onChange: onChange, data: info*/}
                            {/*    })}*/}
                            {/*</div>*/}
                            <div style={{width: 500, marginLeft: 10}}>
                                {inputForm({
                                    title: '검색어',
                                    id: 'searchText',
                                    onChange: onChange,
                                    data: info,
                                    size: 'small',
                                    handleKeyPress: handleKeyPress
                                })}
                            </div>
                            <Space style={{marginTop: 14, marginLeft: 20}} size={8}>
                                <Button type="primary" size="small" style={{fontSize: 11}} onClick={searchInfo}>
                                    <SearchOutlined/>조회
                                </Button>
                                <Button type="primary" danger size="small" style={{fontSize: 11}} onClick={clearAll}>
                                    <ReloadOutlined/>초기화
                                </Button>
                            </Space>
                        </div>
                        : <></>}
                </MainCard>

                {/*@ts-ignored*/}
                <TableGrid deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={confirm}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                    </Popconfirm>
                }
                           totalRow={totalRow}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           columns={tableCodeDomesticPurchaseColumns}
                           onGridReady={onGridReady}
                           funcButtons={['agPrint']}
                />

            </div>
        </>
    </Spin>
}

export default memo(DomesticAgencyRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});
