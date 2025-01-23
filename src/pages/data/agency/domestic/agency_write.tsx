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
} from "@/utils/columnList";
import {
    codeDomesticAgencyWriteInitial,
} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import moment from "moment/moment";
import DatePicker from "antd/lib/date-picker";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import initialServerRouter from "@/manage/function/initialServerRouter";
import nookies from "nookies";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    TopBoxCard
} from "@/utils/commonForm";


export default function agency_write({dataInfo}) {
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(codeDomesticAgencyWriteInitial);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.orderDetailList;
        params.api.applyTransaction({add: result ? result : []});
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

        await getData.post('agency/addAgency', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeDomesticAgencyWriteInitial);
                deleteList()
                window.location.href = '/code_domestic_agency'
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
        copyData['agencyManagerList'] = uncheckedData;
        setInfo(copyData);
    }


    function addRow() {
        let copyData = {...info};
        copyData['agencyManagerList'].push({
            "managerName": "",        // 담당자
            "phoneNumber": "",   // 전화번호
            "faxNumber": "",      // 팩스번호
            "email": "",       // 이메일
            "address": "",              //  주소
            "countryAgency": "",            // 국가대리점
            "mobilePhone": "",             // 핸드폰
            "remarks": ""                // 비고
        })

        setInfo(copyData)
    }




    return <LayoutComponent>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 555 : 120}px)`,
            columnGap: 5
        }}>
            <MainCard title={'발주서 작성'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                // {name: '초기화', func: clearAll, type: 'danger'}
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
                        {inputForm({title: '사업자번호', id: 'agencyName', onChange: onChange, data: info})}
                        {inputForm({title: '계좌번호', id: 'agencyName', onChange: onChange, data: info})}
                    </BoxCard>
                        <BoxCard title={'MAKER'}>
                            {inputForm({title: 'MAKER', id: 'agencyCode', onChange: onChange, data: info})}
                            {inputForm({title: 'ITEM', id: 'agencyName', onChange: onChange, data: info})}
                            {inputForm({title: '홈페이지', id: 'agencyName', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                            {selectBoxForm({
                                title: '달러/제조', id: 'dealerType', onChange: onChange, data: info, list: [
                                    {value: '달러', label: '달러'},
                                    {value: '제조', label: '제조'},
                                ]
                            })}      {selectBoxForm({
                                title: '등급', id: 'dealerType', onChange: onChange, data: info, list: [
                                {value: 'A', label: 'A'},
                                {value: 'B', label: 'B'},
                                {value: 'C', label: 'C'},
                                {value: 'D', label: 'D'},
                                ]
                            })}
                            {inputNumberForm({title: '마진', id: 'margin', onChange: onChange, data: info, suffix : '%'})}
                        </BoxCard>

                        {/*                <div style={{marginTop: 8}}>*/}
                        {/*                    <div style={{paddingBottom: 3}}>매입처 타입</div>*/}
                        {/*                    <Select id={'dealerType'}*/}
                        {/*                            onChange={(src) => onChange({target: {id: 'dealerType', value: src}})}*/}
                        {/*                            size={'small'} value={info['dealerType']} options={[*/}
                        {/*                        {value: '0', label: '딜러'},*/}
                        {/*                        {value: '1', label: '제조'},*/}
                        {/*                    ]} style={{width: '100%',}}/>*/}
                        {/*                </div>*/}

                        {/*                <div style={{marginTop: 8}}>*/}
                        {/*            <div style={{paddingBottom: 3}}>등급</div>*/}
                        {/*            <Select id={'grade'}*/}
                        {/*                    onChange={(src) => onChange({target: {id: 'grade', value: src}})}*/}
                        {/*                    size={'small'} value={info['grade']} options={[*/}
                        {/*                {value: '0', label: 'A'},*/}
                        {/*                {value: '1', label: 'B'},*/}
                        {/*                {value: '2', label: 'C'},*/}
                        {/*                {value: '3', label: 'D'},*/}
                        {/*            ]} style={{width: '100%',}}/>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>마진</div>*/}
                        {/*        <Input id={'margin'} value={info['margin']} onChange={onChange}*/}
                        {/*               size={'small'} style={{width: '90%', marginRight: 8}}/><span>%</span>*/}
                        {/*    </div>*/}

                        {/*<Card size={'small'} style={{*/}
                        {/*    fontSize: 13,*/}
                        {/*    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',*/}
                        {/*}}>*/}



                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>상호</div>*/}
                        {/*        <Input id={'agencyName'} value={info['agencyName']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>MAKER</div>*/}
                        {/*        <Input id={'maker'} value={info['maker']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>ITEM</div>*/}
                        {/*        <Input id={'item'} value={info['item']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}

                        {/*</Card>*/}


                        {/*<Card size={'small'}*/}
                        {/*      style={{*/}
                        {/*          fontSize: 13,*/}
                        {/*          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'*/}
                        {/*      }}>*/}
                        {/*    <div>*/}
                        {/*        <div>홈페이지</div>*/}
                        {/*        <Input id={'homepage'} value={info['homepage']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>사업자번호</div>*/}
                        {/*        <Input id={'businessRegistrationNumber'} value={info['businessRegistrationNumber']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}

                        {/*    <div>*/}
                        {/*        <div style={{paddingTop: 8}}>계좌번호</div>*/}
                        {/*        <Input id={'bankAccountNumber'} value={info['bankAccountNumber']} onChange={onChange}*/}
                        {/*               size={'small'}/>*/}
                        {/*    </div>*/}
                        {/*</Card>*/}
                    </div>
                    : <></>}


            </MainCard>
            <TableGrid
                gridRef={gridRef}
                columns={tableCodeDomesticAgencyWriteColumns}
                onGridReady={onGridReady}
                type={'write'}
                funcButtons={['orderUpload', 'agencyDomesticAdd', 'delete', 'print']}

    />

</div>
</LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;


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
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }

})