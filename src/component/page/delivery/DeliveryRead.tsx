import React, {useRef, useState} from "react";
import {searchOrderInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
import {deleteDelivery, getDeliveryList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {delilveryReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";

export default function DeliveryRead({getPropertyId, getCopyPage}) {
    const router = useRouter();

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(searchOrderInitial)

    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);

    const [loading, setLoading] = useState(false);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = (params) => {
        gridRef.current = params.api;
        getDeliveryList({data: searchOrderInitial}).then(v=>{
            params.api.applyTransaction({add: v});
        })
    };


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            // 체크된 행 데이터 가져오기
            const selectedRows = gridRef.current.getSelectedRows();
            console.log(selectedRows, 'selectedRows:')
            searchInfo()
        }
    }

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


    async function moveRouter() {
        getCopyPage('delivery_write', {orderStatusDetailList : []})
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
        <ReceiveComponent searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '240px' : '65px'} calc(100vh - ${mini ? 370 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'배송조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>


                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 20}}>
                                <BoxCard title={'기본 정보'}>
                                    {rangePickerForm({title: '출고일자', id: 'searchDate', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: 'Inquiry No.',
                                        id: 'searchConnectInquiryNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                                <BoxCard title={'받는분 정보'}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '받는분 전화번호',
                                        id: 'searchRecipientPhone',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>

                                <BoxCard title={'기타 정보'} tooltip={''}>
                                    {selectBoxForm({
                                        title: '확인여부', id: 'searchIsConfirm', list: [
                                            {value: 'X', label: 'X'},
                                            {value: 'O', label: 'O'},
                                            {value: '', label: '전체'},
                                        ], onChange: onChange, data: info
                                    })}
                                    {inputForm({
                                        title: '운송장번호',
                                        id: 'searchTrackingNumber',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           columns={delilveryReadColumn}
                           onGridReady={onGridReady}
                           type={'read'}
                           funcButtons={['print']}
                />
            </div>
        </>
    </Spin>
}
