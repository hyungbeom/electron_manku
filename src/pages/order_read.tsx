import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined} from "@ant-design/icons";
import {estimateWriteColumns, OrderWriteColumn, rfqWriteColumns} from "@/utils/columnList";
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

export default function OrderWrite() {
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


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'발주 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>PO No.</div>
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
                                <div style={{paddingBottom: 3}}>Our PO No.</div>
                                <Input id={'documentNumberFull'} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined/>} />
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Your PO no.</div>
                                <Input id={'agencyCode'} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Messrs</div>
                                <Input id={'documentNumberFull'} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined/>} />
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Attn To</div>
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
                                <div style={{paddingBottom: 3}}>Responsibility</div>
                                <Input id={'customerCode'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Tel</div>
                                <Input id={'customerName'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Fax</div>
                                <Input id={'managerName'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>E-Mail</div>
                                <Input id={'phoneNumber'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>거래처명</div>
                                <Input id={'faxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>견적서담당자</div>
                                <Input id={'faxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>Payment Terms</div>
                                <Input id={'faxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Delivery Terms</div>
                                <Input id={'faxNumber'} size={'small'} onChange={onChange}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'exchangeRate'} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>Delivery</div>
                                <Input id={'exchangeRate'} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <TextArea id={'exchangeRate'} size={'small'}/>
                        </div>
                    </Card>






                </Card>


                <CustomTable columns={OrderWriteColumn} initial={subRfqWriteInitial} dataInfo={subRfqWriteInfo}/>

            </div>
        </LayoutComponent>
    </>
}