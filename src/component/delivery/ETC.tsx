import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
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

export default function ETC({info, setInfo}){

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {

        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }

    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={commonManage.disabledDate}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }


    async function saveFunc() {

        const copyData = {...info}
        copyData['receiptDate'] = moment(info['receiptDate']).format('YYYY-MM-DD');

        await getData.post('inventory/addInventory', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다')
                setInfo(tableOrderInventoryInitial);

                window.location.href = '/inventory_manage'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }
    function onChange(e) {
        let bowl = {};
        bowl[e.target.id] = e.target.value;
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

        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'deliveryDate'})}
            {inputForm({title: '연결 INQUIRY NO.', id: 'connectInquiryNo'})}
            {inputForm({title: '고객사명', id: 'customerName'})}
        </TopBoxCard>

        <div style={{
            display: 'grid',
            gridTemplateColumns: "300px 300px",
            gap: 10,
            marginTop: 10
        }}>
            <BoxCard title={'받는분 정보'}>
                {inputForm({title: '성명', id: 'recipientName', placeholder : '거래처의 정보'})}
                {inputForm({title: '연락처', id: 'recipientPhone', placeholder: '매입처 당담자 입력 필요'})}
                {inputForm({title: '주소', id: 'recipientAddress', placeholder: '매입처 당담자 입력 필요'})}
            </BoxCard>
            <BoxCard title={'화물정보'}>
                {inputForm({title: '구분', id: 'classification', placeholder : 'ex)용달, 대리점 출고 ---->직접입력'})}
                {inputForm({title: '결제방식', id: 'paymentMethod', placeholder : 'option : 현불 or 착불'})}
                {inputForm({title: '확인여부', id: 'isConfirm', placeholder : '백엔드 체크 필요'})}

            </BoxCard>

        </div>
    </>
}