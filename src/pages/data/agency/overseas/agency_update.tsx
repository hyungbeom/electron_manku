import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, EditOutlined, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {
    tableCodeDomesticAgencyWriteColumns, tableCodeOverseasAgencyWriteColumns,
} from "@/utils/columnList";
import {
    codeDomesticAgencyWriteInitial, codeOverseasAgencyWriteInitial,
} from "@/utils/initialList";
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
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import {updateDomesticAgency} from "@/utils/api/mainApi";
import Spin from "antd/lib/spin";
import _ from "lodash";

const listType = 'overseasAgencyManagerList'
export default function code_domestic_agency_write({dataInfo}) {
    const gridRef = useRef(null);
    const router=useRouter();

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>(dataInfo)
    const [loading, setLoading] = useState<any>(false)


    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo[listType]});
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        if(!info['agencyCode']){
            return message.error('코드(약칭)이 누락되었습니다.')
        }
        setLoading(true)
        await updateDomesticAgency({data : info, returnFunc : returnFunc})
    }

    function returnFunc(){
        setLoading(false)
    }


    function clearAll() {
        setInfo(codeOverseasAgencyWriteInitial);
        gridManage.deleteAll(gridRef)
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/agency/overseas/agency_write?${query}`)
    }
    return  <Spin spinning={loading} tip={'견적의뢰 등록중...'}>
    <LayoutComponent>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '340px' : '65px'} calc(100vh - ${mini ? 395 : 120}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 매입처 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '삭제', func: saveFunc, type: 'danger'},
                {name: '초기화', func: clearAll, type: ''},
                {name: '복제', func: copyPage, type: 'default'},
            ]} mini={mini} setMini={setMini}>

                {mini ? <div style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 200px 200px 1fr 300px',
                        columnGap: 10,
                        marginTop: 10
                    }}>
                        <BoxCard title={'코드 정보'}>
                            {inputForm({title: '코드(약칭)', id: 'agencyCode', onChange: onChange, data: info})}
                            {inputForm({title: '상호', id: 'agencyName', onChange: onChange, data: info})}
                            {inputForm({title: '아이템', id: 'item', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'매입처 정보'}>
                            {inputForm({title: '딜러/제조', id: 'dealerType', onChange: onChange, data: info})}
                            {selectBoxForm({
                                title: '등급', id: 'grade', onChange: onChange, data: info, list: [
                                    {value: 'A', label: 'A'},
                                    {value: 'B', label: 'B'},
                                    {value: 'C', label: 'C'},
                                    {value: 'D', label: 'D'},
                                ]
                            })}
                            {inputNumberForm({title: '마진', id: 'margin', onChange: onChange, data: info, suffix: '%'})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {inputForm({title: '송금중개은행', id: 'intermediaryBank', onChange: onChange, data: info})}
                            {inputForm({title: '주소', id: 'address', onChange: onChange, data: info})}
                            {inputForm({title: 'IBan Code', id: 'ibanCode', onChange: onChange, data: info})}
                            {inputForm({title: 'SWIFT CODE', id: 'swiftCode', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '국가', id: 'country', onChange: onChange, data: info})}
                            {inputForm({title: 'ACCOUNT NO', id: 'bankAccountNumber', onChange: onChange, data: info})}
                            {inputForm({title: '화폐단위', id: 'currencyUnit', onChange: onChange, data: info})}
                            {inputForm({title: 'FTA NO', id: 'ftaNumber', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                            {inputForm({title: '담당자', id: 'manager', onChange: onChange, data: info})}
                            {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        </BoxCard>
                    </div>
                    : <></>}
            </MainCard>


            <TableGrid
                gridRef={gridRef}
                columns={tableCodeOverseasAgencyWriteColumns}
                onGridReady={onGridReady}
                type={'write'}
                funcButtons={['daUpload', 'agencyDomesticAdd', 'delete', 'print']}
            />
        </div>
    </LayoutComponent>
    </Spin>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const {query} = ctx;

    // 특정 쿼리 파라미터 가져오기
    const { agencyCode } = query; // 예: /page?id=123&name=example

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

    const result = await getData.post('agency/getOverseasAgencyList', {
        searchType: 1,
        searchText: agencyCode,
        page:1,
        limit:-1,
    });

    const list = result?.data?.entity?.overseasAgencyList[0]

    return {
        props: {dataInfo: list ?? {}}
    }
})