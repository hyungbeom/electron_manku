import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import {estimateInfo, estimateTotalWriteColumn, estimateWriteInitial} from "@/utils/common";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {FileSearchOutlined, FormOutlined, RetweetOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {
    codeDiplomaColumns,
    rfqReadColumns,
    rfqWriteColumns, subCodeDiplomaColumns,
    subInvenReadColumns,
    subOrderReadColumns
} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {
    agencyReadInitial,
    invenReadInitial,
    orderReadInitial,
    subRfqReadInitial,
    subRfqWriteInitial
} from "@/utils/initialList";
import {
    subCodeDiplomaInfo,
    subInvenReadInfo,
    subOrderReadInfo,
    subRfqReadInfo,
    subRfqWriteInfo
} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function Codediploma({searchList}) {


    const [info, setInfo] = useState(agencyReadInitial)
    const [tableInfo, setTableInfo] = useState([])

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }
    useEffect(()=>{
        setTableInfo(transformData(searchList));
    },[])

    const transformData = (data) => {

        // 데이터를 변환하여 새로운 배열을 생성
        const transformedArray = data.flatMap((item) => {
            // estimateRequestDetailList의 항목 개수에 따라 첫 번째만 정보 포함
            return item.estimateRequestDetailList.map((detail, index) => ({
                modifiedDate: moment(item.modifiedDate).format('YYYY-MM-DD') ,
                managerName: item.managerName ,
                agencyName: index === 0 ? item.agencyName : null,
                writtenDate: index === 0 ? item.writtenDate : null,
                documentNumber: index === 0 ? item.documentNumber : null,
                maker: index === 0 ? item.maker : null,
                item: index === 0 ? item.item : null,


                content: detail.content || '',
                estimateRequestId: detail.estimateRequestId || '',
                estimateRequestDetailId: detail.estimateRequestDetailId || '',
                model: detail.model || '',
                quantity: detail.quantity || '',
                unit: detail.unit || '',
                currency: detail.currency || '',
                net: detail.net || '',
                sentStatus: detail.sentStatus || '',
                serialNumber: detail.serialNumber || '',
                replySummaryId: detail.replySummaryId || '',
                unitPrice: detail.unitPrice || '',
                currencyUnit: detail.currencyUnit || '',
                deliveryDate: detail.deliveryDate || '',
                replyDate: detail.replyDate || '',


            }));
        });

        return transformedArray;
    };

    async function searchInfo() {
        const copyData:any = {...info}
        const {writtenDate}:any = copyData;
        if (writtenDate) {
            copyData['searchStartDate'] = moment(writtenDate[0]).format('YYYY-MM-DD');
            copyData['searchEndDate'] = moment(writtenDate[1]).format('YYYY-MM-DD');
        }
        delete copyData?.writtenDate;
        const result = await getData.post('estimate/getEstimateRequestList', copyData);

        setTableInfo(transformData(result?.data?.entity?.estimateRequestList));


    }

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'공문서'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>발주일자</div>
                            <RangePicker id={'searchDate'} size={'small'} onChange={(date, dateString) => onChange({
                                target: {
                                    id: 'searchDate',
                                    value: date
                                }
                            })
                            }/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} onChange={onChange} size={'small'}/>
                        </div>


                    </Card>
                    <div style={{paddingTop: 20, textAlign: 'right'}}>
                        <Button type={'primary'} style={{marginRight: 8}}
                                onClick={searchInfo}><SearchOutlined/>검색</Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'}><RetweetOutlined/>새로만들기</Button>
                    </div>
                </Card>


                <CustomTable columns={subCodeDiplomaColumns} initial={codeDiplomaColumns} dataInfo={subCodeDiplomaInfo}
                             info={tableInfo}/>

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('estimate/getEstimateRequestList', {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": "",              // 작성일자 시작일
        "searchEndDate": "",                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "searchManagerName": "",            // 담당자명
        "searchMobileNumber": "",           // 담당자 연락처
        "searchBiddingNumber": "",          // 입찰번호(미완성)
        "page": 1,
        "limit": 10
    });


    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        // result?.data?.entity?.estimateRequestList
        param = {
            props: {searchList: result?.data?.entity?.estimateRequestList}
        }
    }


    return param
})