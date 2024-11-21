import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {MailOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import Modal from "antd/lib/modal/Modal";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import emailSendFormat from "@/utils/emailSendFormat";
import GoogleDrive from "@/component/Sample";

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

    console.log(dataList,'dataList:')

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
    const handleSendMail = () => {
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
                    acc[id].push({estimateRequestDetailId:cur.estimateRequestDetailId, managerName: cur.managerName, documentNumberFull : cur.documentNumberFull, maker : cur.maker,item : cur.item,model: cur.model, quantity: cur.quantity, unit : cur.unit})
                }
            } else {
                acc[id] = [{estimateRequestDetailId:cur.estimateRequestDetailId, managerName: cur.managerName, documentNumberFull : cur.documentNumberFull, maker : cur.maker, item : cur.item, model: cur.model, quantity: cur.quantity, unit : cur.unit}];
            }
            return acc
        }, {})

        setPreviewData(result)
        setIsModalOpen(true)
        console.log(result, 'result')

    };


    function sendMail(){
        emailSendFormat(userInfo, previewData)
    }


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: '250px 1fr', height: '100vh', gridColumnGap: 5}}>
                <Card title={'메일전송'} style={{fontSize: 12, border: '1px solid lightGray'}} >
                    <Modal okText={'메일 전송'} cancelText={'취소'} onOk={sendMail} title={<div style={{ lineHeight: 2.5, fontWeight:550 }}>메일전송</div>} open={isModalOpen} onCancel={()=>setIsModalOpen(false)} >

                        {Object.values(previewData).map((mail, i1) => {
                            let totalQuantity = 0;
                            return(

                            <div key={i1} style={{
                                position: "relative",
                                width: '100%',
                                height: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginBottom:'30px'
                            }}>
                                <img style={{position: 'absolute', left: '40%', top: 20}} src='/manku_ci_black_text.png'
                                     width={80} alt='manku logo'/>
                                <div style={{
                                    width: '100%',
                                    height: 'auto',
                                    margin: '100px 0 40px 0',
                                    textAlign: 'left',
                                    fontSize: 18,
                                    whiteSpace: 'pre-line'
                                }}>
                                    <span style={{fontWeight: 550}}>[
                                        {Object.values(mail)?.[0]?.managerName}]</span> 님<br/><br/>
                                    안녕하십니까. <span style={{fontWeight: 550}}>만쿠무역 [{userInfo.name}]</span> 입니다.<br/>
                                    아래 견적 부탁드립니다.
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    lineHeight: 2.2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexFlow: 'column',
                                }}>
                                    {/*@ts-ignore*/}
                                    {mail?.map((item, idx) => {
                                        // let totalQuantity = 0;
                                        totalQuantity += item.quantity;
                                        return (

                                            <>
                                                {!idx && (
                                                    <>
                                                        <div style={{
                                                            width: "100%",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            borderTop: "1px solid #121212",
                                                            borderBottom: "1px solid #A3A3A3",
                                                            backgroundColor: "#EBF6F7"
                                                        }}>
                                                            {item.documentNumberFull}
                                                        </div>
                                                        <div style={{
                                                            width: "100%",
                                                            height: "35px",
                                                            borderBottom: "1px solid #A3A3A3",
                                                            display: "flex"
                                                        }}>
                                                            <div style={{
                                                                fontSize: "13px",
                                                                backgroundColor: "#EBF6F7",
                                                                width: "102px",
                                                                height: "100%",
                                                                borderRight: "1px solid #121212"
                                                            }}>
                                                                maker
                                                            </div>
                                                            <div style={{lineHeight: 2, paddingLeft: "32px"}}>
                                                                {item.maker}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            width: "100%",
                                                            height: "35px",
                                                            display: "flex"
                                                        }}>
                                                            <div style={{
                                                                fontSize: "13px",
                                                                backgroundColor: "#EBF6F7",
                                                                width: "102px",
                                                                height: "100%",
                                                                borderRight: "1px solid #121212"
                                                            }}>
                                                                item
                                                            </div>
                                                            <div style={{lineHeight: 2, paddingLeft: "32px"}}>
                                                                {item.item}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            lineHeight: 1.9,
                                                            width: "100%",
                                                            height: "35px",
                                                            fontSize: "18px",
                                                            borderTop: "1px solid #121212",
                                                            borderBottom: "1px solid #A3A3A3",
                                                            backgroundColor: "#EBF6F7",
                                                            fontWeight: 540
                                                        }}>
                                                            MODEL
                                                        </div>
                                                    </>
                                                )}


                                                <div style={{
                                                    width: "100%",
                                                    height: "35px",
                                                    borderBottom: "1px solid #A3A3A3",
                                                    display: "flex"
                                                }}>
                                                    <div style={{
                                                        fontSize: "13px",
                                                        letterSpacing: "-1px",
                                                        lineHeight: 2.5,
                                                        width: "360px",
                                                        height: "100%",
                                                        borderRight: "1px solid #121212"
                                                    }}>
                                                        {item.model}
                                                    </div>
                                                    <div style={{lineHeight: 2, paddingLeft: "30px"}}>
                                                        <span style={{fontWeight: 550}}>{item.quantity}</span> {item.unit}
                                                    </div>
                                                </div>

                                                {
                                                    //@ts-ignore
                                                    idx === mail.length - 1 && (
                                                        <>
                                                            <div style={{
                                                                backgroundColor: "#EBF6F7",
                                                                width: "100%",
                                                                height: "35px",
                                                                display: "flex",
                                                                lineHeight: 2.5,
                                                                borderBottom: "1px solid #121212"
                                                            }}>
                                                                <div style={{
                                                                    fontSize: "13px",
                                                                    width: "360px",
                                                                    height: "100%",
                                                                    borderRight: "1px solid #121212"
                                                                }}>
                                                                    total
                                                                </div>
                                                                <div style={{lineHeight: 2.5, paddingLeft: "30px"}}>
                                                                <span
                                                                    style={{fontWeight: 550}}>{totalQuantity}</span> {item.unit}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}

                                                    </>

                                                )
                                            })
                                            }
                                        </div>

                                <div style={{marginTop:50}}> 감사합니다.</div>
                            </div>
                            )
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
                            <div style={{paddingTop : 30}}>

                                <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                        onClick={searchInfo}><SearchOutlined/>조회</Button>
                                {/*@ts-ignore*/}
                                <Button type={'danger'} size={'small'} style={{marginRight: 8, letterSpacing: -1}}
                                        onClick={handleSendMail}><MailOutlined/>선택 견적서 발송</Button>
                            </div>
                        </div>
                        <div>
                            <GoogleDrive/>
                        </div>
                    </div>

                </Card>

                <TableGrid
                    columns={rfqReadColumns}
                    tableData={tableData}
                    type={'read'}
                    setSelectedRows={setSelectedRows}
                    gridRef={gridRef}
                    excel={true}/>

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
        "limit": -1
    });


    return {
        props: {dataList: result?.data?.entity}
    }
})