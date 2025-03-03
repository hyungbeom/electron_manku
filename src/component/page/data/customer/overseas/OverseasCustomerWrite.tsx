import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {tableCodeDomesticWriteColumn,} from "@/utils/columnList";
import {codeDomesticSalesWriteInitial, codeOverseasSalesWriteInitial, orderWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";

const listType = 'customerManagerList'
export default function OverseasCustomerWrite({dataInfo = {overseasCustomerManagerList : []}, copyPageInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const [mini, setMini] = useState(true);

    const copyInit = _.cloneDeep(codeOverseasSalesWriteInitial)

    const adminParams = {}

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.overseasCustomerManagerList});
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {


        await getData.post('customer/updateOverseasCustomer', info).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeDomesticSalesWriteInitial);
                deleteList()
                window.location.href = '/code_overseas_customer'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }


    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['customerManagerList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }


    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/customer/overseas/customer_write?${query}`)
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '350px' : '65px'} calc(100vh - ${mini ? 480 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 고객사 등록'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '삭제', func: saveFunc, type: 'danger'},
                {name: '복제', func: copyPage, type: 'default'},
            ]} mini={mini} setMini={setMini}>


                {mini ? <div style={{
                    display: 'grid',
                    gridTemplateColumns: "180px 200px 1fr 1fr",
                }}>
                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '코드(약칭)', id: 'customerCode', onChange: onChange, data: info})}
                        {inputForm({title: '지역', id: 'customerRegion', onChange: onChange, data: info})}
                        {inputForm({title: 'FTA No', id: 'ftaNumber', onChange: onChange, data: info})}
                        {selectBoxForm({
                            title: '화폐단위', id: 'currencyUnit', onChange: onChange, data: info, list: [
                                {value: '0', label: 'KRW'},
                                {value: '1', label: 'EUR'},
                                {value: '2', label: 'JPY'},
                                {value: '3', label: 'USD'},
                                {value: '4', label: 'GBP'},
                            ]
                        })}
                    </BoxCard>

                    <BoxCard title={'INQUIRY & PO no'}>
                        {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                        {inputForm({title: '상호', id: 'customerName', onChange: onChange, data: info})}
                        {inputForm({title: '주소', id: 'address', onChange: onChange, data: info})}
                        {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                    </BoxCard>
                    <BoxCard title={'INQUIRY & PO no'}>
                        {datePickerForm({title: '전화번호', id: 'phoneNumber', onChange: onChange, data: info})}
                        {inputForm({title: '팩스번호', id: 'faxNumber', onChange: onChange, data: info})}
                        {inputForm({title: '만쿠 담당자', id: 'mankuTradeManager', onChange: onChange, data: info})}
                    </BoxCard>
                    <BoxCard title={'INQUIRY & PO no'}>
                        {datePickerForm({title: '업체확인사항', id: 'companyVerification', onChange: onChange, data: info})}
                        {inputForm({title: '비고란', id: 'remarks', onChange: onChange, data: info})}
                    </BoxCard>
                </div> : <></>}
            </MainCard>
            <TableGrid
                gridRef={gridRef}
                columns={tableCodeDomesticWriteColumn}
                onGridReady={onGridReady}
                type={'write'}
                funcButtons={['orderUpload', 'orderAdd', 'delete', 'print']}
            />
        </div>
    </>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const {query} = ctx;

    // 특정 쿼리 파라미터 가져오기
    const {customerCode} = query; // 예: /page?id=123&name=example

    const {userInfo} = await initialServerRouter(ctx, store);

    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }
})