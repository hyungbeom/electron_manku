import React, {useRef, useState} from "react";
import {projectReadColumn} from "@/utils/columnList";
import {projectDetailUnit, projectReadInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteProjectList, searchProject} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, tooltipInfo} from "@/utils/commonForm";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";

export default function ProjectRead({getPropertyId, getCopyPage, notificationAlert = null}) {

    const groupRef = useRef<any>(null)

    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(projectReadInitial)

    const [info, setInfo] = useState(copyInit)
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchProject({data: projectReadInitial}).then(v => {
            console.log(v.data, 'v.data:')
            params.api.applyTransaction({add: v.data})
            setTotalRow(v.pageInfo.totalRow)
        })
    };


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(e)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo(e) {
        setLoading(e)
        await searchProject({data: info}).then(v => {
            gridManage.resetData(gridRef, v.data);
            setTotalRow(v.pageInfo.totalRow)
            setLoading(false)
        }, e => setLoading(false))
    }


    function clearAll() {
        setInfo(copyInit)
        gridRef.current.deselectAll()
    }

    function moveRegist() {
        getCopyPage('project_write', {projectDetailList: commonFunc.repeatObject(projectDetailUnit, 10)})
    }


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }
        setLoading(true)
        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            projectId: 'projectId',
            projectDetailId: 'projectDetailId'
        });

        const selectedRows = gridRef.current.getSelectedRows();

        await deleteProjectList({data: {deleteList: deleteList}}).then(v => {
            if (v.code === 1) {
                notificationAlert('error', '프로젝트 삭제완료',
                    <>
                        <div>프로젝트 제목
                            - {selectedRows[0].projectTitle} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다 </div>*/}
                        <div>삭제일자 : {moment().format('HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
                searchInfo(true)
            }
        })
    }

    return <Spin spinning={loading} tip={'프로젝트 조회중...'}>
        <PanelSizeUtil groupRef={groupRef} storage={'project_read'}/>
        <ReceiveComponent searchInfo={searchInfo}/>

        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '335px' : '65px'} calc(100vh - ${mini ? 495 : 195}px)`,
        }}>
            <MainCard title={'프로젝트 조회'} list={[
                {name: '조회', func: searchInfo, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'},
                {name: '신규작성', func: moveRegist, type: 'default'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard grid={"150px 250px 150px 1fr"}>
                                    {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: '작성자',
                                        id: 'searchCreatedBy',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자',
                                        id: 'searchManagerAdminName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'Project No.',
                                        id: 'searchDocumentNumberFull',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'searchProjectTitle',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: 'Inquiry No.',
                                        id: 'searchConnectInquiryNo',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard  tooltip={tooltipInfo('readAgency')}>
                                    {inputForm({
                                        title: '매입처명',
                                        id: 'searchAgencyName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '매입처 담당자명',
                                        id: 'searchAgencyManagerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 연락처',
                                        id: 'searchAgencyManagerPhone',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'searchAgencyManagerEmail',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard tooltip={tooltipInfo('readCustomer')}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'searchCustomerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '고객사 담당자명',
                                        id: 'searchCustomerManagerName',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 연락처',
                                        id: 'searchCustomerPhone',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'searchCustomerEmail',
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel></Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            {/*@ts-ignored*/}
            <TableGrid deleteComp={

                <Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={confirm}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>
            }
                       totalRow={totalRow}
                       getPropertyId={getPropertyId}
                       gridRef={gridRef}
                       onGridReady={onGridReady}
                       funcButtons={['agPrint']}
                       columns={projectReadColumn}/>

        </div>


    </Spin>
}

