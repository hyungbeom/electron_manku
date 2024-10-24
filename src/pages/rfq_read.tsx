import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/Select";
import {estimateInfo, estimateTotalWriteColumn, estimateWriteInitial} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, FormOutlined, SaveOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns, rfqWriteColumns, subRfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {rfqReadInitial, subRfqReadInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqReadInfo, subRfqWriteInfo} from "@/utils/modalDataList";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function rfqRead() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState(rfqReadInitial)
    const [tableInfo, setTableInfo] = useState([])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'의뢰 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일(시작)</div>
                            <DatePicker id={'searchStartDate'} size={'small'} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일(종료)</div>
                            <DatePicker id={'searchEndDate'} size={'small'} onChange={onChange}/>
                        </div>
                    </TwinInputBox>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} size={'small'} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>검색조건</div>
                            <Select id={'searchType'} size={'small'}  onChange={onChange} defaultValue={0} options={[
                                {value: 0, label: '전체'},
                                {value: 1, label: '미회신'},
                                {value: 2, label: '회신'}
                            ]} style={{width: '100%'}}>
                            </Select>
                        </div>
                    </TwinInputBox>

                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>등록직원명</div>
                            <Input id={'searchCreatedBy'} size={'small'} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} size={'small'} onChange={onChange}/>
                        </div>

                    </TwinInputBox>

                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'searchMaker'} size={'small'} onChange={onChange}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>MODEL</div>
                            <Input id={'searchModel'} size={'small'} onChange={onChange}/>
                        </div>
                    </TwinInputBox>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'searchItem'} size={'small'} onChange={onChange}/>
                        </div>
                    </TwinInputBox>


                </Card>

                <CustomTable columns={subRfqReadColumns} initial={subRfqReadInitial} dataInfo={subRfqReadInfo}/>

            </div>
        </LayoutComponent>
    </>
}