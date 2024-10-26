import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import Button from "antd/lib/button";
import {subRfqWriteInfo} from "@/utils/modalDataList";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Card from "antd/lib/card/Card";
import {estimateReadInfo, TagTypeList} from "@/utils/common";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";

export default function TableModal({title, data, dataInfo, setInfoList}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [info, setInfo] = useState<any>(data)


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {


        setInfoList(v => {
            let copyData = {...info}
            const copyData2 = {...v}
            copyData['replyDate'] = moment(copyData['replyDate']).format('YYYY-MM-DD')
            copyData2['estimateRequestDetailList'].push(copyData);


            copyData2['estimateRequestDetailList'].forEach((v, idx)=>{
                copyData2['estimateRequestDetailList'][idx]['serialNumber']  = idx + 1;
                copyData2['estimateRequestDetailList'][idx]['key']  = idx + 1;
            })

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

    return <>  <Button type={'primary'} style={{float: 'left', borderRadius : 5}} onClick={showModal} size={'small'}>add</Button><Modal
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Card title={title} style={{marginTop: 30}}>
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
                            <DatePicker id={v} style={{width : '100%'}} onChange={(src)=>inputChange({target : {id : v, value : src}})}/>
                        </div>
                }

            })}
        </Card>
    </Modal></>
}