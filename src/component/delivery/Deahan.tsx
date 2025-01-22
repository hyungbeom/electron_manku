import {BoxCard, datePickerForm, inputForm, inputNumberForm, selectBoxForm, TopBoxCard} from "@/utils/commonForm";
import React, {useState} from "react";
import {commonManage, gridManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {DownloadOutlined} from "@ant-design/icons";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";

export default function Deahan({info, setInfo}) {


    const handleAddressComplete = (address, zipCode) => {
        setInfo(v => {
            return {...v, recipientAddress: address, recipientPostalCode: zipCode}
        })
    };

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }


    async function handleKeyPress(e) {

        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'connectInquiryNo' :
                    const result = await findDocumentInfo(e, setInfo);
                    setInfo(v => {
                        return {
                            ...result,
                            connectInquiryNo: info.connectInquiryNo,
                            documentNumberFull: v.documentNumberFull
                        }
                    })

                    break;
            }
        }
    }


    return <>

        <TopBoxCard title={''} grid={'1fr 1fr 0.6fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
            {inputForm({
                title: '연결 INQUIRY No.',
                id: 'connectInquiryNo',
                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                onChange: onChange, data: info,
                // handleKeyPress: handleKeyPress
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
            <BoxCard title={'받는분 정보'} tooltip={'받는분의 정보에대한 입력란 입니다.'}>
                {inputForm({
                    title: '성명', id: 'recipientName', onChange: onChange,
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
                    title: '우편번호', id: 'recipientPostalCode', onChange: onChange,
                    data: info
                })}
                {inputForm({
                    title: '주소', id: 'recipientAddress', onChange: onChange,
                    data: info,
                    suffix: <AddressSearch onComplete={handleAddressComplete}/>
                })}
            </BoxCard>

            <BoxCard title={'화물정보'} tooltip={'화물에 대한 정보 입력란 입니다.'}>
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
                {selectBoxForm({
                    title: '확인여부', id: 'isConfirm', list: [
                        {value: 'X', label: 'X'},
                        {value: 'O', label: 'O'},
                    ], onChange: onChange, data: info
                })}
            </BoxCard>
        </div>
    </>
}