import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {tableCompanyAccountColumns,} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {searchCompanyAccount} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import ReceiveComponent from "@/component/ReceiveComponent";
import Space from "antd/lib/space";
import {companyAccountSearchInitial} from "@/utils/initialList";

function CompanyAccount({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSearchInit = () => _.cloneDeep(companyAccountSearchInitial)
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
        gridRef.current = params.api;
        await searchCompanyAccount({data: info}).then(v => {
            params.api.applyTransaction({add: v?.data ?? []})
            setTotalRow(v?.pageInfo?.totalRow ?? 0)
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
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > 회사계정관리
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await searchCompanyAccount({data: info}).then(v => {
                gridManage.resetData(gridRef, v?.data ?? []);
                setTotalRow(v?.pageInfo?.totalRow ?? 0)
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 데이터 관리 > 회사계정관리
     */
    function clearAll() {
        setInfo(getSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 데이터 관리 > 회사계정관리
     */
    async function moveRouter() {
        getCopyPage('company_account_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제
     * 데이터 관리 > 회사계정관리
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows()
        if (!list?.length) return message.warn('삭제할 회사계정을 선택해주세요.');

        setLoading(true);

        const filterList = list.map(v => v.companyAccountId);
        await getData.post('company/deleteCompanyAccounts', {companyAccountIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑 회사계정 삭제완료',
                    <>
                        <div>회사 이름
                            : {list[0].companyName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 의 계정이(가)
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

    return <Spin spinning={loading}>
        <ReceiveComponent componentName={'company_account_read'} searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '140px' : '65px'} calc(100vh - ${mini ? 270 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'회사계정 관리'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRouter, type: ''}
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <TopBoxCard title={''} grid={'200px 200px 190px'}>
                        {inputForm({
                            title: '회사 이름',
                            id: 'searchCompanyName',
                            handleKeyPress: handleKeyPress,
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: '홈페이지',
                            id: 'searchHomepage',
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
                columns={tableCompanyAccountColumns}
                onGridReady={onGridReady}
                getPropertyId={getPropertyId}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(CompanyAccount, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});