import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import TextArea from "antd/lib/input/TextArea";
import {CopyOutlined, FileSearchOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
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
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {saveRfq} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'estimateRequestDetailList'
export default function rqfWrite() {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const router = useRouter();

    const copyInit = _.cloneDeep(rfqWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)


    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
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
            <DatePicker value={moment(info[id]).isValid() ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={commonManage.disabledDate}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
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
        if (!info[listType].length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData:any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    if(key === 'dueDate'){
                        formData.append(key, moment(value).format('YYYY-MM-DD'));
                    }else{
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
                    if(key === 'replyDate'){
                        formData.append(`${listType}[${index}].${key}`, moment(detail[key]).format('YYYY-MM-DD'));
                    }else{
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                    }
                });
            });
        }

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        await saveRfq({data: formData, router: router})

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
                copyData[listType] = v;
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

                <MainCard title={'견적의뢰 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>




                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                                {inputForm({title: '담당자', id: 'managerAdminName'})}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    disabled: true,
                                    placeholder: ''
                                })}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "150px 200px 1fr 1fr 300px",
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
                                        <DriveUploadComp infoFileInit={[]} fileRef={fileRef}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info[listType]}
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