import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {

    RetweetOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import Button from "antd/lib/button";
import DatePicker from "antd/lib/date-picker";
import {
    orderWriteInitial,
    tableOrderInventoryInitial,
} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import TableModal from "@/utils/TableModal";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {useRouter} from "next/router";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";


export default function OrderInventoryRead({dataInfo}) {

    const [info, setInfo] = useState(dataInfo)
    const router = useRouter();


    useEffect(() => {

        let copyData: any = {...info}

            copyData['receiptDate'] = moment(copyData['receiptDate']).format('YYYY-MM-DD');

        setInfo(copyData);
    }, [dataInfo, router])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }


    async function saveFunc() {

        const copyData = {...info}
        copyData['receiptDate'] = moment(info['receiptDate']).format('YYYY-MM-DD');

        await getData.post('inventory/updateInventory', copyData).then(v => {
            if(v.data.code === 1){
                message.success('저장되었습니다')
                setInfo(tableOrderInventoryInitial);

                window.location.href = '/inventory_manage'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }
    
    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', gridColumnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>재고 수정</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>입고일자</div>
                                {/*@ts-ignore*/}
                                <DatePicker value={moment(info['receiptDate'])}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'receiptDate',
                                                    value: date
                                                }
                                            })
                                            } id={'receiptDate'} size={'small'}/>
                            </div>
                            <div style={{marginTop:8}}>
                                <div style={{paddingBottom: 3}}>문서번호</div>
                                <Input size={'small'} id={'documentNumber'} value={info['documentNumber']}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>Maker</div>
                                <Input id={'maker'} value={info['maker']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>Model</div>
                                <Input id={'model'} value={info['model']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>수입단가</div>
                                <Input id={'importUnitPrice'} value={info['importUnitPrice']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>화폐단위</div>
                                <Select id={'currencyUnit'}
                                        onChange={(src) => onChange({target: {id: 'currencyUnit', value: src}})}
                                        size={'small'} value={info['currencyUnit']} options={[
                                    {value: '0', label: 'KRW'},
                                    {value: '1', label: 'EUR'},
                                    {value: '2', label: 'JPY'},
                                    {value: '3', label: 'USD'},
                                    {value: '4', label: 'GBP'},
                                ]} style={{width: '100%',}}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>입고수량</div>
                                <Input id={'receivedQuantity'} value={info['receivedQuantity']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>단위</div>
                                <Input id={'unit'} value={info['unit']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>위치</div>
                                <Input id={'location'} value={info['location']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>비고</div>
                                <TextArea id={'remarks'} value={info['remarks']} onChange={onChange}
                                          size={'small'}/>
                            </div>


                        </Card>


                    </div>

                    <div style={{marginTop: 8, width:'100%', textAlign:'right'}}>
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>저장</Button>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11,}}
                                onClick={() => setInfo(tableOrderInventoryInitial)}><RetweetOutlined/>초기화</Button>

                    </div>
                </Card>

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));

    const {maker, model} = ctx.query;

    console.log(model, 'model')
    console.log(maker, 'result')
    const result = await getData.post('inventory/getInventoryDetail', {
        maker:maker,
        model:model,
    });

    console.log(result, 'result')

    return {props: {dataInfo: result?.data?.entity?.inventoryItemList?.[0]}}
})
