import React, {useRef, useState} from "react";
import {projectReadColumn} from "@/utils/columnList";
import {projectDetailUnit, projectReadInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
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

export default function ProjectRead({getPropertyId, getCopyPage}) {

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

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }
        setLoading(true)
        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            projectId: 'projectId',
            projectDetailId: 'projectDetailId'
        });
        await deleteProjectList({data: {deleteList: deleteList}, returnFunc: searchInfo});

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
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25]; // 기본값 [50, 50, 50]
    };
    function onResizeChange() {
        setSizes(groupRef.current.getLayout())
    }
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    return <Spin spinning={loading} tip={'프로젝트 조회중...'}>
        <PanelSizeUtil groupRef={groupRef} setSizes={setSizes} storage={'project_read'}/>
        <ReceiveComponent searchInfo={searchInfo}/>

        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '350px' : '65px'} calc(100vh - ${mini ? 480 : 195}px)`,
        }}>
            <MainCard title={'프로젝트 조회'} list={[
                {name: '조회', func: searchInfo, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'},
                {name: '신규작성', func: moveRegist, type: 'default'}
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>

                    <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'기본정보'} grid={"150px 250px 150px 1fr"}>
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
                        <Panel defaultSize={sizes[1]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
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
                        <Panel defaultSize={sizes[2]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'매입처 정보'} tooltip={tooltipInfo('readAgency')}>
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
                        <Panel defaultSize={sizes[3]} minSize={10} maxSize={100} onResize={onResizeChange}>
                            <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('readCustomer')}>
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
                    </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            {/*@ts-ignored*/}
            <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                           onClick={deleteList}>
                <CopyOutlined/>삭제
            </Button>}
                       totalRow={totalRow}
                       getPropertyId={getPropertyId}
                       gridRef={gridRef}
                       onGridReady={onGridReady}
                       columns={projectReadColumn}
                       funcButtons={['print']}/>

        </div>


    </Spin>
}

