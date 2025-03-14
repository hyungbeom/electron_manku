import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, selectBoxForm, TopBoxCard} from "@/utils/commonForm";
import React, {useState} from "react";
import {ModalInitList, tableOrderInventoryInitial} from "@/utils/initialList";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import moment from "moment/moment";
import {commonManage} from "@/utils/commonManage";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import AddressSearch from "@/component/AddressSearch";
import {DownloadOutlined} from "@ant-design/icons";

export default function Deasin({info, setInfo}){





    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'connectInquiryNo' :
                    const result = await findDocumentInfo(e, setInfo);
                    setInfo(v => {
                        return {
                            ...result[0],
                            connectInquiryNo: info.connectInquiryNo
                        }
                    })

                    break;
            }
        }
    }
    const handleAddressComplete = (address, zipCode) => {
        setInfo(v=>{
            return {...v, recipientAddress : address, recipientPostalCode : zipCode}
        })
    };

    return <>
        <TopBoxCard  grid={'1fr 1fr 0.6fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange:onChange, data : info})}
            {inputForm({
                title: '연결 Inquiry No.',
                id: 'connectInquiryNo',
                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                onChange: onChange, data: info,
                handleKeyPress: handleKeyPress
            })}
            {inputForm({title: '고객사명', id: 'customerName', onChange:onChange, data : info})}
        </TopBoxCard>

        <div style={{
            display: 'grid',
            gridTemplateColumns: "250px 300px",
            gridTemplateRows: "auto",
            gap: 10,
            marginTop: 10
        }}>
            <BoxCard title={'받는분 정보'}>
                {inputForm({title: '성명', id: 'recipientName', onChange:onChange, data : info})}
                {inputForm({title: '연락처', id: 'recipientPhone', onChange:onChange, data : info})}
                {inputForm({title: '주소', id: 'recipientAddress', onChange:onChange, data : info,    suffix: <AddressSearch onComplete={handleAddressComplete}/>})}
                {inputForm({title: '도착지', id: 'destination', onChange:onChange, data : info})}
            </BoxCard>
            <BoxCard title={'화물정보'}>
                {inputForm({title: '품목명', id: 'productName', onChange:onChange, data : info})}
                {inputNumberForm({
                    title: '수량',
                    id: 'quantity',
                    onChange: onChange,
                    data: info
                })}
                {inputForm({title: '포장', id: 'packagingType', onChange:onChange, data : info})}
                {selectBoxForm({
                    title: '택배/화물', id: 'shippingType', list: [
                        {value: '택배', label: '택배'},
                        {value: '화물', label: '화물'},
                    ], onChange: onChange, data: info
                })}
                {selectBoxForm({
                    title: '결제방식', id: 'paymentMethod', list: [
                        {value: '착불', label: '착불'},
                        {value: '후불', label: '후불'},
                    ], onChange: onChange, data: info
                })}
                {selectBoxForm({
                    title: '유효기간', id: 'isConfirm', list: [
                        {value: 'X', label: 'X'},
                        {value: 'O', label: 'O'},
                    ], onChange: onChange, data: info
                })}
            </BoxCard>
        </div>
    </>
}