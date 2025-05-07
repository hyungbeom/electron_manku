import React, {useEffect, useRef, useState} from "react";
import {remittanceDomesticSearchInitial} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {BoxCard, inputForm, MainCard, radioForm, rangePickerForm, selectBoxForm, SelectForm} from "@/utils/commonForm";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import TableGrid from "@/component/tableGrid";
import {remittanceReadColumn} from "@/utils/columnList";
import Button from "antd/lib/button";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {getRemittanceList} from "@/utils/api/mainApi";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Popconfirm from "antd/lib/popconfirm";

export default function DomesticRemittanceRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const getRemittanceSearchInit = () => _.cloneDeep(remittanceDomesticSearchInitial);
    const [info, setInfo] = useState(getRemittanceSearchInit());

    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        setLoading(true)
        gridRef.current = params.api;

        await getData.post('remittance/getRemittanceList', {}).then(v=>{

                params.api.applyTransaction({add: v?.data.entity});
        })

        // await getRemittanceList({data: getRemittanceSearchInit()}).then(v => {
        //     params.api.applyTransaction({add: v?.data});
        //     // setTotalRow(v.pageInfo.totalRow)
        // });
        setLoading(false);
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(e)
        }
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 송금 > 국내송금 조회
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            console.log(info,'::::')

            await getData.post('remittance/getRemittanceList', info).then(v=>{
                gridManage.resetData(gridRef, v?.data?.entity);
            })
            // await getRemittanceList({data: info}).then(v => {
            //     gridManage.resetData(gridRef, v.data);
            //     setTotalRow(v.pageInfo.totalRow)
            // });
            setLoading(false);
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 송금 > 국내송금 조회
     */
    function clearAll() {
        gridRef.current.deselectAll();
        setInfo(getRemittanceSearchInit());
        setIsSearch(true);
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 송금 > 국내송금 조회
     */
    async function moveRouter() {
        getCopyPage('domestic_remittance_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 송금 > 국내송금 조회
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 송금 정보를 선택해주세요.')
        }
        setLoading(true);

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => parseInt(v.remittanceId));

        await getData.post('remittance/deleteRemittances', {deleteRemittanceIdList: filterList}).then(v => {
            if (v.data.code === 1) {
                searchInfo(true)
                notificationAlert('success', '🗑️ 국내 송금 삭제완료',
                    <>
                        <div>Inquiry No. :
                            : {list[0].connectInquiryNo} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v.data.message)
            }
        })
        setLoading(false);
    }

    return <Spin spinning={loading} tip={'국내 송금 조회중...'}>
        <ReceiveComponent componentName={'domestic_remittance_read'} searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내송금 조회'} list={[
                {name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>, func: searchInfo, type: 'primary'},
                {
                    name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                    func: clearAll,
                    type: 'danger'
                },
                {
                    name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                    func: moveRouter,
                    type: ''
                }
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>
                    <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={15}>
                            <BoxCard title={''}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 25px 25px 25px',
                                    gap: 3
                                }}>
                                    {rangePickerForm({
                                        title: '송금지정일자',
                                        id: 'searchRequestDate',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchRequestDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        searchRequestStartDate: moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        searchRequestEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>T</Button>
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchRequestDate: [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        searchRequestStartDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        searchRequestEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>W</Button>
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                console.log('!!!!')
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchRequestDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        searchRequestStartDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        searchRequestEndDate: moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>M</Button>
                                </div>
                                {inputForm({
                                    title: '담당자',
                                    id: 'searchManagerAdminName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={15}>
                            <BoxCard title={''}>
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'searchDocumentNumber',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사명',
                                    id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '매입처명',
                                    id: 'searchAgencyName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={20}>
                            <BoxCard title={''}>
                                {radioForm({
                                    title: '계산서 발행여부',
                                    id: 'searchIsInvoice',
                                    onChange: onChange,
                                    data: info,
                                    list: [
                                        {value: 'O', title: 'O'},
                                        {value: 'X', title: 'X'}
                                    ]
                                })}
                                {radioForm({
                                    title: '부분송금 진행여부',
                                    id: 'searchPartialRemittanceStatus',
                                    onChange: onChange,
                                    data: info,
                                    list: [
                                        {value: '완료', title: '완료'},
                                        {value: '진행중', title: '진행중'},
                                        {value: '', title: '해당없음'}
                                    ]
                                })}
                                <div style={{paddingTop: 2}}>
                                    {selectBoxForm({
                                        title: '송금상태',
                                        id: 'searchIsSend',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '요청', label: '요청'},
                                            {value: '취소', label: '취소'},
                                            {value: '반려', label: '반려'},
                                            {value: '부분완료', label: '부분완료'},
                                            {value: '완료', label: '완료'}
                                        ]
                                    })}
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                    </PanelGroup>

                </div> : <></>}
            </MainCard>
            {/*@ts-ignored*/}
            <TableGrid
                deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={confirm}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                            <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                        </Button>
                    </Popconfirm>
                }
               totalRow={totalRow}
               getPropertyId={getPropertyId}
               gridRef={gridRef}
               columns={remittanceReadColumn}
               onGridReady={onGridReady}
               funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

