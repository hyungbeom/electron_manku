import React, {useEffect, useRef, useState} from "react";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import {modalCodeDiplomaColumn,} from "@/utils/columnList";
import {codeDiplomaReadInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import DatePicker from "antd/lib/date-picker";
import {inputForm, MainCard, rangePickerForm} from "@/utils/commonForm";

const {RangePicker} = DatePicker

export default function codeOverseasPurchase({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();


    const [info, setInfo] = useState(codeDiplomaReadInitial);
    const [mini, setMini] = useState(true);

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ?? []});
    };


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function searchInfo() {

        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('officialDocument/getOfficialDocumentList',
            {...copyData, "page": 1, "limit": -1});

    }

    function clearAll() {

    }

    function moveRouter() {

    }

    return <LayoutComponent>

        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 220 : 165}px)`,
            columnGap: 5
        }}>

            <MainCard title={'공문서 조회'}
                      list={[{name: '조회', func: searchInfo, type: 'primary'},
                          {name: '초기화', func: clearAll, type: 'danger'},
                          {name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>

                {mini ? <div style={{display: 'flex', alignItems: 'center', padding: 10}}>

                    {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info,})}
                    <div style={{width: 500, marginLeft: 20}}>
                        {inputForm({
                            title: '검색어',
                            id: 'searchCustomerName',
                            onChange: onChange,
                            data: info,
                            size: 'size'
                        })}
                    </div>

                </div> : <></>}
            </MainCard>


            <TableGrid
                gridRef={gridRef}
                columns={modalCodeDiplomaColumn}

                onGridReady={onGridReady}
                funcButtons={['print']}
            />

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('officialDocument/getOfficialDocumentList', {
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),
        "searchDocumentNumber": "",           // 문서번호 검색
        "page": 1,
        "limit": -1
    });


    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        const list = result?.data?.entity?.officialDocumentList
        param = {
            props: {dataInfo: list ?? []}
        }
    }

    return param
})