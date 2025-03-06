import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {remittanceDomesticColumns, tableOrderReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {remittanceDomesticInitial,} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import is from "@sindresorhus/is";
import set = is.set;
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import Select from "antd/lib/select";

const {RangePicker} = DatePicker


export default function remittance_order_integrate({data}) {

    const gridRef = useRef(null);

    const [info, setInfo] = useState(remittanceDomesticInitial)
    const [tableData, setTableData] = useState(data)


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchRequestDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        copyData['searchScheduledDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchRequestDate, searchScheduledDate}: any = copyData;
        if (searchRequestDate) {
            copyData['searchStartRequestDate'] = searchRequestDate[0];
            copyData['searchEndRequestDate'] = searchRequestDate[1];
        }
        if (searchScheduledDate) {
            copyData['searchStartScheduledDate'] = searchScheduledDate[0];
            copyData['searchEndScheduledDate'] = searchScheduledDate[1];
        }1
        const result = await getData.post('etc/getRemittanceRequestList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.remittanceRequestList)
    }

    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('order/deleteOrder', {
                    requestId:item.requestId
                });
                console.log(response)
                if (response.data.code===1) {
                    message.success('삭제되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>발주/송금 통합 관리</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{marginBottom: 3}}>발주일</div>
                                <RangePicker style={{width: '100%'}}
                                             value={[moment(info['searchRequestDate'][0]), moment(info['searchRequestDate'][1])]}
                                             id={'searchRequestDate'} size={'small'} onChange={(date, dateString) => {
                                    onChange({
                                        target: {
                                            id: 'searchRequestDate',
                                            value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                        }
                                    })
                                }
                                }/>
                            </div>
                            <div>
                                <div style={{marginBottom: 3}}>송금 지정 일자</div>
                                <RangePicker style={{width: '100%'}}
                                             value={[moment(info['searchScheduledDate'][0]), moment(info['searchScheduledDate'][1])]}
                                             id={'searchScheduledDate'} size={'small'} onChange={(date, dateString) => {
                                    onChange({
                                        target: {
                                            id: 'searchScheduledDate',
                                            value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                        }
                                    })
                                }
                                }/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>Po.No</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>만쿠담당자</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>작성자</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>

                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>Maker</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>Model</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15}}>
                                <div style={{marginTop: 8}}>
                                    <div style={{paddingBottom: 3}}>결제여부</div>
                                    <Select id={'searchType'}
                                            onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                            size={'small'} value={info['searchType']} options={[
                                        {value: '0', label: '미결제'},
                                        {value: '1', label: '부분결제'},
                                        {value: '2', label: '결제완료'}
                                    ]} style={{width: '100%'}}>
                                    </Select>
                                </div>
                                <div style={{marginTop: 8}}>
                                    <div style={{paddingBottom: 3}}>계산서발행여부</div>
                                    <Select id={'searchType'}
                                            onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                            size={'small'} value={info['searchType']} options={[
                                        {value: '0', label: '미발행'},
                                        {value: '1', label: '발행'},
                                    ]} style={{width: '100%'}}>
                                    </Select>
                                </div>
                            </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>고객사명</div>
                                <Input id={'searchText'} value={info['searchText']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>담당자명</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{marginBottom: 3}}>담당자 연락처</div>
                                <Input id={'searchAdminId'} value={info['searchAdminId']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>


                    </div>

                    <div style={{paddingTop: 8, textAlign: 'right'}}>
                        <Button type={'primary'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    listType={'orderId'}
                    columns={remittanceDomesticColumns}
                tableData={tableData}
                type={'read'}
                excel={true}
                funcButtons={<div>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                            <FileExcelOutlined/>출력
                        </Button></div>}
                />

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


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

    const result = await getData.post('etc/getRemittanceRequestList', {
        "searchText": "",                   // 검색어: 담당자, 인쿼리, 판매처 업체명, 구매처 업체명
        "searchStartRequestDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),       // 송금 요청일자 시작일
        "searchEndRequestDate": moment().format('YYYY-MM-DD'),          // 송금 요청일자 종료일
        "searchStartScheduledDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),    // 송금 지정일자 시작일
        "searchEndScheduledDate": moment().format('YYYY-MM-DD'),       // 송금 지정일자 종료일
        "searchStartDate": "",              // 등록일자 시작일
        "searchEndDate": "",                // 등록일자 종료일
        "searchIsTransferred": null,        // 송금여부(true, false)
        "searchIsRead": null,               // 읽음 여부
        "searchAdminId": null,              // 담당자 Id
        "page": 1,
        "limit":-1
    });

    return {
        props: {data: result?.data?.entity?.remittanceRequestList}
    }
})