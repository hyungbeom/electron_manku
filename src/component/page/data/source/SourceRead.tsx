import {useNotificationAlert} from "@/component/util/NoticeProvider";
import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {commonManage, gridManage} from "@/utils/commonManage";
import moment from "moment/moment";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSourceColumns} from "@/utils/columnList";
import _ from "lodash";
import Space from "antd/lib/space";
import ReceiveComponent from "@/component/ReceiveComponent";
import {sourceSearchInitial} from "@/utils/initialList";


function SourceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSearchInit = () => _.cloneDeep(sourceSearchInitial);
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
        getData.post('inventory/getInventoryList', info).then(v => {
            if (v?.data?.code === 1) {
                const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                params.api.applyTransaction({add: inventoryList});
                setTotalRow(pageInfo?.totalRow ?? 0)
            } else {
                message.warn(v?.data?.message);
            }
        })
        .finally(() => {
            setLoading(false);
        });
    };

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true);
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > 재고관리
     * @param e
     */
    async function searchInfo(e?) {
        if (e) {
            setLoading(true);
            getData.post('inventory/getInventoryList', info).then(v => {
                if (v?.data?.code === 1) {
                    const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                    gridManage.resetData(gridRef, inventoryList);
                    setTotalRow(pageInfo?.totalRow ?? 0)
                } else {
                    message.warn(v?.data?.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 데이터 관리 > 재고관리
     */
    function clearAll() {
        setInfo(getSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 데이터 관리 > 재고관리
     */
    async function moveRouter() {
        getCopyPage('source_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 데이터 관리 > 재고관리
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 재고를 선택해주세요.');

        setLoading(true);
        await getData.post('inventory/deleteListInventories', {deleteInventoryList: list}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑 재고 삭제완료',
                    <>
                        <div>Model
                            : {list[0].model} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 의 재고이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
                console.warn(v?.data?.message);
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

    return <Spin spinning={loading} tip={'재고관리 조회중...'}>
        <ReceiveComponent componentName={'source_read'} searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'재고관리 조회'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRouter, type: ''}
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <TopBoxCard title={''} grid={"200px 200px 200px 1fr"}>
                        {inputForm({
                            title: 'Maker',
                            id: 'searchMaker',
                            handleKeyPress: handleKeyPress,
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: 'Model',
                            id: 'searchModel',
                            handleKeyPress: handleKeyPress,
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: '위치',
                            id: 'searchLocation',
                            handleKeyPress: handleKeyPress,
                            onChange: onChange,
                            data: info
                        })}
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
                        onConfirm={deleteList}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                    </Popconfirm>
                }
                totalRow={totalRow}
                gridRef={gridRef}
                columns={tableSourceColumns}
                onGridReady={onGridReady}
                getPropertyId={getPropertyId}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(SourceRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});