import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/Select";
import {estimateInfo, estimateTotalWriteColumn, estimateWriteInitial} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, FormOutlined, SaveOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {rfqWriteInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqWriteInfo} from "@/utils/modalDataList";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function rqfWrite() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState(rfqWriteInitial)
    const [tableInfo, setTableInfo] = useState([])

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
                                <Input disabled={true} size={'small'} onChange={onChange}/>
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
                                <div style={{paddingBottom: 3}}>대리점코드</div>
                                <Input id={'agencyCode'} onChange={onChange} size={'small'}
                                       suffix={<FileSearchOutlined/>}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>대리점명</div>
                                <Input id={'agencyName'} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                    </Card>

                    <Card title={'담당자 정보'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>담당자</div>
                            <Input id={'inCharge'} size={'small'}/>
                        </div>
                    </Card>

                    <Card title={'CUSTOMER INFORMATION'} size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>상호명</div>
                                <Input id={'customerName'} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자</div>
                                <Input id={'managerName'} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>전화번호</div>
                                <Input id={'phoneNumber'} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>팩스/이메일</div>
                                <Input id={'faxNumber'} size={'small'}/>
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
                            <Input id={'maker'} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'item'} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>비고란</div>
                            <Input id={'remarks'} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>지시사항</div>
                            <TextArea id={'instructions'} size={'small'}/>
                        </div>
                    </Card>
                </Card>


                <CustomTable columns={rfqWriteColumns} initial={subRfqWriteInitial} dataInfo={subRfqWriteInfo}/>

            </div>
        </LayoutComponent>
    </>
}