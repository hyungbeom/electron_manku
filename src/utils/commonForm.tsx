import Card from "antd/lib/card/Card";
import React from "react";
import Button from "antd/lib/button";
import {
    CopyOutlined,
    DownCircleFilled, FileExcelOutlined,
    InfoCircleOutlined,
    RetweetOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import Input from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import InputNumber from "antd/lib/input-number";
import {commonManage, gridManage} from "@/utils/commonManage";
import Radio from "antd/lib/radio";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";
import Tooltip from "antd/lib/tooltip";
import {estimateRequestDetailUnit, projectDetailUnit, projectWriteList, reqWriteList} from "@/utils/initialList";
import {ExcelUpload} from "@/component/common/ExcelUpload";
import Upload from "antd/lib/upload";

const {RangePicker} = DatePicker
const {Option} = Select


export const numbFormatter = (value) => `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const numbParser = (value) => value.replace(/₩\s?|(,*)/g, '')


export function TopBoxCard({children, title = '', grid = '1fr 1fr 1fr 1fr'}) {

    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
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

export function BoxCard({children, title = null, tooltip = ''}:any) {
    // <InfoCircleOutlined />
    return <Card size={'small'}
                 title={title ? <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12}}>
                     <span>{title}</span>
                     <Tooltip style={{fontSize : 12}} title={<div style={{fontSize : 12}}>{tooltip}</div>} color={'cyan'} key={'cyan'}>
                         <InfoCircleOutlined style={{cursor : 'pointer'}}/>
                     </Tooltip>
                 </div> : null}

                 style={{
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                 }}>
        {children}
    </Card>
}


export function MainCard({children, title, list, mini = null, setMini = Function()}) {

    return <Card size={'small'} title={
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{fontSize: 13, fontWeight: 550}}>{title}</div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `${'1fr '.repeat(list.length)}auto`.trim(),
                columnGap: 8
            }}>

                {list.map(v => <Tooltip title={v.title} placement={v.place} color={'cyan'} key={'cyan'}><Button
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

export const inputForm = ({
                              title, id, disabled = false, placeHolder = '', suffix = null, onChange = function () {
    }, handleKeyPress = function () {
    }, data
                              , validate = true
                          }: any) => {

    let bowl = data;
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        {/*@ts-ignored*/}
        <Input placeHolder={placeHolder}
               id={id}
               value={bowl[id]} disabled={disabled}
               onChange={onChange}
               size={'small'}
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
        <div style={{paddingBottom: 3,fontSize : 11}}>{title}</div>
        <RangePicker className={'custom-rangepicker'} value={[moment(bowl[id][0]), moment(bowl[id][1])]} id={id} size={'small'} disabled={disabled}
                     onChange={(e, d) => onChange({target: {id: id, value: d}})} style={{width: '100%',}}/>
    </div>


}


export const datePickerForm = ({title, id, disabled = false, onChange, data}) => {
    let bowl = data;
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        {/*@ts-ignore*/}
        <DatePicker value={bowl[id] ? moment(bowl[id]) : ''} style={{width: '100%', fontSize : 11}}
                    className="custom-datepicker"
                    disabledDate={commonManage.disabledDate}
                    onChange={(e, d) => onChange({
                        target: {
                            id: id,
                            value: d
                        }
                    })
                    }
                    disabled={disabled}
                    id={id} size={'small'}/>
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
                                    parser = null
                                }: any) => {
    let bowl = data;


    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        <InputNumber id={id} value={bowl[id]} disabled={disabled}
                     style={{width: '100%'}}
                     formatter={formatter}
                     parser={parser}
                     onChange={e => onChange({target: {id: id, value: e}})}
                     size={'small'}
                     placeholder={placeholder}
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

export const selectBoxForm = ({title, id, disabled = false, data, onChange, list, size = 'small'}) => {

    return <div style={{}}>
        <div style={{fontSize : 12}}>{title}</div>
        {/*@ts-ignore*/}
        <Select className="custom-select"  id={id} size={size} value={parseInt(data[id])}
                onChange={(src, e) => onChange({target: {id: id, value: src, e:e}})}
                style={{width: '100%', fontSize: 11}}>
            {list.map(v => {
                return <Option style={{fontSize: 11}} value={v.value}>{v.label}</Option>
            })}
        </Select>
    </div>
}

export const textAreaForm = ({title, id, rows = 5, disabled = false, onChange, data, placeHolder = ''}) => {
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        <TextArea style={{resize: 'none', fontSize: 12}} rows={rows} id={id} value={data[id]} disabled={disabled}
                  className="custom-textarea"
                  onChange={onChange}
                  size={'small'}
                  placeholder={placeHolder}
                  showCount
                  maxLength={1000}
        />
    </div>
}
export const tooltipInfo = (type:any) => {

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
            return 'MAKER 정보는 하단 아이콘클릭을 통한 검색으로 선택이 가능합니다.'
        case 'etc' :
            return '기타 정보입력란 입니다.'
        case 'drive' :
            return <>
                <div>'SHARE_POINT' 파일 입력란입니다.</div>
                <div>복제시 파일들은 복제가 되지 않습니다.</div>
                <div>자세한 규칙은 아래 버튼을 클릭하세요</div>
                <Button size={'small'} style={{color: 'black', cursor: 'pointer', fontSize: 10, marginTop : 10}}
                        onClick={() => {
                            window.open('/erp_rule', '_blank', 'width=800,height=600,scrollbars=yes');
                        }}>링크클릭</Button>
            </>

    }
}


export const tableButtonList = (type:any, gridRef?:any) => {

    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '조회리스트')
    };
    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }
    function addRow() {
        const agencyCode:any = document.getElementById('agencyCode')

        const newRow = {...estimateRequestDetailUnit};
        newRow['currency'] = commonManage.changeCurr(agencyCode.value)
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function addProjectRow() {
        const newRow = {...projectDetailUnit};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    switch (type) {
        case 'projectUpload' :
            return <ExcelUpload gridRef={gridRef} list={projectWriteList}/>
        case 'upload' :
            return <ExcelUpload gridRef={gridRef} list={reqWriteList}/>
        case 'add' :
            return  <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                            onClick={addRow}>
                <SaveOutlined/>추가
            </Button>
        case 'addProjectRow' :
            return  <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                            onClick={addProjectRow}>
                <SaveOutlined/>추가
            </Button>
        case 'delete' :
            // @ts-ignored
            return <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                           onClick={deleteList}>
                <CopyOutlined/>삭제
            </Button>
        case 'print' :
            return <Button
                size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>
                <FileExcelOutlined/>출력
            </Button>
    }
}

