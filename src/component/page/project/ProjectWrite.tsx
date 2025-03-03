import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {FileSearchOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import {ModalInitList, projectDetailUnit, projectWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveProject} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Select from "antd/lib/select";
import {getData} from "@/manage/function/api";
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment";


const listType = 'projectDetailList'
export default function ProjectWrite({managerList = [], copyPageInfo = {}}) {


    const router = useRouter();


    const groupRef = useRef<any>(null)

    const options = managerList.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(projectWriteInitial)
    const copyUnitInit = _.cloneDeep(projectDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createBy: userInfo['name'],
        managerAdminName: userInfo['name'],
        writtenDate: moment().format('YYYY-MM-DD'),
    }

    const infoInit = {
        ...copyInit,
        ...adminParams
    }


    const [info, setInfo] = useState<any>({...copyInit, ...adminParams})
    const [validate, setValidate] = useState({documentNumberFull: true});

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (copyPageInfo['project_write']) {
            setInfo({...copyInit, ...copyPageInfo['project_write'], ...adminParams})
            if (gridRef.current?.forEachNode) {
                gridManage.resetData(gridRef, copyPageInfo['project_write'][listType])
            }
        }
    }, [copyPageInfo]);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        const copyData = _.cloneDeep(info);
        delete copyData?.createdDate;
        delete copyData?.modifiedDate;
        const result = copyData?.projectDetailList;

        params.api.applyTransaction({add: copyPageInfo['project_write'][listType] ? copyPageInfo['project_write'][listType] : commonFunc.repeatObject(projectDetailUnit, 30)});
    };


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
        if (e.target.id === 'documentNumberFull') {
            setValidate(v => {
                return {...v, documentNumberFull: true}
            })
        }
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        if (!info['documentNumberFull']) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }
        const list = gridManage.getAllData(gridRef);

        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData);


        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await saveProject({data: formData, router: router, returnFunc: returnFunc})
    }

    function returnFunc(e) {
        if (e === -20001) {
            setValidate(v => {
                return {documentNumberFull: false}
            })
        }
        window.opener?.postMessage('write', window.location.origin);
        setLoading(false)

    }

    function clearAll() {

        setLoading(false)
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }


    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };


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

    }, [sizes]); // 크기 변경 시마다 localStorage에 저장


    // 컴포넌트가 마운트될 때, 전역 마우스 업 이벤트를 추가
    useEffect(() => {
        window.addEventListener('pointerup', handleMouseUp);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, []);

    return <Spin spinning={loading} tip={'프로젝트 등록중...'}>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setValidate={setValidate}
                         setIsModalOpen={setIsModalOpen}/>

        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '470px' : '65px'} calc(100vh - ${mini ? 600 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'프로젝트 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>
                        <TopBoxCard title={''} grid={'1fr 1fr 1fr 1fr'}>
                            {inputForm({
                                title: '작성자',
                                id: 'createBy',
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
                                <div>담당자</div>
                                <Select style={{width: '100%'}} size={'small'}
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
                                <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'PROJECT NO.',
                                        id: 'documentNumberFull',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['documentNumberFull']
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
                            <Panel defaultSize={sizes[1]} minSize={10} maxSize={100}>
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
                                        title: '담당자 전화번호',
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
                            <Panel defaultSize={sizes[2]} minSize={25} maxSize={100}>
                                <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                                    {textAreaForm({
                                        title: '비고란',
                                        rows: 2,
                                        id: 'remarks',
                                        onChange: onChange,
                                        data: info
                                    })}
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

            <TableGrid
                gridRef={gridRef}
                columns={projectWriteColumn}
                onGridReady={onGridReady}
                type={'write'}
                funcButtons={['projectUpload', 'addProjectRow', 'delete', 'print']}
            />

        </div>
    </Spin>
}

