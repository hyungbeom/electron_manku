import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {
    CopyOutlined,
    DownCircleFilled,
    DownloadOutlined,
    RetweetOutlined,
    SaveOutlined,
    UpCircleFilled
} from "@ant-design/icons";
import {tableOrderWriteColumn,} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {orderDetailUnit, orderWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import TextArea from "antd/lib/input/TextArea";
import _ from "lodash";
import {findEstDocumentInfo} from "@/utils/api/commonApi";
import {saveOrder} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";


const listType = 'orderDetailList'
export default function OrderWriter() {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(orderWriteInitial)
    const copyUnitInit = _.cloneDeep(orderDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const [mini, setMini] = useState(true);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
        managerId: userInfo['name'],
        managerPhoneNumber: userInfo['contactNumber'],
        managerFaxNumber: userInfo['faxNumber'],
        managerEmail: userInfo['email'],
    }

    const [info, setInfo] = useState<any>(infoInit)


// =============================================================================================================
    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {

        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
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
                        disabledDate={commonManage.disabledDate}
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

    // ======================================================================================================
    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'ourPoNo' :
                    await findEstDocumentInfo(e, setInfo)
                    break;
            }
        }
    }


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function saveFunc() {
        if (!info[listType].length) {
           return message.warn('하위 데이터 1개 이상이여야 합니다')
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

        await saveOrder({data : formData, router : router})
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
        })

        setInfo(copyData)
    }

    function clearAll() {
        setInfo({...infoInit});
    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div>
        {/*@ts-ignored*/}
        <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
    </div>

    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <MainCard title={'발주서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <TopBoxCard title={'INQUIRY & PO no'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                            {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                            {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                            {inputForm({title: '담당자', id: 'managerAdminName'})}

                            {inputForm({title: '발주서 PO no', id: 'documentNumberFull'})}
                            {inputForm({
                                placeholder: '폴더생성 규칙 유의',
                                title: '연결 INQUIRY No.',
                                id: 'ourPoNo',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>
                            })}
                            {inputForm({title: '거래처 PO no', id: 'yourPoNo'})}
                        </TopBoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '180px 200px 200px 1fr 300px',
                            columnGap: 10,
                            marginTop: 10
                        }}>

                            <BoxCard title={'CUSTOMER & SUPPLY'}>
                                {inputForm({title: 'Messrs', id: 'agencyCode'})}
                                {inputForm({title: 'Attn To', id: 'attnTo'})}
                                {inputForm({title: '고객사명', id: 'customerName'})}
                            </BoxCard>


                            <BoxCard title={'MANAGER IN CHARGE'}>
                                {inputForm({title: 'Responsibility', id: 'managerId'})}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber'})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber'})}
                                {inputForm({title: 'E-Mail', id: 'managerEmail'})}

                            </BoxCard>
                            <BoxCard title={'LOGISTICS'}>
                                <div>
                                    <div style={{paddingBottom: 3}}>Payment Terms</div>
                                    <Select id={'paymentTerms'} size={'small'} defaultValue={'0'}
                                            onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                            options={[
                                                {value: '0', label: 'By in advance T/T'},
                                                {value: '1', label: 'Credit Card'},
                                                {value: '2', label: 'L/C'},
                                                {value: '3', label: 'Order 30% Before Shipping 70%'},
                                                {value: '4', label: 'Order 50% Before Shipping 50%'},
                                            ]} style={{width: '100%'}}>
                                    </Select>
                                </div>
                                {inputForm({title: 'Delivery Terms', id: 'deliveryTerms'})}
                                {inputForm({title: 'MAKER', id: 'maker'})}
                                {inputForm({title: 'ITEM', id: 'item'})}
                                {inputForm({title: 'Delivery', id: 'delivery'})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager'})}
                                {textAreaForm({title: '비고란', rows: 3, id: 'remarks'})}
                                {textAreaForm({title: '하단태그', rows: 3, id: 'footer'})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'}>
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp infoFileInit={[]} fileRef={fileRef}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={tableOrderWriteColumn}
                    tableData={info[listType]}
                    listType={'orderId'}
                    type={'write'}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}

export const getServerSideProps:any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
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