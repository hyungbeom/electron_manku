import React, {memo, useEffect, useRef, useState} from "react";
import {ModalInitList, projectWriteInitial} from "@/utils/initialList";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {getData} from "@/manage/function/api";
import Table from "@/component/util/Table";
import {projectInfo} from "@/utils/column/ProjectInfo";
import message from "antd/lib/message";
import {saveProject} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";


const listType = 'projectDetailList'

function ProjectWrite({copyPageInfo = {}}) {

    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        getMemberList();
    }, []);

    async function getMemberList() {
        // @ts-ignore
        await getData.post('admin/getAdminList', {
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

    const router = useRouter();

    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)


    const fileRef = useRef(null);
    const tableRef = useRef(null);
    const copyInit = _.cloneDeep(projectWriteInitial)

    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminName: userInfo['name'],
        writtenDate: moment().format('YYYY-MM-DD'),
    }

    const infoInit = {
        ...copyInit,
        ...adminParams,
        writtenDate: moment().format('YYYY-MM-DD')
    }

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);


    const [tableData, setTableData] = useState([]);
    const [info, setInfo] = useState(infoInit);


    useEffect(() => {

        if (!isEmptyObj(copyPageInfo['project_write'])) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 100))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({...copyPageInfo['project_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')});
            setTableData(copyPageInfo['project_write'][listType])
        }
    }, [copyPageInfo['project_write']]);


    useEffect(() => {
        commonManage.setInfo(infoRef, info, userInfo['adminId']);
    }, [info, memberList]);

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
        let infoData = commonManage.getInfo(infoRef, infoInit);


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
        formData.delete('createdDate')
        formData.delete('modifiedDate')
        await saveProject({data: formData, router: router, returnFunc: returnFunc})
    }

    function returnFunc(e) {
        if (e === -20001) {
            const dom = infoRef.current.querySelector('#documentNumberFull');
            dom.style.borderColor = 'red'
        }
        setLoading(false)
    }


    function clearAll() {
        // info 데이터 초기화
        commonManage.setInfo(infoRef, projectInfo['defaultInfo'], userInfo['adminId']);
        setTableData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 100))
    }

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_write');
        return savedSizes ? JSON.parse(savedSizes) : [15, 15, 40, 30]; // 기본값 [50, 50, 50]
    };

    function onResizeChange() {
        setSizes(groupRef.current.getLayout())
    }

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    function onChange(e) {
        if (e.target.id === 'documentNumberFull') {
            e.target.style.borderColor = ''
        }
    }

    return <Spin spinning={loading} tip={'프로젝트 등록중...'}>
        <PanelSizeUtil groupRef={groupRef} setSizes={setSizes} storage={'project_write'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '450px' : '65px'} calc(100vh - ${mini ? 560 : 195}px)`,
            rowGap: 10,
            columnGap: 5
        }}>
            <MainCard title={'프로젝트 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>
                        <TopBoxCard title={''} grid={'130px 130px 130px'}>
                            {inputForm({
                                title: '작성자',
                                id: 'createdBy',
                                disabled: true,
                            })}
                            {datePickerForm({
                                title: '작성일자',
                                id: 'writtenDate',
                                disabled: true,
                            })}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                <select name="languages" id="managerAdminId"
                                        style={{
                                            outline: 'none',
                                            border: '1px solid lightGray',
                                            height: 22,
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
                                        onChange: onChange
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
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
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'customerManagerEmail',
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
                                    })}
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 2,
                                        id: 'instructions',
                                    })}
                                    {textAreaForm({
                                        title: '특이사항',
                                        rows: 2,
                                        id: 'specialNotes',
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
        </div>
    </Spin>
}


export default memo(ProjectWrite)