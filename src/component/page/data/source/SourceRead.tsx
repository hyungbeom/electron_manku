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


function SourceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const init = {
        searchMaker: '',
        searchModel: '',
        searchLocation: '',
        page: 1,
        limit: -1
    }
    const [info, setInfo] = useState(_.cloneDeep(init))

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        getData.post('inventory/getInventoryList', init).then(v => {
            if (v?.data?.code === 1) {
                const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                params.api.applyTransaction({add: inventoryList});
                setTotalRow(pageInfo.totalRow)
            } else {
                message.error(v?.data?.message);
            }
        })
    };

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 데이터 관리 > 재고고나리
     */
    async function moveRouter() {
        getCopyPage('source_write', {})
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > 재고관리
     * @param e
     */
    async function searchInfo(e?) {
        if (e) {
            setLoading(true)
            getData.post('inventory/getInventoryList', info).then(v => {
                if (v?.data?.code === 1) {
                    const {pageInfo = {}, inventoryList = []} = v?.data?.entity;
                    gridManage.resetData(gridRef, inventoryList);
                    setTotalRow(pageInfo.totalRow)
                } else {
                    message.error(v?.data?.message);
                }
            })
            setLoading(false)
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 데이터 관리 > 재고관리
     */
    function clearAll() {
        gridRef.current.deselectAll();
        setInfo(_.cloneDeep(init));
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 데이터 관리 > 재고관리
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 재고를 선택해주세요.')
        }
        setLoading(true);

        const list = gridRef.current.getSelectedRows();

        await getData.post('inventory/deleteListInventories', {deleteInventoryList: list}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑 재고 삭제완료',
                    <>
                        <div>Model
                            : {list[0].model} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 재고이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    return <Spin spinning={loading} tip={'재고관리 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'재고관리 조회'} list={[{
                name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                func: moveRouter,
                type: ''
            }]} mini={mini} setMini={setMini}>
                {mini ?
                    <TopBoxCard title={''} grid={"200px 200px 200px 1fr"}>
                        {inputForm({
                            title: 'Maker',
                            id: 'searchMaker',
                            onChange: onChange,
                            handleKeyPress: handleKeyPress,
                            data: info
                        })}
                        {inputForm({
                            title: 'Model',
                            id: 'searchModel',
                            onChange: onChange,
                            handleKeyPress: handleKeyPress,
                            data: info
                        })}
                        {inputForm({
                            title: '위치',
                            id: 'searchLocation',
                            onChange: onChange,
                            handleKeyPress: handleKeyPress,
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
            <TableGrid deleteComp={<Popconfirm
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