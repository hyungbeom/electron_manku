import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {tableCompanyAccountColumns,} from "@/utils/columnList";
import {codeSaveInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {searchCompanyAccount, searchMaker} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import _ from "lodash";
import ReceiveComponent from "@/component/ReceiveComponent";
import Space from "antd/lib/space";

function CompanyAccount({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const init = {
        searchCompanyName: '',
        searchHomepage: '',
        page: 1,
        limit: -1
    }
    const [info, setInfo] = useState(_.cloneDeep(init));

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchCompanyAccount({data: init}).then(v => {
            params.api.applyTransaction({add: v.data})
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

    async function moveRouter() {
        getCopyPage('company_account_write', {})
    }

    async function searchInfo(e) {
        if (e) {
            setLoading(true)
            await searchCompanyAccount({data: info}).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
    }

    /**
     * @description 조회 > 초기화 버튼
     */
    function clearAll() {
        gridRef.current.deselectAll();
        setInfo(_.cloneDeep(init));
        setIsSearch(true);
    }

    /**
     * @description 조회 테이블 > 삭제
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 회사계정을 선택해주세요.')
        }
        setLoading(true);

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => v.companyAccountId);

        await getData.post('company/deleteCompanyAccounts', {companyAccountIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true)
                notificationAlert('success', '🗑 회사계정 삭제완료',
                    <>
                        <div>회사 이름
                            : {list[0].companyName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 계정이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false)
        })
    }

    return <Spin spinning={loading}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'회사계정 관리'} list={[{
                name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                func: moveRouter,
                type: ''
            }]} mini={mini} setMini={setMini}>
                {mini ?
                    <TopBoxCard title={''} grid={'200px 200px 190px'}>
                        {inputForm({
                            title: '회사 이름',
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