import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {tableCodeDomesticAgencyWriteColumns,} from "@/utils/columnList";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    tooltipInfo
} from "@/utils/commonForm";
import {gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveDomesticAgency} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {getData} from "@/manage/function/api";


export default function DomesticAgencyWrite({dataInfo={orderDetailList : []}, copyPageInfo}) {
    const router = useRouter();
    const fileRef = useRef(null);
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState([]);
    const userInfo = useAppSelector((state) => state.user);

    const copyInit = _.cloneDeep(codeDomesticAgencyWriteInitial)


    const adminParams = {}
    const infoInit = {
        ...copyInit,
        ...adminParams
    }
    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})

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
        gridRef.current.clearFocusedCell();

        if (!info['agencyCode']) {
            return message.error('코드(약칭)이 누락되었습니다.')
        }

        const list = gridManage.getAllData(gridRef);

        await saveDomesticAgency({data: {...info,agencyManagerList : list }, router: router})

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
            "phoneNumber": "",   // 연락처
            "faxNumber": "",      // 팩스번호
            "email": "",       // 이메일
            "address": "",              //  주소
            "countryAgency": "",            // 국가대리점
            "mobilePhone": "",             // 핸드폰
            "remarks": ""                // 비고
        })

        setInfo(copyData)
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
            <MainCard title={'국내 매입처 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 200px 200px 1fr 300px',
                        columnGap: 10
                    }}>
                        <BoxCard title={'매입처 정보'}>
                            {inputForm({title: '코드(약칭)', id: 'agencyCode', onChange: onChange, data: info})}
                            {inputForm({title: '상호', id: 'agencyName', onChange: onChange, data: info})}
                            {inputForm({title: '사업자번호', id: 'businessRegistrationNumber', onChange: onChange, data: info})}
                            {inputForm({title: '계좌번호', id: 'bankAccountNumber', onChange: onChange, data: info, suffix : <span onClick={()=>{
                                   // await getData.post('/real_name', { data: "example" }, { baseURL: 'https://openapi.openbanking.or.kr/v2.0/inquiry' })
                                }}>click</span>})}
                        </BoxCard>
                        <BoxCard title={'Maker'}>
                            {inputForm({title: 'Maker', id: 'maker', onChange: onChange, data: info})}
                            {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                            {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        </BoxCard>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                            {selectBoxForm({
                                title: '딜러/제조', id: 'dealerType', onChange: onChange, data: info, list: [
                                    {value: '딜러', label: '딜러'},
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
                            {inputNumberForm({title: '마진', id: 'margin', onChange: onChange, data: info, addonAfter: <span style={{fontSize : 11}}>%</span>  })}
                        </BoxCard>
                        <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')} disabled={!userInfo['microsoftId']}>
                            {/*@ts-ignored*/}
                            <div style={{overFlowY: "auto", maxHeight: 300}}>
                                <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                 numb={5}/>
                            </div>
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