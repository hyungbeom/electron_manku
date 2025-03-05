import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {ClearOutlined, FileSearchOutlined, PlusSquareOutlined, SaveOutlined} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import {
    estimateDetailUnit,
    estimateRequestDetailUnit,
    ModalInitList,
    projectDetailUnit,
    rfqWriteInitial
} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
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
import {useRouter} from "next/router";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {checkInquiryNo, saveRfq} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Select from "antd/lib/select";
import {getData} from "@/manage/function/api";
import moment from "moment";
import Spin from "antd/lib/spin";
import Button from "antd/lib/button";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";

const listType = 'estimateRequestDetailList'
export default function RqfWrite({ copyPageInfo = {}}) {
    const groupRef = useRef<any>(null)
    const [ready, setReady] = useState(false);

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

    const copyInit = _.cloneDeep(rfqWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)


    const userInfo = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createBy: userInfo['name'],

    }

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({
        ...copyInit,  ...adminParams,
        writtenDate: moment().format('YYYY-MM-DD')
    })

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);




    const onGridReady = (params) => {
        gridRef.current = params.api;
        setInfo(isEmptyObj(copyPageInfo['rfq_write']) ? {...copyPageInfo['rfq_write'], documentNumberFull : ''} : infoInit);
        params.api.applyTransaction({add: copyPageInfo['rfq_write'][listType] ? copyPageInfo['rfq_write'][listType] : commonFunc.repeatObject(estimateRequestDetailUnit, 10)});
        setReady(true)
    };

    useEffect(() => {
        if(ready) {
            if(copyPageInfo['rfq_write'] && !isEmptyObj(copyPageInfo['rfq_write'])){
                setInfo(infoInit);
                gridManage.resetData(gridRef,commonFunc.repeatObject(estimateRequestDetailUnit, 10))
            }else{
                setInfo({...copyPageInfo['rfq_write'], ...adminParams, documentNumberFull : ''});
                console.log(adminParams,'as')
                gridManage.resetData(gridRef, copyPageInfo['rfq_write'][listType])
            }
        }
    }, [copyPageInfo['rfq_write'],ready]);

    // useEffect(() => {
    //     initCopyLoadInquiry()
    // }, []);
    //
    // async function initCopyLoadInquiry() {
    //     if (dataInfo) {
    //         await checkInquiryNo({data: {agencyCode: dataInfo['agencyCode'], type: ''}}).then(data => {
    //             onChange({target: {id: 'documentNumberFull', value: data}})
    //         })
    //     }
    // }

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

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        if (e.target.id === 'agencyCode') {

        }
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        if (!info['managerAdminName']) {
            return message.warn('담당자가 누락되었습니다.')
        }
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        // if (!info['documentNumberFull']) {
        //     return message.warn('INQUIRY NO.가 누락되었습니다.')
        // }
        const list = gridManage.getAllData(gridRef);
        const filterList = list.filter(v => !!v.model);
        if (!filterList.length) {
            return message.warn('유효한 하위 데이터 1개 이상이여야 합니다');
        }

        setLoading(true)

        const formData: any = new FormData();
        // serialNumbe
        commonManage.setInfoFormData(info, formData, listType, filterList)
        commonManage.getUploadList(fileRef, formData)

        formData.delete('createdDate');
        formData.delete('modifiedDate');

        await saveRfq({data: formData, router: router, setLoading}).then(v=>{
            setInfo(src=>{
                return {...src, documentNumberFull : v}
            })
            setLoading(false);
        })

    }


    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef)
    }


    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };

    function moveRouter(param) {

        switch (param) {
            case '국내' :
                // router.push('/agencyWrite')
                break;
            case '해외' :
                // router.push('/code_overseas_agency_write')
                break;
        }
        // router.push()
    }




    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_write');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25, 25]; // 기본값 [50, 50, 50]
    };

    function onResizeChange() {
        setSizes(groupRef.current.getLayout())
    }
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    return <Spin spinning={loading} tip={'견적의뢰 등록중...'}>
        <PanelSizeUtil groupRef={groupRef} setSizes={setSizes} storage={'rfq_write'}/>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setIsModalOpen={setIsModalOpen}
                         compProps={<div>
                             <Button size={'small'} style={{marginRight: 5}} onClick={() => moveRouter('국내')}
                                     id={'국내'}>국내생성</Button>
                             <Button size={'small'} style={{marginRight: 50}} onClick={() => moveRouter('해외')}
                                     id={'해외'}>해외생성</Button>
                         </div>}
        />
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 510 : 65}px calc(100vh - ${mini ? 640 : 195}px)`,
                columnGap: 5
            }}>

                <MainCard title={'견적의뢰 작성'} list={[
                    {
                        name: '저장',
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
                    }
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>
                            <TopBoxCard title={''} grid={'1fr 0.6fr 150px 1fr 1fr 1fr'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: 'INQUIRY NO.',
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    data: info,
                                    disabled : true,
                                    placeHolder : '자동생성'
                                })}
                                {inputForm({title: '작성자', id: 'createBy', disabled: true, onChange: onChange, data: info})}
                                <div>
                                    <div style={{paddingBottom: 4.5, fontSize : 12}}>담당자</div>
                                    <Select style={{width: '100%', fontSize : 12}} size={'small'}
                                            showSearch
                                            value={info['managerAdminId']}
                                            placeholder="Select a person"
                                            optionFilterProp="label"
                                            onChange={onCChange}
                                            options={options}
                                    />
                                </div>
                                {inputForm({
                                    title: 'RFQ NO.',
                                    id: 'rfqNo',
                                    onChange: onChange,
                                    data: info

                                })}
                                {inputForm({
                                    title: 'PROJECT NAME',
                                    id: 'projectTitle',
                                    onChange: onChange,
                                    data: info

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
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자명',
                                        id: 'managerName',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {inputForm({
                                        title: '전화번호',
                                        id: 'phoneNumber',
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {inputForm({
                                        title: '팩스',
                                        id: 'faxNumber',
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
                            <Panel defaultSize={sizes[2]} minSize={10} maxSize={100} onResize={onResizeChange}>
                                <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('maker')}>
                                    {inputForm({
                                        title: 'MAKER',
                                        id: 'maker',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}}
                                                                    onClick={
                                                                        (e) => {
                                                                            e.stopPropagation();
                                                                            openModal('maker');
                                                                        }
                                                                    }/>,
                                        onChange: onChange,
                                        handleKeyPress: handleKeyPress,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: 'ITEM',
                                        id: 'item',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '지시사항',
                                        id: 'instructions',
                                        onChange: onChange,
                                        data: info,
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
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {textAreaForm({
                                        title: '비고란',
                                        rows: 10,
                                        id: 'remarks',
                                        onChange: onChange,
                                        data: info,

                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={10} maxSize={100} onResize={onResizeChange}>
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
                        </div>
                        : <></>}
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

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;
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
    const result = await getData.post('admin/getAdminList', {
        "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
        "searchAuthority": null,    // 1: 일반, 0: 관리자
        "page": 1,
        "limit": -1
    });
    const list = result?.data?.entity?.adminList;
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data ?? {}, managerList: list ?? []}}
    }

    return {props: {managerList: list}}
})