import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined} from "@ant-design/icons";
import {estimateWriteColumns, rfqWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateWriteInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqWriteInfo} from "@/utils/modalDataList";
import {estimateTotalWriteInfo} from "@/utils/common";
import Select from "antd/lib/select";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function estimateWrite() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState(estimateWriteInitial)


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    console.log(info,':::')
    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'의뢰 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                                <Input id={'documentNumberFull'} disabled={true} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>작성일</div>
                                <DatePicker id={'writtenDate'} size={'small'}/>
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
                                <div style={{paddingBottom: 3}}>연결 INQUIRY No</div>
                                <Input id={'documentNumberFull'} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined/>} />
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'agencyCode'} onChange={onChange} size={'small'}/>
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
                                <Input id={'customerCode'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>상호명</div>
                                <Input id={'customerName'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자</div>
                                <Input id={'managerName'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'phoneNumber'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스번호</div>
                                <Input id={'faxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>유효기간</div>
                                <Select id={'validityPeriod'} size={'small'} defaultValue={0} options={[
                           {value: 0, label: '견적 발행 후 10일간'},
                                    {value: 1, label: '견적 발행 후 30일간'}
                                ]} style={{width : '100%'}}>
                                </Select>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>결제조건</div>
                                <Select id={'paymentTerms'} size={'small'} defaultValue={0} options={[
                                    {value: 0, label: '발주/납품시 50%'},
                                    {value: 1, label: '납품시 현금결제'},
                                    {value: 2, label: '정기결제'}
                                ]} style={{width : '100%'}}>
                                </Select>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>운송조건</div>
                                <Select id={'shippingTerms'} size={'small'} defaultValue={0} options={[
                                    {value: 0, label: '발주/납품시 50%'},
                                    {value: 1, label: '납품시 현금결제'},
                                    {value: 2, label: '정기결제'}
                                ]} style={{width : '100%'}}>
                                </Select>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>환율</div>
                                <Input id={'exchangeRate'} size={'small'}/>
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
                                <Input id={'estimateManager'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>E-Mail</div>
                                <Input id={'email'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'managerPhoneNumber'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스번호</div>
                                <Input id={'managerFaxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>

                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'maker'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'item'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>Delivery</div>
                            <Input id={'delivery'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <TextArea id={'remarks'} size={'small'} onChange={onChange}/>
                        </div>
                    </Card>



                </Card>


                <CustomTable columns={estimateWriteColumns} initial={subRfqWriteInitial} dataInfo={subRfqWriteInfo}/>

            </div>
        </LayoutComponent>
    </>
}