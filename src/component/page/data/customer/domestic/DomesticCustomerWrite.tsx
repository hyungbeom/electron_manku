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
import Table from "@/component/util/Table";
import {DCWInfo, projectInfo} from "@/utils/column/ProjectInfo";


export default function DomesticCustomerWrite({dataInfo = {customerManagerList : []}, copyPageInfo}) {
    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);


    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);

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
                        {inputForm({title: '코드(약칭)', id: 'customerCode'})}
                        {inputForm({title: '지역', id: 'customerRegion'})}
                        {inputForm({title: '업태', id: 'businessType'})}
                        {inputForm({title: '종목', id: 'businessItem'})}
                        {inputForm({title: '대표자', id: 'representative'})}
                    </BoxCard>

                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '거래시작일', id: 'tradeStartDate'})}
                        {inputForm({title: '상호', id: 'customerName'})}
                        {inputForm({title: '주소', id: 'address'})}
                        {inputForm({title: '홈페이지', id: 'homepage'})}
                        {inputForm({title: '연락처', id: 'customerTel'})}
                        {inputForm({title: '팩스번호', id: 'customerFax'})}
                    </BoxCard>


                    <BoxCard title={'INQUIRY & PO no'}>
                        {inputForm({title: '사업자번호', id: 'businessRegistrationNumber'})}
                        {textAreaForm({title: '업체확인사항', id: 'companyVerify'})}
                        {textAreaForm({title: '비고란', id: 'remarks'})}
                    </BoxCard>
                    <BoxCard title={'INQUIRY & PO no'}>
                        <div style={{paddingTop: 10, paddingBottom: 10}}>
                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>화물운송료</div>
                            <select name="languages" id="shippingTerms"
                                    style={{
                                        outline: 'none',
                                        border: '1px solid lightGray',
                                        height: 23,
                                        width: '100%',
                                        fontSize: 12,
                                        paddingBottom: 0.5
                                    }}>
                                <option value={'화물 선불'}>화물 선불</option>
                                <option value={'화물 후불'}>화물 후불</option>
                                <option value={'택배 선불'}>택배 선불</option>
                                <option value={'택배 후불'}>택배 후불</option>
                            </select>
                        </div>
                        {inputForm({title: '화물지점', id: 'freightBranch'})}
                        <div style={{ paddingBottom: 10}}>
                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>결제방법</div>
                            <select name="languages" id="shippingTerms"
                                    style={{
                                        outline: 'none',
                                        border: '1px solid lightGray',
                                        height: 23,
                                        width: '100%',
                                        fontSize: 12,
                                        paddingBottom: 0.5
                                    }}>
                                <option value={'현금 결제'}>현금 결제</option>
                                <option value={'선수금'}>선수금</option>
                                <option value={'정기 결제'}>정기 결제</option>
                                <option value={'택배 후불'}>택배 후불</option>
                            </select>
                        </div>
                        <div style={{paddingTop: 5, paddingBottom: 10}}>
                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>업체형태</div>
                            <select name="languages" id="shippingTerms"
                                    style={{
                                        outline: 'none',
                                        border: '1px solid lightGray',
                                        height: 23,
                                        width: '100%',
                                        fontSize: 12,
                                        paddingBottom: 0.5
                                    }}>

                                <option value={'딜러'}>딜러</option>
                                <option value={'제조'}>택배 후불</option>
                            </select>
                        </div>
                        <div style={{paddingTop : 5}}>
                        {inputForm({title: '만쿠담당자', id: 'mankuTradeManager'})}
                        </div>
                    </BoxCard>
                </div> : null}
            </MainCard>

            <Table data={tableData} column={DCWInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'DCW_column'}/>

        </div>
    </>
}