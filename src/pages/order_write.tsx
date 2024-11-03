import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, EditOutlined, FileExcelOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {
    searchAgencyCodeColumn,
    searchCustomerColumn,
    subRfqWriteColumn,
    tableOrderWriteColumn,
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderWriteInitial, rfqWriteInitial, subRfqWriteInitial, tableOrderWriteInitial} from "@/utils/initialList";
import {subOrderWriteInfo, subRfqWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";
import * as XLSX from "xlsx";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Modal from "antd/lib/modal/Modal";
import Table from "antd/lib/table";
import TableModal from "@/utils/TableModal";
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function OrderWriter({dataInfo}) {

    const router = useRouter();

    let checkList = []

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(orderWriteInitial)
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});



    useEffect(() => {

        let copyData: any = {...orderWriteInitial}

        if (dataInfo) {
            copyData = dataInfo;
            copyData['writtenDate'] = moment(copyData['writtenDate']);
            // @ts-ignored
            copyData['delivery'] = moment(copyData['delivery']);
        } else {
            // @ts-ignored
            copyData['writtenDate'] = moment();
            // @ts-ignored
            copyData['delivery'] = moment();
        }


        setInfo(copyData);
    }, [dataInfo, router])



    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['orderDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');
            copyData['delivery'] = moment(info['delivery']).format('YYYY-MM-DD');

            console.log(copyData, 'copyData~~~~~~~~~~~')
            await getData.post('order/addOrder', copyData).then(v => {
                if(v.data.code === 1){
                    message.success('저장되었습니다')}
            });
        }
        const checkList = Array.from({ length: info['orderDetailList'].length }, (_, i) => i + 1);
        setInfo(orderWriteInitial);
        deleteList(checkList)
    }

    function findAgency() {

    }


    function SearchAgencyCode() {
        const [data, setData] = useState([])
        const [modalInfo, setModalInfo] = useState({
            "searchType": "2",      // 1: 코드, 2: 상호명, 3: MAKER
            "searchText": "",
            "page": 1,
            "limit": 0
        });

        useEffect(() => {
            searchFunc();
        }, [])

        async function searchFunc() {
            const result = await getData.post('agency/getAgencyList', modalInfo);
            setData(result?.data?.entity?.agencyList)
        }


        return <Modal
            // @ts-ignored
            id={'event1'}
            title={'대리점 코드 조회'}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event1}
            width={'60vw'}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >
            <div style={{height: '60vh'}}>
                <Card title={'검색어'} size={'small'} style={{marginTop: 10}}>
                    <Input
                        value={modalInfo['searchText']}
                        onChange={e => {
                            let bowl = {};
                            bowl['searchText'] = e.target.value;
                            setModalInfo(v => {
                                return {...v, ...bowl};
                            });
                        }}
                    />
                </Card>

                <Button onClick={searchFunc} type={'primary'} style={{width: '100%', marginTop: 10}}>조회</Button>

                {/* 테이블 데이터를 감싸는 Card */}
                <Card style={{marginTop: 10}}>
                    <Table
                        style={{width: '100%'}}
                        scroll={{y: 300}}
                        columns={searchAgencyCodeColumn}
                        dataSource={data}
                        // pagination={true}
                        onRow={(record, rowIndex) => {
                            return {
                                style: {cursor: 'pointer'},
                                onClick: (event) => {

                                    let copyData = {...info}
                                    copyData['agencyCode'] = record.agencyCode;
                                    copyData['agencyName'] = record.agencyName;
                                    setInfo(copyData);
                                    setIsModalOpen({event1: false, event2: false})
                                }
                            };
                        }}
                    />
                </Card>
            </div>
        </Modal>
    }


    function SearchCustomer() {
        const [data, setData] = useState([])
        const [modalInfo, setModalInfo] = useState({
            "searchText": "",       // 상호명
            "page": 1,
            "limit": 100000000
        });

        useEffect(() => {
            searchFunc()
        }, [])

        async function searchFunc() {
            console.log(modalInfo, 'modalInfo:')
            const result = await getData.post('customer/getCustomerListForEstimate', modalInfo);
            setData(result?.data?.entity?.customerList)
        }


        return <Modal
            title={'거래처 조회'}
            // @ts-ignored
            id={'event2'}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event2}
            width={'60vw'}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >
            <div style={{height: '60vh'}}>
                <Card title={'검색어'} size={'small'} style={{marginTop: 10}}>
                    <Input
                        value={modalInfo['searchText']}
                        onChange={e => {
                            let bowl = {};
                            bowl['searchText'] = e.target.value;
                            setModalInfo(v => {
                                return {...v, ...bowl};
                            });
                        }}
                    />
                </Card>

                <Button onClick={searchFunc} type={'primary'} style={{width: '100%', marginTop: 10}}>조회</Button>

                {/* 테이블 데이터를 감싸는 Card */}
                <Card style={{marginTop: 10}}>
                    <Table
                        style={{width: '100%'}}
                        scroll={{y: 300}}
                        columns={searchCustomerColumn}
                        dataSource={data}
                        // pagination={true}
                        onRow={(record, rowIndex) => {
                            return {
                                style: {cursor: 'pointer'},
                                onClick: (event) => {

                                    let copyData = {...info}
                                    copyData['customerCode'] = record.customerCode;
                                    copyData['customerName'] = record.customerName;
                                    copyData['managerName'] = record.managerName;
                                    copyData['phoneNumber'] = record.directTel;
                                    copyData['faxNumber'] = record.faxNumber;
                                    setInfo(copyData);
                                    setIsModalOpen({event1: false, event2: false})
                                }
                            };
                        }}
                    />
                </Card>
            </div>
        </Modal>
    }


    const downloadExcel = () => {

        if(!info['orderDetailList'].length){
            return message.warn('출력할 데이터가 존재하지 않습니다.')
        }

        const worksheet = XLSX.utils.json_to_sheet(info['orderDetailList']);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    function deleteList(checkList) {
        let copyData = {...info}
        const result = copyData['orderDetailList'].filter(v => !checkList.includes(v.serialNumber))

        copyData['orderDetailList'] = result
        setInfo(copyData);

    }

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

    const printSheet = () => {


    }



    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'발주서 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>PO No.</div>
                                <Input disabled={true} value={info['documentNumberFull']} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>작성일</div>
                                <DatePicker value={info['writtenDate']}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'writtenDate',
                                                    value: date
                                                }
                                            })
                                            } id={'writtenDate'} size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>

                    <Card title={'inpuiry 정보 및 supplier information'} size={'small'}
                          style={{
                              fontSize: 13,
                              marginTop: 20,
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                          }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Our PO No</div>
                                <Input id={'documentNumberFull'} value={info['documentNumberFull']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Your PO no</div>
                                <Input id={'yourPoNo'} value={info['yourPoNo']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Messrs</div>
                                <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Attn To</div>
                                <Input id={'attnTo'} value={info['attnTo']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>


                    </Card>

                    <Card title={'CUSTOMER INFORMATION'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Responsibility</div>
                                <Input disabled={true} id={'managerID'} value={userInfo['name']} onChange={onChange} size={'small'} />
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>TEL</div>
                                <Input id={'managerPhoneNumber'} value={info['managerPhoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Fax</div>
                                <Input id={'managerFaxNumber'} value={info['managerFaxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>E-Mail</div>
                                <Input id={'managerEmail'} value={info['managerEmail']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>거래처명</div>
                                <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>견적서담당자</div>
                                <Input id={'estimateManager'} value={info['estimateManager']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>

                    <Card title={'ETC'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>Payment Terms</div>
                            <Select id={'paymentTerms'} size={'small'} defaultValue={'0'} options={[
                                {value: '0', label: 'By in advance T/T'},
                                {value: '1', label: 'Credit Card'},
                                {value: '2', label: 'L/C'},
                                {value: '3', label: 'Order 30% Before Shipping 70%'},
                                {value: '4', label: 'Order 50% Before Shipping 50%'},
                            ]} style={{width : '100%'}}>
                            </Select>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>Delivery Terms</div>
                            <Input id={'deliveryTerms'} value={info['deliveryTerms']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>Delivery</div>
                            <DatePicker value={info['delivery']}
                                        onChange={(date, dateString) => onChange({
                                            target: {
                                                id: 'delivery',
                                                value: date
                                            }
                                        })
                                        } id={'delivery'} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                        </div>


                        <div style={{paddingTop: 20, textAlign: 'right', width:'100%'}}>
                            <Button type={'primary'} style={{marginRight:8 , letterSpacing:dataInfo?-2:0}}
                                    onClick={saveFunc}><SaveOutlined/>{dataInfo? '변경사항 저장' : '저장'}</Button>
                            {dataInfo ? // @ts-ignored
                                <Button type={'danger'} style={{letterSpacing:-2}}
                                                onClick={() => router?.push('/order_write')}><EditOutlined/>새로 작성하기</Button> :
                                // @ts-ignored
                                <Button type={'danger'} style={{letterSpacing:-1}}
                                        onClick={() => setInfo(orderWriteInitial)}><RetweetOutlined/>초기화</Button>}
                        </div>
                    </Card>
                </Card>

                <TableGrid
                    columns={tableOrderWriteColumn}
                    tableData={info['orderDetailList']}
                    // dataInfo={tableOrderReadInfo}
                    setInfo={setInfo}
                    // setTableInfo={setTableInfo}
                    excel={true}
                    modalComponent={
                        <TableModal listType={'orderDetailList'} title={'견적의뢰 세부 작성'}
                                    initialData={tableOrderWriteInitial}
                                    dataInfo={subOrderWriteInfo}
                                    setInfoList={setInfo}
                                    isModalOpen={isMainModalOpen}
                                    setIsModalOpen={setIsMainModalOpen}
                        />}
                    funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                        <CopyOutlined/>복사
                    </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                            <FileExcelOutlined/>출력
                        </Button></div>}
                />

                {/*<CustomTable rowSelection={rowSelection}*/}
                {/*             setDatabase={setInfo}*/}
                {/*             listType={'orderDetailList'}*/}
                {/*             columns={tableOrderWriteColumn}*/}
                {/*             info={info['orderDetailList']}*/}
                {/*             content={<TableModal*/}
                {/*                 listType={'orderDetailList'}*/}
                {/*                 title={'발주서 세부 작성'}*/}
                {/*                 data={tableOrderWriteInitial}*/}
                {/*                 dataInfo={subOrderWriteInfo}*/}
                {/*                 setInfoList={setInfo}*/}
                {/*                 isModalOpen={isMainModalOpen}*/}
                {/*                 setIsModalOpen={setIsMainModalOpen}*/}
                {/*             />}*/}
                {/*             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>*/}
                {/*                 <CopyOutlined/>복사*/}
                {/*             </Button>*/}
                {/*                 /!*@ts-ignored*!/*/}
                {/*                 <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5}} onClick={()=>deleteList(checkList)}>*/}
                {/*                     <CopyOutlined/>삭제*/}
                {/*                 </Button>*/}
                {/*                 <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5}} onClick={printSheet}>*/}
                {/*                     <FileExcelOutlined/>거래명세표 출력*/}
                {/*                 </Button>*/}
                {/*                 <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5}} onClick={downloadExcel}>*/}
                {/*                     <FileExcelOutlined/>엑셀 출력*/}
                {/*                 </Button>*/}
                {/*</>}*/}
                {/*             />*/}

            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
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

    const {orderId} = ctx.query;


    const result = await getData.post('order/getOrderList', {
        "searchStartDate": "",          // 발주일자 검색 시작일
        "searchEndDate": "",            // 발주일자 검색 종료일
        "searchDocumentNumber": "",     // 문서번호
        "searchCustomerName": "",       // 거래처명
        "searchMaker": "",              // MAKER
        "searchModel": "",              // MODEL
        "searchItem": "",               // ITEM
        "searchEstimateManager": "",    // 견적서담당자명
        "page": 1,
        "limit": 20
    });


    return {props: {dataInfo: orderId ? result?.data?.entity?.orderList[0] : null}}
})