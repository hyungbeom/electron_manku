import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {MailOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadMailInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {BoxCard} from "@/utils/commonForm";
import {searchRfq} from "@/utils/api/mainApi";
import PreviewMailModal from "@/component/PreviewMailModal";
import _ from "lodash";
import {commonManage} from "@/utils/commonManage";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {
    const gridRef = useRef(null);
    const {estimateRequestList} = dataList;

    const copyInit = _.cloneDeep(subRfqReadMailInitial)

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = copyInit

    const [info, setInfo] = useState(infoInit);

    const [tableData, setTableData] = useState(estimateRequestList);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);


    function onChange(e) {
        commonManage.onChange(e, setInfo)
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

        const result = await searchRfq({
            data: {
                ...copyData,
                searchStartDate: searchDate[0],
                searchEndDate: searchDate[1]
            }
        });

        setTableData(result?.estimateRequestList);
    }



    const handleSendMail = () => {
        const checkedData = commonManage.getSelectRows(gridRef);
        if (!checkedData.length) {
            return message.warn('선택된 데이터가 없습니다.')
        }

        const result = Object.values(
            checkedData.reduce((acc, items) => {
                const {
                    documentNumberFull,
                    model,
                    agencyManagerName,
                    managerName,
                    quantity,
                    unit,
                    maker,
                    item,
                    endUser
                } = items;

                // documentNumberFull로 그룹화
                if (!acc[documentNumberFull]) {
                    acc[documentNumberFull] = {
                        documentNumberFull: documentNumberFull,
                        agencyManagerName: agencyManagerName,
                        managerName: managerName,
                        unit: unit,
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
                acc[documentNumberFull].endUser = endUser;
                return acc;
            }, {})
        );

        setPreviewData(result)
        setIsModalOpen(true)
    };



    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', gridColumnGap: 5}}>
                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적의뢰 메일전송</div>
                    <div>

                        <div style={{paddingTop: 30}}>

                            <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                    onClick={searchInfo}><SearchOutlined/>조회</Button>
                            {/*@ts-ignore*/}
                            <Button type={'danger'} size={'small'} style={{marginRight: 8, letterSpacing: -1}}
                                    onClick={handleSendMail}><MailOutlined/>선택 견적의뢰 발송</Button>
                        </div>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <PreviewMailModal data={previewData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>


                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <BoxCard title={''}>
                            <div style={{paddingBottom: 3,}}>작성일자</div>
                            <RangePicker
                                value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                onChange({
                                    target: {
                                        id: 'searchDate',
                                        value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                    }
                                })
                            }
                            } style={{width: '100%',}}/>
                            {inputForm({title: '문서번호', id: 'searchDocumentNumber'})}

                        </BoxCard>

                        <BoxCard title={''}>
                            {inputForm({title: '대리점코드', id: 'searchAgencyCode'})}
                            {inputForm({title: '고객사명', id: 'searchCustomerName'})}
                        </BoxCard>

                        <BoxCard title={''}>
                            <div>
                                <div>발송 여부</div>
                                <Select id={'searchType'}
                                        defaultValue={'원드라이브-메일 연동후 자동화 예정'}
                                        onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        size={'small'} value={info['searchType']} options={[
                                    {value: '0', label: '전체'},
                                    {value: '1', label: '발송'},
                                    {value: '2', label: '미발송'}
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div>
                                <div>회신 여부</div>
                                <Select id={'searchReplyStatus'} defaultValue={0}
                                        onChange={(src) => onChange({target: {id: 'searchReplyStatus', value: src}})}
                                        size={'small'} value={info['searchReplyStatus']} options={[
                                    {value: 0, label: '전체'},
                                    {value: 1, label: '회신'},
                                    {value: 2, label: '미회신'}
                                ]} style={{width: '100%',}}/>
                            </div>
                        </BoxCard>


                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={rfqReadColumns}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo === -90009) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));

        const result = await searchRfq({data: {}});

        return {
            props: {dataList: result}
        }
    }

})