import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {
    FileExcelOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    estimateTotalColumns,
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    estimateReadInitial,
} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import * as XLSX from "xlsx";
import Select from "antd/lib/select";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import PrintEstimate from "@/component/printEstimate";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import printIntegratedEstimate from "@/component/printIntegratedEstimate";
import PrintIntegratedEstimate from "@/component/printIntegratedEstimate";

const {RangePicker} = DatePicker


export default function EstimateMerge({dataList}) {

    const gridRef = useRef(null);

    const userInfo = useAppSelector((state) => state.user);
    const {estimateList} = dataList;
    const [info, setInfo] = useState(estimateReadInitial)
    const [tableData, setTableData] = useState(estimateList)
    const [selectedRow, setSelectedRow] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])

    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.estimateList)
    }

    async function printEstimate () {

        const api = gridRef.current.api;
        const checkedData = api.getSelectedRows();

        setSelectedRow(checkedData)
        // console.log(selectedRow, 'setSelectedRow')
        setIsModalOpen(true)
    }


    return <>
        <LayoutComponent>
            {selectedRow.length > 0 &&
            <PrintIntegratedEstimate data={selectedRow} isModalOpen={isModalOpen} userInfo={userInfo} setIsModalOpen={setIsModalOpen}/>
            }
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr',  height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>통합견적서 발행</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>

                            <div>
                                <div style={{paddingBottom: 3}}>작성일자</div>
                                <RangePicker
                                    value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                    id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                    onChange({
                                        target: {
                                            id: 'searchDate',
                                            value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                        }
                                    })
                                }
                                } style={{width: '100%',}}/>
                            </div>

                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>문서번호</div>
                                <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                       size={'small'}
                                       onChange={onChange}/>
                            </div>

                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>등록직원명</div>
                                <Input id={'searchCreatedBy'} value={info['searchCreatedBy']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'searchAgencyCode'} value={info['searchAgencyCode']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>거래처명</div>
                                <Input id={'searchCustomerName'} value={info['searchCustomerName']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'searchMaker'} value={info['searchMaker']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>MODEL</div>
                                <Input id={'searchModel'} value={info['searchModel']} size={'small'}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'searchItem'} value={info['searchItem']} size={'small'} onChange={onChange}/>
                            </div>

                        </Card>
                    </div>
                    <div style={{marginTop: 8, textAlign: 'right'}}>
                        <Button size={'small'}  style={{fontSize: 11}} onClick={searchInfo} type={'primary'}><SearchOutlined/>조회</Button>
                    </div>



                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={estimateTotalColumns}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                    funcButtons={<div>
                        <Button type={'primary'} size={'small'} style={{backgroundColor:'green', border:'none', fontSize: 11, marginLeft:5,}} onClick={printEstimate}>
                            <FileExcelOutlined/>통합 견적서 발행
                        </Button></div>}
                />


            </div>
        </LayoutComponent>
    </>
}
// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('estimate/getEstimateList', {
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
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
        param = {
            props: {dataList: result?.data?.entity}
        }
    }


    return param
})