import CustomTable from "@/component/CustomTable";
import {rfqWriteInitial} from "@/utils/initialList";
import {codeDomesticPurchaseColumn} from "@/utils/columnList";
import React, {useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Input from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}
export default function codeDomesticPurchase() {
    const [info, setInfo] = useState<any>(rfqWriteInitial)


    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateColumns: '300px 1fr', backgroundColor : 'white', padding : 10}}>
            <Card size={'small'} title={'의뢰 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                            <Input disabled={true} size={'small'}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일</div>
                            <DatePicker value={info['writtenDate']}
                                        onChange={(date, dateString) => onChange({
                                            target: {
                                                id: 'writtenDate',
                                                value: date
                                            }
                                        })
                                        } id={'writtenDate'} size={'small'}/>
                        </div>
                    </TwinInputBox>
                </Card>
            </Card>
            <CustomTable content={<div>asdfs</div>} columns={codeDomesticPurchaseColumn} info={[]}/>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '300px 1fr', backgroundColor : 'white', padding : 10}}>
            <Card size={'small'} title={'의뢰 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>INQUIRY NO.</div>
                            <Input disabled={true} size={'small'}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일</div>
                            <DatePicker value={info['writtenDate']}
                                        onChange={(date, dateString) => onChange({
                                            target: {
                                                id: 'writtenDate',
                                                value: date
                                            }
                                        })
                                        } id={'writtenDate'} size={'small'}/>
                        </div>
                    </TwinInputBox>
                </Card>
            </Card>
            <CustomTable content={<div>asdfs</div>} columns={codeDomesticPurchaseColumn} info={[]}/>
        </div>

    </LayoutComponent>
}