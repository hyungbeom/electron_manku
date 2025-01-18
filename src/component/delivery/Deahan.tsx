import {BoxCard, datePickerForm, inputForm, inputNumberForm, TopBoxCard} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";

export default function Deahan({info, setInfo}) {

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }

    return <>

        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
            {inputForm({
                title: '연결 INQUIRY NO.', id: 'connectInquiryNo', onChange: onChange,
                data: info
            })}
            {inputForm({
                title: '고객사명', id: 'customerName', onChange: onChange,
                data: info
            })}
            {inputForm({
                title: '고객주문번호', id: 'customerOrderNo', onChange: onChange,
                data: info
            })}
            {inputForm({
                title: '운송장번호', id: 'trackingNumber', onChange: onChange,
                data: info
            })}
        </TopBoxCard>

        <div style={{
            display: 'grid',
            gridTemplateColumns: "250px 300px ",
            gridTemplateRows: "auto",
            gap: 10,
            marginTop: 10
        }}>
            <BoxCard title={'받는분 정보'}>

                {inputForm({
                    title: '성명', id: 'recipientName',  onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '연락처', id: 'recipientPhone', onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '기타연락처', id: 'recipientAltPhone', onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '우편번호', id: 'recipientPostalCode',  onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '주소', id: 'recipientAddress',  onChange: onChange,
                    data: info
                })}
            </BoxCard>

            <BoxCard title={'화물정보'}>
                {inputForm({
                    title: '품목명', id: 'productName', onChange: onChange,
                    data: info
                })}
                {inputNumberForm({
                    title: '수량',
                    id: 'quantity',
                    onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '확인여부', id: 'isConfirm',  onChange: onChange,
                    data: info
                })}
            </BoxCard>
        </div>
    </>
}