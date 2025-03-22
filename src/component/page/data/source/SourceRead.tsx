import {useNotificationAlert} from "@/component/util/NoticeProvider";
import React, {memo, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {commonManage, gridManage} from "@/utils/commonManage";
import moment from "moment/moment";
import message from "antd/lib/message";
import {deleteHsCodeList} from "@/utils/api/mainApi";
import {SourceReadInitial} from "@/utils/initialList";
import Spin from "antd/lib/spin";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {ExclamationCircleOutlined, RadiusSettingOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSourceColumns} from "@/utils/columnList";
import _ from "lodash";


function SourceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const [info, setInfo] = useState({
        searchMaker: '',
        searchModel: '',
        searchLocation: ''
    })

    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        getData.post('inventory/getInventoryList', {
            "page": 1,
            "limit": -1,
            "searchMaker": "",
            "searchModel": "",
            "searchLocation": ""
        }).then(v => {

            const {code, entity} = v.data
            if (code === 1) {
                const {pageInfo, inventoryList} = entity;
                setTotalRow(pageInfo.totalRow)
                params.api.applyTransaction({add: inventoryList});
            } else {
                params.api.applyTransaction({add: []});
            }
        })

        // await searchHSCode({data: orderReadInitial}).then(v => {
        //     params.api.applyTransaction({add: v.data});
        //     setTotalRow(v.pageInfo.totalRow)
        // })
    };


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo(e?) {

        if (e) {
            setLoading(true)

            getData.post('inventory/getInventoryList', {
                "page": 1,
                "limit": -1,
                ...info
            }).then(v => {

                const {code, entity} = v.data
                if (code === 1) {
                    const {pageInfo, inventoryList} = entity;
                    setTotalRow(pageInfo.totalRow)
                    gridManage.resetData(gridRef, inventoryList);

                } else {
                    gridManage.resetData(gridRef, []);
                }
            }, err => setLoading(false))

        }
        setLoading(false)
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }


        const selectedRows = gridRef.current.getSelectedRows();
        const deleteList = selectedRows.map(v => v.hsCodeId)

        await deleteHsCodeList({data: {hsCodeIdList: deleteList}}).then(v => {
            if (v.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 삭제완료',
                    <>
                        <div>삭제되었습니다</div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            }
        })
    }

    function clearAll() {
        setInfo(SourceReadInitial)
        gridRef.current.deselectAll();
    }

    function moveRegist() {

    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    return <Spin spinning={loading}>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'재고관리 조회'} list={[
                    {name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>, func: searchInfo, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                ]} mini={mini} setMini={setMini}>
                    {mini ? <>
                        <TopBoxCard title={''} grid={"150px 250px 100px 1fr"}>
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
                        </TopBoxCard>
                    </> : null}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={deleteList}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>
                }
                           totalRow={totalRow}
                           gridRef={gridRef}
                           columns={tableSourceColumns}
                           onGridReady={onGridReady}
                           getPropertyId={getPropertyId}
                           funcButtons={['agPrint']}/>
            </div>
        </>
    </Spin>
}

export default memo(SourceRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});