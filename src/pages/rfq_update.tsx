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
import {modalList, rfqWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import MyComponent from "@/component/MyComponent";
import TableGrid from "@/component/tableGrid";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";


export default function rqfUpdate({dataInfo}) {
    const gridRef = useRef(null);

    // const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>(dataInfo)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});



    useEffect(() => {
        let copyData: any = {...info}
        // @ts-ignored
        copyData['writtenDate'] = moment();
        copyData['replyDate'] = moment();
        copyData['dueDate'] = moment();

        setInfo(copyData);

    }, [])

    const disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };


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

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}/>
        </div>
    }

    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
                            }
                        })
                        }
                        disabled={disabled}
                        disabledDate={disabledDate}
                        id={id} size={'small'}/>
        </div>
    }


    function onChange(e) {

        setInfo(v => {
            return {...v, [e.target.id]: e.target.value}
        })
    }

    function openModal(e) {
        let bowl = {};
        bowl[e] = true
        setIsModalOpen(v => {
            return {...v, ...bowl}
        })
    }


    async function saveFunc() {
        if (!info['estimateRequestDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}
            copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');

            const changeTime = gridRef.current.props.context.map(v=>{
                return {...v, replyDate : moment(v['replyDate']).format('YYYY-MM-DD')}
            })
            copyData['estimateRequestDetailList'] = changeTime

            copyData['dueDate'] = moment(info['dueDate']).format('YYYY-MM-DD');
            // copyData['customerInfoList'].push(customerInfo)

            await getData.post('estimate/updateEstimateRequest', copyData).then(v => {

                if (v.data.code === 1) {
                    message.success('저장되었습니다.')
                    // setInfo(rfqWriteInitial);
                    
                    // window.location.href = '/rfq_read'
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

        setInfo(copyData);
    }


    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            "model": "",           // MODEL
            "quantity": 1,              // 수량
            "unit": "ea",               // 단위
            "currency": commonManage.changeCurr(info['agencyCode']),         // CURR
            "net": 0,            // NET/P
            "deliveryDate": null,   // 납기
            "content": "미회신",         // 내용
            "replyDate": null,  // 회신일
            "remarks": "",           // 비고
            "serialNumber": 1           // 견적의뢰 내역 순서 (1부터 시작)
        })

        setInfo(copyData)
    }

    function clearAll() {
        setInfo(rfqWriteInitial)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    searchFunc(e)
                    break;
            }

        }
    }

    async function searchFunc(e) {

        const resultList = await getData.post(modalList[e.target.id]?.url, {
            "searchType": "1",
            "searchText": e.target.value,       // 대리점코드 or 대리점 상호명
            "page": 1,
            "limit": -1
        });

        const data = resultList?.data?.entity[modalList[e.target.id]?.list];


        const size = data?.length;

        if (size > 1) {
            return openModal(e.target.id);
        } else if (size === 1) {
            switch (e.target.id) {
                case 'agencyCode' :
                    const {agencyId, agencyCode, agencyName, currencyUnit} = data[0];
                    setInfo(v => {
                        return {...v, agencyId: agencyId, agencyCode: agencyCode, agencyName: agencyName, currencyUnit:currencyUnit}
                    })
                    break;
                case 'customerName' :
                    const {customerName, managerName, directTel, faxNumber, email} = data[0];
                    // console.log(data[0], 'customerName~~~~')
                    setInfo(v => {
                        return {
                            ...v,
                            customerName: customerName,
                            managerName: managerName,
                            phoneNumber: directTel,
                            faxNumber: faxNumber,
                            customerManagerEmail: email

                        }
                    })
                    break;

                case 'maker' :
                    const {makerName, item, instructions} = data[0];
                    console.log(data[0], 'customerName~~~~')
                    setInfo(v => {
                        return {
                            ...v,
                            maker: makerName,
                            item: item,
                            instructions: instructions,
                        }
                    })
                    break;

            }
        } else {
            message.warn('조회된 데이터가 없습니다.')
        }
    }


    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>

                <SearchInfoModal info={info} setInfo={setInfo}
                                 open={isModalOpen}
                                 setIsModalOpen={setIsModalOpen}/>

                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적의뢰 수정</div>
                    <div>
                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>수정</Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                onClick={clearAll}><RetweetOutlined/>초기화</Button>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>
                    {mini ? <div>
                        <BoxCard title={'기본 정보'}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 0.6fr 0.6fr 1fr 1fr',
                                maxWidth: 900,
                                minWidth: 600,
                                columnGap: 15
                            }}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull',disabled: true})}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
                                {inputForm({title: '담당자', id: 'managerAdminName'})}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </div>
                        </BoxCard>
                        <div style={{display: 'grid', gridTemplateColumns: "150px 200px 1fr 1fr ", gap: 10, marginTop: 10}}>

                            <BoxCard title={'매입처 정보'}>

                                {inputForm({
                                    title: '매입처코드',
                                    id: 'agencyCode',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('agencyCode');
                                        }
                                    }/>
                                })}
                                {inputForm({title: '매입처명', id: 'agencyName'})}
                                {datePickerForm({title: '마감일자(예상)', id: 'dueDate'})}
                            </BoxCard>

                            <BoxCard title={'고객사 정보'}>
                                {inputForm({
                                    title: '고객사명',
                                    id: 'customerName',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('customerName');
                                        }
                                    }/>
                                })}
                                {inputForm({title: '담당자명', id: 'managerName'})}
                                {inputForm({title: '전화번호', id: 'phoneNumber'})}
                                {inputForm({title: '팩스', id: 'faxNumber'})}
                                {inputForm({title: '이메일', id: 'customerManagerEmail'})}
                            </BoxCard>


                            <BoxCard title={'Maker 정보'}>
                                {inputForm({
                                    title: 'MAKER',
                                    id: 'maker',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('maker');
                                        }
                                    }/>
                                })}
                                {inputForm({title: 'ITEM', id: 'item'})}
                                {textAreaForm({title: '지시사항', id: 'instructions'})}

                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {inputForm({title: 'End User', id: 'endUser'})}
                                {textAreaForm({title: '비고란', rows: 7, id: 'remarks'})}
                            </BoxCard>
                        </div>
                    </div> : null}
                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info['estimateRequestDetailList']}
                    listType={'estimateRequestId'}
                    listDetailType={'estimateRequestDetailList'}
                    setInfo={setInfo}
                    excel={true}
                    type={'write'}
                    funcButtons={<div>
                        {/*@ts-ignored*/}
                        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
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

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const {query} = ctx;

    // 특정 쿼리 파라미터 가져오기
    const {estimateRequestId} = query; // 예: /page?id=123&name=example

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

    const result = await getData.post('estimate/getEstimateRequestDetail', {
        "estimateRequestId": estimateRequestId
    });


    return {
        props: {dataInfo: result?.data?.entity?.estimateRequestDetail}
    }
})