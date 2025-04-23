import React, {memo, useRef, useState} from "react";
import {projectReadColumn} from "@/utils/columnList";
import {projectReadInitial} from "@/utils/initialList";
import Button from "antd/lib/button";
import {ExclamationCircleOutlined, RadiusSettingOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteProjectList, searchProject} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, tooltipInfo} from "@/utils/commonForm";
import Spin from "antd/lib/spin";
import ReceiveComponent from "@/component/ReceiveComponent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";

function ProjectRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const gridRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('project_read');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const copyInit = _.cloneDeep(projectReadInitial);
    const [info, setInfo] = useState(copyInit);

    const [totalRow, setTotalRow] = useState(0);

    const onGridReady = async (params) => {
        setLoading(true);
        gridRef.current = params.api;
        await searchProject({data: projectReadInitial}).then(v => {
            params.api.applyTransaction({add: v?.data ?? []})
            setTotalRow(v?.pageInfo?.totalRow ?? 0)
        })
        .finally(() => {
            setLoading(false);
        });
    };

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(e)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 조회 페이지 > 조회 버튼
     * 프로젝트 > 프로젝트 조회
     * @param e
     */
    async function searchInfo(e) {
        if (e) {
            setLoading(true);
            await searchProject({data: info}).then(v => {
                gridManage.resetData(gridRef, v.data ?? []);
                setTotalRow(v?.pageInfo?.totalRow ?? 0)
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }

    /**
     * @description 조회 페이지 > 초기화 버튼
     * 프로젝트 > 프로젝트 조회
     */
    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    /**
     * @description 조회 페이지 > 신규생성 버튼
     * 프로젝트 > 프로젝트 조회
     */
    function moveRegist() {
        getCopyPage('project_write', {})
    }

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 프로젝트 > 프로젝트 조회
     */
    async function confirm() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 프로젝트를 선택해주세요.');

        setLoading(true);
        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            projectId: 'projectId',
            projectDetailId: 'projectDetailId'
        });
        await deleteProjectList({data: {deleteList: deleteList}}).then(v => {
            if (v?.code === 1) {
                searchInfo(true);
                notificationAlert('success', '🗑️ 프로젝트 삭제완료',
                    <>
                        <div>프로젝트 제목
                            : {list[0].projectTitle} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.warn(v?.message);
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
        })
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return <Spin spinning={loading} tip={'프로젝트 조회중...'}>
        <ReceiveComponent componentName={'project_read'} searchInfo={searchInfo}/>
        <PanelSizeUtil groupRef={groupRef} storage={'project_read'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '335px' : '65px'} calc(100vh - ${mini ? 495 : 195}px)`,
        }}>
            <MainCard title={'프로젝트 조회'}
                      list={[
                          {
                              name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>,
                              func: searchInfo,
                              type: 'primary'
                          },
                          {
                              name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                              func: clearAll,
                              type: 'danger'
                          },
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRegist, type: ''},
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard grid={"150px 250px 150px 1fr"}>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 25px 25px 25px', gap: 3}}>
                                    {rangePickerForm({
                                        title: '작성일자',
                                        id: 'searchDate',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        "searchStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>T</Button>
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchDate: [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        "searchStartDate": moment().subtract(1, 'week').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>W</Button>
                                    <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                            onClick={() => {
                                                setInfo(v => {
                                                    return {
                                                        ...v,
                                                        searchDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                        "searchStartDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                    }
                                                })
                                            }}>M</Button>
                                </div>
                                {inputForm({
                                    title: '작성자',
                                    id: 'searchCreatedBy',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자',
                                    id: 'searchManagerAdminName',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
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
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '프로젝트 제목',
                                    id: 'searchProjectTitle',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'searchConnectInquiryNo',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard tooltip={tooltipInfo('readAgency')}>
                                {inputForm({
                                    title: '매입처명',
                                    id: 'searchAgencyName',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '매입처 담당자명',
                                    id: 'searchAgencyManagerName',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 연락처',
                                    id: 'searchAgencyManagerPhone',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 이메일',
                                    id: 'searchAgencyManagerEmail',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
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
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사 담당자명',
                                    id: 'searchCustomerManagerName',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 연락처',
                                    id: 'searchCustomerPhone',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자 이메일',
                                    id: 'searchCustomerEmail',
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info
                                })}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                    </PanelGroup>
                    : <></>}
            </MainCard>
            {/*@ts-ignored*/}
            <TableGrid
                deleteComp={
                    <Popconfirm
                        title="삭제하시겠습니까?"
                        onConfirm={confirm}
                        icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                        <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
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

export default memo(ProjectRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});