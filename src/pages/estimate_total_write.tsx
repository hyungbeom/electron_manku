import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/Select";
import {
    estimateInfo,
    estimateReadInfo,
    estimateReadInitial,
    estimateTotalWriteInfo, estimateTotalWriteInitial,
    estimateWriteInitial
} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import DatePicker from 'antd/lib/date-picker'
import Button from "antd/lib/button";
import {AuditOutlined, FormOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import moment from "moment";

const {RangePicker} = DatePicker;

export default function EstimateTotalWrite() {
    const sub = {
        validityPeriod : 1
    }

    const [info, setInfo] = useState(estimateTotalWriteInitial)

    const [date, setDate] = useState(null);

    function onChangeFunc(e){
        let bowl = {}
        bowl[e.target.id] = e.target.value;
        setInfo(v=>{
            return {...v, ...bowl}
        } )
    }

    function selectFunc(e){
        let bowl = {}
        bowl['searchType'] = e;
        setInfo(v=>{
            return {...v, ...bowl}
        } )

    }

    function searchFunc(e){
        console.log(info,'::')
    }

    function datePickerFunc(e){
        console.log(moment(e[0]),'::')
    }
    return <>
        <LayoutComponent>

            <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', height: '100vh',gridColumnGap : 5}}>
                <Card title={'통합견적서 작성'} style={{fontSize: 12, border : '1px solid lightGray'}}>
                    {Object.keys(info).map(v => {

                        switch (estimateTotalWriteInfo[v]?.type) {
                            case 'input' :
                                return <div style={{width : `${estimateTotalWriteInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateTotalWriteInfo[v]?.title}</div>
                                    <Input id={v} style={{margin : `7px 0`, fontSize : 11, height : 28}} onChange={onChangeFunc}/></div>
                            case 'selectBox' :
                                return  <div style={{width : `${estimateTotalWriteInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateTotalWriteInfo[v]?.title}</div>
                                    <Select id={v} onChange={selectFunc} defaultValue={0} options={
                                        estimateTotalWriteInfo[v]?.boxList?.map((src, idx) => {
                                            return {value: idx, label: src}
                                        })
                                    } style={{margin : `7px 0`, fontSize : 11, width : '100%', height : 28}}>
                                    </Select></div>
                            case 'searchInput' :
                                return  <div style={{width : `${estimateTotalWriteInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateTotalWriteInfo[v]?.title}</div>
                                    <Input id={v} style={{margin : `7px 0`, fontSize : 11, height : 28}}suffix={'search'}/></div>
                            case 'datePicker' :
                                return  <div style={{width : `${estimateTotalWriteInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateTotalWriteInfo[v]?.title}</div>
                                    <RangePicker onChange={datePickerFunc} style={{margin : `7px 0`, fontSize : 11, width : '100%', fontSize : 11, height : 28}}/></div>
                        }
                    })}
                    <div style={{display: 'flex', justifyContent: 'space-between', float : 'right', paddingTop : 20}}>
                        <Button type={'primary'} size={'small'} style={{fontSize: 11}} onClick={searchFunc}><SearchOutlined />검색</Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft : 5}} onClick={searchFunc}><AuditOutlined />통합발행</Button>

                    </div>
                </Card>
                <CustomTable/>
            </div>
        </LayoutComponent>
    </>
}