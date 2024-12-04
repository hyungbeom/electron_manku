import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {
    CopyOutlined,
    DeleteOutlined, DownloadOutlined,
    FileExcelOutlined,
    RetweetOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns, tableOrderInventory, tableOrderInventoryColumns,} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    inventoryReadInitial,
    orderWriteInitial, rfqWriteInitial,
    subRfqReadInitial,
    tableOrderInventoryInitial,
} from "@/utils/initialList";
import {tableOrderInventoryInfo,} from "@/utils/modalDataList";
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
import Radio from "antd/lib/radio";


export default function delivery_write() {

    const [info, setInfo] = useState(tableOrderInventoryInitial)


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
                <Card title={<span style={{fontSize: 12,}}>배송 등록</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>

                            <div>
                                <div style={{marginTop: 6}}>
                                    <Radio.Group onChange={e => setInfo(v => {
                                        return {...v, searchType: e.target.value}
                                    })} defaultValue={2} id={'searchType'}
                                                 value={info['searchType']}>
                                        <Radio value={1}>대한통운</Radio>
                                        <Radio value={2}>대신택배</Radio>
                                        <Radio value={3}>퀵/직납/대리점</Radio>
                                    </Radio.Group>
                                </div>
                                <div style={{paddingBottom: 3}}>작성일자</div>
                                {/*@ts-ignore*/}
                                <DatePicker value={info['receiptDate']}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'receiptDate',
                                                    value: date
                                                }
                                            })
                                            } id={'receiptDate'} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>집하일자</div>
                                {/*@ts-ignore*/}
                                <DatePicker value={info['receiptDate']}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'receiptDate',
                                                    value: date
                                                }
                                            })
                                            } id={'receiptDate'} size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>고객사명</div>
                                <Input size={'small'} id={'documentNumber'} value={info['documentNumber']}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>받는 사람(거래처 담당자)</div>
                                <Input size={'small'} id={'documentNumber'} value={info['documentNumber']}
                                       onChange={onChange}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>받는 사람 전화번호</div>
                                <Input id={'maker'} value={info['maker']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>받는 사람 기타 연락처</div>
                                <Input id={'model'} value={info['model']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>받는 사람 우편번호</div>
                                <Input id={'importUnitPrice'} value={info['importUnitPrice']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>받는 사람 주소</div>
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
                                <div style={{paddingBottom: 3}}>운송장번호</div>
                                <Input id={'receivedQuantity'} value={info['receivedQuantity']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>고객주문번호</div>
                                <Input id={'unit'} value={info['unit']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>품목명</div>
                                <Input id={'location'} value={info['location']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>박스수량</div>
                                <TextArea id={'remarks'} value={info['remarks']} onChange={onChange}
                                          size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>인쿼리넘버</div>
                                <TextArea id={'remarks'} value={info['remarks']} onChange={onChange}
                                          size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>출고 확인</div>
                                <Select id={'currencyUnit'}
                                        onChange={(src) => onChange({target: {id: 'currencyUnit', value: src}})}
                                        size={'small'} value={info['currencyUnit']} options={[
                                    {value: '0', label: '미확인'},
                                    {value: '1', label: '확인'},
                                ]} style={{width: '100%',}}/>
                            </div>

                        </Card>


                    </div>

                    <div style={{marginTop: 8, width: '100%', textAlign: 'right'}}>
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