import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    DownCircleFilled,
    DownloadOutlined,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import {tableEstimateWriteColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateDetailUnit, estimateWriteInitial, ModalInitList, orderWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Select from "antd/lib/select";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import _ from "lodash";
import {findCodeInfo, findDocumentInfo} from "@/utils/api/commonApi";
import {saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'estimateDetailList'
export default function EstimateWrite() {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(estimateWriteInitial)
    const copyUnitInit = _.cloneDeep(estimateDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    // =============================================================================================================

    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {
        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   placeholder={placeholder}
                   suffix={suffix}
            />
        </div>
    }

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea style={{resize: 'none'}} rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}
                      showCount
                      maxLength={1000}
            />
        </div>
    }


    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={moment(info[id]).isValid() ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
                case 'connectDocumentNumberFull' :
                    await findDocumentInfo(e, setInfo)
                    break;
            }

        }
    }


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }
        if (!info[listType].length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }


        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    formData.append(key, value);
                }
            }
        };

        handleIteration();

        const copyData = {...info}


        if (copyData[listType].length) {
            copyData[listType].forEach((detail, index) => {
                Object.keys(detail).forEach((key) => {
                        formData.append(`${listType}[${index}].${key}`, detail[key]);
                });
            });
        }

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        await saveEstimate({data: formData, router: router})

    }


    function deleteList() {
        let copyData = {...info}
        copyData[listType] = commonManage.getUnCheckList(gridRef.current.api);

        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};
        copyData[listType].push({
                ...copyUnitInit,
                "currency": commonManage.changeCurr(info['agencyCode'])
            }
        )
        setInfo(copyData)
    }

    function clearAll() {
        setInfo({...infoInit});
    }

    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{marginLeft: 5,}} onClick={deleteList}>
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
                <MainCard title={'견적서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr 1fr '}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                                {inputForm({title: '담당자', id: 'managerAdminName'})}
                                {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull', placeholder: '폴더생성 규칙 유의'})}
                                {inputForm({
                                    placeholder: '폴더생성 규칙 유의',
                                    title: '연결 INQUIRY No.',
                                    id: 'connectDocumentNumberFull',
                                    suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                                })}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </TopBoxCard>


                            <div style={{display: 'grid', gridTemplateColumns: "150px 200px 200px 180px 1fr 300px"}}>

                                <BoxCard title={'매입처 정보'}>
                                    {inputForm({
                                        title: '매입처코드',
                                        id: 'agencyCode',
                                        suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('agencyCode');
                                            }
                                        }/>
                                    })}
                                    {inputForm({title: '매입처명', id: 'agencyName'})}
                                    {inputForm({title: '담당자', id: 'agencyManagerName'})}
                                    {inputForm({title: '연락처', id: 'agencyManagerPhoneNumber'})}
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
                                        }/>
                                    })}
                                    {inputForm({title: '담당자명', id: 'managerName'})}
                                    {inputForm({title: '전화번호', id: 'phoneNumber'})}
                                    {inputForm({title: '팩스', id: 'faxNumber'})}
                                    {inputForm({title: '이메일', id: 'customerManagerEmail'})}
                                </BoxCard>

                                <BoxCard title={'운송 정보'}>
                                    <div>
                                        <div style={{paddingTop: 8}}>유효기간</div>
                                        <Select id={'validityPeriod'} defaultValue={'0'}
                                                onChange={(src) => onChange({target: {id: 'validityPeriod', value: src}})}
                                                size={'small'} value={info['validityPeriod']} options={[
                                            {value: '0', label: '견적 발행 후 10일간'},
                                            {value: '1', label: '견적 발행 후 30일간'},
                                        ]} style={{width: '100%'}}>
                                        </Select>
                                    </div>
                                    <div>
                                        <div style={{paddingTop: 8}}>결제조건</div>
                                        <Select id={'validityPeriod'} defaultValue={'0'}
                                                onChange={(src) => onChange({target: {id: 'paymentTerms', value: src}})}
                                                size={'small'} value={info['paymentTerms']} options={[
                                            {value: '0', label: '발주시 50% / 납품시 50%'},
                                            {value: '1', label: '납품시 현금결제'},
                                            {value: '2', label: '정기결제'},
                                        ]} style={{width: '100%'}}>
                                        </Select>
                                    </div>
                                    <div style={{marginTop: 8}}>
                                        <div style={{paddingBottom: 3}}>운송조건</div>
                                        <Select id={'shippingTerms'} defaultValue={'0'}
                                                onChange={(src) => onChange({target: {id: 'shippingTerms', value: src}})}
                                                size={'small'} value={info['shippingTerms']} options={[
                                            {value: '0', label: '귀사도착도'},
                                            {value: '1', label: '화물 및 택배비 별도'},
                                        ]} style={{width: '100%',}}/>
                                    </div>
                                    {inputForm({title: 'Delivery(weeks)', id: 'delivery'})}
                                    {inputForm({title: '환율', id: 'exchangeRate', placeholder: '직접기입(자동환율연결x)'})}
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
                                        }/>
                                    })}
                                    {inputForm({title: 'ITEM', id: 'item'})}
                                </BoxCard>
                                <BoxCard title={'ETC'}>
                                    {textAreaForm({title: '지시사항', rows: 4, id: 'instructions'})}
                                    {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                                </BoxCard>
                                <BoxCard title={'드라이브 목록'}>
   {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp infoFileInit={[]} fileRef={fileRef}/>
                                    </div>
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>
                <TableGrid
                    gridRef={gridRef}
                    columns={tableEstimateWriteColumns}
                    tableData={info[listType]}
                    type={'write'}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}
// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

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

})