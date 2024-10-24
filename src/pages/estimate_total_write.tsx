import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/Select";
import {
    estimateInfo,
    estimateReadInfo,
    estimateReadInitial,
    estimateTotalInfo, estimateTotalInitial,
    estimateWriteInitial
} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import DatePicker from 'antd/lib/date-picker'
import Button from "antd/lib/button";
import {FormOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import {estimateTotalColumns} from "@/utils/column";

const {RangePicker} = DatePicker;

export default function Estimate_read() {
    const sub = {
        validityPeriod : 1
    }

    const [info, setInfo] = useState(estimateTotalInitial)

    const [date, setDate] = useState(null);

    const onChange = (date, dateString) => {
        setDate(date);
        console.log(dateString); // 선택한 날짜 출력
    };


    return <>
        <LayoutComponent>

            <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', height: '100vh',gridColumnGap : 5}}>
                <Card title={'통합 견적서 작성'} style={{fontSize: 12, border : '1px solid lightGray'}}>
                    {Object.keys(info).map(v => {
                        switch (estimateTotalInfo[v]?.type) {
                            case 'input' :
                                return <div style={{width : `${estimateReadInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateReadInfo[v]?.title}</div>
                                    <Input style={{margin : `7px 0`, fontSize : 11, height : 28}}/></div>
                            case 'selectBox' :
                                return  <div style={{width : `${estimateReadInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateReadInfo[v]?.title}</div>
                                    <Select defaultValue={0} options={
                                        estimateReadInfo[v]?.boxList?.map((src, idx) => {
                                            return {value: idx, label: src}
                                        })
                                    } style={{margin : `7px 0`, fontSize : 11, width : '100%', height : 28}}>
                                    </Select></div>
                            case 'searchInput' :
                                return  <div style={{width : `${estimateReadInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateReadInfo[v]?.title}</div>
                                    <Input id={v} style={{margin : `7px 0`, fontSize : 11, height : 28}}suffix={'search'}/></div>
                            case 'datePicker' :
                                return  <div style={{width : `${estimateReadInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateReadInfo[v]?.title}</div>
                                    <RangePicker style={{margin : `7px 0`, fontSize : 11, width : '100%', fontSize : 11, height : 28}}/></div>
                        }
                    })}
                    <div style={{display: 'flex', justifyContent: 'space-between', float : 'right', paddingTop : 20}}><Button
                        type={'primary'} size={'small'} style={{fontSize: 11}}><SearchOutlined />검색</Button>

                    </div>
                </Card>
                <CustomTable columns={estimateTotalColumns}/>
            </div>
        </LayoutComponent>
    </>
}