import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, FileSearchOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import {ModalInitList, projectDetailUnit} from "@/utils/initialList";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Upload from "antd/lib/upload";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {updateProject} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import moment from "moment";

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
        const list = gridManage.getAllData(gridRef);

        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData)



        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachmentIdList[${idx}]`, v.id);
        })
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateProject({data: formData, router: router})
    }


    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }

    function addRow() {
        const newRow = {...copyUnitInit};
        gridRef.current.applyTransaction({add: [newRow]});

    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList
        copyInfo['writtenDate'] = moment().format('YYYY-MM-DD')

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/project_write?${query}`)
    }

    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
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
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 555 : 120}px)`,
                columnGap: 5
            }}>

                <MainCard title={'프로젝트 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard>
                                {inputForm({
                                    title: '작성자',
                                    id: 'createdBy',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {datePickerForm({
                                    title: '작성일자',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "200px 250px 1fr 300px ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'프로젝트 정보'}>
                                    {inputForm({
                                        title: 'PROJECT NO.',
                                        id: 'documentNumberFull',
                                        onChange: onChange,
                                        data: info,
                                        disabled : true
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
                                        placeholder: '매입처 당담자 입력 필요',
                                        onChange: onChange,
                                        data: info
                                    })}
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
                                        }/>, onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                    })}
                                    {inputForm({
                                        title: '거래처 담당자명',
                                        id: 'customerManagerName',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 전화번호',
                                        id: 'customerManagerPhone',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'customerManagerEmail',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>

                                <BoxCard title={'기타 정보'}>

                                    {textAreaForm({title: '비고란', rows: 2, id: 'remarks', onChange: onChange, data: info})}
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 2,
                                        id: 'instructions',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '특이사항',
                                        rows: 2,
                                        id: 'specialNotes',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef} numb={5}/>
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