import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {remittanceDomesticSearchInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {BoxCard, inputForm, MainCard, radioForm, TopBoxCard} from "@/utils/commonForm";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import TableGrid from "@/component/tableGrid";
import {remittanceReadColumn} from "@/utils/columnList";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import {deleteProjectList, deleteRemittanceList, getDeliveryList, getRemittanceList} from "@/utils/api/mainApi";
import message from "antd/lib/message";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";

const {RangePicker} = DatePicker
export default function RemittanceDomesticRead({getPropertyId, getCopyPage}) {

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(remittanceDomesticSearchInitial)

    const [mini, setMini] = useState(true);

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState(copyInit)


    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
         await getData.post('remittance/getRemittanceList', remittanceDomesticSearchInitial).then(v=>{
            if(v.data.code === 1){
                params.api.applyTransaction({add: v?.data?.entity?.remittanceList});
            }
         })
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(e)
        }
    }

    async function searchInfo(e) {
        if(e) {
            setLoading(true);
            let result = await getRemittanceList({data: info});
            gridManage.resetData(gridRef, result);
            setLoading(false);
        }
        setLoading(false);
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const result = gridManage.getFieldValue(gridRef, 'remittanceId')
        setLoading(true)
        await deleteRemittanceList({data: {deleteRemittanceIdList: result}, returnFunc: searchInfo});
    }

    async function moveRouter() {
        getCopyPage('remittance_domestic_write', {orderStatusDetailList : []})
    }
    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }


    return <Spin spinning={loading} tip={'국내송금 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '295px' : '65px'} calc(100vh - ${mini ? 425 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'국내송금 조회'} list={[
                    {name: '조회', func: searchInfo, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '신규생성', func: moveRouter}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 20}}>
                            <BoxCard title={'기본 정보'}>

                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'searchConnectInquiryNo',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                <div>
                                    <div style={{marginBottom: 3}}>발주일자</div>
                                    <RangePicker style={{width: '100%'}}
                                                 value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                                 id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                        onChange({
                                            target: {
                                                id: 'searchDate',
                                                value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                            }
                                        })
                                    }
                                    }/>
                                </div>
                            </BoxCard>
                            <BoxCard title={'거래 정보'}>
                                {inputForm({
                                    title: '고객사명',
                                    id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '매입처명',
                                    id: 'searchAgencyName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자',
                                    id: 'searchManagerAdminName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                            </BoxCard>

                            <BoxCard title={'확인정보'}>
                                {radioForm({
                                    title: '송금여부',
                                    id: 'searchIsSend',
                                    onChange: onChange,
                                    data: info,
                                    list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}, {value: '', title: '전체'}]
                                })}
                                {radioForm({
                                    title: '계산서 발행여부',
                                    id: 'searchIsInvoice',
                                    onChange: onChange,
                                    data: info,
                                    list: [{value: 'O', title: 'O'}, {value: 'X', title: 'X'}, {value: '', title: '전체'}]
                                })}
                            </BoxCard>
                        </div>
                    </div> : <></>}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           columns={remittanceReadColumn}
                           onGridReady={onGridReady}
                           funcButtons={['print']}
                />
            </div>
        </>
    </Spin>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


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

    const result = await getData.post('remittance/getRemittanceList', remittanceDomesticSearchInitial);

    const returnValue = result?.data?.entity?.remittanceList;
    return {
        props: {dataInfo: returnValue ? returnValue : null}
    }
})