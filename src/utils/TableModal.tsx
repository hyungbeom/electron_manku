import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import Button from "antd/lib/button";
import {subRfqWriteInfo} from "@/utils/modalDataList";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Card from "antd/lib/card/Card";
import {estimateReadInfo, TagTypeList} from "@/utils/common";
import Select from "antd/lib/Select";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";

export default function TableModal({data, dataInfo, setInfoList}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [info, setInfo] = useState<any>(data)


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {


        setInfoList(v => {
            let copyData = {...info}
            const copyData2 = {...v}
            copyData['key'] = copyData2['estimateRequestDetailList']?.length + 1;
            copyData2['estimateRequestDetailList'].push(copyData);
            return copyData2;
        })
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    function inputChange(e) {
        let bowl = {};
        bowl[e.target.id] = e.target.value;
        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    return <>  <Button type={'primary'} style={{float: 'left'}} onClick={showModal}>ADD</Button><Modal
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Card title={'의뢰작성 내용 추가'} style={{marginTop: 30}}>
            {Object.keys(data).map(v => {

                switch (TagTypeList[v]?.type) {
                    case 'input' :
                        return <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <Input id={v} value={info[v]} onChange={inputChange}/>
                        </div>
                    case 'inputNumber' :
                        return <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <InputNumber id={v} value={info[v]}
                                         onChange={(src) => inputChange({target: {id: v, value: src}})} style={{width : '100%'}}/>
                        </div>
                    case 'select' :
                        return <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <Select id={v} value={info[v]} onChange={(src) => inputChange({target: {id: v, value: src}})}   options={
                                TagTypeList[v]?.boxList?.map((src, idx) => {
                                    return {value: src, label: src}
                                })
                            } style={{margin : `7px 0`, fontSize : 11, width : '100%', height : 28}}>
                            </Select>
                        </div>
                    case 'textArea' :
                        return  <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <TextArea id={v} value={info[v]} onChange={inputChange}/>
                        </div>
                    case 'date' :
                        return  <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <DatePicker style={{width : '100%'}}/>
                        </div>
                }

            })}
        </Card>
    </Modal></>
}