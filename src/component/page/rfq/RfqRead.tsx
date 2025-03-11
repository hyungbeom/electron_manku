import React, {useEffect, useRef, useState} from "react";
import {CopyOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import {estimateRequestDetailUnit, subRfqReadInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";


export default function RfqRead({getPropertyId, getCopyPage}) {

    const router = useRouter();
    const countRef = useRef(1);
    const infoRef = useRef(null);
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(subRfqReadInitial)
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(copyInit);
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchRfq({data: subRfqReadInitial}).then(v => {
            const {data, pageInfo} = v;
            setTotalRow(pageInfo.totalRow)

            params.api.applyTransaction({add: data});
        })

        // 그리드 로드 후 스크롤 이벤트 추가
        // setTimeout(() => {
        //     const gridElement = document.querySelector(".ag-body-viewport");
        //     if (gridElement) {
        //         gridElement.addEventListener("scroll", handleScroll);
        //     }
        // }, 100);
    };

    useEffect(() => {
        infoRef.current = info
    }, [info]);

    // const handleScroll = async () => {
    //     const gridElement = document.querySelector(".ag-body-viewport");
    //     if (!gridElement) return;
    //
    //     const {scrollTop, scrollHeight, clientHeight} = gridElement;
    //     const atBottom = scrollHeight - scrollTop <= clientHeight + 1; // 소수점 오차 보정
    //
    //     if (atBottom) {
    //         if (countRef.current) {
    //             countRef.current += 1; // countRef를 직접 수정
    //
    //             setLoading(true);
    //
    //
    //             await getData.post('estimate/getEstimateRequestList', {...infoRef.current, page: countRef.current}).then(v => {
    //                 if (!v.data.entity.pageInfo.isNextPage) {
    //                     countRef.current = 0;
    //                 }else{
    //                     gridRef.current.applyTransaction({add: v.data.entity.estimateRequestList ? v.data.entity.estimateRequestList : []});
    //                 }
    //                 setLoading(false)
    //             })
    //             setLoading(false)
    //         }
    //     }
    // };

    // useEffect(() => {
    //     return () => {
    //         // 컴포넌트 언마운트 시 스크롤 이벤트 제거
    //         const gridElement = document.querySelector(".ag-body-viewport");
    //         if (gridElement) {
    //             gridElement.removeEventListener("scroll", handleScroll);
    //         }
    //     };
    // }, []);

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {

        commonManage.onChange(e, setInfo)
    }

    async function searchInfo() {
        const copyData: any = {...info}
        setLoading(true)
        await searchRfq({
            data: copyData
        }).then(v => {
            countRef.current = 1;
            const {data, pageInfo} = v;
            setTotalRow(pageInfo.totalRow)
            gridManage.resetData(gridRef, data);
            setLoading(false)
            gridRef.current.ensureIndexVisible(0)
        })

    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateRequestId: 'estimateRequestId',
            estimateRequestDetailId: 'estimateRequestDetailId'
        });
        await deleteRfq({data: {deleteList: deleteList}, returnFunc: searchInfo});

    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    function moveRegist() {
        getCopyPage('rfq_write', {estimateRequestDetailList: commonFunc.repeatObject(estimateRequestDetailUnit, 10)})
    }


    return <>
        <ReceiveComponent searchInfo={searchInfo}/>
        <Spin spinning={loading} tip={'견적의뢰 조회중...'}>

            <>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: `${mini ? 270 : 65}px calc(100vh - ${mini ? 400 : 195}px)`,
                    columnGap: 5
                }}>
                    <MainCard title={'견적의뢰 조회'} list={[
                        {name: '조회', func: searchInfo, type: 'primary'},
                        {name: '초기화', func: clearAll, type: 'danger'},
                        {name: '신규작성', func: moveRegist, type: 'default'}
                    ]} mini={mini} setMini={setMini}>
                        {mini ? <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1.5fr',
                            width: '100%',
                            columnGap: 5
                        }}>
                            <BoxCard>
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard>
                                {inputForm({
                                    title: '문서번호', id: 'searchDocumentNumber',
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
                                {inputForm({
                                    title: '고객사명', id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>

                            <BoxCard>
                                {inputForm({
                                    title: 'Maker', id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Model', id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Item', id: 'searchItem',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>
                        </div> : <></>}
                    </MainCard>

                    {/*@ts-ignored*/}
                    <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                                   onClick={deleteList}>
                        <CopyOutlined/>삭제
                    </Button>}
                               totalRow={totalRow}
                               getPropertyId={getPropertyId}
                               gridRef={gridRef}
                               columns={rfqReadColumns}
                               onGridReady={onGridReady}
                               type={'read'}
                               funcButtons={['agPrint']}/>
                </div>
            </>
        </Spin>
    </>
}