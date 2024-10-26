import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import Button from "antd/lib/button";
import { subRfqWriteInfo } from "@/utils/modalDataList";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Card from "antd/lib/card/Card";
import { estimateReadInfo, TagTypeList } from "@/utils/common";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";

export default function TableModal({ title, data, dataInfo, setInfoList }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [info, setInfo] = useState<any>({ ...data }); // 초기 데이터를 안전하게 복사

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setInfoList((prevList) => {
            // 깊은 복사를 사용하여 새로운 객체 생성
            let newInfo = { ...info };
            newInfo["replyDate"] = moment(newInfo["replyDate"]).format("YYYY-MM-DD");

            // 이전 리스트를 복사한 후 새로운 데이터를 추가
            let updatedList = { ...prevList };
            updatedList["estimateRequestDetailList"] = [...updatedList["estimateRequestDetailList"], newInfo];

            // serialNumber와 key 값을 업데이트
            updatedList["estimateRequestDetailList"].forEach((item, index) => {
                item["serialNumber"] = index + 1;
                item["key"] = index + 1;
            });

            return updatedList;
        });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const inputChange = (e) => {
        const { id, value } = e.target;
        setInfo((prevInfo) => ({
            ...prevInfo,
            [id]: value
        }));
    };

    const handleDateChange = (date, dateString, id) => {
        setInfo((prevInfo) => ({
            ...prevInfo,
            [id]: date
        }));
    };

    return (
        <>
            <Button type="primary" style={{ float: "left", borderRadius: 5 }} onClick={showModal} size="small">
                Add
            </Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Card title={title} style={{ marginTop: 30 }}>
                    {Object.keys(data).map((key) => {
                        switch (TagTypeList[key]?.type) {
                            case "input":
                                return (
                                    <div style={{ paddingTop: 8 }} key={key}>
                                        <div>{dataInfo[key]?.title}</div>
                                        <Input id={key} value={info[key]} onChange={inputChange} />
                                    </div>
                                );
                            case "inputNumber":
                                return (
                                    <div style={{ paddingTop: 8 }} key={key}>
                                        <div>{dataInfo[key]?.title}</div>
                                        <InputNumber
                                            id={key}
                                            value={info[key]}
                                            onChange={(value) =>
                                                inputChange({ target: { id: key, value: value } })
                                            }
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                );
                            case "select":
                                return (
                                    <div style={{ paddingTop: 8 }} key={key}>
                                        <div>{dataInfo[key]?.title}</div>
                                        <Select
                                            id={key}
                                            value={info[key]}
                                            onChange={(value) => inputChange({ target: { id: key, value } })}
                                            options={TagTypeList[key]?.boxList?.map((item) => ({
                                                value: item,
                                                label: item
                                            }))}
                                            style={{ margin: "7px 0", fontSize: 11, width: "100%", height: 28 }}
                                        />
                                    </div>
                                );
                            case "textArea":
                                return (
                                    <div style={{ paddingTop: 8 }} key={key}>
                                        <div>{dataInfo[key]?.title}</div>
                                        <TextArea id={key} value={info[key]} onChange={inputChange} />
                                    </div>
                                );
                            case "date":
                                return (
                                    <div style={{ paddingTop: 8 }} key={key}>
                                        <div>{dataInfo[key]?.title}</div>
                                        <DatePicker
                                            id={key}
                                            style={{ width: "100%" }}
                                            value={info[key] ? moment(info[key]) : null}
                                            onChange={(date, dateString) => handleDateChange(date, dateString, key)}
                                        />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </Card>
            </Modal>
        </>
    );
}