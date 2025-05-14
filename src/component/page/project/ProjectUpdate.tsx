import React, {memo, useEffect, useRef, useState} from "react";
import {ModalInitList, projectWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    tooltipInfo,
    TopBoxCard
} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {getAttachmentFileList, updateProject} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import 'react-splitter-layout/lib/index.css';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {estimateInfo, projectInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import {findCodeInfo} from "@/utils/api/commonApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import moment from "moment/moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {CopyOutlined, DeleteOutlined, FormOutlined, RadiusSettingOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";
import _ from "lodash";
import Modal from "antd/lib/modal/Modal";
import Button from "antd/lib/button";
import EstimatePaper from "@/component/견적서/EstimatePaper";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";

const listType = 'projectDetailList'

function ProjectUpdate({
                                          updateKey = {},
                                          getCopyPage = null,
                                          getPropertyId = null,
                                          layoutRef
                                      }:any) {
    const notificationAlert = useNotificationAlert();
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const groupRef = useRef<any>(null)
    const fileRef = useRef(null);
    const pdfRef = useRef(null);
    const pdfSubRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

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

    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const userInfo = useAppSelector((state) => state.user.userInfo);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminName: userInfo['name'],
        writtenDate: moment().format('YYYY-MM-DD'),
    }
    const getProjectInit = () => {
        const copyInit = _.cloneDeep(projectInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState(getProjectInit());
    const getProjectValidateInit = () => _.cloneDeep(projectInfo['write']['validate']);
    const [validate, setValidate] = useState(getProjectValidateInit());

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getProjectValidateInit());
        setInfo(getProjectInit());
        setFileList([]);
        setOriginFileList([]);
        setTableData([]);
        getDataInfo().then(v => {
            const {projectDetail, attachmentFileList} = v;

            setInfo({
                ...getProjectInit(),
                ...projectDetail,
                managerAdminId: projectDetail['managerAdminId'] ? projectDetail['managerAdminId'] : '',
                managerAdminName: projectDetail['managerAdminName'] ? projectDetail['managerAdminName'] : '',
                createdBy: userInfo['name']
            });
            setFileList(fileManage.getFormatFiles(attachmentFileList))
            setOriginFileList(attachmentFileList)
            projectDetail[listType] = [...projectDetail[listType], ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000 - projectDetail[listType].length)];
            setTableData(projectDetail[listType]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['project_update']])

    async function getDataInfo() {
        const result = await getData.post('project/getProjectDetail', {
            "projectId": updateKey['project_update'],
            "documentNumberFull": ""
        });
        return result?.data?.entity;
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, infoRef)
                    break;
            }
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        // 값 입력되면 유효성 초기화
        const { id, value } = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if(activeTab?.renderedName === '프로젝트 수정'){
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 수정 페이지 > 수정 버튼
     * 프로젝트 > 프로젝트 수정
     */
    async function saveFunc() {


        if (!commonManage.checkValidate(info, projectInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v=> !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }
        // const resultFilterTableList =  filterTableList.map(v=>{
        //     delete v.total;
        //     delete v.totalPurchase;
        //     return {
        //         ...v, unitPrice : isNaN(v.unitPrice) ? '' : v.unitPrice,  net : isNaN(v.net) ? '' : v.net
        //     }
        //
        // })
        //
        // if (!resultFilterTableList.length) {
        //     return message.warn('하위 데이터 1개 이상이여야 합니다');
        // }

        setLoading(true);

        const findMember = memberList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];
        info['projectId'] = updateKey['project_update']

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateProject({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false);
    }

    async function returnFunc(code, msg) {
        if (code === 1) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "PROJECT",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": updateKey['project_update']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(v)

                window.postMessage({message: 'reload', target: 'project_read'}, window.location.origin);
                notificationAlert('success', '💾 프로젝트 수정완료',
                    <>
                        <div>Project No. : {info.documentNumberFull}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('project_update', updateKey['project_update'])
                    },
                    {cursor: 'pointer'}
                )
            })
        } else {
            notificationAlert('error', '⚠️ 작업실패',
                <>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    alert('작업 로그 페이지 참고')
                },
                {cursor: 'pointer'}
            )
        }
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 프로젝트 > 프로젝트 수정
     */
    function deleteFunc(){
        getData.post('project/deleteProject',{projectId : updateKey['project_update']}).then(v=>{
            const {code, message} = v.data;
            if(code === 1){
                window.postMessage({message: 'reload', target: 'project_read'}, window.location.origin);
                notificationAlert('success', '🗑 프로젝트 삭제완료',
                    <>
                        <div>Project No. : {info.documentNumberFull}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('project_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'project_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        console.log(v?.data?.message);
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 초기화 버튼
     * 프로젝트 > 프로젝트 수정
     */
    function clearAll() {
        setLoading(true);
        setInfo(getProjectInit());
        setValidate(projectInfo['write']['validate']);

        function calcData(sourceData) {
            const keyOrder = Object.keys(projectInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(projectInfo['write']['excelExpert'])
                .concat(projectInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }

        // tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000)));
        setTableData(calcData(commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000)))
        setFileList([]);
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 프로젝트 > 프로젝트 수정
     */
    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        copyInfo['documentNumberFull'] = '';
        copyInfo['folderId'] = '';
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 1000 - totalList.length)];

        getCopyPage('project_write', { ...copyInfo, _meta: {updateKey: Date.now()}})
    }

    async function printEstimate() {
        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])


        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if (!infoData['managerAdminId']) {
            return message.warn('담당자를 선택해주세요')
        }
        setIsPrintModalOpen(true)
    }

    function EstimateModal() {
        return <Modal
            title={<div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 30px'}}>
                <span>견적서 출력</span>
                <span>
                       <Button style={{fontSize: 11, marginRight: 10}} size={'small'}
                               onClick={() => generatePDF(false)}>다운로드</Button>
                       <Button style={{fontSize: 11}} size={'small'} onClick={() => generatePDF(true)}>인쇄</Button>
                </span>
            </div>}
            onCancel={() => setIsPrintModalOpen(false)}
            open={isPrintModalOpen}
            width={1050}
            footer={null}
            onOk={() => setIsPrintModalOpen(false)}>
            <EstimatePaper infoRef={infoRef} pdfRef={pdfRef} pdfSubRef={pdfSubRef} tableRef={tableRef} memberList={memberList} type={'project'}/>
        </Modal>
    }

    const generatePDF = async (printMode = false) => {
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
            compress: true, // 압축 활성화
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const padding = 30; // 좌우 여백 설정
        const contentWidth = pdfWidth - padding * 2; // 실제 이미지 너비

        // ✅ 높이가 0이 아닌 요소만 필터링
        const elements = Array.from(pdfSubRef.current.children).filter(
            (el: any) => el.offsetHeight > 0 && el.innerHTML.trim() !== ""
        );

        if (pdfRef.current) {
            const firstCanvas = await html2canvas(pdfRef.current, {scale: 1.5, useCORS: true});
            const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
            pdf.addImage(firstImgData, "JPEG", 0, 20, pdfWidth, firstImgHeight);


        }

        for (let i = 0; i < elements.length; i++) {
            const element: any = elements[i];
            const firstCanvas = await html2canvas(element, {scale: 1.5, useCORS: true});
            const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;

            pdf.addPage();
            pdf.addImage(firstImgData, "JPEG", 0, 0, pdfWidth, firstImgHeight);

        }

        if (printMode) {
            const pdfBlob = pdf.output("bloburl");
            window.open(pdfBlob, "_blank");
        } else {
            pdf.save(`${info.documentNumberFull}_견적서.pdf`);
        }
    };

    /**
     * @description 수정 페이지 > 돋보기 버튼
     * 프로젝트 > 프로젝트 수정
     * 고객사 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    console.log(info,':::')

    return <Spin spinning={loading}>
        <EstimateModal/>
        <PanelSizeUtil groupRef={groupRef} storage={'project_update'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '485px' : '65px'} calc(100vh - ${mini ? 580 : 160}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'프로젝트 수정'} list={[
                    {name: <div>견적서 출력</div>, func: printEstimate, type: ''},
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                    // {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'},
                    {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: ''}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={''} grid={'110px 80px 80px'}>
                                {datePickerForm({
                                    title: '작성일자',
                                    id: 'writtenDate',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({
                                    title: '작성자',
                                    id: 'createdBy',
                                    disabled: true,
                                    data: info
                                })}
                                <div>
                                    {selectBoxForm({
                                        title: '담당자',
                                        id: 'managerAdminId',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['managerAdminId'],
                                        list: memberList?.map((item) => ({
                                            ...item,
                                            value: item.adminId,
                                            label: item.name,
                                        }))
                                    })}
                                </div>
                            </TopBoxCard>

                            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                        style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                        {inputForm({
                                            title: 'Project No.',
                                            id: 'documentNumberFull',
                                            disabled : true,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '프로젝트 제목',
                                            id: 'projectTitle',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {datePickerForm({title: '마감일자', id: 'dueDate', onChange: onChange, data: info})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                        {inputForm({
                                            title: '고객사명',
                                            id: 'customerName',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('customerName');
                                                }
                                            }>🔍</span>,
                                            handleKeyPress: handleKeyPress,
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '담당자명',
                                            id: 'customerManagerName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '전화번호',
                                            id: 'customerManagerPhone',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
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
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                             info={info} type={'project'}/>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                            </PanelGroup>
                        </div> : <></>}
                </MainCard>

                <Table data={tableData} column={projectInfo['write']} funcButtons={['print']} ref={tableRef} type={'project_write_column'}/>
            </div>
        </>
    </Spin>
}

export default memo(ProjectUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});