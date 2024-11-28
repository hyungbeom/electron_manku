import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {MailOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import Modal from "antd/lib/modal/Modal";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import emailSendFormat from "@/utils/emailSendFormat";
import GoogleDrive from "@/component/Sample";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {
    const gridRef = useRef(null);
    const {estimateRequestList} = dataList;
    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState(subRfqReadInitial);
    const [tableData, setTableData] = useState(estimateRequestList);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo();
        }
    }


    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}

            />
        </div>
    }



    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateRequestList', copyData);
        // setTableInfo(transformData(result?.data?.entity?.estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
        setTableData(result?.data?.entity?.estimateRequestList);
    }


    const getCheckedRowsData = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes(); // gridOptions 대신 gridRef 사용
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
    };

    const handleSendMail = () => {
        const checkedData = getCheckedRowsData();

        if(!checkedData.length){
            return message.warn('선택된 데이터가 없습니다.')
        }

        console.log(checkedData, 'checkedData~~')

        const result = Object.values(
            checkedData.reduce((acc, items) => {
                const {documentNumberFull, model, agencyManagerName, quantity, unit, maker, item} = items;

                // documentNumberFull로 그룹화
                if (!acc[documentNumberFull]) {
                    acc[documentNumberFull] = {
                        documentNumberFull: documentNumberFull,
                        agencyManagerName: agencyManagerName,
                        list: [],
                        totalQuantity: 0, // 총 수량 초기화
                    };
                }

                // 동일한 모델 찾기
                const existingModel = acc[documentNumberFull].list.find(
                    (entry) => entry.model === model && entry.unit === unit
                );

                if (existingModel) {
                    // 모델이 동일하면 수량 합산
                    existingModel.quantity += quantity;
                } else {
                    // 새로 추가
                    acc[documentNumberFull].list.push({model, quantity, unit});
                }

                // 총 수량 업데이트
                acc[documentNumberFull].totalQuantity += quantity;
                acc[documentNumberFull].maker = maker;
                acc[documentNumberFull].item = item;
                return acc;
            }, {})
        );

        setPreviewData(result)
        console.log(result, 'setPreviewData')
        setIsModalOpen(true)
    };


    function sendMail() {
        emailSendFormat(userInfo, previewData)
    }

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: '250px 1fr', height: '100vh', gridColumnGap: 5}}>
                <Card title={'메일전송'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Modal okText={'메일 전송'} cancelText={'취소'} onOk={sendMail}
                           title={<div style={{lineHeight: 2.5, fontWeight: 550}}>메일전송</div>} open={isModalOpen}
                           onCancel={() => setIsModalOpen(false)}>

                        <div style={{width: '100%'}}>
                            {previewData.length > 0 &&
                                <div style={{width: '100%', height: 'auto'}}>
                                    [<span style={{fontWeight: 550}}>{previewData[0].agencyManagerName}</span>]님 안녕하십니까.<br/>
                                    [<span style={{fontWeight: 550}}>만쿠무역 {userInfo.name}</span>]입니다.<br/>
                                    아래 견적 부탁드립니다.
                                </div>}

                            <div style={{
                                textAlign: 'center',
                                lineHeight: 2.2,
                                display: 'flex',
                                flexDirection: 'column',
                                flexFlow: 'column'
                            }}>

                                {previewData.map((v, idx) => {

                                    return <>
                                        <div style={{
                                            marginTop: 20,
                                            width: '100%',
                                            height: '35px',
                                            fontSize: 15,
                                            borderTop: '1px solid #121212',
                                            borderBottom: '1px solid #A3A3A3',
                                            backgroundColor: '#EBF6F7'
                                        }}>
                                            {v.documentNumberFull}
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '35px',
                                            borderBottom: '1px solid #A3A3A3',
                                            display: 'flex'
                                        }}>
                                            <div style={{
                                                fontSize: '13px',
                                                backgroundColor: '#EBF6F7',
                                                width: '102px',
                                                height: '100%',
                                                borderRight: '1px solid #121212'
                                            }}>Maker
                                            </div>
                                            <div style={{lineHeight: 2, paddingLeft: 32}}>{v.maker}</div>
                                        </div>
                                        <div style={{width: '100%', height: 35, display: "flex"}}>
                                            <div style={{
                                                fontSize: '13px',
                                                backgroundColor: '#EBF6F7',
                                                width: '102px',
                                                height: '100%',
                                                borderRight: '1px solid #121212'
                                            }}>Item
                                            </div>
                                            <div style={{lineHeight: 2, paddingLeft: 32}}>{v.item}</div>
                                        </div>
                                        <div style={{
                                            lineHeight: 1.9,
                                            width: '100%',
                                            height: 35,
                                            fontSize: 18,
                                            borderTop: '1px solid #121212',
                                            borderBottom: '1px solid #A3A3A3',
                                            backgroundColor: '#EBF6F7'
                                        }}>
                                            Model
                                        </div>
                                        {v.list.map(src => {
                                            return <div
                                                style={{width: '100%', height: 35, borderBottom: '1px solid #A3A3A3',}}>
                                                <div style={{
                                                    fontSize: 13,
                                                    letterSpacing: -1,
                                                    lineHeight: 2.5,
                                                    width: 360,
                                                    height: '100%',
                                                    borderRight: '1px solid #121212'
                                                }}>{src.model}</div>
                                                <div style={{lineHeight: 2, paddingLeft: 30,}}><span
                                                    style={{fontWeight: 550}}>{src.quantity}</span> {src.unit}</div>
                                            </div>

                                        })}
                                        <div style={{
                                            lineHeight: 2.5,
                                            width: '100%',
                                            height: 35,
                                            fontSize: 18,
                                            display:'flex',
                                            borderBottom: '1px solid #121212',
                                            backgroundColor: '#EBF6F7'
                                        }}>
                                            <div style={{
                                                fontSize: 13,
                                                width: 360,
                                                height: '100%',
                                                borderRight: '1px solid #121212'
                                            }}>
                                                Total
                                            </div>
                                            <div style={{lineHeight: 2, paddingLeft: 30}}>
                                                <span style={{fontWeight: 550}}>{v.totalQuantity}</span> ${v.unit}
                                            </div>
                                        </div>

                                    </>
                                })}
                            </div>
                        </div>
                    </Modal>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridColumnGap: 10}}>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일자</div>
                            <RangePicker style={{width: '100%'}}
                                         value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                         id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                onChange({
                                    target: {
                                        id: 'searchDate',
                                        value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                    }
                                })
                            }
                            }/>
                            {inputForm({title: '문서번호', id: 'searchDocumentNumber'})}
                            {inputForm({title: '대리점코드', id: 'searchCustomerName'})}

                        </div>


                        <div>
                            <div>
                                <div style={{paddingBottom: 3}}>발송여부</div>
                                <Select id={'searchType'}
                                        onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        size={'small'} value={info['searchType']} options={[
                                    {value: '0', label: '전체'},
                                    {value: '1', label: '발송'},
                                    {value: '2', label: '미발송'}
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>회신여부</div>
                                <Select id={'searchType'}
                                        onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        size={'small'} value={info['searchType']} options={[
                                    {value: '0', label: '전체'},
                                    {value: '1', label: '회신'},
                                    {value: '2', label: '미회신'}
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{paddingTop: 30}}>

                                <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                        onClick={searchInfo}><SearchOutlined/>조회</Button>
                                {/*@ts-ignore*/}
                                <Button type={'danger'} size={'small'} style={{marginRight: 8, letterSpacing: -1}}
                                        onClick={handleSendMail}><MailOutlined/>선택 견적서 발송</Button>
                            </div>
                        </div>
                    </div>

                </Card>

                <TableGrid
                    columns={rfqReadColumns}
                    tableData={tableData}
                    type={'read'}
                    gridRef={gridRef}
                    excel={true}/>

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

    const result = await getData.post('estimate/getEstimateRequestList', {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
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
        "limit": -1
    });


    return {
        props: {dataList: result?.data?.entity}
    }
})