import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {DownloadOutlined} from "@ant-design/icons";
import {tableOrderWriteColumn,} from "@/utils/columnList";
import {orderWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {findOrderDocumentInfo} from "@/utils/api/commonApi";
import {saveOrder} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";


const listType = 'orderDetailList'
export default function OrderWriter({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();


    const copyInit = _.cloneDeep(orderWriteInitial)

    const userInfo = useAppSelector((state) => state.user);

    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({documentNumberFull: true});
    const [fileList, setFileList] = useState([]);

    const [loading, setLoading] = useState(false);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
        managerId: userInfo['name'],
        managerPhoneNumber: userInfo['contactNumber'],
        managerFaxNumber: userInfo['faxNumber'],
        managerEmail: userInfo['email'],
        createdId: 0,
        customerId: 0
    }
    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit, ...dataInfo, ...adminParams})


    const onGridReady = (params) => {
        gridRef.current = params.api;
        const result = dataInfo?.orderDetailList;
        params.api.applyTransaction({add: result ? result : []});
    };


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'ourPoNo' :
                    await findOrderDocumentInfo(e, setInfo, gridRef)
                    break;
            }
        }
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
            return message.warn('발주서 PO no를 입력하셔야 합니다.')
        }
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }

        setLoading(true)
        const formData: any = new FormData();

        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData)
        await saveOrder({data: formData, router: router})
    }

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 555 : 120}px)`,
                columnGap: 5
            }}>
                <MainCard title={'발주서 작성'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <TopBoxCard title={'INQUIRY & PO no'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info})}

                            {inputForm({
                                title: '발주서 PO no',
                                id: 'documentNumberFull',
                                onChange: onChange,
                                data: info,
                                validate: validate['documentNumberFull']
                            })}
                            {inputForm({
                                placeholder: '폴더생성 규칙 유의',
                                title: '연결 INQUIRY No.',
                                id: 'ourPoNo',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                                onChange: onChange, data: info, handleKeyPress: handleKeyPress
                            })}
                            {inputForm({title: '고객사 PO no', id: 'yourPoNo', onChange: onChange, data: info})}
                        </TopBoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '180px 200px 200px 1fr 300px',
                            columnGap: 10,
                            marginTop: 10
                        }}>

                            <BoxCard title={'매입처 정보'}>
                                {inputForm({title: 'Messrs', id: 'agencyCode', onChange: onChange, data: info})}
                                {inputForm({title: 'Attn To', id: 'attnTo', onChange: onChange, data: info})}
                                {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard title={'당담자 정보'}>
                                {inputForm({title: 'Responsibility', id: 'managerId', onChange: onChange, data: info})}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber', onChange: onChange, data: info})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber', onChange: onChange, data: info})}
                                {inputForm({title: 'E-Mail', id: 'managerEmail', onChange: onChange, data: info})}

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
                                {inputForm({
                                    title: 'Delivery Terms',
                                    id: 'deliveryTerms',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'MAKER', id: 'maker', onChange: onChange, data: info})}
                                {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                {inputForm({title: 'Delivery', id: 'delivery', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', rows: 6, id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'} disabled={!info['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     numb={4}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={tableOrderWriteColumn}
                    onGridReady={onGridReady}
                    type={'write'}
                    funcButtons={['orderUpload', 'orderAdd', 'delete', 'print']}
                />

            </div>
        </LayoutComponent>
    </>
}

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
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }


})