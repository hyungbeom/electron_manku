import Card from "antd/lib/card/Card";
import React from "react";
import Button from "antd/lib/button";
import {DownCircleFilled, RetweetOutlined, SaveOutlined, UpCircleFilled} from "@ant-design/icons";
import Input from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import InputNumber from "antd/lib/input-number";
import {commonManage} from "@/utils/commonManage";
import Radio from "antd/lib/radio";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";
import Tooltip from "antd/lib/tooltip";

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

export function BoxCard({children, title = null}) {

    return <Card size={'small'} title={title ? <div style={{fontSize : 12}}>{title}</div> : null}
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
                          ,validate = true}: any) => {

    let bowl = data;
    return <div style={{fontSize : 12, paddingBottom : 10}}>
        <div>{title}</div>
        {/*@ts-ignored*/}
        <Input placeHolder={placeHolder}
               id={id}
               value={bowl[id]} disabled={disabled}
               onChange={onChange}
               size={'small'}
               onKeyDown={handleKeyPress}
               suffix={suffix}
               style={{borderColor : validate ? '' : 'red'}}
        />
    </div>
}

export const rangePickerForm = ({
                                    title, id, disabled = false, onChange = function () {
    }, data
                                }: any) => {
    let bowl = data;
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div style={{paddingBottom: 3,}}>{title}</div>
        <RangePicker value={[moment(bowl[id][0]), moment(bowl[id][1])]} id={id} size={'small'} disabled={disabled}
                     onChange={(e, d) => onChange({target: {id: id, value: d}})} style={{width: '100%',}}/>
    </div>


}


export const datePickerForm = ({title, id, disabled = false, onChange, data}) => {
    let bowl = data;
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        {/*@ts-ignore*/}
        <DatePicker value={bowl[id] ? moment(bowl[id]) : ''} style={{width: '100%'}}
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


    return <div style={{

    }}>
        <div>{title}</div>
        {/*@ts-ignore*/}
        <Select id={id} size={size} value={data[id]}
                onChange={(src) => onChange({target: {id: id, value: src}})}
                 style={{width: '100%',fontSize : 11}}>
            {list.map(v=>{
                return <Option style={{fontSize : 11}} value={v.value}>{v.label}</Option>
            })}
        </Select>
    </div>
}

export const textAreaForm = ({title, id, rows = 5, disabled = false, onChange, data, placeHolder=''}) => {
    return <div style={{fontSize: 12, paddingBottom: 10}}>
        <div>{title}</div>
        <TextArea style={{resize: 'none'}} rows={rows} id={id} value={data[id]} disabled={disabled}
                  onChange={onChange}
                  size={'small'}
                  placeholder={placeHolder}
                  showCount
                  maxLength={1000}
        />
    </div>
}