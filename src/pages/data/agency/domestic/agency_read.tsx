import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import Button from "antd/lib/button";
import {CopyOutlined,} from "@ant-design/icons";
import message from "antd/lib/message";

import {tableCodeDomesticPurchaseColumns,} from "@/utils/columnList";
import TableGrid from "@/component/tableGrid";
import _ from "lodash";
import {codeDomesticAgencyWriteInitial} from "@/utils/initialList";
import {inputForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";


export default function codeDomesticPurchase({dataInfo}) {

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(codeDomesticAgencyWriteInitial)

    const [info, setInfo] = useState(copyInit);
    const [mini, setMini] = useState(true);
    const [loading, setLoading] = useState(false);
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

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            agencyId: 'agencyId',
        });

        setLoading(true)

        await getData.post('agency/deleteAgency',  {deleteList: deleteList}).then(v=>{
            searchInfo(v.data.code === 1)
        })




    }


    async function searchInfo(e) {

        if (e) {
            setLoading(true)
            const result = await getData.post('agency/getAgencyList', {
                "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: MAKER
                "searchText": info['searchText'],
                "page": 1,
                "limit": -1
            });
            gridManage.resetData(gridRef, result?.data?.entity?.agencyList);
            setLoading(false)
        }
        setLoading(false)
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    async function moveRouter() {
        window.open(`/data/agency/domestic/agency_write`, '_blank', 'width=1300,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');

    }

    return <Spin spinning={loading} tip={'견적서 조회중...'}>
    <LayoutComponent>

        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '120px' : '65px'} calc(100vh - ${mini ? 220 : 165}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내 매입처 조회'}
                      list={[{name: '조회', func: searchInfo, type: 'primary'},
                          {name: '초기화', func: clearAll, type: 'danger'},
                          {name: '신규생성', func: moveRouter}]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <div style={{display: 'flex', alignItems: 'center'}}>

                        <div style={{marginTop: -10, width: 150}}>
                            {selectBoxForm({
                                title: '유효기간', id: 'searchType', list: [
                                    {value: 1, label: '코드'},
                                    {value: 2, label: '상호명'},
                                    {value: 3, label: 'MAKER'}
                                ], onChange: onChange, data: info
                            })}
                        </div>
                        <div style={{width: 500, marginLeft: 10}}>
                            {inputForm({
                                title: '검색어',
                                id: 'searchText',
                                onChange: onChange,
                                data: info,
                                size: 'small',
                                handleKeyPress: handleKeyPress
                            })}
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
                       columns={tableCodeDomesticPurchaseColumns}
                       onGridReady={onGridReady}
                       funcButtons={['print']}
            />

        </div>
    </LayoutComponent>
    </Spin>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('agency/getAgencyList', {
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

        const list = result?.data?.entity?.agencyList;

        param = {
            props: {dataInfo: list ?? null}
        }
    }

    return param
})