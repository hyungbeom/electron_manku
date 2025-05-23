import React, {memo, useRef, useState} from "react";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined, SendOutlined
} from "@ant-design/icons";
import Button from "antd/lib/button";
import {tableOrderReadColumns} from "@/utils/columnList";
import {orderDetailUnit, orderReadInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteOrder, searchOrder} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import ReceiveComponent from "@/component/ReceiveComponent";
import Spin from "antd/lib/spin";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {getData} from "@/manage/function/api";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


function OrderRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const gridRef = useRef(null);
    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const copyInit = _.cloneDeep(orderReadInitial)
    const [info, setInfo] = useState(copyInit);

    const [totalRow, setTotalRow] = useState(0);

    const onGridReady = async (params) => {
        setLoading(true)
        gridRef.current = params.api;
        await searchOrder({data: orderReadInitial}).then(v => {
            params.api.applyTransaction({add: v?.data});
            setTotalRow(v.pageInfo.totalRow)
            setLoading(false)
        })
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
     * 발주서 > 발주서 조회
     * @param e
     */
    async function searchInfo(e) {
        const copyData: any = {...info}
        if (e) {
            setLoading(true);
            copyData['searchDocumentNumber'] = copyData?.searchDocumentNumber.replace(/\s/g, "").toUpperCase();
            await searchOrder({data: {...copyData, "page": 1, "limit": -1}}).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
                .finally(() => {
                    setLoading(false);
                });
        }
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 발주서를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            orderId: 'orderId',
            orderDetailId: 'orderDetailId'
        });
        setLoading(true);
        const selectedRows = gridRef.current.getSelectedRows();
        await deleteOrder({data: {deleteList: deleteList}}).then(v => {
            if (v.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 발주서 삭제완료',
                    <>
                        <div>Inquiry No.
                            : {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 의
                            발주서이(가)
                            삭제되었습니다.
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다. </div>*/}
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            } else {
                console.warn(v?.message);
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

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function moveRouter() {
        getCopyPage('order_write', {orderDetailList: commonFunc.repeatObject(orderDetailUnit, 1000)})
    }


    function sendAlertMail(){
        const list = gridRef.current.getSelectedRows();
        function checkMail(managerAdminId) {
            // 실제 구현에 맞게 수정
            if (managerAdminId === 20) return "test20@example.com";
            if (managerAdminId === 17) return "test17@example.com";
            if (managerAdminId === 19) return "test19@example.com";
            return "";
        }


// data는 위에서 주신 배열
        const grouped = Object.values(
            list.reduce((acc, cur) => {
                const id = cur.managerAdminId;
                if (!acc[id]) {
                    const findMember = adminList.find(v=> v.adminId === id)

                    acc[id] = {
                        email: findMember?.email,
                        managerAdminName: cur.managerAdminName,
                        detailList: []
                    };
                }
                acc[id].detailList.push(cur);
                return acc;
            }, {})
        );


        getData.post('order/updateCheckEmail', {data : grouped}).then(v=>{
            if(v?.data?.code === 1){
                message.success("요청메일 보내기가 완료되었습니다");
                searchInfo(true);
            }
        })
    }


    return <Spin spinning={loading} tip={'발주서 조회중...'}>
        <ReceiveComponent componentName={'order_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'order_read'}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
            }}>
                <MainCard title={'발주서 조회'}
                          list={[
                              {
                                  name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>,
                                  func: searchInfo,
                                  type: 'primary'
                              },
                              {
                                  name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                                  func: clearAll,
                                  type: 'danger'
                              },
                              {
                                  name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                                  func: moveRouter,
                                  type: ''
                              },
                          ]}
                          mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={''}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 25px 25px 25px',
                                            gap: 3
                                        }}>
                                            {rangePickerForm({
                                                title: '발주일자',
                                                id: 'searchDate',
                                                onChange: onChange,
                                                data: info
                                            })}
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>T</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'week').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>W</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>M</Button>
                                        </div>

                                        <div>
                                            {inputForm({
                                                title: '문서번호',
                                                id: 'searchDocumentNumber',
                                                onChange: onChange,
                                                handleKeyPress: handleKeyPress,
                                                data: info
                                            })}
                                        </div>
                                        {inputForm({
                                            title: 'Project No.', id: 'searchRfqNo',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}

                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={''}>

                                        {inputForm({
                                            title: '고객사명',
                                            id: 'searchCustomerName',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}

                                        {inputForm({
                                            title: '만쿠담당자',
                                            id: 'searchManagerAdminName',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '등록직원명', id: 'searchCreatedBy',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>

                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={''}>


                                        {inputForm({
                                            title: 'Maker',
                                            id: 'searchMaker',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: 'Item',
                                            id: 'searchItem',
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
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={''}>

                                        {selectBoxForm({
                                            title: '담당자 요청상태',
                                            id: 'searchReplyStatus',
                                            onChange: onChange,
                                            data: info,
                                            list: [

                                                {value: "", label: "전체"},
                                                {value: 0, label: "미요청"},
                                                {value: 1, label: "요청중"},
                                                {value: 2, label: "확인완료"}
                                            ]
                                        })}
                                        <div style={{paddingTop: 9}}>
                                            {selectBoxForm({
                                                title: '입고 여부',
                                                id: 'searchStockStatus',
                                                onChange: onChange,
                                                data: info,
                                                list: [
                                                    {value: '', label: '전체'},
                                                    {value: '입고', label: '입고'},
                                                    {value: '미입고', label: '미입고'}
                                                ]
                                            })}
                                        </div>
                                    </BoxCard>
                                </Panel>

                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid
                    deleteComp={
                        <>
                            <Popconfirm
                                title="담당자에 알림 메일을 보내겠습니까?"
                                onConfirm={sendAlertMail}
                                icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                                <Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                                    <SendOutlined/>알림메일 보내기
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="삭제하시겠습니까?"
                                onConfirm={deleteList}
                                icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                                <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                    <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                                </Button>
                            </Popconfirm>
                        </>
                    }
                    totalRow={totalRow}
                    getPropertyId={getPropertyId}
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={tableOrderReadColumns}
                    funcButtons={['agPrint']}/>

            </div>
        </>
    </Spin>
}

export default memo(OrderRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});