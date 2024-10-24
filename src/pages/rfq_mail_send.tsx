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
import {rfqWriteColumns, subMailSendColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {rfqMailSendInitial, subRfqMailSendInitial, subRfqReadInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqMailSendInfo, subRfqWriteInfo} from "@/utils/modalDataList";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function rfqMailSend() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState(rfqMailSendInitial)
    const [tableInfo, setTableInfo] = useState([])

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
                <Card title={'메일 전송'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일(시작)</div>
                            <DatePicker id={'startDate'} size={'small'} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일(종료)</div>
                            <DatePicker id={'endDate'} size={'small'} onChange={onChange}/>
                        </div>
                    </TwinInputBox>

                        <div>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'documentNumberFull'} size={'small'} onChange={onChange}/>
                        </div>

                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>대리점코드</div>
                            <Input id={'agencyCode'} size={'small'} suffix={<FileSearchOutlined/>} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'agencyName'} size={'small'} onChange={onChange}/>
                        </div>
                    </TwinInputBox>

                    <TwinInputBox>
                    <div>
                        <div style={{paddingBottom: 3}}>검색조건(전송)</div>
                        <Select id={'searchTypeSend'} onChange={onChange} size={'small'} defaultValue={0} options={[
                            {value: 0, label: '미전송'},
                            {value: 1, label: '전송'},
                            {value: 2, label: '전체'}
                        ]} style={{width: '100%'}}>
                        </Select>
                    </div>
                    <div>
                        <div style={{paddingBottom: 3}}>검색조건(회신)</div>
                        <Select id={'searchTypeReply'} onChange={onChange} size={'small'} defaultValue={0} options={[
                            {value: 0, label: '미회신'},
                            {value: 1, label: '전체'}
                        ]} style={{width: '100%'}}>
                        </Select>
                    </div>
                    </TwinInputBox>

                        <div>
                            <div style={{paddingBottom: 3}}>상호명</div>
                            <Input id={'customerName'} size={'small'} onChange={onChange}/>
                        </div>


                </Card>


                <CustomTable columns={subMailSendColumns} initial={subRfqMailSendInitial} dataInfo={subRfqMailSendInfo}/>

            </div>
        </LayoutComponent>
    </>
}