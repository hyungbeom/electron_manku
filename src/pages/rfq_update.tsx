import React, {useRef, useState} from "react";
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
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {updateRfq} from "@/utils/api/mainApi";
import {estimateRequestDetailUnit} from "@/utils/initialList";
import _ from "lodash";


const listType = 'estimateRequestDetailList'
export default function rqfUpdate({dataInfo}) {
    const gridRef = useRef(null);

    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)

    const infoInit = dataInfo


    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});




    // =============================================================================================

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
                        disabledDate={commonManage.disabledDate}
                        id={id} size={'small'}/>
        </div>
    }

    // =========================================================================

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
            }
        }
    }

    async function saveFunc() {
        if (!info[listType].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...info}

            const changeTime = gridRef.current.props.context.map(v => {
                return {...v, replyDate: moment(v['replyDate']).format('YYYY-MM-DD')}
            });

            copyData[listType] = changeTime
            copyData['dueDate'] = moment(info['dueDate']).format('YYYY-MM-DD');

            await updateRfq({data: copyData})
        }
    }

    function deleteList() {
        let copyData = {...info}
        copyData['estimateRequestDetailList'] = commonManage.getUnCheckList(gridRef.current.api);
        setInfo(copyData);
    }

    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            ...copyUnitInit,
            "currency": commonManage.changeCurr(info['agencyCode'])
        })
        setInfo(copyData)
    }

    function clearAll() {
        setInfo({...infoInit});
    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div>
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
    </div>


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

                        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 0.6fr 1fr 1fr'}>
                            {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                            {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull', disabled: true})}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
                            {inputForm({title: '담당자', id: 'managerAdminName'})}
                            {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                        </TopBoxCard>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr  1.5fr 1.22fr', columnGap: 10}}>
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
                    tableData={info[listType]}
                    listType={'estimateRequestId'}
                    type={'write'}
                    funcButtons={subTableUtil}
                />

            </div>
            <MyComponent/>
        </LayoutComponent>
    </>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {query} = ctx;

    const {estimateRequestId} = query;

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
        const result = await getData.post('estimate/getEstimateRequestDetail', {
            "estimateRequestId": estimateRequestId
        });

        return {
            props: {dataInfo: result?.data?.entity?.estimateRequestDetail}
        }
    }
})