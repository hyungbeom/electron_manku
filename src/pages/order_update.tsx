import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, DownCircleFilled, EditOutlined, SaveOutlined, UpCircleFilled} from "@ant-design/icons";
import DatePicker from "antd/lib/date-picker";
import {estimateDetailUnit, orderDetailUnit, printEstimateInitial, rfqWriteInitial,} from "@/utils/initialList";
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
import {updateOrder} from "@/utils/api/mainApi";
import _ from "lodash";
import {findEstDocumentInfo} from "@/utils/api/commonApi";

const listType = 'orderDetailList'
export default function order_update({data}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const {orderDetail} = data;
    const copyUnitInit = _.cloneDeep(orderDetailUnit)

    const userInfo = useAppSelector((state) => state.user);


    const [info, setInfo] = useState<any>(orderDetail)

    const [mini, setMini] = useState(true);
    const [customerData, setCustomerData] = useState(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});


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




    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info[listType].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {

            await updateOrder({data : info})

        }
    }

    async function printTransactionStatement() {
        await searchCustomer();
        setIsModalOpen({event1: true, event2: false});
    }

    function printPo() {
        setIsModalOpen({event1: false, event2: true});
    }

    async function searchCustomer() {

        const result = await getData.post('customer/getCustomerListForOrder', {
            customerName: info['customerName']
        })

        // console.log(result?.data?.entity?.customerList?.[0], 'result')

        if (result?.data?.code === 1) {

            if (result?.data?.entity?.customerList.length) {
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
        copyData[listType] = uncheckedData;

        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};
        copyData[listType].push({
            ...copyUnitInit,
            "currency": commonManage.changeCurr(info['agencyCode'])
        })
        setInfo(copyData)
    }



    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'documentNumberFull' :
                    await findEstDocumentInfo(e, setInfo)
                    break;
            }

        }
    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div>
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
    </div>

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

                                {inputForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
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
                    tableData={info[listType]}
                    listType={'orderId'}
                    listDetailType={listType}
                    setInfo={setInfo}
                    excel={true}
                    type={'write'}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {orderId} = ctx.query;

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
        const result = await getData.post('order/getOrderDetail', {
            orderId: orderId
        });
        return {props: {data: orderId ? result?.data?.entity : null}}
    }
})