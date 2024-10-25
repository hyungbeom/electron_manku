import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {rfqWriteColumns, subInvenWriteColumns, subOrderWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    invenWriteInitial,
    OrderWriteInitial,
    rfqWriteInitial, subInvenWriteInitial,
    subOrderWriteInitial,
    subRfqWriteInitial
} from "@/utils/initialList";
import {subInvenWriteInfo, subOrderWriteInfo, subRfqWriteInfo} from "@/utils/modalDataList";
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

export default function OrderWriter() {
    const sub = {
        validityPeriod: 1
    }

    const [info, setInfo] = useState<any>(OrderWriteInitial)


    useEffect(() => {
        let copyData = {...OrderWriteInitial}
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
                console.log(v, ':::')
            })
        }

    }
    // console.log(moment(info['writtenDate']).format('YYYY-MM-DD'),'??')
    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'재고 등록'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>입고일자</div>
                                <DatePicker value={info['receiptDate']}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'receiptDate',
                                                    value: date
                                                }
                                            })
                                            } id={'receiptDate'} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>문서번호</div>
                                <Input id={'documentNumberFull'} value={info['documentNumberFull']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'maker'} value={info['maker']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>MODEL</div>
                                <Input id={'model'} value={info['model']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>수입단가</div>
                                <Input id={'importUnitPrice'} value={info['importUnitPrice']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>화폐단위</div>
                                <Input id={'currencyUnit'} value={info['currencyUnit']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>입고수량</div>
                                <Input id={'receivedQuantity'} value={info['receivedQuantity']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>단위</div>
                                <Input id={'unit'} value={info['unit']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <div>
                            <div style={{paddingBottom: 3}}>위치</div>
                            <Input id={'location'} value={info['location']} onChange={onChange}
                                   size={'small'}/>
                        </div>

                        <div>
                            <div style={{paddingBottom: 3}}>비고</div>
                            <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>저장</Button>
                            {/*@ts-ignored*/}
                            <Button type={'danger'}><RetweetOutlined/>삭제</Button>
                        </div>
                    </Card>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>검색</div>
                            <Input id={'searchText'} value={info['searchText']} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={saveFunc}><SaveOutlined/>검색</Button>
                        </div>


                    </Card>


                </Card>


                <CustomTable columns={subInvenWriteColumns} initial={subInvenWriteInitial} dataInfo={subInvenWriteInfo}
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