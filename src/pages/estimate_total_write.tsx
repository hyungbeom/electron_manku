import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import {estimateTotalColumns,} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial,} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import PrintIntegratedEstimate from "@/component/printIntegratedEstimate";
import {searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage} from "@/utils/commonManage";
import {BoxCard} from "@/utils/commonForm";

const {RangePicker} = DatePicker


export default function EstimateMerge({estimateList}) {
    const gridRef = useRef(null);

    const userInfo = useAppSelector((state) => state.user);


    const copyInit = _.cloneDeep(estimateReadInitial)
    const infoInit = {
        ...copyInit,
        searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }

    const [info, setInfo] = useState(infoInit)
    const [tableData, setTableData] = useState(estimateList)

    const [selectedRow, setSelectedRow] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);


    // =============================================================================

    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;


        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateList',
            {...copyData, "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.estimateList)
    }

    async function printEstimate() {

        const api = gridRef.current.api;
        const checkedData = api.getSelectedRows();

        setSelectedRow(checkedData)
        // console.log(selectedRow, 'setSelectedRow')
        setIsModalOpen(true)
    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div>
        <Button type={'primary'} size={'small'}
                style={{backgroundColor: 'green', border: 'none', fontSize: 11, marginLeft: 5,}}
                onClick={printEstimate}>
            <FileExcelOutlined/>통합 견적서 발행
        </Button></div>


    return <>
        <LayoutComponent>
            {selectedRow.length > 0 &&
                <PrintIntegratedEstimate data={selectedRow} isModalOpen={isModalOpen} userInfo={userInfo}
                                         setIsModalOpen={setIsModalOpen}/>
            }
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>통합견적서 발행</span>} headStyle={{marginTop: -10, height: 30}}
                         style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <BoxCard title={''}>
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
                            {inputForm({title: '문서번호', id: 'searchDocumentNumber'})}

                        </BoxCard>
                        <BoxCard title={''}>
                            {inputForm({title: '등록직원명', id: 'searchCreatedBy'})}
                            {inputForm({title: '대리점코드', id: 'searchAgencyCode'})}
                            {inputForm({title: '고객사명', id: 'searchCustomerName'})}
                        </BoxCard>
                        <BoxCard title={''}>
                            {inputForm({title: 'MAKER', id: 'searchMaker'})}
                            {inputForm({title: 'MODEL', id: 'searchModel'})}
                            {inputForm({title: 'ITEM', id: 'searchItem'})}

                        </BoxCard>
                    </div>
                    <div style={{marginTop: 8, textAlign: 'right'}}>
                        <Button size={'small'} style={{fontSize: 11}} onClick={searchInfo}
                                type={'primary'}><SearchOutlined/>조회</Button>
                    </div>


                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={estimateTotalColumns}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                    funcButtons={subTableUtil}
                />


            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
        let copyData = await searchEstimate({data: {}});
        return {
            props: {estimateList: copyData}
        }
    }
})