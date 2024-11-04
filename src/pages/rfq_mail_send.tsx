import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns, tableOrderReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial, tableOrderReadInitial} from "@/utils/initialList";
import {subRfqReadInfo, tableOrderReadInfo} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import {transformData} from "@/utils/common/common";
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import Modal from "antd/lib/modal/Modal";
import {userInfo} from "node:os";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import emailSendFormat from "@/utils/emailSendFormat";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const {estimateRequestList, pageInfo} = dataList;
    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState(subRfqReadInitial);
    const [tableData, setTableData] = useState(estimateRequestList);
    const [paginationInfo, setPaginationInfo] = useState(pageInfo);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState({});


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
        console.log(moment().subtract(1, 'years').format('YYYY-MM-DD'), ':::')

        setInfo(copyData);
        // setTableInfo(transformData(estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
        // setTableData(estimateRequestList);
        // console.log(tableData, 'setTableData')
    }, [])


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateRequestList', copyData);
        // setTableInfo(transformData(result?.data?.entity?.estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
        setTableData(result?.data?.entity?.estimateRequestList);
        setPaginationInfo(result?.data?.entity?.pageInfo)
    }

    async function deleteList() {

        let deleteIdList = [];
        selectedRows.forEach(v => (
            deleteIdList.push(v.estimateRequestId)
        ))

        console.log(deleteIdList, 'deleteIdList')

        if (deleteIdList.length < 1)
            return alert('하나 이상의 항목을 선택해주세요.')
        else {
            // @ts-ignore
            for (const v of deleteIdList) {
                await getData.post('estimate/deleteEstimateRequest', {
                    estimateRequestId: v
                }).then(r => {
                    if (r.data.code === 1)
                        console.log(v + '삭제완료')
                });
            }
            message.success('삭제되었습니다.')
            window.location.reload();
        }
    }


    async function getDetailData(params) {
        const result = await getData.post('estimate/getEstimateRequestDetail', {
            estimateRequestId: params
        });
        setTableData(result?.data?.entity?.estimateRequestList)
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            selectedRows = selectedRowKeys
        },
        onDoubleClick: (src) => {
            console.log(src, ':::')
        },
        getCheckboxProps: (record) => ({
            disabled: record?.name === 'Disabled User',
            // Column configuration not to be checked
            name: record?.name,
        }),
    };


    const getCheckedRowsData = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes(); // gridOptions 대신 gridRef 사용
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
    };

// 버튼 클릭 시 체크된 데이터 출력
    const handleButtonClick = () => {
        const checkedData = getCheckedRowsData();
        const result = checkedData.reduce((acc, cur, idx) => {
            let id = cur['estimateRequestId']
            if (acc[id]) {
                let idx = 0;
                const findModel = acc[id].find((v, index) => {
                    idx = index;
                    return v.model === cur.model
                })
                if (findModel) {
                    const { quantity} = findModel;
                    acc[id][idx] = {...acc[id][idx], quantity: acc[id][idx].quantity + quantity, unit : cur.unit}
                    return acc;
                }else{
                    acc[id].push({managerName: cur.managerName, documentNumberFull : cur.documentNumberFull, maker : cur.maker,item : cur.item,model: cur.model, quantity: cur.quantity, unit : cur.unit})
                }
            } else {
                acc[id] = [{managerName: cur.managerName, documentNumberFull : cur.documentNumberFull, maker : cur.maker, item : cur.item, model: cur.model, quantity: cur.quantity, unit : cur.unit}];
            }
            return acc
        }, {})

        setPreviewData(result)

        setIsModalOpen(true)

    };


    function sendMail(){
        emailSendFormat(userInfo, previewData)
    }
    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: '250px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'메일전송'} style={{fontSize: 12, border: '1px solid lightGray'}} >
                    <Modal title={<>'메일전송'<Button onClick={sendMail}>전송</Button></>} open={isModalOpen} closeIcon={!isModalOpen} >
                        <img src='/manku_ci_black_text.png' width={116} alt='manku logo'></img>
                        {/*@ts-ignore*/}
                        {/*<div>{(Object.values(previewData))[0].managerName}님</div>*/}
                        <div>안녕하십니까. 만쿠무역 {userInfo['name']}입니다.<br/>
                        </div>
                        {Object.values(previewData).map(v=>{
                            return <Card>
                                {/*@ts-ignore*/}
                                {v?.map((src, idx)=>{
                                    return <div style={{gridTemplateRows:"repeat(7, 60px)", gridAutoFlow:'row'}}>
                                        <div style={{borderTop:'1px solid #121212', borderBottom: '1px solid #A3A3A3'}}>{!idx ? src.documentNumberFull : null}</div>
                                        <div style={{}}>{!idx ? src.maker : null}</div>
                                        <div>{!idx ? src.item : null}</div> &nbsp;&nbsp;
                                        <span>{src.model}</span> &nbsp;&nbsp;
                                        <span>{src.quantity}</span> &nbsp;&nbsp;
                                        <span>{src.unit}</span>
                                    </div>
                                })
                                }
                            </Card>
                        })}
                    </Modal>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: 10}}>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일자</div>
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
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>문서번호</div>
                                <Input id={'searchDocumentNumber'} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'searchCustomerName'} onChange={onChange} size={'small'}/>
                            </div>
                        </div>


                        <div>
                            <div>
                                <div style={{paddingBottom: 3}}>검색조건</div>
                                <Select id={'searchType'}
                                        onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        size={'small'} value={info['searchType']} options={[
                                    {value: '0', label: '전체'},
                                    {value: '1', label: '회신'},
                                    {value: '2', label: '미회신'}
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>검색조건</div>
                                <Select id={'searchType'}
                                        onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        size={'small'} value={info['searchType']} options={[
                                    {value: '0', label: '전체'},
                                    {value: '1', label: '회신'},
                                    {value: '2', label: '미회신'}
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div>
                                <Button type={'primary'} style={{marginRight: 8}}
                                        onClick={searchInfo}><SearchOutlined/>조회</Button>
                                <Button type={'primary'} style={{marginRight: 8}}
                                        onClick={handleButtonClick}><SearchOutlined/>조회</Button>
                            </div>
                        </div>
                    </div>

                </Card>

                <TableGrid
                    columns={rfqReadColumns}
                    tableData={tableData}
                    setSelectedRows={setSelectedRows}
                    gridRef={gridRef}
                    pageInfo={paginationInfo}
                    excel={true}/>


                {/*<CustomTable columns={rfqReadColumns}*/}
                {/*             initial={subRfqReadInitial}*/}
                {/*             dataInfo={subRfqReadInfo}*/}
                {/*             info={tableInfo}*/}
                {/*             setDatabase={setInfo}*/}
                {/*             setTableInfo={setTableInfo}*/}
                {/*             rowSelection={rowSelection}*/}
                {/*             pageInfo={paginationInfo}*/}
                {/*             visible={true}*/}
                {/*             setPaginationInfo={setPaginationInfo}*/}

                {/*             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>*/}
                {/*                 <CopyOutlined/>복사*/}
                {/*             </Button>*/}
                {/*                 /!*@ts-ignored*!/*/}
                {/*                 <Button type={'danger'} size={'small'} style={{fontSize: 11}} onClick={deleteList}>*/}
                {/*                     <CopyOutlined/>삭제*/}
                {/*                 </Button>*/}
                {/*                 <Button type={'dashed'} size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>*/}
                {/*                     <FileExcelOutlined/>출력*/}
                {/*                 </Button></>}*/}
                {/*/>*/}

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

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

    const result = await getData.post('estimate/getEstimateRequestList', {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "searchManagerName": "",            // 담당자명
        "searchMobileNumber": "",           // 담당자 연락처
        "searchBiddingNumber": "",          // 입찰번호(미완성)
        "page": 1,
        "limit": 100
    });


    return {
        props: {dataList: result?.data?.entity}
    }
})