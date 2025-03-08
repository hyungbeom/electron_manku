import React, {memo, useEffect, useRef, useState} from "react";
import {ModalInitList, projectDetailUnit, projectWriteInitial} from "@/utils/initialList";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Select from "antd/lib/select";
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


const listType = 'projectDetailList'

function ProjectWrite({managerList = [], copyPageInfo = {}}) {

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

    const router = useRouter();


    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)


    const fileRef = useRef(null);
    const tableRef = useRef(null);
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
        ...adminParams,
        writtenDate: moment().format('YYYY-MM-DD')
    }


    // const [info, setInfo] = useState<any>(infoInit)
    const [validate, setValidate] = useState({documentNumberFull: true});

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);


    const [tableData, setTableData] = useState([]);
    const [info, setInfo] = useState(infoInit);


    useEffect(() => {
        if (copyPageInfo['project_write'] && !isEmptyObj(copyPageInfo['project_write'])) {
            setTableData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 100))
        } else {
            console.log({...copyPageInfo['project_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')},'{...copyPageInfo[\'project_write\'], ...adminParams, writtenDate: moment().format(\'YYYY-MM-DD\')}:')
            setInfo({...copyPageInfo['project_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')});
            setTableData(copyPageInfo['project_write'][listType])
        }

    }, [copyPageInfo['project_write']]);

    // const onGridReady = (params) => {
    //
    //     gridRef.current = params.api;
    //     setInfo(isEmptyObj(copyPageInfo['project_write'])?copyPageInfo['project_write'] : infoInit);
    //     params.api.applyTransaction({add: copyPageInfo['project_write'][listType] ? copyPageInfo['project_write'][listType] : commonFunc.repeatObject(projectDetailUnit, 10)});
    //     setReady(true)
    // };

    // useEffect(() => {
    //     if(ready) {
    //         if(copyPageInfo['project_write'] && !isEmptyObj(copyPageInfo['project_write'])){
    //             setInfo(infoInit);
    //             gridManage.resetData(gridRef,commonFunc.repeatObject(projectDetailUnit, 10))
    //         }else{
    //             setInfo({...copyPageInfo['project_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')});
    //             gridManage.resetData(gridRef, copyPageInfo['project_write'][listType])
    //         }
    //     }
    // }, [copyPageInfo['project_write']]);

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

    function onChange(e: any) {
        commonManage.onChange(e, setInfo)
    }

    const filterEmptyObjects = (data, excludeFields = []) => {
        if (data.length === 0) return [];

        return data.slice(0, -1).filter((obj) => {
            // ✅ excludeFields의 모든 필드가 '' 또는 null 또는 undefined이면 제거
            const isEmpty = excludeFields.every(field =>
                obj[field] === '' || obj[field] === null || obj[field] === undefined
            );

            return !isEmpty; // 값이 하나라도 있으면 유지
        });
    };

    async function saveFunc() {

        const result = Object.keys(infoInit).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let bowl = {}
        for (let element of elements) {
            bowl[element.id] = element.value
        }
        // console.log(bowl,'bowl')
        bowl['managerAdminId'] = info['managerAdminId'];
       const findMember = memberList.find(v=> v.adminId === info['managerAdminId']);
       console.log(findMember,'ss')
        bowl['managerAdminName'] = findMember['name'];


        const hotInstance = tableRef.current?.hotInstance;
        const rawData = hotInstance?.getData(); // 이중 배열 형태
        const formattedData = rawData.map(row => {
            return Object.keys(projectInfo['write']['defaultData']).reduce((acc, key, index) => {
                acc[key] = row[index] || "";
                return acc;
            }, {});
        });
        const list = filterEmptyObjects(formattedData, ['model', 'item', 'maker'])

        if (!bowl['documentNumberFull']) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }


        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(bowl, formData, listType, list)
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
        setLoading(false)

    }

    function clearAll() {

        // setLoading(false)
        // setInfo({...infoInit});
        // gridManage.resetData(gridRef, commonFunc.repeatObject(projectDetailUnit, 10))
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

    function onResizeChange() {
        setSizes(groupRef.current.getLayout())
    }

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    console.log(info['createBy'], 'info[\'createBy\']:')
    return <Spin spinning={loading} tip={'프로젝트 등록중...'}>
        <PanelSizeUtil groupRef={groupRef} setSizes={setSizes} storage={'project_write'}/>
        {/*<SearchInfoModal info={info} setInfo={setInfo}*/}
        {/*                 open={isModalOpen}*/}

        {/*                 setValidate={setValidate}*/}
        {/*                 setIsModalOpen={setIsModalOpen}/>*/}

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
                        <TopBoxCard title={''} grid={'150px 150px 150px'}>
                            {inputForm({
                                title: '작성자',
                                id: 'createBy',
                                disabled: true,
                                defaultValue: info['createBy']
                            })}
                            {datePickerForm({
                                title: '작성일자',
                                id: 'writtenDate',
                                disabled: true,
                                defaultValue: info['writtenDate']
                            })}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700}}>담당자</div>
                                <Select id={'managerAdminId'} style={{width: '100%', fontSize: 12, marginTop: 5}}
                                        size={'small'}
                                        showSearch
                                        value={info['managerAdminId']}
                                        placeholder="Select a person"
                                        optionFilterProp="label"
                                        onChange={onCChange}
                                        options={options}
                                />
                            </div>

                        </TopBoxCard>


                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 5}}>
                            <Panel defaultSize={sizes[0]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'PROJECT NO.🔴',
                                        id: 'documentNumberFull',
                                        placeholder: '필수입력',
                                        defaultValue: info['documentNumberFull']
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
                                        defaultValue: info['projectTitle']

                                    })}
                                    {datePickerForm({title: '마감일자', id: 'dueDate', defaultValue: info['dueDate']})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={10} maxSize={100}>
                                <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'customerName',
                                        defaultValue: info['customerName'],

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
                                        defaultValue: info['customerManagerName']

                                    })}
                                    {inputForm({
                                        title: '담당자 전화번호',
                                        id: 'customerManagerPhone',
                                        defaultValue: info['customerManagerPhone'],
                                    })}
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'customerManagerEmail',
                                        defaultValue: info['customerManagerEmail'],
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
        </div>
    </Spin>
}


export default memo(ProjectWrite)