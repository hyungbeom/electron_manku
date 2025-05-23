import {BoxCard, datePickerForm, inputForm, selectBoxForm, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

export default function ETC({info, setInfo, openModal}) {

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    const handleAddressComplete = (address, zipCode) => {
        setInfo(v=>{
            return {...v, recipientAddress : address, recipientPostalCode : zipCode}
        })
    };

    return <>
        <TopBoxCard  grid={'120px 150px 110px'}>
            {inputForm({
                title: '만쿠발주서 No.',
                id: 'connectInquiryNo',
                disabled: true,
                suffix: <span style={{cursor: 'pointer'}} onClick={
                    (e) => {
                        e.stopPropagation();
                        openModal('connectInquiryNoForDelivery');
                    }
                }>🔍</span>,
            })}
            {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
        </TopBoxCard>

        <PanelGroup direction="horizontal" style={{gap: 0.5, paddingTop: 10}}>
            <Panel defaultSize={20} minSize={5}>
                <BoxCard title={'발주서 정보'}>
                    {inputForm({
                        title: '발주서 No.',
                        id: 'connectInquiryNo',
                        onChange: onChange,
                        data: info,
                        disabled: true,
                    })}
                    {textAreaForm({title: '발주서 항목번호', rows: 4, id: 'orderDetailIds', onChange: onChange, data: info, disabled: true})}
                </BoxCard>
            </Panel>
            <Panel defaultSize={20} minSize={5}>
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
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={20} minSize={5}>
                <BoxCard title={'화물정보'}>
                    {inputForm({title: '구분', id: 'classification', onChange: onChange, data: info})}
                    <div style={{paddingBottom: 10}}>
                        {selectBoxForm({
                            title: '결제방식', id: 'paymentMethod', list: [
                                {value: '착불', label: '착불'},
                                {value: '후불', label: '후불'},
                            ], onChange: onChange, data: info
                        })}
                    </div>
                    <div style={{paddingBottom: 10}}>
                        {selectBoxForm({
                            title: '확인여부', id: 'isConfirm', list: [
                                {value: 'O', label: 'O'},
                                {value: 'X', label: 'X'},
                            ], onChange: onChange, data: info
                        })}
                    </div>
                    <div style={{paddingBottom: 10}}>
                        {selectBoxForm({
                            title: '출고완료여부', id: 'isOutBound', list: [
                                {value: 'O', label: 'O'},
                                {value: 'X', label: 'X'},
                            ], onChange: onChange, data: info
                        })}
                    </div>
            </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={5} minSize={0}></Panel>
        </PanelGroup>
    </>
}