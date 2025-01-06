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
    UpCircleFilled,
    UploadOutlined
} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateRequestDetailUnit, ModalInitList, rfqWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Upload from "antd/lib/upload";
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveRfq} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";


export default function rqfWrite() {
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(rfqWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        adminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);


    // =============================================================================================================
    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {

        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
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
            <TextArea style={{resize: 'none'}} rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}
                      showCount
                      maxLength={1000}
            />
        </div>
    }


    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={commonManage.disabledDate}
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


    // ======================================================================================================
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

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        let bowl = {};
        bowl[e.target.id] = e.target.value;
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }

        const copyData = {...info}

        const changeTime = gridRef.current.props.context.map(v => {
            return {...v, replyDate: moment(v['replyDate']).format('YYYY-MM-DD')}
        })

        copyData['estimateRequestDetailList'] = changeTime
        await saveRfq({data: copyData, router: router})


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
     * @description 업로드 속성설정 property 세팅
     */
    const uploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.toLowerCase().endsWith('.xlsx') ||
                file.name.toLowerCase().endsWith('.xls');

            if (!isExcel) {
                message.error('엑셀 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
            }

            commonManage.excelFileRead(file).then(v => {
                let copyData = {...info}
                copyData['estimateRequestDetailList'] = v;
                setInfo(copyData);
            })
            return false;
        },
    };


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
        {/*@ts-ignore*/}
        <Upload {...uploadProps} size={'small'} style={{marginLeft: 5}} showUploadList={false}>
            <Button icon={<UploadOutlined/>} size={'small'}>엑셀 업로드</Button>
        </Upload>
        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{marginLeft: 5,}} onClick={deleteList}>
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
                {/*@ts-ignore*/}
                <SearchInfoModal type={'agencyList'} info={info} setInfo={setInfo}
                                 open={isModalOpen}
                                 setIsModalOpen={setIsModalOpen}/>

                <Card size={'small'} title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적의뢰 작성</div>
                    <div>
                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}
                        ><SaveOutlined/>저장</Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                onClick={clearAll}><RetweetOutlined/>초기화</Button>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}}
                                   onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>


                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                                {inputForm({title: '담당자', id: 'managerAdminName'})}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    disabled: true,
                                    placeholder: '[매입처코드-년도-일련번호]'
                                })}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "150px 200px 1fr 1fr ",
                                gap: 10,
                                marginTop: 10
                            }}>
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
                                    {inputForm({title: '매입처담당자', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
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
                        </div>
                        : <></>}
                </Card>

                <TableGrid
                    list={'estimateRequestDetailList'}
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info['estimateRequestDetailList']}
                    listType={'estimateRequestId'}
                    type={'write'}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));

})