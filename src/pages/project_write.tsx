import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {FileSearchOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import {ModalInitList, projectDetailUnit, projectWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveProject} from "@/utils/api/mainApi";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import Select from "antd/lib/select";
import {getData} from "@/manage/function/api";

const listType = 'projectDetailList'
export default function projectWrite({dataInfo, managerList}) {
    const options = managerList.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(projectWriteInitial)
    const copyUnitInit = _.cloneDeep(projectDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    console.log(userInfo,'userInfo')

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        createBy: userInfo['name'],
        managerAdminName: userInfo['name']
    }

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})
    const [validate, setValidate] = useState({documentNumberFull: true});

    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        const copyData = _.cloneDeep(info);
        delete copyData?.createdDate;
        delete copyData?.modifiedDate;
        const result = copyData?.projectDetailList;
        setInfo(copyData);
        params.api.applyTransaction({add: result ? result : commonFunc.repeatObject(projectDetailUnit, 30)});
    };

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

    function onChange(e) {
        if (e.target.id === 'documentNumberFull') {
            setValidate(v => {
                return {...v, documentNumberFull: true}
            })
        }
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        if (!info['documentNumberFull']) {
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }
        const list = gridManage.getAllData(gridRef);

        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, list)
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
        window.opener?.postMessage('write', window.location.origin);
        setLoading(false)

    }

    function clearAll() {

        setLoading(false)
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }


    const onCChange = (value: string, e: any) => {
        setInfo(v => {
            return {...v, managerAdminId: e.adminId, managerAdminName: e.name}
        })
    };



    return <Spin spinning={loading} tip={'프로젝트 등록중...'}>
        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         gridRef={gridRef}
                         setValidate={setValidate}
                         setIsModalOpen={setIsModalOpen}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '430px' : '65px'} calc(100vh - ${mini ? 485 : 120}px)`,
                columnGap: 5
            }}>
                <MainCard title={'프로젝트 등록'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={''} grid={'1fr 1fr 1fr 1fr'}>
                                {inputForm({
                                    title: '작성자',
                                    id: 'createBy',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {datePickerForm({
                                    title: '작성일자',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                <div>
                                    <div>담당자</div>
                                    <Select style={{width: '100%'}} size={'small'}
                                            showSearch
                                            value={info['managerAdminId']}
                                            placeholder="Select a person"
                                            optionFilterProp="label"
                                            onChange={onCChange}
                                            options={options}
                                    />
                                </div>

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "200px 250px 1fr 300px ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'프로젝트 정보'} tooltip={tooltipInfo('readProject')}>
                                    {inputForm({
                                        title: 'PROJECT NO.',
                                        id: 'documentNumberFull',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['documentNumberFull']
                                    })}
                                    {inputForm({
                                        title: '프로젝트 제목',
                                        id: 'projectTitle',
                                        placeholder: '매입처 당담자 입력 필요',
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {datePickerForm({title: '마감일자', id: 'dueDate', onChange: onChange, data: info})}
                                </BoxCard>
                                <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
                                    {inputForm({
                                        title: '고객사명',
                                        id: 'customerName',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('customerName');
                                            }
                                        }/>, onChange: onChange, data: info, handleKeyPress: handleKeyPress
                                    })}
                                    {inputForm({
                                        title: '고객사 담당자명',
                                        id: 'customerManagerName',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 전화번호',
                                        id: 'customerManagerPhone',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                    {inputForm({
                                        title: '담당자 이메일',
                                        id: 'customerManagerEmail',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info
                                    })}
                                </BoxCard>

                                <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                                    {textAreaForm({title: '비고란', rows: 2, id: 'remarks', onChange: onChange, data: info})}
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
                                <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')} disabled={!userInfo['microsoftId']}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         numb={5}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={projectWriteColumn}
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={['projectUpload', 'addProjectRow', 'delete', 'print']}
                />

            </div>
        </LayoutComponent>
    </Spin>
}

// @ts-ignored
export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
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