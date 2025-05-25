import Card from "antd/lib/card/Card";
import React, {useEffect, useRef} from "react";
import Button from "antd/lib/button";
import {
    DownCircleFilled,
    ExclamationCircleOutlined,
    FileExcelOutlined,
    SaveOutlined,
    UpCircleFilled,
    WarningOutlined
} from "@ant-design/icons";
import Input from "antd/lib/input/Input";
import Password from "antd/lib/input/Password";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import {gridManage} from "@/utils/commonManage";
import Radio from "antd/lib/radio";
import Select from "antd/lib/select";
import {orderDetailUnit, projectDetailUnit, storeDetailUnit} from "@/utils/initialList";
import {ExcelUpload} from "@/component/common/ExcelUpload";
import message from "antd/lib/message";
import Popconfirm from "antd/lib/popconfirm";
import ProjectWrite from "@/component/page/project/ProjectWrite";
import ProjectRead from "@/component/page/project/ProjectRead";
import ProjectUpdate from "@/component/page/project/ProjectUpdate";
import RfqWrite from "@/component/page/rfq/RfqWrite";
import RfqRead from "@/component/page/rfq/RfqRead";
import RqfUpdate from "@/component/page/rfq/RfqUpdate";
import RfqMailSend from "@/component/page/rfq/RfqMailSend";
import EstimateWrite from "@/component/page/estimate/EstimateWrite";
import EstimateRead from "@/component/page/estimate/EstimateRead";
import EstimateUpdate from "@/component/page/estimate/EstimateUpdate";
import OrderWrite from "@/component/page/order/OrderWrite";
import OrderRead from "@/component/page/order/OrderRead";
import OrderUpdate from "@/component/page/order/OrderUpdate";
import StoreWrite from "@/component/page/store/StoreWrite";
import StoreRead from "@/component/page/store/StoreRead";
import StoreUpdate from "@/component/page/store/StoreUpdate";
import DeliveryWrite from "@/component/page/delivery/DeliveryWrite";
import DeliveryRead from "@/component/page/delivery/DeliveryRead";
import DeliveryUpdate from "@/component/page/delivery/DeliveryUpdate";
import DomesticRemittanceWrite from "@/component/page/remittance/domestic/DomesticRemittanceWrite";
import DomesticRemittanceRead from "@/component/page/remittance/domestic/DomesticRemittanceRead";
import DomesticRemittanceUpdate from "@/component/page/remittance/domestic/DomesticRemittanceUpdate";
import OverseasRemittanceWrite from "@/component/page/remittance/overseas/OverseasRemittanceWrite";
import OverseasRemittanceRead from "@/component/page/remittance/overseas/OverseasRemittanceRead";
import OverseasRemittanceUpdate from "@/component/page/remittance/overseas/OverseasRemittanceUpdate";
import TaxInvoiceWrite from "@/component/page/remittance/TaxInvoiceWrite";
import TaxInvoiceRead from "@/component/page/remittance/TaxInvoiceRead";
import TaxInvoiceUpdate from "@/component/page/remittance/TaxInvoiceUpdate";
import DomesticAgencyWrite from "@/component/page/data/agency/domestic/DomesticAgencyWrite";
import DomesticAgencyRead from "@/component/page/data/agency/domestic/DomesticAgencyRead";
import DomesticAgencyUpdate from "@/component/page/data/agency/domestic/DomesticAgencyUpdate";
import OverseasAgencyWrite from "@/component/page/data/agency/overseas/OverseasAgencyWrite";
import OverseasAgencyRead from "@/component/page/data/agency/overseas/OverseasAgencyRead";
import OverseasAgencyUpdate from "@/component/page/data/agency/overseas/OverseasAgencyUpdate";
import DomesticCustomerWrite from "@/component/page/data/customer/domestic/DomesticCustomerWrite";
import DomesticCustomerRead from "@/component/page/data/customer/domestic/DomesticCustomerRead";
import DomesticCustomerUpdate from "@/component/page/data/customer/domestic/DomesticCustomerUpdate";
import OverseasCustomerWrite from "@/component/page/data/customer/overseas/OverseasCustomerWrite";
import OverseasCustomerRead from "@/component/page/data/customer/overseas/OverseasCustomerRead";
import OverseasCustomerUpdate from "@/component/page/data/customer/overseas/OverseasCustomerUpdate";
import MakerWrite from "@/component/page/data/maker/MakerWrite";
import MakerRead from "@/component/page/data/maker/MakerRead";
import MakerUpdate from "@/component/page/data/maker/MakerUpdate";
import HcodeRead from "@/component/page/data/hscode/HcodeRead";
import CompanyAccount from "@/component/CompanyAccount";
import CompanyAccountUpdate from "@/component/CompanyAccountUpdate";
import CompanyAccountWrite from "@/component/CompanyAccountWrite";
import SourceWrite from "@/component/page/data/source/SourceWrite";
import SourceRead from "@/component/page/data/source/SourceRead";
import SourceUpdate from "@/component/page/data/source/SourceUpdate";
import ExpectedDeliveryRead from "@/component/page/order/ExpectedDeliveryRead";
import SeaOrderWrite from "@/component/page/order/SeaOrderWrite";

const {RangePicker} = DatePicker
const {Option} = Select

export const numbFormatter = (value) => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const numbParser = (value) => value.replace(/₩\s?|(,*)/g, '')


export function TopBoxCard({children, title = '', grid = '1fr 1fr 1fr 1fr'}) {

    return <Card size={'small'} title={title}
                 style={{
                     height: 70,
                     fontSize: 13,
                     border: '1px solid #bae7ff',

                 }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: grid,
            columnGap: 15
        }}>
            {children}
        </div>
    </Card>
}

export function BoxCard({children, title = '', tooltip = '', disabled = false}: any) {
    const disabledStyle = {
        opacity: disabled ? 0.5 : 1, // 흐리게 표시
        pointerEvents: disabled ? "none" : "auto", // 클릭 막기
        userSelect: disabled ? "none" : "auto", // 텍스트 선택 불가
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',

    }
    const defaultStyle = {
        height: '100%',

        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
    }


    // <InfoCircleOutlined />
    // @ts-ignore
    return <Card style={{
        border: '1px solid #bae7ff',
        height: '100%'
    }} size={'small'}
                 headStyle={{backgroundColor: '#bae7ff'}}
                 title={title}>
        {/*@ts-ignore*/}
        <div style={disabled ? disabledStyle : defaultStyle}>
            {children}
        </div>
    </Card>
}


export function MainCard({children, title, list, mini = null, setMini = Function()}) {

    function confirm(v) {
        v()
    }

    // @ts-ignore
    return <Card size={'small'} style={{
        border: '1px solid #bae7ff',
        marginTop: 3,
        borderRadius: 5,
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.07)'
    }}
                 headStyle={{backgroundColor: '#bae7ff'}}
                 title={
                     <div style={{display: 'flex', justifyContent: 'space-between'}}>
                         <div style={{fontSize: 15, fontWeight: 700}}>{title}</div>
                         <div style={{
                             display: 'grid',
                             gridTemplateColumns: `${'0.1fr '.repeat(list.length)}auto`.trim(),
                             columnGap: 8
                         }}>
                             {list.map(v => <>
                                     {
                                         v.type === 'delete' ?
                                             <Popconfirm
                                                 title="삭제하시겠습니까?"
                                                 onConfirm={() => confirm(v.func)}
                                                 icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                                                 <Button type={'primary'} danger style={{fontSize: 11}} size={'small'}
                                                     // onClick={v.func}
                                                 >{v?.prefix}{v.name}</Button>
                                             </Popconfirm>

                                         // 견적의뢰 메일 발송 추가
                                         : v.type === 'mail' ?
                                                 <Popconfirm
                                                     title="발송처리하시겠습니까?"
                                                     onConfirm={() => confirm(v.func)}
                                                     icon={<WarningOutlined/>}>
                                                     <Button type={'default'} size={'small'}
                                                             style={{
                                                                 fontSize: 11,
                                                             }}>{v?.prefix}{v.name}</Button>
                                                 </Popconfirm>

                                         :  <Button type={v.type} style={{fontSize: 11}} size={'small'}
                                                    onClick={v.func}>{v?.prefix}{v.name}</Button>
                                     }
                                 </>
                             )}

                             {mini !== null ? <span style={{fontSize: 20, cursor: 'pointer', marginTop: -5}}
                                                    onClick={() => setMini(v => !v)}> {!mini ?
                                 <DownCircleFilled/> : <UpCircleFilled/>}</span> : <></>}
                         </div>
                     </div>
                 }>
        {children}
    </Card>
}


export const InputForm = ({
                              title,
                              id,
                              placeholder = '',
                              suffix = null,
                              handleKeyPress = function () {
                              },
                              value = '',
                              validate = true,
                              size = 'small',
                              fontSize = 12
                          }: any) => {


    return <div style={{fontSize: fontSize, paddingBottom: 10}}>
        <div style={{paddingBottom: fontSize / 2, fontWeight: 700}}>{title}</div>
        {/*@ts-ignored*/}
        <input placeholder={placeholder}

               id={id}
               size={size}
               onKeyDown={handleKeyPress}
            // suffix={suffix}
            // style={{fontSize: 12, border : '1px solid lightGray'}}
        />
    </div>
}


export const inputAntdForm = ({
                                  title,
                                  id,
                                  placeholder = '',
                                  suffix = null,
                                  handleKeyPress = function () {
                                  },
                                  onChange = null,
                                  data = null,
                                  validate = true,
                                  size = 'small',
                                  disabled = false,
                                  fontSize = 12
                              }: any) => {


    function onchange(e) {
        e.target.style.borderColor = ''
        if (onChange) {
            onChange(e)
        }
    }

    return <div style={{fontSize: fontSize, paddingBottom: 10}}>
        <div style={{paddingBottom: fontSize / 2, fontWeight: 700}}>{title}</div>
        {/*@ts-ignored*/}
        <div style={{display: 'flex'}}>
            <Input placeholder={placeholder}
                   id={id}
                   size={size}
                   disabled={disabled}
                   value={data ? data[id] : null}
                   onKeyDown={handleKeyPress}
                   onChange={onchange}
                // suffix={suffix}
                   style={{fontSize: 12, border: `1px solid ${validate ? 'lightGray' : 'red'}`}}
            />
            <span style={{marginLeft: -22, paddingTop: 1.5}}>{suffix}</span>
        </div>
    </div>
}


export const inputForm = ({
                              title,
                              id,
                              placeholder = '',
                              suffix = null,
                              handleKeyPress = function () {
                              },
                              onChange = null,
                              data = null,
                              validate = true,
                              size = 'small',
                              disabled = false,
                              fontSize = 12
                          }: any) => {


    function onchange(e) {
        e.target.style.borderColor = ''
        if (onChange) {
            onChange(e)
        }
    }

    return <div style={{fontSize: fontSize, paddingBottom: 10}}>
        <div style={{paddingBottom: fontSize / 2, fontWeight: 700}}>{title}</div>
        {/*@ts-ignored*/}
        <div style={{display: 'flex'}}>
            <input placeholder={placeholder}
                   autoComplete={'off'}
                   id={id}
                   size={size}
                   disabled={disabled}
                   value={data ? data[id] : null}
                   onKeyDown={handleKeyPress}
                   onChange={onchange}
                // suffix={suffix}
                   style={{fontSize: 12, border: `1px solid ${validate ? 'lightGray' : 'red'}`}}
            />
            <span style={{marginLeft: -22, paddingTop: 1.5}}>{suffix}</span>
        </div>
    </div>
}

export const inputPasswordForm = ({
                                      title,
                                      id,
                                      disabled = false,
                                      placeHolder = '',
                                      suffix = null,
                                      onChange = function () {
                                      },
                                      handleKeyPress = function () {
                                      },
                                      data
                                      ,
                                      validate = true,
                                      size = 'small',
                                      fontSize = 12
                                  }: any) => {

    let bowl = data;
    return <div style={{fontSize: fontSize, paddingBottom: 10}}>
        <div style={{paddingBottom: fontSize / 2, fontWeight: 700}}>{title}</div>
        {/*@ts-ignored*/}
        <Password placeholder={placeHolder}

                  id={id}
                  value={bowl[id]} disabled={disabled}
                  onChange={onChange}
                  size={size}
                  onKeyDown={handleKeyPress}
                  suffix={suffix}
                  style={{borderColor: validate ? '' : 'red', fontSize: 12}}
        />
    </div>
}


export const rangePickerForm = ({
                                    title, id, disabled = false, onChange = function () {
    }, data
                                }: any) => {
    let bowl = data;
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 5.5, fontSize: 12, fontWeight: 700}}>{title}</div>
        <RangePicker className={'custom-rangepicker'} value={[moment(bowl[id][0]), moment(bowl[id][1])]} id={id}
                     size={'small'} disabled={disabled}
                     onChange={(e, d) => onChange({target: {id: id, value: d}})} style={{width: '100%', height: 24}}/>
    </div>


}


export const datePickerForm = ({title, id, disabled = false, onChange = null, data = null}) => {

    function change(e) {
        if (onChange) {
            onChange(e)
        }
    }

    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 5.5, fontWeight: 700}}>{title}</div>
        {/*@ts-ignore*/}

        <input type="date" id={id} disabled={disabled} onChange={change} value={data ? data[id] : null}/>
    </div>
}


export const inputNumberForm = ({
                                    title,
                                    id,
                                    disabled = false,
                                    placeholder = '',
                                    onChange,
                                    data,
                                    validate = true,
                                    formatter = null,
                                    parser = null,
                                    step = 1,
                                    addonAfter = '',
                                    min = 1,
                                    max = 10000,
                                }: any) => {
    let bowl = data;

    function onChanges(e) {
        if (onChange) {
            onChange(e)
        }
    }

    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 4, fontWeight: 700}}>{title}</div>
        <div style={{display: 'flex'}}>
            <input type={'number'} id={id} disabled={disabled}
                   style={{width: '100%', marginTop: 3, border: `1px solid ${validate ? 'lightGray' : 'red'}`}}
                   step={step}
                   value={data ? data[id] : null}
                   placeholder={placeholder}
                   onChange={onChanges}
                   min={min}
                   max={max}

            />
            <span style={{marginLeft: -20, paddingTop: 5, fontWeight: 700}}>{addonAfter}</span>
        </div>
    </div>
}

export const SelectForm = ({ id, list, title, onChange, data, validate = true, direction = 'down' }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const input = ref.current?.getElementsByClassName('customInput')[0] as HTMLInputElement;
        if (!input || !listRef.current || !ref.current) return;

        const handleInputFocus = () => {
            listRef.current!.style.display = 'block';
        };

        const handleOptionClick = (e: any) => {
            if (e.target.tagName === 'DIV') {
                const syntheticEvent = {
                    target: {
                        id,
                        value: e.target.textContent,
                    },
                };
                onChange(syntheticEvent);
                listRef.current!.style.display = 'none';
            }
        };

        const handleFocusIn = (e: any) => {
            if (!ref.current!.contains(e.target)) {
                listRef.current!.style.display = 'none';
            }
        };

        const handleClickOutside = (e: any) => {
            if (!ref.current!.contains(e.target)) {
                listRef.current!.style.display = 'none';
            }
        };

        input.addEventListener('focus', handleInputFocus);
        listRef.current.addEventListener('click', handleOptionClick);
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('click', handleClickOutside);

        return () => {
            input.removeEventListener('focus', handleInputFocus);
            listRef.current?.removeEventListener('click', handleOptionClick);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [id, onChange]);

    return (
        <div ref={ref} className="dropdown-wrapper" style={{ fontSize: 12, width: '100%' }}>
            <div style={{ fontWeight: 700, paddingBottom: 5 }}>{title}</div>
            <input
                ref={inputRef}
                type="text"
                id={id}
                className="customInput"
                name="customInput"
                value={data?.[id] ?? ''}
                onChange={(e) => onChange({ target: { id: id, value: e.target.value } })}
                placeholder="선택 또는 입력"
                autoComplete="off"
                style={{ height: 23, border: `1px solid ${validate ? 'lightGray' : 'red'}` }}
            />
            <div className="dropdown-list" ref={listRef}
                 style={{
                     position: 'absolute',
                     top: direction === 'up' ? 'auto' : '100%',
                     bottom: direction === 'up' ? 'calc(100% - 24px)' : 'auto',
                     maxHeight: 140,
                     overflowY: 'auto',
                     backgroundColor: 'white',
                     zIndex: 1000,
                     border: '1px solid lightgray',
                 }}>
                {list.map((v) => (
                    <div
                        key={v}
                        onPointerDown={(e) => {
                            if ((e.target as HTMLElement).tagName === 'DIV') {
                                onChange({ target: { id, value: v } });
                                listRef.current!.style.display = 'none';
                            }
                        }}
                    >
                        {v}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const radioForm = ({title, id, disabled = false, data, onChange, list}) => {
    let bowl = data;

    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 6, fontWeight: 700}}>{title}</div>
        <Radio.Group id={id} value={bowl[id]} disabled={disabled}
                     // style={{width: '100%', display: 'flex', flexWrap:'wrap', gap: '25px', alignItems: 'center'}}
                     style={{
                         width: '100%',
                         display: 'flex',
                         flexWrap: 'nowrap', // 줄바꿈 안되게
                         justifyContent: 'left', // 가운데 정렬
                         alignItems: 'center',
                     }}
                     onChange={e => {
                         e.target['id'] = id
                         onChange(e);
                     }}>
            {list.map(v => {
                return <Radio value={v.value} style={{fontSize : 12}}>{v.title}</Radio>
            })}
        </Radio.Group>
    </div>
}

export const selectBoxForm = ({title, id, disabled = false, data, validate = true, onChange, list, size = 'small', fontSize = 12}) => {

    return <div style={{}}>
        <div style={{fontSize: 12, paddingBottom: 5, fontWeight: 700}}>{title}</div>
        {/*@ts-ignore*/}
        <Select className="custom-select" id={id} size={size}
                value={!isNaN(parseInt(data[id])) ? parseInt(data[id]) : data[id]}
                onChange={(src, e) => onChange({target: {id: id, value: src, e: e}})}
                style={{width: '100%', fontSize: 11, border : validate ? '': '1px solid red'}}>
            {list.map(v => {
                return <Option style={{fontSize: 11}} value={v.value}>{v.label}</Option>
            })}
        </Select>
    </div>
}

export const textAreaForm = ({
                                 data = null,
                                 title,
                                 id,
                                 rows = 5,
                                 disabled = false,
                                 placeHolder = '',
                                 onChange = null,
                                 maxLength = 1000,
                                 defaultValue = null
                             }) => {
    function change(e) {
        if (onChange) {
            onChange(e)
        }
    }


    return <div style={{fontSize: 12, paddingBottom: 5}}>
        <div style={{paddingBottom: 5, fontWeight: 700}}>{title}</div>
        <textarea style={{resize: 'none', fontSize: 12,}} rows={rows} id={id}
                  value={data ? data[id] : null}
                  disabled={disabled}
                  className="custom-textarea"
                  onChange={change}
                  placeholder={placeHolder}
                  maxLength = {maxLength}
        />
    </div>
}
export const tooltipInfo = (type: any) => {

    switch (type) {
        case 'readProject' :
            return '프로젝트 타이틀에 해당하는 기본정보란 입니다.'
        case 'readAgency' :
            return '매입처 연락관련 정보란 입니다.'
        case 'readCustomer' :
            return '고객사 연락관련 정보란 입니다.'
        case 'agency' :
            return '매입처 정보는 Enter 또는 우측 아이콘클릭 이후 검색을 통한 선택만 사용을 하여야합니다.'
        case 'customer' :
            return '고객사 정보는 Enter 또는 우측 아이콘클릭 이후 검색을 통한 선택만 사용을 하여야합니다.'
        case 'maker' :
            return 'Maker 정보는 하단 아이콘클릭을 통한 검색으로 선택이 가능합니다.'
        case 'etc' :
            return '기타 정보입력란 입니다.'
        case 'drive' :
            return <>
                <div>'SHARE_POINT' 파일 입력란입니다.</div>
                <div>복제시 파일들은 복제가 되지 않습니다.</div>
                <div>자세한 규칙은 아래 버튼을 클릭하세요</div>
                <Button size={'small'} style={{color: 'black', cursor: 'pointer', fontSize: 10, marginTop: 10}}
                        onClick={() => {
                            window.open('/erp_rule', '_blank', 'width=800,height=600,scrollbars=yes');
                        }}>링크클릭</Button>
            </>

    }
}


export const tableButtonList = (type: any, gridRef?: any) => {

    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '조회리스트')
    };

    const agDownloadExcel = async () => {
        const list = gridRef.current.getSelectedRows()
        if (!list.length) {
            return message.warning('1개 이상의 데이터를 선택해주세요.')
        }
        gridRef.current.exportDataAsCsv({
            fileName: `조회리스트_${moment().format('YYYY-MM-DD')}.csv`,
            onlySelected: true, // ✅ 선택된 행만 내보내기
        });
    };

    function deleteList() {
        // const list = commonManage.getUnCheckList(gridRef);
        // gridManage.resetData(gridRef, list);
    }

    function addRow() {
        // const agencyCode: any = document.getElementById('agencyCode')
        //
        // const newRow = {...estimateRequestDetailUnit};
        // newRow['currency'] = commonManage.changeCurr(agencyCode.value)
        // gridRef.current.applyTransaction({add: [newRow]});
    }

    function addEstimateRow() {
        // const agencyCode: any = document.getElementById('agencyCode')
        //
        // const newRow = {...estimateDetailUnit};
        // newRow['currency'] = commonManage.changeCurr(agencyCode.value)
        // gridRef.current.applyTransaction({add: [newRow]});
    }

    function addOrderRow() {
        const newRow = {...orderDetailUnit};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function addStoreRow() {
        const newRow = {...storeDetailUnit};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function addProjectRow() {
        const newRow = {...projectDetailUnit};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function addAgencyDomesticRow() {
        const newRow = {...orderDetailUnit};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    switch (type) {

        case 'agencyDomesticAdd' :
            return <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                           onClick={addAgencyDomesticRow}>
                <SaveOutlined/>추가
            </Button>


        case 'storeAdd' :
            return <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                           onClick={addStoreRow}>
                <SaveOutlined/>추가
            </Button>


        case 'estimateAdd' :
            return <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                           onClick={addEstimateRow}>
                <SaveOutlined/>추가
            </Button>


        case 'orderAdd' :
            return <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                           onClick={addOrderRow}>
                <SaveOutlined/>추가
            </Button>
        // =======================================================

        case 'upload' :
            // @ts-ignored
            return <ExcelUpload ref={gridRef}/>
        case 'print' :
            return <Button
                size={'small'} style={{fontSize: 11, backgroundColor: '#3bc381'}} onClick={downloadExcel}>
                <FileExcelOutlined/>Excel 다운로드
            </Button>
        case 'agPrint' :
            return <Button
                size={'small'} style={{fontSize: 11, backgroundColor: '#3bc381'}} onClick={agDownloadExcel}>
                <FileExcelOutlined/>Excel 다운로드
            </Button>

    }
}


/**
 * @description 탭을 활성화 시키기 위한 컴포넌트 집약 데이터
 */
export const tabComponents = {

    project_write: {name: "프로젝트 등록", component: <ProjectWrite/>},
    project_read: {
        name: "프로젝트 조회",
        component: <ProjectRead/>
    },
    project_update: {name: "프로젝트 수정", component: <ProjectUpdate/>},


    rfq_write: {name: "견적의뢰 등록", component: <RfqWrite/>},
    rfq_read: {name: "견적의뢰 조회", component: <RfqRead/>},
    rfq_update: {name: "견적의뢰 수정", component: <RqfUpdate/>},

    rfq_mail_send: {name: "메일전송", component: <RfqMailSend/>},

    estimate_write: {name: "견적서 등록", component: <EstimateWrite/>},
    estimate_read: {
        name: "견적서 조회",
        component: <EstimateRead/>
    },
    estimate_update: {name: "견적서 수정", component: <EstimateUpdate/>},

    order_write: {name: "국내발주서 등록", component: <OrderWrite/>},
    seaOrder_write: {name: "해외발주서 등록", component: <SeaOrderWrite/>},
    order_read: {name: "발주서 조회", component: <OrderRead/>},
    order_update: {name: "발주서 수정", component: <OrderUpdate/>},
    expected_delivery_read: {name: "입고예정 조회", component: <ExpectedDeliveryRead/>},

    store_write: {name: "입고 등록", component: <StoreWrite/>},
    store_read: {name: "입고 조회", component: <StoreRead/>},
    store_update: {name: "입고 수정", component: <StoreUpdate/>},

    delivery_write: {name: "배송 등록", component: <DeliveryWrite/>},
    delivery_read: {
        name: "배송 조회",
        component: <DeliveryRead/>
    },
    delivery_update: {name: "배송 수정", component: <DeliveryUpdate/>},


    // remittance_domestic_write: {name: "국내송금 등록", component: <RemittanceDomesticWrite/>},
    // remittance_domestic_read: {
    //     name: "국내송금 조회",
    //     component: <RemittanceDomesticRead/>
    // },
    // remittance_domestic_update: {name: "국내송금 수정", component: <RemittanceDomesticUpdate/>},
    domestic_remittance_write: {name: "국내송금 등록", component: <DomesticRemittanceWrite/>},
    domestic_remittance_read: {
        name: "국내송금 조회",
        component: <DomesticRemittanceRead/>
    },
    domestic_remittance_update: {name: "국내송금 수정", component: <DomesticRemittanceUpdate/>},
    overseas_remittance_write: {name: "해외송금 등록", component: <OverseasRemittanceWrite/>},
    overseas_remittance_read: {
        name: "해외송금 조회",
        component: <OverseasRemittanceRead/>
    },
    overseas_remittance_update: {name: "해외송금 수정", component: <OverseasRemittanceUpdate/>},
    tax_invoice_write: {name: "세금계산서 요청 등록", component: <TaxInvoiceWrite/>},
    tax_invoice_read: {name: "세금계산서 요청 조회", component: <TaxInvoiceRead/>},
    tax_invoice_update: {name: "세금계산서 요청 수정", component: <TaxInvoiceUpdate/>},


    domestic_agency_write: {name: "국내매입처 등록", component: <DomesticAgencyWrite/>},
    domestic_agency_read: {
        name: "국내매입처 조회",
        component: <DomesticAgencyRead/>
    },
    domestic_agency_update: {
        name: "국내매입처 수정",
        component: <DomesticAgencyUpdate/>
    },

    overseas_agency_write: {name: "해외매입처 등록", component: <OverseasAgencyWrite/>},
    overseas_agency_read: {
        name: "해외매입처 조회",
        component: <OverseasAgencyRead/>
    },
    overseas_agency_update: {
        name: "해외매입처 수정",
        component: <OverseasAgencyUpdate/>
    },


    domestic_customer_write: {name: "국내고객사 등록", component: <DomesticCustomerWrite/>},
    domestic_customer_read: {
        name: "국내고객사 조회",
        component: <DomesticCustomerRead/>
    },
    domestic_customer_update: {name: "국내고객사 수정", component: <DomesticCustomerUpdate/>},


    overseas_customer_write: {name: "해외고객사 등록", component: <OverseasCustomerWrite/>},
    overseas_customer_read: {
        name: "해외고객사 조회", component: <OverseasCustomerRead/>
    },
    overseas_customer_update: {
        name: "해외고객사 수정",
        component: <OverseasCustomerUpdate/>
    },


    maker_write: {name: "메이커 등록", component: <MakerWrite/>},
    maker_read: {name: "메이커 조회", component: <MakerRead/>},
    maker_update: {name: "메이커 수정", component: <MakerUpdate/>},


    hscode_read: {
        name: "HS CODE 조회",
        component: <HcodeRead/>
    },

    company_account_read: {
        name: "회사계정관리 조회",
        component: <CompanyAccount/>
    },
    company_account_update: {
        name: "회사계정관리 수정",
        component: <CompanyAccountUpdate/>
    },
    company_account_write: {
        name: "회사계정관리 등록",
        component: <CompanyAccountWrite/>
    },

    source_read: {
        name: "재고관리 조회",
        component: <SourceRead/>
    },
    source_update: {
        name: "재고관리 수정",
        component: <SourceUpdate/>
    },
    source_write: {
        name: "재고관리 등록",
        component: <SourceWrite/>
    },
};


/**
 * @description (단축키)탭 활성화를 위한 default data
 */
export const tabShortcutMap = {
    '1': 'rfq_read',
    '2': 'estimate_read',
    '3': 'order_read',
    '4': 'project_read'
};