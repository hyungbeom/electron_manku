import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {tableEstimateReadColumns} from "@/utils/columnList";
import {estimateReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";


export default function EstimateRead({dataInfo}) {

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);

    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo});
    };


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
        if(e){
            setLoading(true)
            await searchEstimate({data: copyData}).then(v => {
                gridManage.resetData(gridRef, v);
                setLoading(false)
            })
        }
        setLoading(false)

    }

    async function moveRouter() {
        window.open(`/estimate_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateId: 'estimateId',
            estimateDetailIdList: 'estimateDetailId'
        });
        setLoading(true);
        await deleteEstimate({data: {deleteList: deleteList}, returnFunc: searchInfo});
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    return <Spin spinning={loading} tip={'견적서 조회중...'}>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '260px' : '65px'} calc(100vh - ${mini ? 320 : 120}px)`,
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
                                    title: 'MAKER', id: 'searchMaker',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'MODEL', id: 'searchModel',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'ITEM', id: 'searchItem',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}

                            </BoxCard>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}

                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={tableEstimateReadColumns}
                           funcButtons={['print']}
                />

            </div>
        </LayoutComponent>
    </Spin>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));
    let result = await searchEstimate({data: estimateReadInitial});
    return {
        props: {dataInfo: result ? result : null}
    }

})