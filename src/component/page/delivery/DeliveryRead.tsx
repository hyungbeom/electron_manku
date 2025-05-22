import React, {memo, useRef, useState} from "react";
import {searchOrderInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {CopyOutlined, RadiusSettingOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {deleteDelivery, getDeliveryList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {deliveryReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";


function DeliveryRead({getPropertyId, getCopyPage}: any) {
    const router = useRouter();

    const gridRef = useRef(null);

    const groupRef = useRef<any>(null)
    const copyInit = _.cloneDeep(searchOrderInitial)

    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);

    const [loading, setLoading] = useState(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('delivery_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = (params) => {
        gridRef.current = params.api;
        getDeliveryList({data: searchOrderInitial}).then(v => {
            params.api.applyTransaction({add: v});
        })
    };


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            // 체크된 행 데이터 가져오기
            const selectedRows = gridRef.current.getSelectedRows();

            searchInfo()
        }
    }

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


    async function moveRouter() {
        getCopyPage('delivery_write', {orderStatusDetailList: []})
    }

    /**
     * @description 배송 등록리스트 출력 함수입니다.
     */
    async function searchInfo() {
        const copyData: any = {...info}
        setLoading(true)
        await getDeliveryList({data: copyData}).then(v => {
            gridManage.resetData(gridRef, v);
            setLoading(false)
        })
    }

    /**
     * @description selectRows(~ deliveryList)를 삭제하는 함수입니다.
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }
        const deleteIdList = gridManage.getFieldValue(gridRef, 'deliveryId')
        await deleteDelivery({data: {deleteIdList: deleteIdList}, returnFunc: searchInfo});
    }

    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    return <Spin spinning={loading} tip={'배송정보 조회중...'}>
        <ReceiveComponent componentName={'delivery_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'delivery_read'}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '310px' : '65px'} calc(100vh - ${mini ? 440 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'배송조회'}
                          list={[
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
                          ]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'기본 정보'}>
                                    {rangePickerForm({title: '출고일자', id: 'searchDate', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: 'Inquiry No.',
                                        id: 'searchConnectInquiryNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '운송장번호',
                                        id: 'searchTrackingNumber',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'받는분 정보'}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '받는분 성명',
                                        id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '받는분 연락처',
                                        id: 'searchRecipientPhone',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'기타 정보'} tooltip={''}>
                                    <div style={{paddingBottom: 9}}>
                                        {selectBoxForm({
                                            title: '확인여부', id: 'searchIsConfirm', list: [
                                                {value: '', label: '전체'},
                                                {value: 'O', label: 'O'},
                                                {value: 'X', label: 'X'},
                                            ],
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </div>
                                    <div style={{paddingBottom: 0}}>
                                        {selectBoxForm({
                                            title: '출고완료여부', id: 'searchIsConfirm', list: [
                                                {value: '', label: '전체'},
                                                {value: 'O', label: 'O'},
                                                {value: 'X', label: 'X'},
                                            ],
                                            onChange: onChange,
                                            data: info
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
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>}
                    getPropertyId={getPropertyId}
                    gridRef={gridRef}
                    columns={deliveryReadColumn}
                    onGridReady={onGridReady}
                    funcButtons={['agPrint']}
                />
            </div>
        </>
    </Spin>
}

export default memo(DeliveryRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});