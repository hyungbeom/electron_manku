import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";

import Button from "antd/lib/button";
import {CopyOutlined, EditOutlined, FileExcelOutlined, SearchOutlined,} from "@ant-design/icons";
import * as XLSX from "xlsx";
import message from "antd/lib/message";

import {tableCodeDomesticPurchaseColumns, tableCodeOverseasPurchaseColumns,} from "@/utils/columnList";
import {codeDomesticAgencyWriteInitial, codeDomesticPurchaseInitial,} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";
import {useRouter} from "next/router";
import _ from "lodash";


export default function codeOverseasPurchase({dataInfo}) {
    const gridRef = useRef(null);
    const router=useRouter();
    const copyInit = _.cloneDeep(codeDomesticPurchaseInitial)

    const [info, setInfo] = useState(copyInit);




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
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('agency/deleteOverseasAgency', {
                    overseasAgencyId:item.overseasAgencyId
                });
                console.log(response)
                if (response.data.code===1) {
                    message.success('삭제되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }


    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: '120px 1fr', height: '100vh', columnGap: 5}}>
            <Card size={'small'} title={'해외 매입처 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr 120px'}}>
                        <div style={{marginTop: 6}}>
                            <Radio.Group onChange={e => setInfo(v => {
                                return {...v, searchType: e.target.value}
                            })} id={'searchType'}
                                         value={info['searchType']}>
                                <Radio value={"1"}>코드</Radio>
                                <Radio value={"2"}>상호명</Radio>
                                <Radio value={"3"}>ITEM</Radio>
                                <Radio value={"4"}>국가</Radio>
                            </Radio.Group>
                        </div>

                        <Search

                            onChange={onChange}
                            id={'searchText'}
                            placeholder="input search text"
                            allowClear
                            enterButton={<><SearchOutlined/>&nbsp;&nbsp; 조회</>}
                        />
                        <div style={{margin: '0 10px'}}>
                            <Button type={'primary'} style={{backgroundColor: 'green', border: 'none'}}
                                    onClick={() => router?.push('/code_overseas_agency_write')}><EditOutlined/>신규작성</Button>
                        </div>

                    </div>

                </Card>
            </Card>

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