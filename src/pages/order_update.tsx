import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {
    CopyOutlined, DownCircleFilled, DownloadOutlined, EditOutlined,
    SaveOutlined, UpCircleFilled
} from "@ant-design/icons";
import {
    tableOrderWriteColumn,
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    orderWriteInitial,
    printEstimateInitial,
    rfqWriteInitial,
} from "@/utils/initialList";
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
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";
import PrintTransactionModal from "@/utils/printTransaction";
// import printTransaction from "@/utils/printTransaction";


export default function OrderWriter({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(orderWriteInitial)
    const [mini, setMini] = useState(true);
    const [customerData, setCustomerData] = useState(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            // console.log(copyData, 'copyData~~~~~~~~~~~')
            await getData.post('order/updateOrder', copyData).then(v => {
                if(v.data.code === 1){
                    message.success('저장되었습니다')
                    setInfo(rfqWriteInitial);
                    deleteList()
                    window.location.href = '/order_read'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });
    }
}

    async function printTransactionStatement () {
        await searchCustomer();
        setIsModalOpen(true)
    }

    async function searchCustomer () {

        const result = await getData.post('customer/getCustomerListForOrder', {
            customerName: info['customerName']
        })

        if (result?.data?.code === 1) {

            if(result?.data?.entity?.customerList.length) {
                setCustomerData(result?.data?.entity?.customerList?.[0])
            }
        }
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
        copyData['orderDetailList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};
        copyData['orderDetailList'].push({
            "model": "",           // MODEL
            "unit": "ea",               // 단위
            "currency": "KWD",          // CURR
            "net": 0,            // NET/P
            "quantity": 1,              // 수량
            "receivedQuantity": 0,
            "unreceivedQuantity": 0,
            "unitPrice": 0,
            "amount": 0,
        })

        setInfo(copyData)
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


    async function findDocument() {

        const result = await getData.post('order/getOrderList', {
            "searchDocumentNumber": info['documentNumberFull'],     // 문서번호
            "searchCustomerName": "",       // 거래처명
            "searchMaker": "",              // MAKER
            "searchModel": "",              // MODEL
            "searchItem": "",               // ITEM
            "searchEstimateManager": "",    // 견적서담당자명
            "page": 1,
            "limit": -1,
        });

        if (result?.data?.code === 1) {

            if(result?.data?.entity?.orderList.length) {
                setInfo(v => {
                        return {...v, ...result?.data?.entity?.orderList[0], writtenDate : moment(result?.data?.entity?.orderList[0].writtenDate),
                            delivery : moment(result?.data?.entity?.orderList[0].delivery)
                        }
                    }
                )
            }
        }
    }



    function handleKeyPressDoc(e) {
        if (e.key === 'Enter') {
            findDocument();
        }
    }



    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100vh', columnGap: 5}}>
                {/*@ts-ignore*/}
                <PrintTransactionModal data={info} customerData={customerData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <Card title={'발주서 수정'} style={{fontSize: 12, border: '1px solid lightGray'}} extra={<span style={{fontSize : 20, cursor : 'pointer'}} onClick={()=>setMini(v => !v)}> {!mini ? <UpCircleFilled/> : <DownCircleFilled/>}</span>} >
                    {mini ? <div>
                    <Card size={'small'} title={'INQUIRY & PO no'}
                          style={{ fontSize: 13, marginBottom : 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                    }}>
                        <div style={{display: 'grid', gridTemplateColumns: '0.6fr 1fr 1fr', width: 640, columnGap: 20}}>
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
                            <div>
                                <div style={{paddingBottom: 3}}>연결 PO No.</div>
                                <Input size={'small'} id={'documentNumberFull'} value={info['documentNumberFull']}
                                       onChange={onChange}
                                       onKeyDown={handleKeyPressDoc}
                                       suffix={<DownloadOutlined style={{cursor: 'pointer'}} onClick={findDocument}/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>거래처 PO no</div>
                                <Input id={'yourPoNo'} value={info['yourPoNo']} onChange={onChange} size={'small'}/>
                            </div>
                        </div>

                    </Card>


                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr  1.22fr 1.5fr', columnGap: 10}}>

                        <Card size={'small'} title={'CUSTOMER & SUPPLY'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>


                            <div>
                                <div style={{paddingBottom: 3}}>Messrs</div>
                                <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Attn To</div>
                                <Input id={'attnTo'} value={info['attnTo']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>거래처명</div>
                                <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>


                        <Card size={'small'} title={'MANAGER IN CHARGE'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>


                            <div>
                                <div style={{paddingBottom: 3}}>Responsibility</div>
                                <Input disabled={true} id={'managerID'} value={userInfo['name']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>TEL</div>
                                <Input id={'managerPhoneNumber'} value={info['managerPhoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingBottom: 3}}>Fax</div>
                                <Input id={'managerFaxNumber'} value={info['managerFaxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>E-Mail</div>
                                <Input id={'managerEmail'} value={info['managerEmail']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                        </Card>

                        <Card size={'small'} title={'LOGISTICS'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>Payment Terms</div>
                                <Select id={'paymentTerms'} size={'small'} defaultValue={'0'} options={[
                                    {value: '0', label: 'By in advance T/T'},
                                    {value: '1', label: 'Credit Card'},
                                    {value: '2', label: 'L/C'},
                                    {value: '3', label: 'Order 30% Before Shipping 70%'},
                                    {value: '4', label: 'Order 50% Before Shipping 50%'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>Delivery Terms</div>
                                <Input id={'deliveryTerms'} value={info['deliveryTerms']} onChange={onChange}
                                       size={'small'}/>
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

                        </Card>

                        <Card size={'small'} title={'ETC'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>


                            <div>
                                <div style={{paddingBottom: 3}}>견적서담당자</div>
                                <Input id={'estimateManager'} value={info['estimateManager']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>비고란</div>
                                <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>하단태그</div>
                                <Input id={'footer'} value={info['footer']} onChange={onChange} size={'small'}/>
                            </div>

                        </Card>

                        <div style={{paddingTop: 10}}>
                            <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                    onClick={printTransactionStatement}><SaveOutlined/>거래명세표 출력</Button>
                            <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>수정</Button>
                            {/*@ts-ignored*/}
                            <Button size={'small'} type={'ghost'} style={{marginRight: 8,}}
                                    onClick={() => router?.push('/order_write')}><EditOutlined/>신규작성</Button>

                        </div>
                    </div>
                    </div>:null}

                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={tableOrderWriteColumn}
                    tableData={info['orderDetailList']}
                    listType={'orderId'}
                    listDetailType={'orderDetailList'}
                    setInfo={setInfo}
                    excel={true}
                    funcButtons={<div>
                        {/*@ts-ignored*/}
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                    </div>}
                />

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


    const result = await getData.post('order/getOrderDetail', {
        orderId:orderId
    });


    return {props: {dataInfo: orderId ? result?.data?.entity?.orderDetail : null}}
})