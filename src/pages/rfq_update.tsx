import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import TextArea from "antd/lib/input/TextArea";
import {CopyOutlined, FileSearchOutlined, SaveOutlined} from "@ant-design/icons";
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
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {updateRfq} from "@/utils/api/mainApi";
import {estimateRequestDetailUnit} from "@/utils/initialList";
import _ from "lodash";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";

const listType = 'estimateRequestDetailList'
export default function rqfUpdate({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)

    const infoInit = dataInfo?.estimateRequestDetail
    const infoFileInit = dataInfo?.attachmentFileList


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
            <DatePicker value={moment(info[id]).isValid() ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
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
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        if (!info[listType].length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    if (key === 'dueDate') {
                        formData.append(key, moment(value).format('YYYY-MM-DD'));
                    } else {
                        formData.append(key, value);
                    }
                }
            }
        };

        handleIteration();

        const copyData = {...info}


        if (copyData[listType].length) {
            copyData[listType].forEach((detail, index) => {
                Object.keys(detail).forEach((key) => {
                    if (key === 'replyDate') {
                        formData.append(`${listType}[${index}].${key}`, moment(detail[key]).format('YYYY-MM-DD'));
                    } else {
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                    }
                });
            });
        }

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);

        //새로 추가되는 파일
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachementIdList[${idx}]`, v.id);
        })


        for (const [key, value] of formData.entries()) {
            console.log(`Key: ${key}, Value: ${value}:::::::::`);
        }

        await updateRfq({data: formData, router: router})
    }

    function deleteList() {
        let copyData = {...info}
        copyData[listType] = commonManage.getUnCheckList(gridRef.current.api);
        setInfo(copyData);
    }

    function addRow() {
        let copyData = {...info};
        copyData[listType].push({
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

        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <MainCard title={'견적의뢰 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 0.6fr 1fr 1fr'}>
                            {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                            {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull', disabled: true})}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
                            {inputForm({title: '담당자', id: 'managerAdminName'})}
                            {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                        </TopBoxCard>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: "150px 200px 1fr 1fr 300px",
                            columnGap: 10
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
                                {inputForm({title: '매입처명', id: 'agencyName', disabled : true})}
                                {inputForm({title: '매입처담당자', id: 'agencyManagerName', disabled : true})}
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
                            <BoxCard title={'드라이브 목록'}>
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info[listType]}
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

    if (codeInfo < 0) {
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
            props: {dataInfo: result?.data?.entity}
        }
    }
})