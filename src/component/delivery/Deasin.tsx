import {BoxCard, datePickerForm, inputForm, inputNumberForm, selectBoxForm, TopBoxCard} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

export default function Deasin({info, setInfo, openModal}){

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    const handleAddressComplete = (address, zipCode) => {
        setInfo(v=>{
            return {...v, recipientAddress : address, recipientPostalCode : zipCode}
        })
    };

    return <>
        <TopBoxCard  grid={'110px 120px 150px'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange:onChange, data : info})}
            {inputForm({
                title: '만쿠발주서 No.',
                id: 'connectInquiryNo',
                disabled: true,
                suffix: <span style={{cursor: 'pointer'}} onClick={
                    (e) => {
                        e.stopPropagation();
                        openModal('connectInquiryNo');
                    }
                }>🔍</span>,
            })}
            {inputForm({title: '고객사명', id: 'customerName', onChange:onChange, data : info})}
        </TopBoxCard>

        <PanelGroup direction="horizontal" style={{gap: 0.5, paddingTop: 10}}>
            <Panel defaultSize={25} minSize={5}>
                <BoxCard title={'받는분 정보'}>
                    {inputForm({title: '성명', id: 'recipientName', onChange:onChange, data : info})}
                    {inputForm({title: '연락처', id: 'recipientPhone', onChange:onChange, data : info})}
                    {inputForm({
                        title: '주소',
                        id: 'recipientAddress',
                        placeholder: '매입처 담당자 입력 필요',
                        onChange: onChange,
                        data: info,
                        suffix: <AddressSearch onComplete={handleAddressComplete}/>
                    })}
                    {inputForm({title: '도착지', id: 'destination', onChange:onChange, data : info})}
                </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={25} minSize={5}>
                <BoxCard title={'품목 정보'}>
                    {inputForm({ title: '품목명', id: 'productName', onChange:onChange, data : info})}
                    {inputNumberForm({ title: '수량', id: 'quantity', onChange: onChange, data: info })}
                    {inputForm({ title: '포장', id: 'packagingType', onChange:onChange, data : info})}
                </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={25} minSize={5}>
                <BoxCard title={'화물 정보'}>
                    <div style={{paddingBottom: 9}}>
                        {selectBoxForm({
                            title: '택배/화물', id: 'shippingType', list: [
                                {value: '택배', label: '택배'},
                                {value: '화물', label: '화물'},
                            ], data: info,
                            onChange: (e) => {
                                const value = e?.target?.value ?? '';
                                setInfo(prev => ({
                                    ...prev,
                                    shippingType: value,
                                    destination: value === '화물' ? '평택 어언점' : '',
                                }))
                            }
                        })}
                    </div>
                    <div style={{paddingBottom: 11}}>
                        {selectBoxForm({
                            title: '결제방식', id: 'paymentMethod', list: [
                                {value: '착불', label: '착불'},
                                {value: '후불', label: '후불'},
                            ], onChange: onChange, data: info
                        })}
                    </div>
                    <div style={{paddingBottom: 11}}>
                        {selectBoxForm({
                            title: '확인여부', id: 'isConfirm', list: [
                                {value: 'X', label: 'X'},
                                {value: 'O', label: 'O'},
                            ], onChange: onChange, data: info
                        })}
                    </div>
                    {selectBoxForm({
                        title: '출고완료여부', id: 'isOutBound', list: [
                            {value: 'O', label: 'O'},
                            {value: 'X', label: 'X'},
                        ], onChange: onChange, data: info
                    })}
                </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={5} minSize={0}></Panel>
        </PanelGroup>
    </>
}