import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import moment from "moment";


export default function rfqRead({dataInfo}) {

    const router = useRouter();
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(subRfqReadInitial)
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(copyInit);

    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ? dataInfo : []});
    };

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
            gridManage.resetData(gridRef, v);
            setLoading(false)
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
        window.open(`/rfq_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }


    return <>
        <ReceiveComponent searchInfo={searchInfo}/>
        <Spin spinning={loading} tip={'견적의뢰 조회중...'}>

            <LayoutComponent>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: `${mini ? 255 : 65}px calc(100vh - ${mini ? 310 : 120}px)`,
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
                            columnGap: 20
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
                        </div> : <></>}
                    </MainCard>

                    {/*@ts-ignored*/}
                    <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                                   onClick={deleteList}>
                        <CopyOutlined/>삭제
                    </Button>}
                               gridRef={gridRef}
                               columns={rfqReadColumns}
                               onGridReady={onGridReady}
                               type={'read'}
                               funcButtons={['print']}/>

                </div>
            </LayoutComponent>
        </Spin>
    </>
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
    } else {
        store.dispatch(setUserInfo(userInfo));

        const start = Date.now();

        const result = await searchRfq({data: subRfqReadInitial});

        console.log("API 호출 시간:", Date.now() - start);
        return {
            props: {dataInfo: result ? result : null}
        }
    }

})