import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {tableCodeReadColumns,} from "@/utils/columnList";
import {hsCodeSearchInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    FormOutlined,
    ReloadOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {deleteHsCodeList, searchHSCode} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import Space from "antd/lib/space";
import {hsCodeInfo} from "@/utils/column/ProjectInfo";

function HcodeRead({getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getHsCodeInit = () => _.cloneDeep(hsCodeInfo['defaultInfo']);
    const [info, setInfo] = useState(getHsCodeInit());
    const getHsCodeValidateInit = () => _.cloneDeep(hsCodeInfo['write']['validate']);
    const [validate, setValidate] = useState(getHsCodeValidateInit());

    const [totalRow, setTotalRow] = useState(0);

    const [isModify, setIsModifty] = useState(false);

    const getSearchInit = () => _.cloneDeep(hsCodeSearchInitial);
    const [searchInit, setSearchInit] = useState(getSearchInit());
    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            cancel();
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        setLoading(true);
        gridRef.current = params.api;
        await searchHSCode({data: searchInit}).then(v => {
            params.api.applyTransaction({add: v?.data ?? []});
            setTotalRow(v?.data?.length);
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
        commonManage.onChange(e, setInfo);

        // 값 입력되면 유효성 초기화
        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
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
            setLoading(true);
            await searchHSCode({data: searchInit}).then(v => {
                gridManage.resetData(gridRef, v?.data ?? []);
                setTotalRow(v?.data?.length);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화
     * 데이터 관리 > HS CODE 관리
     */
    function clearAll() {
        cancel();
        setSearchInit(getSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description HS-Code > 등록
     * 데이터 관리 > HS Code 조회
     * isModify = false 수정 모드 아닐때 노출
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, hsCodeInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('hsCode/addHsCode', info).then(v => {
            if (v?.data?.code === 1) {
                setInfo(getHsCodeInit());
                searchInfo(true);
                notificationAlert('success', '💾 HS-CODE 등록완료',
                    <>
                        <div>Item : {info['item']}</div>
                        <div>HS-CODE : {info['hsCode']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
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
                        alert('작업 로그 페이지 참고');
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

    /**
     * @description HS-Code > 수정
     * 데이터 관리 > HS CODE 조회
     * 테이블 내용 더블 클릭시 isModify = true 가 되면서 수정모드에서 노출
     */
    async function updateFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, hsCodeInfo['write']['validationList'], setValidate)) return;

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
                console.log(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고');
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

    /**
     * @description HS-Code > 취소
     * 데이터 관리 > HS CODE 조회
     * 테이블 내용 더블 클릭시 isModify = true 가 되면서 수정모드에서 노출
     */
    function cancel() {
        setValidate(getHsCodeValidateInit());
        setInfo(getHsCodeInit());
        setIsModifty(false);
    }

    /**
     * @description HS-Code > 테이블 > 삭제
     * 데이터 관리 > HS CODE 조회
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows()
        if (!list?.length) return message.warn('삭제할 HS-CODE를 선택해주세요.');

        setLoading(true);
        const filterList = list.map(v => v.hsCodeId);
        await deleteHsCodeList({data: {hsCodeIdList: filterList}}).then(v => {
            if (v?.code === 1) {
                // 삭제된 리스트에 현재 수정중인 id가 있는지 확인 (삭제됬으면 폼 초기화)
                if (filterList.includes(info.hsCodeId)) cancel();

                searchInfo(true);
                notificationAlert('success', '🗑 HS-CODE 삭제완료',
                    <>
                        <div>Item
                            : {list[0]?.item} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 의
                            HS-CODE이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.log(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고');
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

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '140px' : '65px'} calc(100vh - ${mini ? 270 : 195}px)`,
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
                            handleKeyPress: handleKeyPress,
                            onChange: searchChange,
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
                            data: info,
                            validate: validate['item'],
                            key: validate['item']
                        })}
                        {inputForm({
                            title: 'HS-CODE',
                            id: 'hsCode',
                            onChange: onChange,
                            data: info,
                            validate: validate['hsCode'],
                            key: validate['hsCode']
                        })}
                        <Space style={{marginTop: 14}} size={10}>
                            {!isModify ?
                                <Button type="primary" size="small" style={{fontSize: 11}} onClick={saveFunc}>
                                    <SaveOutlined/>저장
                                </Button>
                                : <>
                                    <Button type="primary" size="small" style={{fontSize: 11}} onClick={updateFunc}>
                                        <FormOutlined/>수정
                                    </Button>
                                    <Button type="default" size="small" style={{fontSize: 11}} onClick={cancel}>
                                        <ReloadOutlined/>취소
                                    </Button>
                                </>
                            }
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
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                            <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                        </Button>
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
    </Spin>
}

export default memo(HcodeRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});