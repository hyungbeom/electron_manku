import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {tableCodeOverseasAgencyWriteColumns,} from "@/utils/columnList";
import {codeOverseasAgencyInitial, codeOverseasAgencyWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import initialServerRouter from "@/manage/function/initialServerRouter";
import nookies from "nookies";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";

const listType = 'overseasAgencyManagerList'
export default function OverseasAgencyWrite({dataInfo={overseasAgencyManagerList : []}, copyPageInfo}) {
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({agencyCode: true});
    const copyInit = _.cloneDeep(codeOverseasAgencyWriteInitial);
    const adminParams = {agencyCode: ''}
    const infoInit = {
        ...copyInit,
        ...adminParams
    }


    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})

    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.overseasAgencyManagerList
        params.api.applyTransaction({add: result ? result : []});
    };


    function onChange(e) {
        if (e.target.id === 'agencyCode') {
            setValidate(v => {
                return {...v, agencyCode: true}
            })
        }
        commonManage.onChange(e, setInfo)
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

        await getData.post('agency/addOverseasAgency', info).then(v => {
            if (v.data.code === 1) {
                window.opener?.postMessage('write', window.location.origin);
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

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '350px' : '65px'} calc(100vh - ${mini ? 480 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'해외 매입처 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 200px 200px 1fr 300px',
                        columnGap: 10
                    }}>
                        <BoxCard title={'코드 정보'}>
                            {inputForm({title: '코드(약칭)', id: 'agencyCode', onChange: onChange, data: info, validate : validate['agencyCode']})}
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
    </>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;


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
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }

    return param
})