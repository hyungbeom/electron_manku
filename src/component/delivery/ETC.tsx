import {BoxCard, datePickerForm, inputForm, TopBoxCard} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";

export default function ETC({info, setInfo}) {


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    return <>
        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
            {inputForm({title: '연결 INQUIRY NO.', id: 'connectInquiryNo', onChange: onChange, data: info})}
            {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
        </TopBoxCard>

        <div style={{
            display: 'grid',
            gridTemplateColumns: "300px 300px",
            gap: 10,
            marginTop: 10
        }}>
            <BoxCard title={'받는분 정보'}>
                {inputForm({title: '성명', id: 'recipientName', onChange: onChange, data: info})}
                {inputForm({title: '연락처', id: 'recipientPhone', onChange: onChange, data: info})}
                {inputForm({
                    title: '주소',
                    id: 'recipientAddress',
                    placeholder: '매입처 당담자 입력 필요',
                    onChange: onChange,
                    data: info
                })}
            </BoxCard>
            <BoxCard title={'화물정보'}>
                {inputForm({title: '구분', id: 'classification', onChange: onChange, data: info})}
                {inputForm({title: '결제방식', id: 'paymentMethod', onChange: onChange, data: info})}
                {inputForm({title: '확인여부', id: 'isConfirm', onChange: onChange, data: info})}

            </BoxCard>

        </div>
    </>
}