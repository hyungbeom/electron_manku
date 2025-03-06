import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {tableEstimateReadColumns} from "@/utils/columnList";
import {
    estimateDetailUnit,
    estimateReadInitial,
    estimateRequestDetailUnit,
    subRfqReadInitial
} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, searchEstimate, searchRfq} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {useRouter} from "next/router";
import {getData} from "@/manage/function/api";
import EstimateTotalWrite from "@/component/page/estimate/EstimateTotalWrite";
import PrintIntegratedEstimate from "@/component/printIntegratedEstimate";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


export default function EstimateRead({getPropertyId, getCopyPage}) {

    const router = useRouter();
    const countRef = useRef(1);
    const infoRef = useRef(null);
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const userInfo = useAppSelector((state) => state.user);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchEstimate({data: estimateReadInitial}).then(v => {

            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })

        // 그리드 로드 후 스크롤 이벤트 추가
        setTimeout(() => {
            const gridElement = document.querySelector(".ag-body-viewport");
            if (gridElement) {
                gridElement.addEventListener("scroll", handleScroll);
            }
        }, 100);
    };
    useEffect(() => {
        infoRef.current = info
    }, [info]);

    const handleScroll = async () => {
        const gridElement = document.querySelector(".ag-body-viewport");
        if (!gridElement) return;

        const {scrollTop, scrollHeight, clientHeight} = gridElement;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 1; // 소수점 오차 보정

        if (atBottom) {
            if (countRef.current) {
                countRef.current += 1; // countRef를 직접 수정

                setLoading(true);


                await getData.post('estimate/getEstimateList', {...infoRef.current, page: countRef.current}).then(v => {
                    if (!v.data.entity.pageInfo.isNextPage) {
                        countRef.current = 0;
                    } else {
                        gridRef.current.applyTransaction({add: v.data.entity.estimateRequestList ? v.data.entity.estimateRequestList : []});
                    }
                    setLoading(false)
                })
                setLoading(false)
            }
        }
    };

    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 스크롤 이벤트 제거
            const gridElement = document.querySelector(".ag-body-viewport");
            if (gridElement) {
                gridElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo(e) {
        const copyData: any = {...info}
        if (e) {
            setLoading(true)
            await searchEstimate({data: copyData}).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)

    }

    async function moveRouter() {
        getCopyPage('estimate_write', {estimateDetailList : commonFunc.repeatObject(estimateDetailUnit, 10)})

    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateId: 'estimateId',
            estimateDetailId: 'estimateDetailId'
        });
        setLoading(true);
        await deleteEstimate({data: {deleteList: deleteList}, returnFunc: searchInfo});
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function printEstimate() {

        const checkedData = gridRef.current.getSelectedRows();

        setSelectedRow(checkedData)
        // console.log(selectedRow, 'setSelectedRow')
        setIsModalOpen(true)
    }

    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        {selectedRow.length > 0 &&
            <PrintIntegratedEstimate data={selectedRow} isModalOpen={isModalOpen} userInfo={userInfo}
                                     setIsModalOpen={setIsModalOpen}/>
        }
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '260px' : '65px'} calc(100vh - ${mini ? 390 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적서 조회'}
                          list={[
                              {name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}
                          ]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div
                            style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>
                            <BoxCard title={''}>
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                                {selectBoxForm({
                                    title: '주문 여부', id: 'searchType', onChange: onChange, data: info, list: [
                                        {value: 0, label: '전체'},
                                        {value: 1, label: '주문'},
                                        {value: 2, label: '미주문'}
                                    ]
                                })}

                            </BoxCard>
                            <BoxCard title={''}>

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
                            <BoxCard title={''}>

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
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<><Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>
                    <Button type={'primary'} size={'small'}
                            style={{backgroundColor: 'green', border: 'none', fontSize: 11, marginLeft: 5,}}
                            onClick={printEstimate}>
                        <FileExcelOutlined/>통합 견적서 발행
                    </Button>

                </>
                }
                           totalRow={totalRow}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={tableEstimateReadColumns}
                           funcButtons={['print']}
                />

            </div>
        </>
    </Spin>
}

