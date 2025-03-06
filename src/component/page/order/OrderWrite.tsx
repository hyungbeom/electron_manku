import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {DownloadOutlined} from "@ant-design/icons";
import {tableOrderWriteColumn,} from "@/utils/columnList";
import {estimateDetailUnit, estimateRequestDetailUnit, orderDetailUnit, orderWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Select from "antd/lib/select";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import TableGrid from "@/component/tableGrid";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {findOrderDocumentInfo} from "@/utils/api/commonApi";
import {saveOrder} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FormItem from "antd/lib/form/FormItem";
import Input from "antd/lib/input";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import PrintPo from "@/component/printPo";
import moment from "moment/moment";


const listType = 'orderDetailList'
export default function OrderWrite({dataInfo = [],  copyPageInfo}) {
    const [ready, setReady] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
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


    const options = memberList?.map((item) => ({
        ...item,
        value: item.adminId,
        label: item.name,
    }));
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
        estimateManager: userInfo['name'],
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
        ...adminParams,
        writtenDate: moment().format('YYYY-MM-DD')
    }

    const [info, setInfo] = useState<any>(infoInit)


    const onGridReady = (params) => {
        gridRef.current = params.api;
        setInfo(isEmptyObj(copyPageInfo['order_write'])?copyPageInfo['order_write'] : infoInit);
        params.api.applyTransaction({add: copyPageInfo['order_write'][listType] ? copyPageInfo['order_write'][listType] : commonFunc.repeatObject(orderDetailUnit, 10)});
        setReady(true)
    };

    useEffect(() => {
        if(ready) {
            if(copyPageInfo['order_write'] && !isEmptyObj(copyPageInfo['order_write'])){
                setInfo(infoInit);
                gridManage.resetData(gridRef,commonFunc.repeatObject(orderDetailUnit, 10))
            }else{
                setInfo({...copyPageInfo['order_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')});
                gridManage.resetData(gridRef, copyPageInfo['order_write'][listType])
            }
        }
    }, [copyPageInfo['order_write'],ready]);


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'ourPoNo' :
                    await findOrderDocumentInfo(e, setInfo, gridRef, memberList)
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
        await saveOrder({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false)
    }

    function returnFunc(code, msg) {
        if (code === -20001) {
            message.error('발주서 PO no가 중복되었습니다.');
            setValidate(v => {
                return {...v, documentNumberFull: false}
            })
        } else {
            message.error(msg);
        }
        setLoading(false)
    }

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }


    const onCChange = (value: string, e: any) => {
        const findValue = memberList.find(v => v.adminId === value)
        console.log(findValue, 'value:')
        setInfo(v => {
            return {
                ...v,
                managerAdminId: e.adminId,
                estimateManager: findValue.name,
                managerAdminName: e.name,
                managerId: findValue.name,
                managerPhoneNumber: findValue.contactNumber,
                managerFaxNumber: findValue.faxNumber,
                managerEmail: findValue.email
            }
        })
    };

    function printPo() {
        setIsModalOpen({event1: false, event2: true});
    }


    return <Spin spinning={loading} tip={'발주서 등록중...'}>
        <>
            {isModalOpen['event2'] && <PrintPo data={info} gridRef={gridRef} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 630 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'발주서 작성'} list={[
                    {name: '거래명세표 출력', func: null, type: 'default'},
                    {name: '발주서 출력', func: printPo, type: 'default'},
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <TopBoxCard title={''} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, onChange: onChange, data: info})}
                            <div>
                                <div style={{fontSize : 12}}>담당자</div>
                                <Select style={{width: '100%', marginTop : 5, fontSize : 12}} size={'small'}
                                        showSearch
                                        value={info['estimateManager']}
                                        placeholder="Select a person"
                                        optionFilterProp="label"
                                        onChange={onCChange}
                                        options={options}
                                />
                            </div>

                            {inputForm({
                                title: '발주서 PO no',
                                id: 'documentNumberFull',
                                onChange: onChange,
                                data: info,
                                validate: validate['documentNumberFull']
                            })}
                            {inputForm({
                                placeholder: '폴더생성 규칙 유의',
                                title: '연결 INQUIRY NO.',
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

                            <BoxCard title={'담당자 정보'}>
                                {inputForm({title: 'Responsibility', id: 'managerId', onChange: onChange, data: info})}
                                {/*{inputForm({title: 'TEL', id: 'managerPhoneNumber', onChange: onChange, data: info})}*/}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber', onChange: onChange, data: info})}

                                <div style={{fontSize: 12, paddingBottom: 10, width: '100%'}}>
                                    <div style={{marginBottom: 5}}>Tel</div>
                                    <div style={{display : 'flex'}}>
                                        {/*@ts-ignored*/}
                                        <PhoneInput disableDropdown={true}  country={"kr"} style={{width : 60}} inputStyle={{display: "none"}}
                                                    buttonStyle={{width: 40, height: 23}}/>
                                        <Input value={info['managerPhoneNumber']} id={'managerPhoneNumber'} onChange={onChange} size={'small'} style={{width : '100%', fontSize : 12, height : 23}}/>
                                    </div>
                                </div>
                                {inputForm({title: 'E-Mail', id: 'managerEmail', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'LOGISTICS'}>
                                {selectBoxForm({
                                    title: 'paymentTerms', id: 'paymentTerms', onChange: src =>onChange({target: {id: 'paymentTerms', value: src}}), data: info, list: [
                                        {value: 'By in advance T/T', label: 'By in advance T/T'},
                                        {value: 'Credit Card', label: 'Credit Card'},
                                        {value: 'L/C', label: 'L/C'},
                                        {
                                            value: 'Order 30% Before Shipping 70%',
                                            label: 'Order 30% Before Shipping 70%'
                                        },
                                        {
                                            value: 'Order 50% Before Shipping 50%',
                                            label: 'Order 50% Before Shipping 50%'
                                        },
                                    ]
                                })}

                                {inputForm({
                                    title: 'Delivery Terms',
                                    id: 'deliveryTerms',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'MAKER', id: 'maker', onChange: onChange, data: info})}
                                {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                {datePickerForm({title: 'Delivery', id: 'delivery', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', rows: 9, id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
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
        </>
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
    const list: any = result?.data?.entity?.adminList;
    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data, managerList: list}}
    } else {

        return {props: {managerList: list}}
    }


})