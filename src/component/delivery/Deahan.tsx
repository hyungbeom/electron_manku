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

export default function Deahan(){
    const [info, setInfo] = useState(tableOrderInventoryInitial)
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


    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea style={{resize: 'none'}} rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}
                      showCount
                      maxLength={1000}
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
                                value: date
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

    return <div style={{
        display: 'grid',
        gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
        height: '100vh',
        columnGap: 5
    }}>
        <SearchInfoModal type={'agencyList'} info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 1fr 1fr 1fr'}>
            {datePickerForm({title: '출고일자', id: 'writtenDate'})}
            {inputForm({title: '연결 INQUIRY NO.', id: 'adminName'})}
            {inputForm({title: '고객사명', id: 'customerName'})}
            {inputForm({title: '고객주문번호', id: 'managerAdminName'})}
            {inputForm({title: '운송장번호', id: 'managerAdminName'})}
        </TopBoxCard>

        <div style={{
            display: 'grid',
            gridTemplateColumns: "1fr 1fr ",
            gap: 10,
            marginTop: 10
        }}>
            <BoxCard title={'받는분 정보'}>
                {inputForm({title: '성명', id: 'agencyName', placeholder : '거래처의 정보'})}
                {inputForm({title: '연락처', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
                {inputForm({title: '기타연락처', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
                {inputForm({title: '우편번호', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
                {inputForm({title: '주소', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
            </BoxCard>
            <BoxCard title={'화물정보_1'}>
                {inputForm({title: '품목명', id: 'managerName'})}
                {inputForm({title: '수량', id: 'phoneNumber', placeholder : '숫자만 입력 가능하게'})}
                {inputForm({title: '확인여부', id: 'managerName', placeholder : ''})}
            </BoxCard>
        </div>
    </div>
}