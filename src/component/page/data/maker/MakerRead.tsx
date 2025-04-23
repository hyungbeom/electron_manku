import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {makerColumn,} from "@/utils/columnList";
import {makerSearchInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, radioForm, TopBoxCard} from "@/utils/commonForm";
import {searchMaker} from "@/utils/api/mainApi";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import Popconfirm from "antd/lib/popconfirm";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import message from "antd/lib/message";
import _ from "lodash";
import Space from "antd/lib/space";
import ReceiveComponent from "@/component/ReceiveComponent";

function MakerRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getSearchInit = () => _.cloneDeep(makerSearchInitial)
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
        await searchMaker({data: info}).then(v => {
            params.api.applyTransaction({add: v?.data ?? []});
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
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 데이터 관리 > 메이커
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await searchMaker({data: info}).then(v => {
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
     * 데이터 관리 > 메이커
     */
    function clearAll() {
        setInfo(getSearchInit());
        gridRef.current.deselectAll();
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 데이터 관리 > 메이커
     */
    async function moveRouter() {
        getCopyPage('maker_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 데이터 관리 > 메이커 조회
     */
    async function deleteList() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 Maker를 선택해주세요.');

        setLoading(true);
        const filterList = list.map(v => v.makerId);
        await getData.post('maker/deleteMakers', {makerIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ Maker 삭제완료',
                    <>
                        <div>Maker
                            : {list[0].makerName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
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

    return <Spin spinning={loading} tip={'Maker 조회중...'}>
        <ReceiveComponent componentName={'maker_read'} searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'메이커 조회'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRouter, type: ''}
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <TopBoxCard title={''} grid={'240px 270px 190px'}>
                        <Space style={{marginTop: 7}}>
                            {radioForm({
                                title: '',
                                id: 'searchType',
                                onChange: onChange,
                                data: info,
                                list: [
                                    {value: 1, title: 'Maker'},
                                    {value: 2, title: 'Item'},
                                    {value: 3, title: 'AREA'}
                                ],
                            })}
                        </Space>
                        <div style={{marginTop: 7}}>
                            {inputForm({
                                title: '',
                                id: 'searchText',
                                handleKeyPress: handleKeyPress,
                                onChange: onChange,
                                data: info,
                            })}
                        </div>
                        <Space size={10} style={{marginTop: 1}}>
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
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                columns={makerColumn}
                onGridReady={onGridReady}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(MakerRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});