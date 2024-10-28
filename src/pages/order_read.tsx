import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import {estimateInfo, estimateTotalWriteColumn, estimateWriteInitial} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined, FileExcelOutlined,
    FileSearchOutlined,
    FormOutlined,
    RetweetOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns, rfqWriteColumns, subOrderReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {codeDiplomaInitial, orderReadInitial, subRfqReadInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subOrderReadInfo, subRfqReadInfo, subRfqWriteInfo} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function OrderRead({dataList}) {
    let checkList = []

    const {inventoryList, pageInfo} = dataList;
    const [info, setInfo] = useState(subRfqReadInitial)
    const [tableInfo, setTableInfo] = useState(inventoryList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)

    console.log(pageInfo,'pageInfo:')
    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
        setTableInfo(transformData(inventoryList));
    }, [])



    async function searchInfo() {
        const copyData: any = {...info}
        const {writtenDate}: any = copyData;
        if (writtenDate) {
            copyData['searchStartDate'] = writtenDate[0];
            copyData['searchEndDate'] = writtenDate[1];
        }
        const result = await getData.post('inventory/getInventoryList', copyData);
        setTableInfo(transformData(result?.data?.entity?.inventoryList));
    }

    function deleteList() {
        let copyData = {...info}
        const result = copyData['inventoryList'].filter(v => !checkList.includes(v.serialNumber))

        copyData['inventoryList'] = result
        setInfo(copyData);
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableInfo);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            checkList  = selectedRowKeys

        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'발주 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일자</div>
                            <RangePicker id={'searchDate'} size={'small'} onChange={(date, dateString) => onChange({
                                target: {
                                    id: 'searchDate',
                                    value: date
                                }
                            })
                            }/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'searchMaker'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>MODEL</div>
                            <Input id={'searchModel'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'searchItem'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>견적서담당자</div>
                            <Input id={'searchEstimateManager'} onChange={onChange} size={'small'}/>
                        </div>


                    </Card>
                    <div style={{paddingTop: 20, textAlign: 'right'}}>
                        <Button type={'primary'} style={{marginRight: 8}}
                                onClick={searchInfo}><SearchOutlined />검색</Button>
                    </div>
                </Card>

                <CustomTable columns={subOrderReadColumns}
                             initial={orderReadInitial}
                             dataInfo={subOrderReadInfo}
                             info={tableInfo}
                             setDatabase={setInfo}
                             setTableInfo={setTableInfo}
                             rowSelection={rowSelection}
                             pageInfo={paginationInfo}
                             setPaginationInfo={setPaginationInfo}

                             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                                 <CopyOutlined/>복사
                             </Button>
                                 {/*@ts-ignored*/}
                                 <Button type={'danger'} size={'small'} style={{fontSize: 11}} onClick={deleteList}>
                                     <CopyOutlined/>삭제
                                 </Button>
                                 <Button type={'dashed'} size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>
                                     <FileExcelOutlined/>출력
                                 </Button></>}
                />

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('inventory/getInventoryList', {
        "searchMaker": "",          // MAKER 검색
        "searchModel": "",          // MODEL 검색
        "searchLocation": "",       // 위치 검색
        "page": 1,
        "limit": 20
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
        // result?.data?.entity?.estimateRequestList
        param = {
            props: {dataList: result?.data?.entity}
        }
    }


    return param
})