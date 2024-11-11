import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    DownCircleFilled,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {rfqWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import * as XLSX from 'xlsx';
import MyComponent from "@/component/MyComponent";
import {useRouter} from "next/router";
import nookies from "nookies";
import TableGrid from "@/component/tableGrid";
import SearchAgendaModal from "@/component/SearchAgendaModal";
import SearchCustomerModal from "@/component/SearchCustomerModal";

export default function rqfWrite({dataInfo}) {
    const gridRef = useRef(null);
    const router = useRouter();

    const [info, setInfo] = useState<any>(rfqWriteInitial)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [agencyData, setAgencyData] = useState([]);
    const [customerData, setCustomerData] = useState([]);


    useEffect(() => {

        let copyData: any = {...rfqWriteInitial}
        //
        // if (dataInfo) {
        //     copyData = dataInfo;
        //     copyData['writtenDate'] = moment(copyData['writtenDate']);
        // } else {
            // @ts-ignored
            copyData['writtenDate'] = moment();
        // }


        setInfo(copyData);
    // }, [dataInfo, router])
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
            copyData['replyDate'] = moment(info['replyDate']).format('YYYY-MM-DD');

            await getData.post('estimate/addEstimateRequest', copyData).then(v => {
                if (v.data.code === 1) {
                    message.success('저장되었습니다.')
                    setInfo(rfqWriteInitial);
                    deleteList()
                    window.location.href = '/rfq_read'
                } else {
                    message.error('저장에 실패하였습니다.')
                }
            });
        }
    }

    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['estimateRequestDetailList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            "model": "",           // MODEL
            "quantity": 1,              // 수량
            "unit": "ea",               // 단위
            "currency": "krw",          // CURR
            "net": 0,            // NET/P
            "deliveryDate": "",   // 납기
            "content": "",         // 내용
            "replyDate": '',  // 회신일
            "remarks": "",           // 비고
            "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
        })

        setInfo(copyData)
    }

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            if (e.target.id === 'agencyCode') {
                if (!info['agencyCode']) {
                    return false;
                }
                const result = await getData.post('agency/getAgencyListForEstimate', {
                    "searchText": info['agencyCode'],       // 대리점코드 or 대리점 상호명
                    "page": 1,
                    "limit": -1
                })

                if (result.data.entity.agencyList.length > 1) {
                    setAgencyData(result.data.entity.agencyList)
                    setIsModalOpen({event1: true, event2: false})
                } else if (!!result.data.entity.agencyList.length) {
                    const {agencyCode, agencyName} = result.data.entity.agencyList[0]

                    setInfo(v => {
                        return {...v, agencyCode: agencyCode, agencyName: agencyName}
                    })
                }
            } else {
                if (!info['customerName']) {
                    return false
                }
                const result = await getData.post('customer/getCustomerListForEstimate', {
                    "searchText": info['customerName'],       // 대리점코드 or 대리점 상호명
                    "page": 1,
                    "limit": -1
                })
                if (result.data.entity.customerList.length > 1) {
                    setCustomerData(result.data.entity.customerList)
                    setIsModalOpen({event1: false, event2: true})
                } else if (!!result.data.entity.customerList.length) {
                    const {customerName, managerName, directTel, faxNumber} = result.data.entity.customerList[0]


                    setInfo(v => {
                        return {
                            ...v,
                            customerName: customerName,
                            managerName: managerName,
                            phoneNumber: directTel,
                            faxNumber: faxNumber
                        }
                    })
                }
            }
        }
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100%', columnGap: 5}}>

                <SearchAgendaModal info={info} setInfo={setInfo} agencyData={agencyData} isModalOpen={isModalOpen}
                                   setIsModalOpen={setIsModalOpen}/>
                <SearchCustomerModal info={info} setInfo={setInfo} customerData={customerData} isModalOpen={isModalOpen}
                                     setIsModalOpen={setIsModalOpen}/>

                <Card title={'견적의뢰 작성'} style={{fontSize: 12, border: '1px solid lightGray'}} extra={<span style={{fontSize : 20, cursor : 'pointer'}} onClick={()=>setMini(v => !v)}> {!mini ? <UpCircleFilled/> : <DownCircleFilled/>}</span>} >
                    {mini ?  <div>
                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                            marginBottom : 5
                        }}>
                            <div style={{display : 'grid', gridTemplateColumns : '1fr 1fr 1fr', width : 640, columnGap : 20}}>
                                <div>
                                    <div style={{paddingTop: 8, width : '100%'}}>작성일</div>
                                    <DatePicker value={info['writtenDate']} style={{width : '100%'}}
                                                onChange={(date, dateString) => onChange({
                                                    target: {
                                                        id: 'writtenDate',
                                                        value: date
                                                    }
                                                })
                                                } id={'writtenDate'} size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>INQUIRY NO.</div>
                                    <Input disabled={true} size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>RFQ NO.</div>
                                    <Input size={'small'}/>
                                </div>
                            </div>
                        </Card>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr  1.5fr 1.22fr', columnGap: 10}}>


                            <Card size={'small'}
                                  style={{
                                      fontSize: 13,
                                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                                  }}>
                                <div>
                                    <div style={{paddingTop: 8}}>대리점코드</div>
                                    <Input id={'agencyCode'} value={info['agencyCode']} onChange={onChange}
                                           size={'small'}
                                           onKeyDown={handleKeyPress}
                                           suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                               (e) => {
                                                   e.stopPropagation();
                                                   setIsModalOpen({event1: true, event2: false})
                                               }
                                           }/>}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>매입처명</div>
                                    <Input id={'agencyName'} value={info['agencyName']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>담당자</div>
                                    <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                            </Card>

                            <Card  size={'small'} style={{
                                fontSize: 13,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div>
                                    <div style={{paddingTop: 8}}>상호명</div>
                                    <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                           size={'small'}
                                           onKeyDown={handleKeyPress}
                                           suffix={<FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                               (e) => {
                                                   e.stopPropagation();
                                                   setIsModalOpen({event1: false, event2: true})
                                               }
                                           }/>}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>담당자</div>
                                    <Input id={'managerName'} value={info['managerName']} onChange={onChange}
                                           size={'small'}/>
                                </div>

                                <div>
                                    <div style={{paddingTop: 8}}>전화번호</div>
                                    <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8}}>팩스/이메일</div>
                                    <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                           size={'small'}/>
                                </div>
                            </Card>

                            <Card size={'small'} style={{
                                fontSize: 13,
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
                            <Card  size={'small'} style={{
                                fontSize: 13,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                            }}>
                                <div style={{paddingTop: 8}}>
                                    <div style={{paddingBottom: 3}}>프로젝트 제목</div>
                                    <Input id={'maker'} value={info['maker']} onChange={onChange} size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingTop: 8, width : '100%'}}>마감일자</div>
                                    <DatePicker value={info['writtenDate']} style={{width : '100%'}}
                                                onChange={(date, dateString) => onChange({
                                                    target: {
                                                        id: 'writtenDate',
                                                        value: date
                                                    }
                                                })
                                                } id={'writtenDate'} size={'small'}/>
                                </div>
                                <div style={{paddingTop: 8}}>
                                    <div style={{paddingBottom: 3}}>End User</div>
                                    <Input id={'remarks'} value={info['remarks']} onChange={onChange} size={'small'}/>
                                </div>

                            </Card>
                            <div style={{paddingTop: 10}}>

                                <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                        onClick={saveFunc}><SaveOutlined/>저장</Button>

                                {/*@ts-ignored*/}
                                <Button type={'danger'} size={'small'}
                                        onClick={() => setInfo(rfqWriteInitial)}><RetweetOutlined/>초기화</Button>

                            </div>
                        </div>
                    </div> : null}
                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info['estimateRequestDetailList']}
                    listType={'estimateRequestId'}
                    listDetailType={'estimateRequestDetailList'}
                    // dataInfo={tableOrderReadInfo}
                    setInfo={setInfo}
                    // setTableInfo={setTableInfo}
                    excel={true}
                    type={'write'}
                    funcButtons={<div>
                        {/*@ts-ignored*/}
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                    </div>}
                />


            </div>
            <MyComponent/>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);
    const cookies = nookies.get(ctx)
    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    const {display = 'horizon'} = cookies;

    store.dispatch(setUserInfo(userInfo));

    // const {estimateRequestId} = ctx.query;
    //
    // const result = await getData.post('estimate/getEstimateRequestList', {
    //     "searchEstimateRequestId": estimateRequestId,      // 견적의뢰 Id
    //     "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
    //     "searchStartDate": "2024-08-01",              // 작성일자 시작일
    //     "searchEndDate": "2024-12-31",                // 작성일자 종료일
    //     "searchDocumentNumber": "",         // 문서번호
    //     "searchCustomerName": "",           // 거래처명
    //     "searchMaker": "",                  // MAKER
    //     "searchModel": "",                  // MODEL
    //     "searchItem": "",                   // ITEM
    //     "searchCreatedBy": "",              // 등록직원명
    //     "searchManagerName": "",            // 담당자명
    //     "searchMobileNumber": "",           // 담당자 연락처
    //     "searchBiddingNumber": "",          // 입찰번호(미완성)
    //     "page": 1,
    //     "limit": 100000
    // });
    //
    //
    return {
        props: {
            // dataInfo: estimateRequestId ? result?.data?.entity?.estimateRequestList[0] : null,
            display: display
        }
    }
})