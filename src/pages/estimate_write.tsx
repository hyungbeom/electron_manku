import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {CopyOutlined, FileExcelOutlined, FileSearchOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {
    searchAgencyCodeColumn,
    searchCustomerColumn, tableEstimateWriteColumns
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    estimateWriteInitial,
    tableEstimateWriteInitial
} from "@/utils/initialList";
import {tableEstimateWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Modal from "antd/lib/modal/Modal";
import Table from "antd/lib/table";
import * as XLSX from "xlsx";
import TableModal from "@/utils/TableModal";
import Select from "antd/lib/select";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function EstimateWrite() {
    let checkList = []

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(estimateWriteInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});


    useEffect(() => {

        let copyData = {...estimateWriteInitial}

        // @ts-ignored
        copyData['writtenDate'] = moment();
        setInfo(copyData);
    }, [])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['estimateDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            await getData.post('estimate/addEstimate', copyData).then(v => {
                console.log(v, ':::::')
            });
        }

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

        if(!info['estimateDetailList'].length){
            return message.warn('출력할 데이터가 존재하지 않습니다.')
        }

        const worksheet = XLSX.utils.json_to_sheet(info['estimateDetailList']);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    function deleteList() {
        let copyData = {...info}
        const result = copyData['estimateDetailList'].filter(v => !checkList.includes(v.serialNumber))

        copyData['estimateDetailList'] = result
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


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'견적서 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                                <Input disabled={true} size={'small'}/>
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
                                <div style={{paddingBottom: 3}}>연결 INQUIRY No.</div>
                                <Input  size={'small'}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}}/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                           (e) => {
                                               e.stopPropagation();
                                               setIsModalOpen({event1: true, event2: false})
                                           }
                                       }/>}/>
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
                                <div style={{paddingBottom: 3}}>CUSTOMER 코드</div>
                                <Input id={'customerCode'} value={info['customerCode']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>상호명</div>
                                <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                       size={'small'} suffix={<FileSearchOutlined style={{cursor: 'pointer'}}/>}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자</div>
                                <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스번호</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>

                    <Card title={'OPTION'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                            <div>
                                <div style={{paddingBottom: 3}}>유효기간</div>
                                <Select id={'validityPeriod'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'validityPeriod', value: src}})}
                                        size={'small'} value={info['validityPeriod']} options={[
                                    {value: '0', label: '견적 발행 후 10일간'},
                                    {value: '1', label: '견적 발행 후 30일간'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{marginTop:8}}>
                                <div style={{paddingBottom: 3}}>결제조건</div>
                                <Select id={'validityPeriod'} defaultValue={'0'}
                                        onChange={(src) => onChange({target: {id: 'paymentTerms', value: src}})}
                                        size={'small'} value={info['paymentTerms']} options={[
                                    {value: '0', label: '발주시 50% / 납품시 50%'},
                                    {value: '1', label: '납품시 현금결제'},
                                    {value: '2', label: '정기결제'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>운송조건</div>
                                <Input id={'shippingTerms'} value={info['shippingTerms']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>환율</div>
                                <Input id={'exchangeRate'} value={info['exchangeRate']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>


                    <Card title={'담당자 정보'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자</div>
                                <Input disabled={true} id={'estimateManager'} value={userInfo['name']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>E-Mail</div>
                                <Input id={'email'} value={info['email']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'managerPhoneNumber'} value={info['managerPhoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스번호</div>
                                <Input id={'managerFaxNumber'} value={info['managerFaxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>

                    <Card title={'ETC'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
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
                            <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}
                                      size={'small'}/>
                        </div>

                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>저장</Button>
                            {/*@ts-ignored*/}
                            <Button type={'danger'}><RetweetOutlined/>초기화</Button>
                        </div>
                    </Card>
                </Card>

                <CustomTable rowSelection={rowSelection}
                             setDatabase={setInfo}
                             listType={'estimateDetailList'}
                             excel={true}
                             content={<TableModal title={'견적작성 세부추가'} data={tableEstimateWriteInitial}
                                                  dataInfo={tableEstimateWriteInfo}
                                                  setInfoList={setInfo}/>} columns={tableEstimateWriteColumns}
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
                             info={info['estimateDetailList']}/>

            </div>
        </LayoutComponent>
    </>
}
// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const userAgent = ctx.req.headers['user-agent'];
    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    console.log(userInfo, 'userInfo:')
    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }


    return param
})