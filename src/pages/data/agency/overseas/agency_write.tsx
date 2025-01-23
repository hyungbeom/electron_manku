import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {
    tableCodeDomesticAgencyWriteColumns,
    tableCodeOverseasAgencyWriteColumns,
} from "@/utils/columnList";
import {
    codeDomesticAgencyWriteInitial, codeOverseasAgencyInitial, codeOverseasAgencyWriteInitial,
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


export default function code_domestic_agency_write() {
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(codeOverseasAgencyWriteInitial);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: []});
    };


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        const copyData = {...info}
        copyData['tradeStartDate'] = moment(info['tradeStartDate']).format('YYYY-MM-DD');

        await getData.post('agency/addOverseasAgency', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeOverseasAgencyInitial);
                deleteList()
                window.location.href = '/code_overseas_agency'
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
        copyData['overseasAgencyManagerList'] = uncheckedData;

        setInfo(copyData);

    }


    function addRow() {
        let copyData = {...info};
        copyData['overseasAgencyManagerList'].push({
            "managerName": "",        // 담당자
            "phoneNumber": "",   // 전화번호
            "faxNumber": "",      // 팩스번호
            "email": "",       // 이메일
            "address": "",              //  주소
            "countryAgency": "",            // 국가대리점
            "mobilePhone":  "",             // 핸드폰
            "remarks": ""                // 비고
        })

        setInfo(copyData)
    }

    function clearAll() {
        setInfo(codeOverseasAgencyWriteInitial);
        gridRef.current.deselectAll();
    }

    return <LayoutComponent>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '340px' : '65px'} calc(100vh - ${mini ? 395 : 120}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 매입처 수정'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 200px 200px 1fr 300px',
                        columnGap: 10,
                        marginTop: 10
                    }}>
                        <BoxCard title={'매입처 정보'}>
                            {inputForm({title: '코드(약칭)', id: 'agencyCode', onChange: onChange, data: info})}
                            {inputForm({title: '상호', id: 'agencyName', onChange: onChange, data: info})}
                            {inputForm({title: '사업자번호', id: 'businessRegistrationNumber', onChange: onChange, data: info})}
                            {inputForm({title: '계좌번호', id: 'bankAccountNumber', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'MAKER'}>
                            {inputForm({title: 'MAKER', id: 'maker', onChange: onChange, data: info})}
                            {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                            {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                            {selectBoxForm({
                                title: '달러/제조', id: 'dealerType', onChange: onChange, data: info, list: [
                                    {value: '달러', label: '달러'},
                                    {value: '제조', label: '제조'},
                                ]
                            })} {selectBoxForm({
                            title: '등급', id: 'grade', onChange: onChange, data: info, list: [
                                {value: 'A', label: 'A'},
                                {value: 'B', label: 'B'},
                                {value: 'C', label: 'C'},
                                {value: 'D', label: 'D'},
                            ]
                        })}
                            {inputNumberForm({title: '마진', id: 'margin', onChange: onChange, data: info, suffix: '%'})}
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
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


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


    return param
})