import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/Select";
import {estimateInfo, estimateWriteInitial} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, FormOutlined, SaveOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";

export default function OrderWrite() {
    const sub = {
        validityPeriod : 1
    }

    const [info, setInfo] = useState(estimateWriteInitial)

    const [date, setDate] = useState(null);

    const onChange = (date, dateString) => {
        setDate(date);
        console.log(dateString); // 선택한 날짜 출력
    };

    function searchPopup(){

    }

    return <>

        <LayoutComponent>

            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap : 5}}>
                <Card title={'의뢰 조회'} style={{fontSize: 12, border : '1px solid lightGray'}}>
                    {Object.keys(info).map(v => {
                        switch (estimateInfo[v]?.type) {
                            case 'input' :
                                return <div style={{width : `${estimateInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateInfo[v]?.title}</div>
                                    <Input id={v} style={{margin : `7px 0`, fontSize : 11}}/></div>
                            case 'selectBox' :
                                return  <div style={{width : `${estimateInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateInfo[v]?.title}</div>
                                    <Select id={v} defaultValue={0} options={
                                        estimateInfo[v].boxList.map((src, idx) => {
                                            return {value: idx, label: src}
                                        })
                                    } style={{margin : `7px 0`, width : '100%', fontSize : 11}}>
                                    </Select></div>
                            case 'searchInput' :
                                return  <div style={{width : `${estimateInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateInfo[v]?.title}</div>
                                    <Input id={v} style={{margin : `7px 0`, fontSize : 11}} suffix={<FileSearchOutlined style={{cursor : 'pointer'}} onClick={searchPopup}/>}/></div>
                            case 'inputArea' :
                                return  <div style={{width : `${estimateInfo[v]?.size -1}%`, float : 'left', marginLeft : 3}}>
                                    <div>{estimateInfo[v]?.title}</div>
                                    <TextArea id={v} style={{marginTop : 8, fontSize : 11}} suffix={'search'}/></div>
                        }
                    })}


                    <div style={{display: 'flex', justifyContent: 'space-between', width: 115, float : 'right', paddingTop : 20}}><Button
                        type={'primary'} size={'small'} style={{fontSize: 11}}><SaveOutlined />저장</Button><Button
                        size={'small'} style={{fontSize: 11}}><FormOutlined />신규</Button>

                    </div>
                </Card>
                <CustomTable/>
            </div>
        </LayoutComponent>
    </>
}