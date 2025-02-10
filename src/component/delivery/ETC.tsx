import {BoxCard, datePickerForm, inputForm, selectBoxForm, TopBoxCard} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {DownloadOutlined} from "@ant-design/icons";
import {findDocumentInfo} from "@/utils/api/commonApi";

export default function ETC({info, setInfo}) {


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
        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
            {inputForm({
                title: '연결 INQUIRY No.',
                id: 'connectInquiryNo',
                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                onChange: onChange, data: info,
                handleKeyPress: handleKeyPress
            })}
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
                    placeholder: '매입처 담당자 입력 필요',
                    onChange: onChange,
                    data: info,
                    suffix: <AddressSearch onComplete={handleAddressComplete}/>
                })}
            </BoxCard>
            <BoxCard title={'화물정보'}>
                {inputForm({title: '구분', id: 'classification', onChange: onChange, data: info})}
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