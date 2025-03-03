import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {tableCodeDomesticWriteColumn,} from "@/utils/columnList";
import {codeDomesticSalesWriteInitial, orderWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import moment from "moment/moment";
import DatePicker from "antd/lib/date-picker";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import initialServerRouter from "@/manage/function/initialServerRouter";
import nookies from "nookies";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import TextArea from "antd/lib/input/TextArea";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";


export default function DomesticCustomerWrite({dataInfo = {customerManagerList : []}, copyPageInfo}) {
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);


    const copyInit = _.cloneDeep(codeDomesticSalesWriteInitial)
    const adminParams = {}

    const infoInit = {
        ...copyInit,
        ...adminParams
    }



    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})



    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.customerManagerList;
        params.api.applyTransaction({add: result ? result : []});
    };


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        const copyData = {...info}
        copyData['tradeStartDate'] = moment(info['tradeStartDate']).format('YYYY-MM-DD');

        await getData.post('customer/addCustomer', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeDomesticSalesWriteInitial);
                deleteList()
                window.location.href = '/code_domestic_customer'
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


    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '460px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내 고객사 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'default'},
            ]} mini={mini} setMini={setMini}>

                {mini ?  <div style={{
                    display: 'grid',
                    gridTemplateColumns: "180px 200px 1fr 240px",
                }}>
                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '코드(약칭)', id: 'customerCode', onChange: onChange, data: info})}
                        {inputForm({title: '지역', id: 'customerRegion', onChange: onChange, data: info})}
                        {inputForm({title: '업태', id: 'businessType', onChange: onChange, data: info})}
                        {inputForm({title: '종목', id: 'businessItem', onChange: onChange, data: info})}
                        {inputForm({title: '대표자', id: 'representative', onChange: onChange, data: info})}
                    </BoxCard>

                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                        {inputForm({title: '상호', id: 'customerName', onChange: onChange, data: info})}
                        {inputForm({title: '주소', id: 'address', onChange: onChange, data: info})}
                        {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        {inputForm({title: '전화번호', id: 'customerTel', onChange: onChange, data: info})}
                        {inputForm({title: '팩스번호', id: 'customerFax', onChange: onChange, data: info})}
                    </BoxCard>


                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '사업자번호', id: 'businessRegistrationNumber', onChange: onChange, data: info})}
                        {textAreaForm({title: '업체확인사항', id: 'companyVerify', onChange: onChange, data: info})}
                        {textAreaForm({title: '비고란', id: 'remarks', onChange: onChange, data: info})}
                    </BoxCard>
                    <BoxCard title={'INQUIRY & PO no'}>
                        {selectBoxForm({
                            title: '화물운송료', id: 'uploadType', onChange: onChange, data: info, list: [
                                {value: '화물 선불', label: '화물 선불'},
                                {value: '화물 후불', label: '화물 후불'},
                                {value: '택배 선불', label: '택배 선불'},
                                {value: '택배 후불', label: '택배 후불'},
                            ]
                        })}
                        {inputForm({title: '화물지점', id: 'freightBranch', onChange: onChange, data: info})}
                        {selectBoxForm({
                            title: '결제방법', id: 'paymentMethod', onChange: onChange, data: info, list: [
                                {value: '현금 결제', label: '현금 결제'},
                                {value: '선수금', label: '선수금'},
                                {value: '정기 결제', label: '정기 결제'},
                            ]
                        })}
                        {selectBoxForm({
                            title: '업체형태', id: 'dealerType', onChange: onChange, data: info, list:[
                                {value: '딜러', label: '딜러'},
                                {value: '제조', label: '제조'}
                            ]
                        })}
                        {inputForm({title: '만쿠담당자', id: 'mankuTradeManager', onChange: onChange, data: info})}
                    </BoxCard>
                </div> : null}
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
    const {query} = ctx;

    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);
    const cookies = nookies.get(ctx)
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