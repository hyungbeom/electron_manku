import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {searchOrderInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import {deleteDelivery, getDeliveryList} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, TopBoxCard} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {delilveryReadColumn} from "@/utils/columnList";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";

export default function delivery_read({dataInfo}) {
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
        params.api.applyTransaction({add: dataInfo});
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
        window.open(`/delivery_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
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

    return <Spin spinning={loading} tip={'배송정보 조회중...'}>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '345px' : '65px'} calc(100vh - ${mini ? 435 : 155}px)`,
                columnGap: 5
            }}>
                <MainCard title={'배송조회'}
                          list={[{name: '조회', func: searchInfo, type: 'primary'}, {name: '신규생성', func: moveRouter}]}
                          mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'300px 200px 1fr'}>
                                {rangePickerForm({title: '출고일자', id: 'searchDate', onChange: onChange, data: info})}
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'searchConnectInquiryNo',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </TopBoxCard>

                            <div style={{display: 'grid', gridTemplateColumns: "350px 350px"}}>
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

                                <BoxCard title={'기타 정보'}>
                                    {inputForm({
                                        title: '확인여부',
                                        id: 'searchIsConfirm',
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
                            </div>
                        </div>
                        : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           gridRef={gridRef}
                           columns={delilveryReadColumn}
                           onGridReady={onGridReady}
                           type={'read'}
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

        let result = await getDeliveryList({data: searchOrderInitial});

        return {
            props: {dataInfo: result ? result : null}
        }
    }
})