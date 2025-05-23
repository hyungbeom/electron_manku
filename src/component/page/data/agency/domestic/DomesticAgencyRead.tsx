import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined,
    SaveOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {tableCodeDomesticPurchaseColumns,} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import _ from "lodash";
import {DASearchInitial} from "@/utils/initialList";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
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

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSearchInit = () => _.cloneDeep(DASearchInitial);
    const [info, setInfo] = useState(getSearchInit());

    const [totalRow, setTotalRow] = useState(0);

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        setLoading(true);
        gridRef.current = params.api;
        await searchDomesticAgency({data: info}).then(v => {
            params.api.applyTransaction({add: v?.data ?? []});
            setTotalRow(v?.data?.length);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true);
        }
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > 매입처 > 국내매입처
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await searchDomesticAgency({data: info}).then(v => {
                gridManage.resetData(gridRef, v?.data ?? []);
                setTotalRow(v?.data?.length);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 데이터 관리 > 매입처 > 국내매입처
     */
    function clearAll() {
        setInfo(getSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 데이터 관리 > 매입처 > 국내매입처
     */
    async function moveRouter() {
        getCopyPage('domestic_agency_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 데이터 관리 > 매입처 > 국내매입처
     */
    async function confirm() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 매입처를 선택해주세요.');

        setLoading(true);
        const filterList = list.map(v => parseInt(v.agencyId));
        await getData.post('agency/deleteAgencies', {agencyIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 국내매입처 삭제완료',
                    <>
                        <div>상호
                            : {list[0].agencyName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.warn(v?.data?.message);
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

    return <Spin spinning={loading} tip={'국내 매입처 조회중...'}>
        <ReceiveComponent componentName={'domestic_agency_read'} searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '140px' : '65px'} calc(100vh - ${mini ? 270 : 195}px)`,
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
                    <TopBoxCard title={''} grid={'300px 1fr'}>
                        <div style={{marginLeft: 10}}>
                            {inputForm({
                                title: '검색어',
                                id: 'searchText',
                                handleKeyPress: handleKeyPress,
                                onChange: onChange,
                                data: info
                            })}
                        </div>
                        <Space style={{marginTop: 14}} size={8}>
                            <Button type="primary" size="small" style={{fontSize: 11}} onClick={searchInfo}>
                                <SearchOutlined/>조회
                            </Button>
                            <Button type="primary" danger size="small" style={{fontSize: 11}} onClick={clearAll}>
                                <ReloadOutlined/>초기화
                            </Button>
                        </Space>
                    </TopBoxCard>
                    : <></>}
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
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                columns={tableCodeDomesticPurchaseColumns}
                onGridReady={onGridReady}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(DomesticAgencyRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});
