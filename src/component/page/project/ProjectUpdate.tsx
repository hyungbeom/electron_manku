import React, {useEffect, useRef, useState} from "react";
import {ModalInitList, projectWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {getAttachmentFileList, updateProject} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Select from "antd/lib/select";
import {projectInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import {findCodeInfo} from "@/utils/api/commonApi";
import SearchInfoModal from "@/component/SearchAgencyModal";


const listType = 'projectDetailList'
export default function ProjectUpdate({

                                          updateKey = {},
                                          getCopyPage = null
                                      }) {
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [memberList, setMemberList] = useState([]);
    const [validate, setValidate] = useState({documentNumberFull: true});
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


    const [info, setInfo] = useState<any>(projectWriteInitial)
    const [fileList, setFileList] = useState([]);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [originFileList, setOriginFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);

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


    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {projectDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setOriginFileList(attachmentFileList)
            setInfo(projectDetail);
            projectDetail[listType] = [...projectDetail[listType], ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 100 - projectDetail[listType].length)]
            setTableData(projectDetail[listType]);

            setLoading(false)
        })
    }, [updateKey['project_update']])


    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);



    async function getDataInfo() {
        const result = await getData.post('project/getProjectDetail', {
            "projectId": updateKey['project_update'],
            "documentNumberFull": ""
        });
        return result?.data?.entity;
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



    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, projectWriteInitial);

        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        if (!infoData['documentNumberFull']) {
            const dom = infoRef.current.querySelector('#documentNumberFull');
            dom.style.borderColor = 'red'
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }

        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
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
                    "relatedId": updateKey['project_update']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                // setOriginFileList(list)
                setLoading(false);
            })
        } else {
            setLoading(false)
        }
    }

    function copyPage() {

        const totalList = tableRef.current.getSourceData();
        totalList.pop();

        console.log(totalList, 'totalList:')


        const result = Object.keys(projectWriteInitial).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }


        copyInfo['managerAdminId'] = info['managerAdminId'];
        const findMember = memberList.find(v => v.adminId === info['managerAdminId']);
        copyInfo['managerAdminName'] = findMember['name'];

        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 100 - totalList.length)];

        getCopyPage('project_write', copyInfo)
    }

    function clearAll() {
        // setInfo(v => {
        //     return {
        //         ...projectWriteInitial,
        //         documentNumberFull: v.documentNumberFull,
        //         writtenDate: v.writtenDate,
        //         createdBy: v.createdBy,
        //         managerAdminName: v.managerAdminName,
        //         managerAdminId: v?.managerAdminId ? v?.managerAdminId : 0
        //     }
        // });
        // gridManage.deleteAll(gridRef)
    }

    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };

    return <Spin spinning={loading}>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>

        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '450px' : '65px'} calc(100vh - ${mini ? 560 : 195}px)`,
                rowGap: 10,
                columnGap: 5
            }}>
                <MainCard title={'프로젝트 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '복제', func: copyPage, type: 'default'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={''} grid={'150px 150px 150px'}>
                                {inputForm({
                                    title: '작성자',
                                    id: 'createdBy',
                                    disabled: true,
                                })}
                                {datePickerForm({
                                    title: '작성일자',
                                    id: 'writtenDate',
                                    disabled: true
                                })}
                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                    <select name="languages" id="managerAdminId"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        {
                                            options.map(v => {
                                                return <option value={v.value}>{v.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </TopBoxCard>


                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 5}}>
                                <Panel defaultSize={sizes[0]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                        {inputForm({
                                            title: 'PROJECT NO.',
                                            id: 'documentNumberFull',
                                            placeholder: '필수입력',
                                            defaultValue: info['documentNumberFull'],
                                            validate: validate['documentNumberFull']
                                        })}
                                        {inputForm({
                                            title: '프로젝트 제목',
                                            id: 'projectTitle',
                                            defaultValue: info['projectTitle']

                                        })}
                                        {datePickerForm({title: '마감일자', id: 'dueDate'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={10} maxSize={100}>
                                    <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                        {inputForm({
                                            title: '고객사명',
                                            id: 'customerName',


                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('customerName');
                                                }
                                            }>🔍</span>, handleKeyPress: handleKeyPress
                                        })}
                                        {inputForm({
                                            title: '고객사 담당자명',
                                            id: 'customerManagerName',

                                        })}
                                        {inputForm({
                                            title: '담당자 전화번호',
                                            id: 'customerManagerPhone',

                                        })}
                                        {/*{inputForm({*/}
                                        {/*    title: '담당자 전화번호',*/}
                                        {/*    id: 'customerManagerPhone',*/}
                                        {/*    defaultValue: info['customerManagerPhone'],*/}
                                        {/*})}*/}
                                        {inputForm({
                                            title: '담당자 이메일',
                                            id: 'customerManagerEmail'
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={25} maxSize={100}>
                                    <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                                        {textAreaForm({
                                            title: '비고란',
                                            rows: 2,
                                            id: 'remarks',
                                            defaultValue: info['remarks'],
                                        })}
                                        {textAreaForm({
                                            title: '지시사항',
                                            rows: 2,
                                            id: 'instructions',
                                            defaultValue: info['instructions'],
                                        })}
                                        {textAreaForm({
                                            title: '특이사항',
                                            rows: 2,
                                            id: 'specialNotes',
                                            defaultValue: info['specialNotes'],
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={15} maxSize={100}>
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

                <Table data={tableData} column={projectInfo['write']} funcButtons={['print']} ref={tableRef}/>
                {/*<TableGrid*/}
                {/*    gridRef={gridRef}*/}
                {/*    onGridReady={onGridReady}*/}
                {/*    columns={projectWriteColumn}*/}
                {/*    type={'write'}*/}
                {/*    funcButtons={['projectUpload', 'addProjectRow', 'delete', 'print']}*/}
                {
                    /*/>*/}
            </div>
        </>
    </Spin>
}