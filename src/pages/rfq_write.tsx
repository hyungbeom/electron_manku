import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, FileSearchOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
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
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {saveRfq} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'estimateRequestDetailList'
export default function rqfWrite({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(rfqWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)


    const userInfo = useAppSelector((state) => state.user);

    console.log(dataInfo,'dataInfo:')

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.estimateRequestDetailList;
        params.api.applyTransaction({add: result ? result : []});
    };

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
        if (!info['documentNumberFull']) {
            return message.warn('INQUIRY NO.가 누락되었습니다.')
        }
        const list = gridManage.getAllData(gridRef);
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData: any = new FormData();

        console.log(info,'info::::')
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


        if (list.length) {
            list.forEach((detail, index) => {
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
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        formData.delete('createdDate');
        formData.delete('modifiedDate');

        await saveRfq({data: formData, router: router})

    }


    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }

    function addRow() {
        const newRow = {...copyUnitInit};
        newRow['currency'] = commonManage.changeCurr(info['agencyCode'])
        gridRef.current.applyTransaction({add: [newRow]});
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
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '520px' : '65px'} calc(100vh - ${mini ? 575 : 120}px)`,
                columnGap: 5
            }}>

                <MainCard title={'견적의뢰 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: '작성자', id: 'adminName', disabled: true, onChange: onChange, data: info})}
                                {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    placeholder: '',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo', onChange: onChange, data: info})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
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
                                        }/>, onChange: onChange, handleKeyPress : handleKeyPress, data: info
                                    })}
                                    {inputForm({
                                        title: '매입처명',
                                        id: 'agencyName',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '매입처담당자',
                                        id: 'agencyManagerName',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {datePickerForm({title: '마감일자(예상)', id: 'dueDate', onChange: onChange, data: info})}
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
                                        }/>, onChange: onChange, handleKeyPress : handleKeyPress, data: info
                                    })}
                                    {inputForm({title: '담당자명', id: 'managerName', onChange: onChange, data: info})}
                                    {inputForm({title: '전화번호', id: 'phoneNumber', onChange: onChange, data: info})}
                                    {inputForm({title: '팩스', id: 'faxNumber', onChange: onChange, data: info})}
                                    {inputForm({title: '이메일', id: 'customerManagerEmail', onChange: onChange, data: info})}
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
                                        }/>, onChange: onChange, handleKeyPress : handleKeyPress, data: info
                                    })}
                                    {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                    {textAreaForm({title: '지시사항', id: 'instructions', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: 'End User', id: 'endUser', onChange: onChange, data: info})}
                                    {textAreaForm({title: '비고란', rows: 7, id: 'remarks', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'}>
                                    {/*@ts-ignored*/}
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
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;
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
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }
})