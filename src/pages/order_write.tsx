import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {rfqWriteColumns, subOrderWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderWriteInitial, rfqWriteInitial, subOrderWriteInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subOrderWriteInfo, subRfqWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function OrderWriter() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState<any>(orderWriteInitial)


    useEffect(() => {
        let copyData = {...orderWriteInitial}
        // @ts-ignored
        copyData['writtenDate'] = moment();
        setInfo(copyData)
    }, [])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['estimateRequestDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            await getData.post('estimate/addEstimateRequest', copyData).then(v => {

            })
        }

    }
    // console.log(moment(info['writtenDate']).format('YYYY-MM-DD'),'??')
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
                                <Input disabled={true}  id={'managerID'} value={info['managerID']} onChange={onChange} size={'small'} />
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
                            <Select id={'paymentTerms'} size={'small'} defaultValue={0} options={[
                                {value: 0, label: 'By in advance T/T'},
                                {value: 1, label: 'Credit Card'},
                                {value: 2, label: 'L/C'},
                                {value: 3, label: 'Order 30% Before Shipping 70%'},
                                {value: 4, label: 'Order 50% Before Shipping 50%'},
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


                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>저장</Button>
                            {/*@ts-ignored*/}
                            <Button type={'danger'}><RetweetOutlined/>초기화</Button>
                        </div>
                    </Card>
                </Card>


                <CustomTable columns={subOrderWriteColumns} initial={subOrderWriteInitial} dataInfo={subOrderWriteInfo}
                             setInfo={setInfo} info={info['orderDetailList']}/>

            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
// export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
//
//
//     const userAgent = ctx.req.headers['user-agent'];
//     let param = {}
//
//     const {userInfo} = await initialServerRouter(ctx, store);
//
//     if (userInfo) {
//         store.dispatch(setUserInfo(userInfo));
//     }
//     return param
// })