import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import DatePicker from "antd/lib/date-picker";
import {tableOrderInventoryInitial,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import moment from "moment";
import message from "antd/lib/message";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";
import {BoxCard} from "@/utils/commonForm";


export default function OrderInventoryWrite() {

    const [info, setInfo] = useState(tableOrderInventoryInitial)


    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={disabledDate}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }
    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                // onKeyDown={handleKeyPress}
                   suffix={suffix}

            />
        </div>
    }
    const disabledDate = (current) => {
        // current는 moment 객체입니다.
        // 오늘 이전 날짜를 비활성화
        return current && current < moment().startOf('day');
    };



    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['receiptDate'] = moment()
        setInfo(copyData);
    }, [])


    async function saveFunc() {

        const copyData = {...info}
        copyData['receiptDate'] = moment(info['receiptDate']).format('YYYY-MM-DD');

        await getData.post('inventory/addInventory', copyData).then(v => {
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
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>재고 등록</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', columnGap: 20}}>

                        <BoxCard>
                            {datePickerForm({title: '입고일자', id: 'receiptDate'})}
                            {inputForm({title: '문서번호', id: 'documentNumber'})}
                            {inputForm({title: 'Maker', id: 'maker'})}
                            {inputForm({title: 'Model', id: 'model'})}
                        </BoxCard>

                        <BoxCard>
                            {datePickerForm({title: '수입단가', id: 'importUnitPrice'})}
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
                            {inputForm({title: '입고수량', id: 'receivedQuantity'})}
                            {inputForm({title: '단위', id: 'unit'})}
                        </BoxCard>

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
//
//
// // @ts-ignore
// export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
//
//
//     let param = {}
//
//     const {userInfo, codeInfo} = await initialServerRouter(ctx, store);
//
//     const result = await getData.post('inventory/getInventoryList', {
//         "searchInventoryId": "",
//         "searchMaker": "",          // MAKER 검색
//         "searchModel": "",          // MODEL 검색
//         "searchLocation": "",       // 위치 검색
//         "page": 1,
//         "limit": -1,
//     });
//
//
//     if (userInfo) {
//         store.dispatch(setUserInfo(userInfo));
//     }
//     if (codeInfo !== 1) {
//         param = {
//             redirect: {
//                 destination: '/', // 리다이렉트할 대상 페이지
//                 permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
//             },
//         };
//     } else {
//         // result?.data?.entity?.estimateRequestList
//         param = {
//             props: {dataList: result?.data?.entity}
//         }
//     }
//
//
//     return param
// })