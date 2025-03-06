import React, {useEffect, useRef, useState} from "react";
import {FileSearchOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import {ModalInitList, projectWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import TableGrid from "@/component/tableGrid";
import SearchInfoModal from "@/component/SearchAgencyModal";
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
import {useAppSelector} from "@/utils/common/function/reduxHooks";

import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Select from "antd/lib/select";


const listType = 'projectDetailList'
export default function ProjectUpdate({dataInfo = {projectDetail: [], attachmentFileList: []}, updateKey = {}, getCopyPage = null}) {

    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        getMemberList();
    }, []);

    async function getMemberList() {
        // @ts-ignore
        return await getData.post('admin/getAdminList', {
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v => {
            setMemberList(v.data.entity.adminList)
        })
    }


    const options = memberList.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const groupRef = useRef<any>(null)

    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();
    const userInfo = useAppSelector((state) => state.user);
    const infoInit = dataInfo?.projectDetail
    const infoInitFile = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>({})
    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoInitFile));
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [originFileList, setOriginFileList] = useState(infoInitFile);
    const [loading, setLoading] = useState(false);


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_write');
        return savedSizes ? JSON.parse(savedSizes) : [15, 15, 40, 30]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    function onResizeChange() {
        setSizes(groupRef.current.getLayout())

    }

    const handleMouseUp = () => {
        setSizes(groupRef.current.getLayout())
        localStorage.setItem('project_write', JSON.stringify(groupRef.current.getLayout()));
    };
    useEffect(() => {
        window.addEventListener('pointerup', handleMouseUp);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, []);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
    };

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {projectDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setInfo(projectDetail)
            initInfo(projectDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['project_update']])

    async function getDataInfo() {
        const result = await getData.post('project/getProjectDetail', {
            "projectId": updateKey['project_update'],
            "documentNumberFull": ""
        });
        return result?.data?.entity;
    }

    function initInfo(data) {

        gridManage.resetData(gridRef, data)
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
        gridRef.current.clearFocusedCell();
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


        await updateProject({data: formData, router: router, returnFunc: returnFunc})
    }

    async function returnFunc(e) {
        if (e) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "PROJECT",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": infoInit['projectId']
                }
            }).then(v => {
                window.opener?.postMessage('update', window.location.origin);
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false);
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

        getCopyPage('project_write',copyInfo)
        // router.push(`/project_write?${query}`)
    }

    function clearAll() {
        setInfo(v => {
            return {
                ...projectWriteInitial,
                documentNumberFull: v.documentNumberFull,
                writtenDate: v.writtenDate,
                createdBy: v.createdBy,
                managerAdminName: v.managerAdminName,
                managerAdminId: v?.managerAdminId ? v?.managerAdminId : 0
            }
        });
        gridManage.deleteAll(gridRef)
    }

    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };



    return <Spin spinning={loading} tip={'프로젝트 수정중...'}>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setIsModalOpen={setIsModalOpen}/>

        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '430px' : '65px'} calc(100vh - ${mini ? 560 : 195}px)`,
                columnGap: 5
            }}>

                <MainCard title={'프로젝트 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '복제', func: copyPage, type: 'default'}
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
                                <div>
                                    <div style={{fontSize: 12}}>담당자</div>
                                    <Select style={{width: '100%', fontSize: 12, marginTop: 5}} size={'small'}
                                            showSearch
                                            value={info['managerAdminId']}
                                            placeholder="Select a person"
                                            optionFilterProp="label"
                                            onChange={onCChange}
                                            options={options}
                                    />
                                </div>

                            </TopBoxCard>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProejct')}>
                                        {inputForm({
                                            title: 'Project No.',
                                            id: 'documentNumberFull',
                                            onChange: onChange,
                                            data: info,
                                            disabled: true
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
                                        placeholder: '매입처 담당자 입력 필요',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {datePickerForm({title: '마감일자', id: 'dueDate', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                {inputForm({
                                    title: '고객사명',
                                    id: 'customerName',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('customerName');
                                        }
                                    }/>, onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                })}
                                {inputForm({
                                    title: '고객사 담당자명',
                                    id: 'customerManagerName',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 연락처',
                                    id: 'customerManagerPhone',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 이메일',
                                    id: 'customerManagerEmail',
                                    onChange: onChange,
                                    data: info
                                })}
                            </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={10} maxSize={100} onResize={onResizeChange}>
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
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                     disabled={!userInfo['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     numb={5}/>
                                </div>
                            </BoxCard>
                            </Panel>
                        </PanelGroup>
                    </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={projectWriteColumn}
                    type={'write'}
                    funcButtons={['projectUpload', 'addProjectRow', 'delete', 'print']}
                />
            </div>
        </>
    </Spin>
}