import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import { Radio } from "antd";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {
    codeDomesticPurchaseColumns,
    rfqWriteColumns,
    subOrderWriteColumns
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderWriteInitial, rfqWriteInitial, subOrderWriteInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subOrderWriteInfo, subRfqWriteInfo} from "@/utils/modalDataList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function CodeDomesticPurchase() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState<any>(orderWriteInitial)


    useEffect(() => {
        let copyData = {...orderWriteInitial}
        // @ts-ignored
        copyData['writtenDate'] = moment();
        setInfo(copyData)
    }, [])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if (!info['estimateRequestDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            await getData.post('estimate/addEstimateRequest', copyData).then(v => {

            })
        }

    }
    // console.log(moment(info['writtenDate']).format('YYYY-MM-DD'),'??')
    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'국내대리점(매입)'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card title={'조회'} size={'small'}
                          style={{
                              fontSize: 13,
                              marginTop: 20,
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                          }}>
                        <div>
                            <div style={{paddingBottom: 3}}>구분</div>
                            <Radio.Group onChange={onChange} value={info['searchType']} defaultValue={1}>
                                <Radio value={1}>코드</Radio>
                                <Radio value={2}>상호명</Radio>
                                <Radio value={3}>MAKER</Radio>
                            </Radio.Group>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>검색어</div>
                            <Input id={'documentNumberFull'} value={info['documentNumberFull']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>검색</Button>
                        </div>
                    </Card>


                    <Card title={'등록/저장'} size={'small'}
                          style={{
                              fontSize: 13,
                              marginTop: 20,
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                          }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>코드약칭</div>
                                <Input id={'documentNumberFull'} value={info['documentNumberFull']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>딜러/제조</div>
                                <Select id={'paymentTerms'} size={'small'} defaultValue={0} options={[
                                    {value: 0, label: '딜러'},
                                    {value: 1, label: '제조'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>

                            <div>
                                <div style={{paddingBottom: 3}}>등급</div>
                                <Select id={'paymentTerms'} size={'small'} options={[
                                    {value: 0, label: 'A'},
                                    {value: 1, label: 'B'},
                                    {value: 3, label: 'C'},
                                    {value: 4, label: 'D'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>마진</div>
                                <Input id={'managerID'} style={{width: '85%'}} value={info['managerID']}
                                       onChange={onChange}
                                       size={'small'}/>&nbsp;%
                            </div>
                        </TwinInputBox>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>상호</div>
                            <Input id={'managerID'} value={info['managerID']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'managerID'} value={info['managerID']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>홈페이지</div>
                            <Input id={'managerID'} value={info['managerID']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>사업자번호</div>
                            <Input id={'managerID'} value={info['managerID']} onChange={onChange}
                                   size={'small'}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'managerID'} value={info['managerID']} onChange={onChange}
                                   size={'small'}/>
                        </div>

                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>신규</Button>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>저장</Button>

                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>삭제</Button>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>출력</Button>

                        </div>
                    </Card>
                </Card>


                <CustomTable columns={codeDomesticPurchaseColumns} initial={subOrderWriteInitial}
                             dataInfo={subOrderWriteInfo}
                             setInfo={setInfo} info={info['orderDetailList']}/>

            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
// export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
//
//
//     const userAgent = ctx.req.headers['user-agent'];
//     let param = {}
//
//     const {userInfo} = await initialServerRouter(ctx, store);
//
//     if (userInfo) {
//         store.dispatch(setUserInfo(userInfo));
//     }
//     return param
// })