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

const {RangePicker} =

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function estimateRead() {
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
                    <Card  size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>


                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <div>
                                <div>
                                    <div style={{paddingBottom: 3}}>작성일</div>
                                    <DatePicker id={'writtenDate'} size={'small'}/>
                                </div>
                            </div>
                        </div>
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