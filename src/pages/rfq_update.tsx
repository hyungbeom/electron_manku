import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {CopyOutlined, FileSearchOutlined, SaveOutlined} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import MyComponent from "@/component/MyComponent";
import TableGrid from "@/component/tableGrid";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {updateRfq} from "@/utils/api/mainApi";
import {estimateRequestDetailUnit, storeWriteInitial} from "@/utils/initialList";
import _ from "lodash";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";
import Select from "antd/lib/select";

const listType = 'estimateRequestDetailList'
export default function rqfUpdate({dataInfo, managerList}) {
    console.log(managerList,'managerList:')
    const options = managerList.map((item) => ({
        ...item,
        value: item.name,
        label: item.name,
    }));

    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();


    const copyUnitInit = _.cloneDeep(estimateRequestDetailUnit)

    const infoInit = dataInfo?.estimateRequestDetail
    const infoFileInit = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>({...infoInit, uploadType: 0})
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.estimateRequestDetail[listType]});
    };

    const onCChange = (value: string, e:any) => {
        setInfo(v=> {
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
                    await findCodeInfo(e, setInfo, openModal)
                    break;
            }
        }
    }

    async function saveFunc() {
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }

        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    if (key === 'dueDate') {
                        formData.append(key, moment(value).format('YYYY-MM-DD'));
                    } else {
                        formData.append(key, value);
                    }
                }
            }
        };

        handleIteration();


        if (list.length) {
            list.forEach((detail, index) => {
                Object.keys(detail).forEach((key) => {
                    if (key === 'replyDate') {
                        formData.append(`${listType}[${index}].${key}`, moment(detail[key]).format('YYYY-MM-DD'));
                    } else {
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                    }
                });
            });
        }

        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));

        const uploadContainer = document.querySelector(".ant-upload-list"); // 업로드 리스트 컨테이너

        if (uploadContainer) {
            const fileNodes = uploadContainer.querySelectorAll(".ant-upload-list-item-name");
            const fileNames = Array.from(fileNodes).map((node: any) => node.textContent.trim());

            let count = 0
            fileRef.current.fileList.forEach((item, index) => {
                if (item?.originFileObj) {
                    formData.append(`attachmentFileList[${count}].attachmentFile`, item.originFileObj);
                    formData.append(`attachmentFileList[${count}].fileName`, fileNames[index].replace(/\s+/g, ""));
                    count += 1;
                }
            });

        }
        result.map((v, idx) => {
            formData.append(`deleteAttachementIdList[${idx}]`, v.id);
        })
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateRfq({data: formData, router: router})
    }

    function deleteList() {
        const list = commonManage.getUnCheckList(gridRef);
        gridManage.resetData(gridRef, list);
    }

    function addRow() {
        const newRow = {...copyUnitInit, "currency": commonManage.changeCurr(info['agencyCode'])};
        gridRef.current.applyTransaction({add: [newRow]});
    }

    function clearAll() {
        setInfo(estimateRequestDetailUnit);
        gridManage.deleteAll(gridRef)
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/rfq_write?${query}`)
    }

    const subTableUtil = <div>
        {/*@ts-ignored*/}
        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
    </div>


    return <>

        <SearchInfoModal info={info} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>

        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <MainCard title={'견적의뢰 수정'} list={[
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 0.6fr 0.6fr 1fr 1fr'}>
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
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            <div>
                                <div>담당자</div>
                                <Select style={{width: '100%'}} size={'small'}
                                        showSearch
                                        value={info['managerAdminName']}
                                        placeholder="Select a person"
                                        optionFilterProp="label"
                                        onChange={onCChange}
                                        options={options}
                                />
                            </div>
                            {inputForm({title: 'RFQ NO.', id: 'rfqNo', onChange: onChange, data: info})}
                            {inputForm({title: '프로젝트 제목', id: 'projectTitle', onChange: onChange, data: info})}
                        </TopBoxCard>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: "150px 200px 1fr 1fr 300px",
                            columnGap: 10
                        }}>
                            <BoxCard title={'매입처 정보'}>
                                {inputForm({
                                    title: '매입처코드',
                                    id: 'agencyCode',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('agencyCode');
                                        }
                                    }/>, onChange: onChange, data: info
                                })}
                                {inputForm({
                                    title: '매입처명',
                                    id: 'agencyName',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '매입처담당자',
                                    id: 'agencyManagerName',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {datePickerForm({title: '마감일자(예상)', id: 'dueDate', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard title={'고객사 정보'}>
                                {inputForm({
                                    title: '고객사명',
                                    id: 'customerName',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('customerName');
                                        }
                                    }/>, onChange: onChange, data: info
                                })}
                                {inputForm({title: '담당자명', id: 'managerName', onChange: onChange, data: info})}
                                {inputForm({title: '전화번호', id: 'phoneNumber', onChange: onChange, data: info})}
                                {inputForm({title: '팩스', id: 'faxNumber', onChange: onChange, data: info})}
                                {inputForm({title: '이메일', id: 'customerManagerEmail', onChange: onChange, data: info})}
                            </BoxCard>


                            <BoxCard title={'Maker 정보'}>
                                {inputForm({
                                    title: 'MAKER',
                                    id: 'maker',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('maker');
                                        }
                                    }/>, onChange: onChange, data: info
                                })}
                                {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                {textAreaForm({title: '지시사항', id: 'instructions', onChange: onChange, data: info})}

                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {inputForm({title: 'End User', id: 'endUser', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', rows: 7, id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'}>
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
                                    <DriveUploadComp infoFileInit={infoFileInit} fileRef={fileRef}
                                                     numb={info['uploadType']}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={subTableUtil}
                />

            </div>
            <MyComponent/>
        </LayoutComponent>
    </>
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
        props: {dataInfo: dataInfo ? dataInfo : null, managerList : list}
    }

})