import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {tableCodeReadColumns,} from "@/utils/columnList";
import {hsCodeInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {deleteHsCodeList, searchHSCode} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import Space from "antd/lib/space";

function HcodeRead({getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const getHsCodeInit = () => _.cloneDeep(hsCodeInitial);
    const [info, setInfo] = useState(getHsCodeInit());
    const init = {
        searchText: "",
        page: 1,
        limit: -1
    }
    const [searchInit, setSearchInit] = useState(_.cloneDeep(init));
    const [isModify, setIsModifty] = useState(false);

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchHSCode({data: searchInit}).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
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

    function searchChange(e) {
        setSearchInit({...searchInit, searchText: e.target.value});
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > HS CODE 조회
     * @param e
     */
    async function searchInfo(e?) {
        if (e) {
            setLoading(true)
            await searchHSCode({data: searchInit}).then(v => {
                if(v?.data?.code === 1) {
                    gridManage.resetData(gridRef, v.data);
                    setTotalRow(v.pageInfo.totalRow)
                    setLoading(false)
                } else {
                    message.error(v?.data?.message);
                }
            })
            setLoading(false);
        }
    }

    /**
     * @description 조회 페이지 > 초기화
     * 데이터 관리 > HS CODE 관리
     */
    function clearAll() {
        gridRef.current.deselectAll();
        setSearchInit(_.cloneDeep(init));
        setIsSearch(true);
    }

    /**
     * @description HS-Code 유효성 체크
     * 데이터 관리 > HS CODE 관리
     * @param info
     */
    function checkValidate(info) {
        if (!info.item) {
            message.warning('Item을 입력해주세요.');
            return false;
        }
        if (!info.hsCode) {
            message.warning('HS-CODE를 입력해주세요.');
            return false;
        }
        return true;
    }

    /**
     * @description HS-Code > 등록
     * 데이터 관리 > HS Code 조회
     * isModify = false 수정 모드 아닐때 노출
     */
    async function saveFunc() {
        if (!checkValidate(info)) return;

        setLoading(true);
        await getData.post('hsCode/addHsCode', info).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '💾 HS-CODE 등록완료',
                    <>
                        <div>Item : {info['item']}</div>
                        <div>HS-CODE : {info['hsCode']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                setInfo(getHsCodeInit());
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description HS-Code > 수정
     * 데이터 관리 > HS CODE 조회
     * 테이블 내용 더블 클릭시 isModify = true 가 되면서 수정모드에서 노출
     */
    async function updateFunc() {
        if (!checkValidate(info)) return;

        setLoading(true);
        await getData.post('hsCode/updateHsCode', info).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '💾 HS-CODE 수정완료',
                    <>
                        <div>Item : {info['item']}</div>
                        <div>HS-CODE : {info['hsCode']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description HS-Code > 취소
     * 데이터 관리 > HS CODE 조회
     * 테이블 내용 더블 클릭시 isModify = true 가 되면서 수정모드에서 노출
     */
    function cancel() {
        setIsModifty(false);
        setInfo(getHsCodeInit());
    }

    /**
     * @description HS-Code > 테이블 > 삭제
     * 데이터 관리 > HS CODE 조회
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 HS-CODE를 선택해주세요.')
        }
        setLoading(true);

        const selectedRows = gridRef.current.getSelectedRows();
        const filterList = selectedRows.map(v => v.hsCodeId)
        await deleteHsCodeList({data: {hsCodeIdList: filterList}}).then(v => {
            if (v?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑 HS-CODE 삭제완료',
                    <>
                        <div>Item
                            : {selectedRows[0]?.item} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} HS-CODE
                            이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.message)
            }
        })
        setLoading(false);
    }

    return <Spin spinning={loading}>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'HS-CODE 조회'}
                          list={[]}
                          mini={mini} setMini={setMini}>

                    {mini ?
                        <TopBoxCard title={''} grid={'200px 190px 200px 200px 190px'}>
                            {inputForm({
                                title: '검색어',
                                id: 'searchText',
                                onChange: searchChange,
                                handleKeyPress: handleKeyPress,
                                data: searchInit
                            })}
                            <Space style={{marginTop: 14}} size={10}>
                                <Button type="primary" size="small" style={{fontSize: 11}} onClick={searchInfo}>
                                    <SearchOutlined/>조회
                                </Button>
                                <Button type="primary" danger size="small" style={{fontSize: 11}} onClick={clearAll}>
                                    <ReloadOutlined/>초기화
                                </Button>
                            </Space>
                            {inputForm({
                                title: 'Item',
                                id: 'item',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: 'HSCODE',
                                id: 'hsCode',
                                onChange: onChange,
                                data: info
                            })}
                            <Space style={{marginTop: 14}} size={10}>
                                {!isModify ?
                                    <Button type="primary" size="small" style={{fontSize: 11}} onClick={saveFunc}>
                                        <SaveOutlined/>저장
                                    </Button>
                                    : <>
                                        <Button type="primary" size="small" style={{fontSize: 11}} onClick={updateFunc}>
                                            <SaveOutlined/>수정
                                        </Button>
                                        <Button type="default" size="small" style={{fontSize: 11}}
                                                onClick={cancel}>
                                            <ReloadOutlined/>취소
                                        </Button>
                                    </>
                                }
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
                           columns={tableCodeReadColumns}
                           onGridReady={onGridReady}
                           getPropertyId={getPropertyId}
                           funcButtons={['agPrint']}
                           setInfo={setInfo}
                           type={'hsCode'}
                           tempFunc={setIsModifty}
                />
            </div>
        </>
    </Spin>
}

export default memo(HcodeRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});