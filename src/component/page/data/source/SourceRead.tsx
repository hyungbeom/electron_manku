import {useNotificationAlert} from "@/component/util/NoticeProvider";
import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {commonManage, gridManage} from "@/utils/commonManage";
import moment from "moment/moment";
import message from "antd/lib/message";
import {deleteHsCodeList} from "@/utils/api/mainApi";
import {codeSaveInitial} from "@/utils/initialList";
import Spin from "antd/lib/spin";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {ExclamationCircleOutlined, RadiusSettingOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableCompanyAccountColumns, tableSourceColumns} from "@/utils/columnList";

export default function SourceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const [info, setInfo] = useState({
        searchText: '',
        item: '',
        hsCode: ''
    })

    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        getData.post('inventory/getInventoryList', {
            "page": 1,
            "limit": -1,
            "searchText": ""
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


    async function saveFunc() {

        setLoading(true);
        await getData.post('hsCode/addHsCode', info).then(v => {
            const code = v.data.code;
            if (code === 1) {
                notificationAlert('success', '💾회사계정 등록완료',
                    <>
                        <div>Item : {info['item']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null,
                    {}
                )
            } else {
                message.error('등록에 실패하였습니다.')
            }
            returnFunc(code === 1)
        })
    }

    function returnFunc(e) {
        setLoading(e)
        if (e) {
            searchInfo();
        }
    }


    async function searchInfo(e?) {

        if (e) {
            setLoading(true)

            getData.post('company/getCompanyAccountList', {
                "page": 1,
                "limit": -1,
                "searchCompanyName": info['searchCompanyName'],
                "searchHomepage": info['searchHomepage']
            }).then(v => {
                const {code, entity} = v.data
                if (code === 1) {
                    const {pageInfo, companyAccountList} = entity;
                    setTotalRow(pageInfo.totalRow)
                    gridManage.resetData(gridRef, companyAccountList);
                } else {
                    gridManage.resetData(gridRef, []);
                }
                setLoading(false)
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
                notificationAlert('success', '🗑️발주서 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            }
        })
    }

    function clearAll() {
        setInfo(codeSaveInitial)
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
                <MainCard title={'회사계정 관리'} list={[
                    {name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>, func: searchInfo, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                ]} mini={mini} setMini={setMini}>
                    {mini ? <>
                        <TopBoxCard title={''} grid={"150px 250px 80px 1fr"}>
                            {inputForm({
                                title: '회사이름',
                                id: 'searchCompanyName',
                                onChange: onChange,
                                handleKeyPress: handleKeyPress,
                                data: info
                            })}
                            {inputForm({
                                title: '홈페이지',
                                id: 'searchHomepage',
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
