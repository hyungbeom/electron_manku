import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {storeRealInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import {deleteOrderStatusDetails, getOrderStatusList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {inputForm, MainCard, rangePickerForm, TopBoxCard} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {storeReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";

export default function delivery_read({dataInfo}) {
    const router = useRouter();

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(storeRealInitial)

    const [info, setInfo] = useState(copyInit)
    const [mini, setMini] = useState(true);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo});
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


    /**
     * @description 배송등록 페이지로 이동합니다.
     */
    async function moveRouter() {
        router.push('/delivery_write')
    }

    /**
     * @description 배송 등록리스트 출력 함수입니다.
     */
    async function searchInfo() {
        const copyData: any = {...info}
        let result = await getOrderStatusList({data: copyData});
        gridManage.resetData(gridRef, result)
    }

    /**
     * @description selectRows(~ deliveryList)를 삭제하는 함수입니다.
     */
    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }
        const fieldMappings = {
            orderStatusId: "orderStatusId",
            orderStatusDetailId: "orderStatusDetailId",
        };

        const deleteList = gridManage.getFieldDeleteList(gridRef, fieldMappings);
        deleteOrderStatusDetails({data: {deleteList: deleteList}, returnFunc: searchInfo})
    }


    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '발주현황표')
    };


    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '230px' : '65px'} calc(100vh - ${mini ? 325 : 160}px)`,
                columnGap: 5
            }}>
                <MainCard title={'입고조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'}, {name: '신규생성', func: moveRouter}]}
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

        let result = await getOrderStatusList({data: storeRealInitial});

        return {
            props: {dataInfo: result ? result : null}
        }
    }
})