import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import {makerColumn,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";

export default function makerRead({dataInfo}) {
    const gridRef = useRef(null);

    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [mini, setMini] = useState(true);


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


    function searchInfo() {

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
            <MainCard title={'해외 거래처 조회'}
                      list={[{name: '조회', func: searchInfo, type: 'primary'},
                          {name: '초기화', func: clearAll, type: 'danger'},
                          {name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>

                {mini ? <div style={{display: 'flex', alignItems: 'center', padding: 10}}>

                    {radioForm({
                        title: '',
                        id: 'searchType',
                        onChange: onChange,
                        data: info,
                        list: [{value: 1, title: '코드'},
                            {value: 2, title: '상호명'},
                            {value: 3, title: 'item'},
                            {value: 4, title: '국가'}]
                    })}


                    <div style={{width: 500, marginLeft: 20}}>
                        {inputForm({
                            title: '',
                            id: 'searchCustomerName',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>


                </div> : <></>}
            </MainCard>

            <TableGrid
                gridRef={gridRef}
                columns={makerColumn}
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

    const result = await getData.post('maker/getMakerList', {
        "searchType": "",       // 구분 1: MAKER, 2: ITEM, 3: "AREA"
        "searchText": "",       // 검색어
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
        const list = result?.data?.entity?.makerList;
        param = {
            props: {dataInfo: list ?? null}
        }
    }

    return param
})