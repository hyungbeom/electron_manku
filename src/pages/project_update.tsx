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
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage, fileManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {getAttachmentFileList, updateProject} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import moment from "moment";
import Spin from "antd/lib/spin";

const listType = 'projectDetailList'
export default function projectUpdate({dataInfo}) {
    console.log(dataInfo, 'dataInfo:')
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const [validate, setValidate] = useState({agencyCode: true, documentNumberFull: true});
    const infoInit = dataInfo?.projectDetail
    const infoInitFile = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoInitFile));
    const [originFileList, setOriginFileList] = useState(infoInitFile);
    const [loading, setLoading] = useState(false);

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

        setLoading(true)
        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData)
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateProject({data: formData, router: router, returnFunc:returnFunc})
    }

    async function returnFunc(e) {
        if (e) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "PROJECT",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": infoInit['projectId']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList
        copyInfo['writtenDate'] = moment().format('YYYY-MM-DD')

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/project_write?${query}`)
    }


    return <Spin spinning={loading} tip={'프로젝트 수정중...'}>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setValidate={setValidate}
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
                                <BoxCard title={'프로젝트 정보'}  tooltip={tooltipInfo('readProejct')}>
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
                                <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
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

                                <BoxCard title={'ETC'} tooltip={tooltipInfo('etc')}>

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
                                <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList}  fileRef={fileRef} numb={5}/>
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
                    funcButtons={['projectUpload','addProjectRow', 'delete', 'print']}
                />
            </div>
        </LayoutComponent>
    </Spin>
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