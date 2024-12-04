import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, DownCircleFilled, EditOutlined, SaveOutlined, UpCircleFilled} from "@ant-design/icons";
import DatePicker from "antd/lib/date-picker";
import {printEstimateInitial, rfqWriteInitial,} from "@/utils/initialList";
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
import {BoxCard} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {tableOrderWriteColumn} from "@/utils/columnList";
import PrintPo from "@/component/printPo";
import PrintTransactionModal from "@/component/printTransaction";
import {commonManage} from "@/utils/commonManage";
import TextArea from "antd/lib/input/TextArea";


export default function order_update({data}) {
    const gridRef = useRef(null);
    const router = useRouter();
    const {orderDetail} = data;

    const userInfo = useAppSelector((state) => state.user);
    console.log(orderDetail,'::')
    const [info, setInfo] = useState<any>(orderDetail)
    const [mini, setMini] = useState(true);
    const [customerData, setCustomerData] = useState(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1:false, event2:false});

    useEffect(() => {
        let copyData: any = {...info}
        // @ts-ignored
        copyData['writtenDate'] = moment();
        copyData['replyDate'] = moment();
        copyData['dueDate'] = moment();

        setInfo(copyData);

    }, [])

// =============================================================================================================
    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {

        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea style={{resize: 'none'}} rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}
                      showCount
                      maxLength={1000}
            />
        </div>
    }


    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={disabledDate}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }


    // ======================================================================================================
    const disabledDate = (current) => {
        // current는 moment 객체입니다.
        // 오늘 이전 날짜를 비활성화
        return current && current < moment().startOf('day');
    };


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
            // copyData['delivery'] = moment(info['delivery']).format('YYYY-MM-DD');

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
        setIsModalOpen({event1:true, event2:false});
    }

    function printPo () {
        setIsModalOpen({event1:false, event2:true});
    }

    async function searchCustomer () {

        const result = await getData.post('customer/getCustomerListForOrder', {
            customerName: info['customerName']
        })

        // console.log(result?.data?.entity?.customerList?.[0], 'result')

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
            "currency":   commonManage.changeCurr(info['agencyCode']),
            "net": 0,            // NET/P
            "quantity": 0,              // 수량
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


    async function findDocument(e) {

        const result = await getData.post('estimate/getEstimateDetail', {
            "estimateId": null,
            "documentNumberFull": e.target.value
        });

        // console.log(result)

        if (result?.data?.code === 1) {


            if(result?.data?.entity?.estimateDetail?.estimateDetailList.length) {

                console.log(result?.data?.entity?.estimateDetail,'result?.data?.entity?.estimateDetail?.estimateDetailList:')

                setInfo(v => {
                        return {...v, ...result?.data?.entity?.estimateDetail,
                            documentNumberOriginFull : e.target.value, adminName: userInfo['name'],
                            writtenDate : moment(),
                            orderDetailList : result?.data?.entity?.estimateDetail?.estimateDetailList,
                            currencyUnit:result?.data?.entity?.estimateDetail?.estimateDetailList?.[0]?.currency,
                        }
                    }
                )

                console.log(info['currencyUnit'], 'currencyUnit~~~')
            }
        }
    }



    function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'documentNumberFull' :
                    findDocument(e);
                    break;
            }

        }
    }


    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                {/*@ts-ignore*/}
                <PrintTransactionModal data={info} customerData={customerData} isModalOpen={isModalOpen}
                                       setIsModalOpen={setIsModalOpen}/>
                <PrintPo data={data} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>발주서 수정</div>
                    <div>
                        <Button type={'default'} size={'small'} style={{fontSize: 11, marginRight: 8}}
                                onClick={printTransactionStatement}><SaveOutlined/>거래명세표 출력</Button>
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>수정</Button>
                        {/*@ts-ignored*/}
                        <Button size={'small'} type={'danger'} style={{fontSize: 11, marginRight: 8,}}
                                onClick={() => router?.push('/order_write')}><EditOutlined/>신규작성</Button>
                        <Button type={'default'} size={'small'} style={{fontSize: 11, marginRight: 8}}
                                onClick={printPo}><SaveOutlined/>발주서 출력</Button>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>
                    {mini ? <div>

                        <BoxCard title={'INQUIRY & PO no'}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 0.6fr 1fr 1fr 1fr',
                                maxWidth: 900,
                                minWidth: 600,
                                columnGap: 15
                            }}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                                {/*{inputForm({title: '담당자', id: 'managerAdminName'})}*/}

                                {inputForm({title: '연결 PO No.', id: 'documentNumberFull'})}
                                {inputForm({title: '거래처 PO no', id: 'yourPoNo'})}
                            </div>
                        </BoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '150px 200px 200px 1fr',
                            columnGap: 10,
                            marginTop: 10
                        }}>

                            <BoxCard title={'CUSTOMER & SUPPLY'}>
                                <div>
                                    <div style={{paddingBottom: 3}}>Messrs</div>
                                    <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                                <div style={{marginTop: 8}}>
                                    <div style={{paddingBottom: 3}}>Attn To</div>
                                    <Input id={'attnTo'} value={info['attnTo']} onChange={onChange} size={'small'}/>
                                </div>
                                <div style={{marginTop: 8}}>
                                    <div style={{paddingBottom: 3}}>고객사명</div>
                                    <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                            </BoxCard>


                            <BoxCard title={'MANAGER IN CHARGE'}>
                                {inputForm({title: 'Responsibility', id: 'managerId'})}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber'})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber'})}
                                {inputForm({title: 'E-Mail', id: 'managerEmail'})}

                            </BoxCard>
                            <Card size={'small'} title={'LOGISTICS'} style={{
                                fontSize: 13,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div>
                                    <div style={{paddingBottom: 3}}>Payment Terms</div>
                                    <Select id={'paymentTerms'} size={'small'} defaultValue={'0'}
                                            onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                            options={[
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
                                {inputForm({title: 'Delivery(weeks)', id: 'delivery'})}

                                {/*<div style={{paddingTop: 8}}>*/}
                                {/*    <div style={{paddingBottom: 3}}>Delivery</div>*/}
                                {/*    <DatePicker value={moment(info['delivery'])}*/}
                                {/*                onChange={(date, dateString) => onChange({*/}
                                {/*                    target: {*/}
                                {/*                        id: 'delivery',*/}
                                {/*                        value: date*/}
                                {/*                    }*/}
                                {/*                })*/}
                                {/*                } id={'delivery'} size={'small'}/>*/}
                                {/*</div>*/}

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
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                                {textAreaForm({title: '하단태그', rows: 3, id: 'footer'})}
                            </Card>
                        </div>
                    </div> : null}
                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={tableOrderWriteColumn}
                    tableData={info['orderDetailList']}
                    listType={'orderId'}
                    listDetailType={'orderDetailList'}
                    setInfo={setInfo}
                    excel={true}
                    type={'write'}
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
        orderId: orderId
    });


    return {props: {data: orderId ? result?.data?.entity : null}}
})