import Card from "antd/lib/card/Card";
import React, {useRef} from "react";
import Button from "antd/lib/button";
import {
    CopyOutlined,
    DownCircleFilled,
    FileExcelOutlined,
    InfoCircleOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import Input from "antd/lib/input/Input";
import Password from "antd/lib/input/Password";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import InputNumber from "antd/lib/input-number";
import {commonManage, gridManage} from "@/utils/commonManage";
import Radio from "antd/lib/radio";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";
import Tooltip from "antd/lib/tooltip";
import {
    estimateDetailUnit,
    estimateRequestDetailUnit,
    estimateWriteList,
    orderDetailUnit,
    orderWriteList,
    projectDetailUnit,
    projectWriteList,
    reqWriteList,
    storeDetailUnit,
    storeWriteList
} from "@/utils/initialList";
import {ExcelUpload} from "@/component/common/ExcelUpload";
import {tableCodeDomesticAgencyWriteColumns} from "@/utils/columnList";

const {RangePicker} = DatePicker
const {Option} = Select
import {v4 as uuid} from 'uuid';

export const numbFormatter = (value) => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const numbParser = (value) => value.replace(/₩\s?|(,*)/g, '')


export function TopBoxCard({children, title = '', grid = '1fr 1fr 1fr 1fr'}) {

    return <Card size={'small'} title={title}
                 style={{
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

export function BoxCard({children, title = null, tooltip = '', disabled = false}: any) {
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
                 title={title ? <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                     <span>{title}</span>
                     <Tooltip style={{fontSize: 12}} title={<div style={{fontSize: 12}}>{tooltip}</div>} color={'cyan'}
                              key={uuid()}>
                         <InfoCircleOutlined style={{cursor: 'pointer'}}/>
                     </Tooltip>
                 </div> : null}>
        {/*@ts-ignore*/}
        <div style={disabled ? disabledStyle : defaultStyle}>
            {children}
        </div>
    </Card>
}


export function MainCard({children, title, list, mini = null, setMini = Function()}) {

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
                             gridTemplateColumns: `${'1fr '.repeat(list.length)}auto`.trim(),
                             columnGap: 8
                         }}>

                             {list.map(v => <Tooltip title={v.title} placement={v.place} color={'cyan'}
                                                     key={uuid()}><Button
                                 type={v.type} style={{fontSize: 11}} size={'small'}
                                 onClick={v.func}>{v?.prefix}{v.name}</Button></Tooltip>)}

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


    return <div style={{fontSize: fontSize, paddingBottom: 10}}>
        <div style={{paddingBottom: fontSize / 2, fontWeight: 700}}>{title}</div>
        {/*@ts-ignored*/}
        <div style={{display : 'flex'}}>
            <input placeholder={placeholder}
                   id={id}
                   size={size}
                   disabled={disabled}

                   onKeyDown={handleKeyPress}
                   onChange={onChange}
                // suffix={suffix}
                   style={{fontSize: 12, border: `1px solid ${validate ? 'lightGray' : 'red'}`}}
            />
            <span style={{marginLeft : -22, paddingTop : 2}}>{suffix}</span>
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
        <div style={{paddingBottom: fontSize / 2}}>{title}</div>
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
        <div style={{paddingBottom: 5.5, fontSize: 12, fontWeight : 700}}>{title}</div>
        <RangePicker className={'custom-rangepicker'} value={[moment(bowl[id][0]), moment(bowl[id][1])]} id={id}
                     size={'small'} disabled={disabled}
                     onChange={(e, d) => onChange({target: {id: id, value: d}})} style={{width: '100%',height : 24}}/>
    </div>


}


export const datePickerForm = ({title, id, disabled = false, onChange = null, data = null}) => {

    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 5.5, fontWeight: 700}}>{title}</div>
        {/*@ts-ignore*/}

        <input type="date" id={id} disabled={disabled}/>
    </div>
}


export const inputNumberForm = ({
                                    title,
                                    id,
                                    disabled = false,
                                    placeholder = '',
                                    onChange,
                                    data,
                                    formatter = null,
                                    parser = null,
                                    step = 1,
                                    addonAfter = '',
                                    min = -99999,
                                    max = 99999,
                                }: any) => {
    let bowl = data;


    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 4}}>{title}</div>
        <InputNumber id={id} disabled={disabled}
                     style={{width: '100%'}}
                     formatter={formatter}
                     parser={parser}
                     step={step}
                     onChange={e => onChange({target: {id: id, value: e}})}
                     size={'small'}
                     placeholder={placeholder}
                     addonAfter={addonAfter}
                     min={min}
                     max={max}

        />
    </div>
}

export const radioForm = ({title, id, disabled = false, data, onChange, list}) => {
    let bowl = data;

    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        <Radio.Group id={id} value={bowl[id]} disabled={disabled}
                     onChange={e => {
                         e.target['id'] = id
                         onChange(e);
                     }}>
            {list.map(v => {
                return <Radio value={v.value}>{v.title}</Radio>
            })}
        </Radio.Group>
    </div>
}

export const selectBoxForm = ({title, id, disabled = false, data, onChange, list, size = 'small', fontSize = 12}) => {

    return <div style={{}}>
        <div style={{fontSize: 12, paddingBottom: 6}}>{title}</div>
        {/*@ts-ignore*/}
        <Select className="custom-select" id={id} size={size}
                value={!isNaN(parseInt(data[id])) ? parseInt(data[id]) : data[id]}
                onChange={(src, e) => onChange({target: {id: id, value: src, e: e}})}
                style={{width: '100%', fontSize: 11, paddingBottom: 7}}>
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
    return <div style={{fontSize: 12, paddingBottom: 5}}>
        <div style={{paddingBottom: 5, fontWeight: 700}}>{title}</div>
        <textarea style={{resize: 'none', fontSize: 12,}} rows={rows} id={id}
                 value={data ? data[id] : null}
                  disabled={disabled}
                  className="custom-textarea"
                  placeholder={placeHolder}
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

    console.log(gridRef.current, 'gridRef:')
    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '조회리스트')
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

    }
}

