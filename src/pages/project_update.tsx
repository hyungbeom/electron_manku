import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import TextArea from "antd/lib/input/TextArea";
import {CopyOutlined, FileSearchOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {ModalInitList, projectDetailUnit} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Upload, {UploadProps} from "antd/lib/upload";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {updateProject} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";

const listType = 'projectDetailList'
export default function projectUpdate({dataInfo}) {
    console.log(dataInfo, 'dataInfo:')
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyUnitInit = _.cloneDeep(projectDetailUnit)

    const infoInit = dataInfo?.projectDetail
    const infoFileInit = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.projectDetail[listType]});
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
        if (!info['documentNumberFull']) {
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }
        const tableList = gridManage.getAllData(gridRef);

        if (!tableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    formData.append(key, value);
                }
            }
        };

        handleIteration();
        tableList.forEach((detail, index) => {
            Object.keys(detail).forEach((key) => {
                formData.append(`${listType}[${index}].${key}`, detail[key]);
            });
        });

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachmentIdList[${idx}]`, v.id);
        })
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        await updateProject({data: formData, router: router})
    }


    function deleteList() {
        let copyData = {...info}
        copyData[listType] = commonManage.getUnCheckList(gridRef.current.api);
        setInfo(copyData);
    }

    function addRow() {
        // 새로운 행 데이터 생성
        const newRow = {...copyUnitInit};

        // ag-Grid API를 사용하여 데이터 추가
        gridRef.current.api.applyTransaction({add: [newRow]});

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


    const props: UploadProps = {
        name: 'file',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
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
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>

                <MainCard title={'프로젝트 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr'}>

                                {inputForm({title: '작성자', id: 'managerAdminName', disabled: true, onChange: onChange, data: info})}
                                {datePickerForm({title: '작성일자', id: 'writtenDate', disabled: true, onChange: onChange, data: info})}
                                {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "200px 250px 1fr 300px ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'프로젝트 정보'}>
                                    {inputForm({title: 'PROJECT NO.', id: 'documentNumberFull', onChange: onChange, data: info})}
                                    {inputForm({title: '프로젝트 제목', id: 'projectTitle', placeholder: '매입처 당담자 입력 필요', onChange: onChange, data: info})}
                                    {datePickerForm({title: '마감일자', id: 'dueDate', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'거래처 정보'}>
                                    {inputForm({
                                        title: '거래처명',
                                        id: 'customerName',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('customerName');
                                            }
                                        }/>, onChange: onChange, data: info
                                    })}
                                    {inputForm({title: '거래처 담당자명', id: 'customerManagerName', disabled: true, onChange: onChange, data: info})}
                                    {inputForm({title: '담당자 전화번호', id: 'customerManagerPhone', disabled: true, onChange: onChange, data: info})}
                                    {inputForm({title: '담당자 이메일', id: 'customerManagerEmail', disabled: true, onChange: onChange, data: info})}
                                </BoxCard>

                                <BoxCard title={'기타 정보'}>

                                    {textAreaForm({title: '비고란', rows: 3, id: 'remarks', onChange: onChange, data: info})}
                                    {textAreaForm({title: '지시사항', rows: 3, id: 'instructions', onChange: onChange, data: info})}
                                    {textAreaForm({title: '특이사항', rows: 3, id: 'specialNotes', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={projectWriteColumn}
                    type={'write'}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {projectId} = ctx.query;

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
        const result = await getData.post('project/getProjectDetail', {
            "projectId": projectId,
            "documentNumberFull": ""
        });

        const dataInfo = result?.data?.entity;
        return {
            props: {dataInfo: dataInfo ? dataInfo : null}
        }
    }
})