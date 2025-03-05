import Card from "antd/lib/card/Card";
import Input from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";
import {EditOutlined, FileSearchOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";
import {rfqWriteInitial} from "@/utils/initialList";
import React from "react";
import {TwinInputBox} from "@/utils/common/component/Common";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

export function WriteRfq_V({info, onChange, setIsModalOpen}){
    const userInfo = useAppSelector((state) => state.user);


    return <div style={{display : 'grid', gridTemplateColumns : '300px 300px 300px 1fr', gridColumnGap : 15}}>

        <Card title={'BASE'} size={'small'} style={{
            fontSize: 13,
            marginTop: 20,
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

        <div>
        <Card title={'inpuiry 정보 및 supplier information'} size={'small'}
              style={{
                  fontSize: 13,
                  marginTop: 20,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
              }}>
            <TwinInputBox>
                <div>
                    <div style={{paddingBottom: 3}}>대리점코드</div>
                    <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange} size={'small'}
                           suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                               (e) => {
                                   e.stopPropagation();
                                   setIsModalOpen({event1: true, event2: false})
                               }
                           }/>}/>
                </div>
                <div>
                    <div style={{paddingBottom: 3}}>매입처명</div>
                    <Input id={'agencyName'} value={info['agencyName']} onChange={onChange} size={'small'}/>
                </div>
            </TwinInputBox>
            <div>
                <div style={{paddingBottom: 3}}>담당자</div>
                <Input id={'managerName'} value={userInfo['name']} disabled={true} onChange={onChange}
                       size={'small'}/>
            </div>
        </Card>
            <Card title={'담당자 정보'} size={'small'} style={{
                fontSize: 13,
                marginTop: 20,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
            }}>
                <div>
                    <div style={{paddingBottom: 3}}>담당자</div>
                    <Input id={'managerName'} value={userInfo['name']} disabled={true} onChange={onChange}
                           size={'small'}/>
                </div>
            </Card>
        </div>

        <Card title={'CUSTOMER INFORMATION'} size={'small'} style={{
            fontSize: 13,
            marginTop: 20,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
        }}>
            <TwinInputBox>
                <div>
                    <div style={{paddingBottom: 3}}>상호명</div>
                    <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                           size={'small'} suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                        (e) => {
                            e.stopPropagation();
                            setIsModalOpen({event1: false, event2: true})
                        }
                    }/>}/>
                </div>
                <div>
                    <div style={{paddingBottom: 3}}>담당자</div>
                    <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                           size={'small'}/>
                </div>
            </TwinInputBox>
            <TwinInputBox>
                <div>
                    <div style={{paddingBottom: 3}}>전화번호</div>
                    <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                           size={'small'}/>
                </div>
                <div>
                    <div style={{paddingBottom: 3}}>팩스/이메일</div>
                    <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange} size={'small'}/>
                </div>
            </TwinInputBox>
        </Card>

        <Card title={'ETC'} size={'small'} style={{
            fontSize: 13,
            marginTop: 20,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
        }}>
            <div style={{paddingTop: 8}}>
                <div style={{paddingBottom: 3}}>MAKER</div>
                <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>
            </div>
            <div style={{paddingTop: 8}}>
                <div style={{paddingBottom: 3}}>ITEM</div>
                <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
            </div>
            <div style={{paddingTop: 8}}>
                <div style={{paddingBottom: 3}}>비고란</div>
                <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
            </div>
            <div style={{paddingTop: 8}}>
                <div style={{paddingBottom: 3}}>지시사항</div>
                <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}
                          size={'small'}/>
            </div>


        </Card>
    </div>
}