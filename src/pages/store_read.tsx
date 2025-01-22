import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {storeRealInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
import {deleteOrderStatusDetails, getOrderStatusList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {inputForm, MainCard, rangePickerForm, TopBoxCard} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {storeReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";

export default function delivery_read({dataInfo}) {
    console.log(dataInfo,'dataInfo:')
    const router = useRouter();

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(storeRealInitial)

    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);

    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo});
    };


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            // 체크된 행 데이터 가져오기
            const selectedRows = gridRef.current.getSelectedRows();
            searchInfo(e)
        }
    }

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


    /**
     * @description 배송등록 페이지로 이동합니다.
     */
    async function moveRouter() {
        window.open(`/store_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }

    /**
     * @description 배송 등록리스트 출력 함수입니다.
     */
    async function searchInfo(e) {
        const copyData: any = {...info}
        if(e) {
            setLoading(true)
            let result = await getOrderStatusList({data: copyData});
            gridManage.resetData(gridRef, result)
            setLoading(false)
        }
        setLoading(false)
    }

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            orderStatusId: "orderStatusId",
            orderStatusDetailId: "orderStatusDetailId",
        });
        setLoading(true)
        deleteOrderStatusDetails({data: {deleteList: deleteList}, returnFunc: searchInfo})
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    return <Spin spinning={loading} tip={'입고 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '230px' : '65px'} calc(100vh - ${mini ? 325 : 160}px)`,
                columnGap: 5
            }}>
                <MainCard title={'입고조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'},
                              {name: '초기화', func: clearAll, type: 'danger'},
                              {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1.5fr 1fr 1fr'}>
                                {inputForm({
                                    title: 'B/L No.',
                                    id: 'searchBlNo',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '결제여부',
                                    id: 'searchPaymentStatus',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {rangePickerForm({title: '입고일자', id: 'searchArrivalDate', onChange: onChange, data: info})}
                                {inputForm({
                                    title: 'inquiry No.',
                                    id: 'searchOrderDocumentNumberFull',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '거래처명',
                                    id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </TopBoxCard>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           gridRef={gridRef}
                           columns={storeReadColumn}
                           onGridReady={onGridReady}
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
    } else {
        store.dispatch(setUserInfo(userInfo));

        let result = await getOrderStatusList({data: storeRealInitial});

        return {
            props: {dataInfo: result ? result : null}
        }
    }
})