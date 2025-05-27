import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import React from "react";
import {commonManage} from "@/utils/commonManage";
import AddressSearch from "@/component/AddressSearch";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

export default function Deahan({info, setInfo, openModal}) {

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }

    const handleAddressComplete = (address, zipCode) => {
        setInfo(v => {
            return {...v, recipientAddress: address, recipientPostalCode: zipCode}
        })
    };

    return <>
        <TopBoxCard grid={'120px 120px 120px 120px 120px 120px'}>
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
            {inputForm({
                title: 'Project No.',
                id: 'rfqNo',
                onChange: onChange,
                data: info
            })}
            {inputForm({ title: '고객주문번호', id: 'customerOrderNo', onChange: onChange, data: info })}
            {inputForm({ title: '고객사명', id: 'customerName', onChange: onChange, data: info })}
            {datePickerForm({title: '출고일자', id: 'deliveryDate', onChange: onChange, data: info})}
            {inputForm({ title: '운송장번호', id: 'trackingNumber', onChange: onChange, data: info })}


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
                <BoxCard title={'받는분 정보'} tooltip={'받는분의 정보에대한 입력란 입니다.'}>
                    {inputForm({
                        title: '성명', id: 'recipientName', onChange: onChange,
                        data: info
                    })}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                            {inputForm({
                                title: '연락처',
                                id: 'recipientPhone',
                                onChange: onChange,
                                data: info
                            })}
                        </div>
                        <div style={{ flex: 1 }}>
                            {inputForm({
                                title: '기타연락처',
                                id: 'recipientAltPhone',
                                onChange: onChange,
                                data: info
                            })}
                        </div>
                    </div>
                    {inputForm({
                        title: '주소',
                        id: 'recipientAddress',
                        placeholder: '매입처 담당자 입력 필요',
                        onChange: onChange,
                        data: info,
                        suffix: <AddressSearch onComplete={handleAddressComplete}/>
                    })}
                    {inputForm({
                        title: '우편번호', id: 'recipientPostalCode', onChange: onChange,
                        data: info
                    })}
                </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={20} minSize={5}>
                <BoxCard title={'품목정보'} tooltip={'화물에 대한 정보 입력란 입니다.'}>
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
                </BoxCard>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={20} minSize={5}>
                <BoxCard title={'화물정보'} tooltip={'화물에 대한 정보 입력란 입니다.'}>
                    <div style={{paddingBottom: 11}}>
                        {selectBoxForm({
                            title: '확인여부', id: 'isConfirm', list: [
                                {value: 'O', label: 'O'},
                                {value: 'X', label: 'X'},
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