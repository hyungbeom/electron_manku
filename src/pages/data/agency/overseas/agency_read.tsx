
 import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import Button from "antd/lib/button";
import {CopyOutlined,} from "@ant-design/icons";
import message from "antd/lib/message";

import {tableCodeOverseasPurchaseColumns,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import _ from "lodash";
import {inputForm, MainCard, radioForm} from "@/utils/commonForm";


export default function codeOverseasPurchase({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();
    const copyInit = _.cloneDeep(codeDomesticPurchaseInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ? dataInfo : []});
    };

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }


    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(), ':::')

        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('agency/deleteOverseasAgency', {
                    overseasAgencyId: item.overseasAgencyId
                });
                console.log(response)
                if (response.data.code === 1) {
                    message.success('삭제되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }


    function searchInfo() {

    }

    function clearAll() {

    }

    function moveRouter() {
        window.open(`/data/agency/overseas/agency_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }

    return <LayoutComponent>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 220 : 165}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 매입처 조회'}
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

            {/*@ts-ignored*/}
            <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                           onClick={deleteList}>
                <CopyOutlined/>삭제
            </Button>}
                       gridRef={gridRef}
                       columns={tableCodeOverseasPurchaseColumns}
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

    const result = await getData.post('agency/getOverseasAgencyList', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: MAKER
        "searchText": "",
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
        const list = result?.data?.entity?.overseasAgencyList
        param = {
            props: {dataInfo: list ?? null}
        }
    }

    return param
})