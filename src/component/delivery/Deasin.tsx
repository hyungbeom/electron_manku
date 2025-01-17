import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, datePickerForm, inputForm, TopBoxCard} from "@/utils/commonForm";
import React, {useState} from "react";
import {ModalInitList, tableOrderInventoryInitial} from "@/utils/initialList";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import moment from "moment/moment";
import {commonManage} from "@/utils/commonManage";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {findCodeInfo} from "@/utils/api/commonApi";

export default function Deasin({info, setInfo}){


    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }
    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
            }

        }
    }

    return <>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange:onChange, data : info})}
            {inputForm({title: '연결 INQUIRY NO.', id: 'connectInquiryNo', onChange:onChange, data : info})}
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
                {inputForm({title: '주소', id: 'recipientAddress', onChange:onChange, data : info})}
                {inputForm({title: '도착지', id: 'destination', onChange:onChange, data : info})}
            </BoxCard>
            <BoxCard title={'화물정보'}>
                {inputForm({title: '품목명', id: 'productName', onChange:onChange, data : info})}
                {inputForm({title: '수량', id: 'quantity', onChange:onChange, data : info})}
                {inputForm({title: '포장', id: 'packagingType', onChange:onChange, data : info})}
                {inputForm({title: '택배/화물', id:'shippingType', onChange:onChange, data : info})}
                {inputForm({title: '결제방식', id:'paymentMethod', onChange:onChange, data : info})}
                {inputForm({title: '확인여부', id : 'isConfirm', onChange:onChange, data : info})}
            </BoxCard>
        </div>
    </>
}