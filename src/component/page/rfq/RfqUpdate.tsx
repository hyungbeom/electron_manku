import React, {useEffect, useRef, useState} from "react";
import {FileSearchOutlined} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import SearchInfoModal from "@/component/SearchAgencyModal";
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
import {commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {getAttachmentFileList, updateRfq} from "@/utils/api/mainApi";
import {rfqWriteInitial} from "@/utils/initialList";
import _ from "lodash";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";
import Select from "antd/lib/select";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";

const listType = 'estimateRequestDetailList'
export default function RqfUpdate({updateKey = {}, getCopyPage = null, managerList = []}) {
    const groupRef = useRef<any>(null)

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


    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();


    const userInfo = useAppSelector((state) => state.user);
    const [info, setInfo] = useState<any>({})
    const [mini, setMini] = useState(true);

    const [fileList, setFileList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            console.log(v, 'v::::')
            const {estimateRequestDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList)
            setInfo({
                ...estimateRequestDetail,
                uploadType: 0,
                managerAdminName: estimateRequestDetail['managerAdminName'] ? estimateRequestDetail['managerAdminName'] : estimateRequestDetail['createdBy']
            })
            gridManage.resetData(gridRef, estimateRequestDetail[listType])
            setLoading(false)
        })
    }, [updateKey['rfq_update']])

    async function getDataInfo() {

        const result = await getData.post('estimate/getEstimateRequestDetail', {
            "estimateRequestId": updateKey['rfq_update']
        });
        console.log(result, '??')
        return result?.data?.entity;
    }


    const onGridReady = (params) => {
        gridRef.current = params.api;
    };


    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {

        commonManage.onChange(e, setInfo)
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal, '')
                    break;
            }
        }
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        if (!info['agencyCode']) {
            message.warn('매입처 코드가 누락되었습니다.');
            return;
        }
        const list = gridManage.getAllData(gridRef);
        const filterList = list.filter(v => !!v.model);
        if (!filterList.length) {
            message.warn('유효한 하위 데이터 1개 이상이여야 합니다');
            return;
        }

        setLoading(true)
        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, filterList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate');
        formData.delete('modifiedDate');
        await updateRfq({data: formData, returnFunc: returnFunc})
    }

    async function returnFunc(e) {
        if (e) {

            await getAttachmentFileList({
                data: {
                    "relatedType": "ESTIMATE_REQUEST",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": updateKey['rfq_update']
                }
            }).then(v => {
                console.log(';;;')
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    function clearAll() {
        setInfo(v => {
            return {
                ...rfqWriteInitial,
                documentNumberFull: v.documentNumberFull,
                writtenDate: v.writtenDate,
                createdBy: v.createdBy,
                managerAdminName: v.managerAdminName,
                managerAdminId: v?.managerAdminId ? v?.managerAdminId : 0
            }
        });
        gridManage.deleteAll(gridRef)
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info);
        copyInfo[listType] = totalList

        getCopyPage('rfq_write', copyInfo)
    }


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_write');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25, 25]; // 기본값 [50, 50, 50]
    };

    function onResizeChange() {
        setSizes(groupRef.current.getLayout())
    }

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    return <Spin spinning={loading} tip={'견적의뢰 수정중...'}>
        <PanelSizeUtil groupRef={groupRef} setSizes={setSizes} storage={'rfq_write'}/>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         type={''}
                         gridRef={gridRef}
                         setIsModalOpen={setIsModalOpen}/>

        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 500 : 65}px calc(100vh - ${mini ? 630 : 75}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적의뢰 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={''} grid={'1fr 1fr 0.6fr 0.6fr 1fr 1fr'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: 'Inquiry No.',
                                id: 'documentNumberFull',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            <div>
                                <div style={{paddingBottom: 4.5, fontSize: 12}}>담당자</div>
                                <Select style={{width: '100%', fontSize: 12}} size={'small'}
                                        showSearch
                                        value={info['managerAdminName']}
                                        className="custom-select"
                                        placeholder="Select a person"
                                        optionFilterProp="label"
                                        onChange={onCChange}
                                        options={options}
                                />
                            </div>
                            {inputForm({title: 'RFQ No.', id: 'rfqNo', onChange: onChange, data: info})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
                        </TopBoxCard>
                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={15} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'매입처 정보'} tooltip={tooltipInfo('agency')}>
                                    {inputForm({
                                        title: '매입처코드',
                                        id: 'agencyCode',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('agencyCode');
                                            }
                                        }/>,
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '매입처명',
                                        id: 'agencyName',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '매입처담당자',
                                        id: 'agencyManagerName',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '매입처이메일',
                                        id: 'agencyManagerEmail',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {datePickerForm({title: '마감일자(예상)', id: 'dueDate', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={15} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'customerName',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('customerName');
                                            }
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({title: '담당자명', id: 'managerName', onChange: onChange, data: info})}
                                    {inputForm({title: '연락처', id: 'phoneNumber', onChange: onChange, data: info})}
                                    {inputForm({title: '팩스', id: 'faxNumber', onChange: onChange, data: info})}
                                    {inputForm({
                                        title: '이메일',
                                        id: 'customerManagerEmail',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={15} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('etc')}>
                                    {inputForm({
                                        title: 'Maker',
                                        id: 'maker',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('maker');
                                            }
                                        }/>, onChange: onChange, handleKeyPress: handleKeyPress, data: info
                                    })}
                                    {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                    {textAreaForm({
                                        title: '지시사항',
                                        rows: 7,
                                        id: 'instructions',
                                        onChange: onChange,
                                        data: info
                                    })}

                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={15} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'ETC'} tooltip={tooltipInfo('etc')}>
                                    {inputForm({title: 'End User', id: 'endUser', onChange: onChange, data: info})}
                                    {textAreaForm({
                                        title: '비고란',
                                        rows: 10,
                                        id: 'remarks',
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={23} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                         disabled={!userInfo['microsoftId']}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <div style={{width: 100, float: 'right'}}>
                                            {selectBoxForm({
                                                title: '', id: 'uploadType', onChange: onChange, data: info, list: [
                                                    {value: 0, label: '요청자료'},
                                                    {value: 1, label: '첨부파일'},
                                                    {value: 2, label: '업체회신자료'}
                                                ]
                                            })}
                                        </div>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         numb={info['uploadType']}/>
                                    </div>
                                </BoxCard>
                            </Panel>
                        </PanelGroup>
                    </div> : null}
                </MainCard>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={['upload', 'add', 'delete', 'print']}
                />

            </div>

        </>
    </Spin>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {query} = ctx;

    const {estimateRequestId} = query;

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));

    const managerData = await getData.post('admin/getAdminList', {
        "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
        "searchAuthority": null,    // 1: 일반, 0: 관리자
        "page": 1,
        "limit": -1
    });
    const list = managerData?.data?.entity?.adminList;
    const result = await getData.post('estimate/getEstimateRequestDetail', {
        "estimateRequestId": estimateRequestId
    });
    const dataInfo = result?.data?.entity;
    return {
        props: {dataInfo: dataInfo ? dataInfo : null, managerList: list}
    }

})