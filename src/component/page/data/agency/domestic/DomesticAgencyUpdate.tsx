import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {tableCodeDomesticAgencyWriteColumns,} from "@/utils/columnList";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import moment from "moment/moment";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {gridManage} from "@/utils/commonManage";
import _ from "lodash";


const listType = 'agencyManagerList'
export default function DomesticAgencyUpdate({dataInfo=[], updateKey}) {
    const gridRef = useRef(null);
    const router = useRouter();

    // const {agencyList} = data;
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>(codeDomesticAgencyWriteInitial)
    const [validate, setValidate] = useState({agencyCode: true});

    const onGridReady = (params) => {
        gridRef.current = params.api;
    };

    useEffect(() => {
        getInfo();
    }, [updateKey['domestic_agency_update']]);

    async function getInfo(){
        await getData.post('agency/getAgencyList', {
            searchType: 1,
            searchText: updateKey['domestic_agency_update'],
            page: 1,
            limit: -1,
        }).then(v=>{
            if(v.data.code === 1){
               const result = v.data.entity.agencyList.find(src => src.agencyCode === updateKey['domestic_agency_update'])
                setInfo(result);
               console.log(result,'sss')
                gridManage.resetData(gridRef, result[listType])
            }
        })
    }

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef)
        if (!info['agencyCode']) {
            setValidate(v => {
                return {...v, agencyCode: false}
            })
            return message.warn('코드(약칭)을 입력하셔야 합니다.')
        }
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        await getData.post('agency/updateAgency', copyInfo).then(v => {
            if (v.data.code === 1) {
                window.opener?.postMessage('write', window.location.origin);
                message.success('수정되었습니다.')
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }


    function clearAll() {
        setInfo(codeDomesticAgencyWriteInitial);
        gridRef.current.deselectAll();
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/agency/domestic/agency_write?${query}`)
    }
    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '360px' : '65px'} calc(100vh - ${mini ? 490 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'국내 매입처 수정'} list={[
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
                        <BoxCard title={'매입처 정보'}>
                            {inputForm({title: '코드(약칭)', id: 'agencyCode', onChange: onChange, data: info, validate : validate['agencyCode']})}
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
                columns={tableCodeDomesticAgencyWriteColumns}
                onGridReady={onGridReady}
                type={'write'}
                funcButtons={['daUpload', 'agencyDomesticAdd', 'delete', 'print']}
            />

        </div>
    </>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const {query} = ctx;

    // 특정 쿼리 파라미터 가져오기
    const {agencyCode} = query; // 예: /page?id=123&name=example

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

    const result = await getData.post('agency/getAgencyList', {
        searchType: 1,
        searchText: agencyCode,
        page: 1,
        limit: 1,
    });


    const list = result?.data?.entity?.agencyList[0];
    return {
        props: {dataInfo: list ?? []}
    }
})