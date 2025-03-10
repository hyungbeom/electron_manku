import React, {useEffect, useRef, useState} from "react";
import {ClearOutlined, FileSearchOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {getAttachmentFileList, updateRfq} from "@/utils/api/mainApi";
import {rfqWriteInitial} from "@/utils/initialList";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Table from "@/component/util/Table";
import {rfqInfo} from "@/utils/column/ProjectInfo";

const listType = 'estimateRequestDetailList'
export default function RqfUpdate({updateKey = {}, getCopyPage = null, managerList = []}) {
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

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
    const [tableData, setTableData] = useState([]);

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {estimateRequestDetail, attachmentFileList} = v;
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList);
            setInfo({
                ...estimateRequestDetail,
                uploadType: 0,
                managerAdminId: estimateRequestDetail['managerAdminId'] ? estimateRequestDetail['managerAdminId'] : estimateRequestDetail['createdBy']
            })
            estimateRequestDetail[listType] = [...estimateRequestDetail[listType], ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 100 - estimateRequestDetail[listType].length)]

            setTableData(estimateRequestDetail[listType]);

            setLoading(false)
        })
    }, [updateKey['rfq_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);


    async function getDataInfo() {

        const result = await getData.post('estimate/getEstimateRequestDetail', {
            "estimateRequestId": updateKey['rfq_update']
        });
        return result?.data?.entity;
    }


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
        let infoData = commonManage.getInfo(infoRef, rfqInfo['defaultInfo']);


        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        if (!infoData['agencyCode']) {
            const dom = infoRef.current.querySelector('#agencyCode');
            dom.style.borderColor = 'red'
            return message.warn('매입처 코드가 누락되었습니다.')
        }


        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        setLoading(true);
        const formData: any = new FormData();
        commonManage.setInfoFormData({
            ...infoData,
            estimateRequestId: updateKey['rfq_update']
        }, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')
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
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        }
        setLoading(false)

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

        const totalList = tableRef.current.getSourceData();
        totalList.pop();


        const result = Object.keys(rfqInfo['defaultInfo']).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }

        const dom = infoRef.current.querySelector('#managerAdminId');

        copyInfo['managerAdminId'] = parseInt(dom.value);
        const findMember = memberList.find(v => v.adminId === parseInt(dom.value));

        copyInfo['managerAdminName'] = findMember['name'];

        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(rfqInfo['write']['defaultData'], 100 - totalList.length)];

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
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>


        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 510 : 65}px calc(100vh - ${mini ? 640 : 195}px)`,
                columnGap: 5
            }}>

                <MainCard title={'견적의뢰 수정'} list={[
                    {
                        name: '수정',
                        func: saveFunc,
                        type: 'primary',
                        title: '입력한 견적의뢰 내용을 저장합니다.',
                        prefix: <SaveOutlined/>
                    },
                    {
                        name: '초기화',
                        func: clearAll,
                        type: 'danger',
                        title: '필드에 입력한 모든 정보들을 초기화 합니다.',
                        prefix: <ClearOutlined/>
                    },
                    {name: '복제', func: copyPage, type: 'default'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>
                            <TopBoxCard title={''} grid={'110px 110px 150px 150px 150px 350px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    // onChange: onChange,
                                    // data: info
                                })}

                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
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
                                {inputForm({
                                    title: 'Inquiry No.',
                                    id: 'documentNumberFull',
                                    // onChange: onChange,
                                    // data: info,
                                    disabled: true,
                                    placeHolder: '자동생성'
                                })}
                                {inputForm({
                                    title: 'RFQ No.',
                                    id: 'rfqNo',
                                    // onChange: onChange,
                                    // data: info

                                })}
                                {inputForm({
                                    title: 'PROJECT NAME',
                                    id: 'projectTitle',
                                    // onChange: onChange,
                                    // data: info

                                })}
                            </TopBoxCard>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 3, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'매입처 정보'} tooltip={tooltipInfo('agency')}>
                                        {inputForm({
                                            title: '매입처코드',
                                            id: 'agencyCode',
                                            suffix: <FileSearchOutlined style={{cursor: 'pointer'}}
                                                                        onClick={
                                                                            (e) => {
                                                                                e.stopPropagation();
                                                                                openModal('agencyCode');
                                                                            }
                                                                        }/>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: '매입처명',
                                            id: 'agencyName',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: '매입처담당자',
                                            id: 'agencyManagerName',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: '매입처이메일',
                                            id: 'agencyManagerEmail',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {datePickerForm({
                                            title: '마감일자(예상)', id: 'dueDate'
                                            // , onChange: onChange, data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                        {inputForm({
                                            title: '고객사명',
                                            id: 'customerName',
                                            suffix: <FileSearchOutlined style={{cursor: 'pointer'}}
                                                                        onClick={
                                                                            (e) => {
                                                                                e.stopPropagation();
                                                                                openModal('customerName');
                                                                            }
                                                                        }/>,
                                            // onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: '담당자명',
                                            id: 'managerName',
                                            // onChange: onChange,
                                            // data: info,
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',
                                            // onChange: onChange,
                                            // data: info,
                                        })}
                                        {inputForm({
                                            title: '팩스',
                                            id: 'faxNumber',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('maker')}>
                                        {inputForm({
                                            title: 'Maker',
                                            id: 'maker',
                                            suffix: <FileSearchOutlined style={{cursor: 'pointer'}}
                                                                        onClick={
                                                                            (e) => {
                                                                                e.stopPropagation();
                                                                                openModal('maker');
                                                                            }
                                                                        }/>,
                                            // onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            // data: info
                                        })}
                                        {inputForm({
                                            title: 'Item',
                                            id: 'item',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {textAreaForm({
                                            title: '지시사항',
                                            id: 'instructions',
                                            // onChange: onChange,
                                            // data: info,
                                            rows: 7
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'ETC'} tooltip={tooltipInfo('etc')}>
                                        {inputForm({
                                            title: 'End User',
                                            id: 'endUser',
                                            // onChange: onChange,
                                            // data: info
                                        })}
                                        {textAreaForm({
                                            title: '비고란',
                                            rows: 10,
                                            id: 'remarks',
                                            // onChange: onChange,
                                            // data: info,

                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                    <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                             disabled={!userInfo['microsoftId']}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList}
                                                         fileRef={fileRef}
                                                         infoRef={infoRef}/>
                                    </BoxCard>
                                </Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={rfqInfo['write']} funcButtons={['print']} ref={tableRef}/>
            </div>

        </>
    </Spin>
}