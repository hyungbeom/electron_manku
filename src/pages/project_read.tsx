import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {projectReadColumn} from "@/utils/columnList";
import {projectReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteProjectList, searchProject} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, rangePickerForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";


export default function ProjectRead({dataInfo}) {

    const router = useRouter();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(projectReadInitial)

    const [info, setInfo] = useState(copyInit)

    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ? dataInfo : []});
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
            gridManage.resetData(gridRef, v);
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
        window.open(`/project_write`, '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
    }

    return <Spin spinning={loading} tip={'프로젝트 조회중...'}>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '420px' : '65px'} calc(100vh - ${mini ? 515 : 160}px)`,
                columnGap: 5
            }}>

                <MainCard title={'프로젝트 조회'} list={[
                    {name: '조회', func: searchInfo, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '신규작성', func: moveRegist, type: 'default'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={''} grid={"150px 250px 150px 1fr"}>

                                {inputForm({
                                    title: '작성자',
                                    id: 'searchCreatedBy',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info,})}
                                {inputForm({
                                    title: '담당자',
                                    id: 'searchManagerAdminName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "200px 250px 300px ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'PROJECT NO.',
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
                                        title: '담당자 전화번호',
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
                                        title: '담당자 전화번호',
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
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={projectReadColumn}
                           funcButtons={['print']}

                />

            </div>
        </LayoutComponent>
    </Spin>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


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
        let result = await searchProject({data: projectReadInitial});
        return {
            props: {dataInfo: result ? result : null}
        }
    }
})