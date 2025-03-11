import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {DownloadOutlined, FileSearchOutlined} from "@ant-design/icons";
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
import {findCodeInfo, findOrderDocumentInfo} from "@/utils/api/commonApi";
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
import {estimateInfo, orderInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import SearchInfoModal from "@/component/SearchAgencyModal";


const listType = 'orderDetailList'
export default function OrderWrite({dataInfo = [],  copyPageInfo}) {
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)


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
            setMemberList(v?.data?.entity?.adminList)
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


    const copyInit = _.cloneDeep(orderInfo['defaultInfo'])

    const userInfo = useAppSelector((state) => state.user);

    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({documentNumberFull: true});
    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
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



    useEffect(() => {
        if (!isEmptyObj(copyPageInfo['order_write'])) {
            // copyPageInfo 가 없을시
            setInfo(infoInit);
            setTableData(commonFunc.repeatObject(orderInfo['write']['defaultData'], 100))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({...copyPageInfo['order_write'], ...adminParams, writtenDate: moment().format('YYYY-MM-DD')});
            setTableData(copyPageInfo['order_write'][listType])
        }
    }, [copyPageInfo['order_write']]);


    useEffect(() => {
        commonManage.setInfo(infoRef, info, userInfo['adminId']);
    }, [info, memberList]);


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'ourPoNo' :
                    await findOrderDocumentInfo(e, setInfo, setTableData, memberList)
                    break;
                case 'agencyCode' :
                    await findCodeInfo(e, setInfo, openModal, '')
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
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];


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


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading} tip={'발주서 등록중...'}>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>
        <>
            {isModalOpen['event2'] && <PrintPo data={info} gridRef={gridRef} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}
            <div ref={infoRef} style={{
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

                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
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
                                placeholder: '폴더생성 규칙 유의',
                                title: '연결 Inquiry No.',
                                id: 'ourPoNo',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                                handleKeyPress: handleKeyPress
                            })}
                            {inputForm({
                                title: '발주서 PO no',
                                id: 'documentNumberFull',

                                validate: validate['documentNumberFull']
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
                                {inputForm({
                                    title: '매입처코드',
                                    id: 'agencyCode',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('agencyCode');
                                        }
                                    }/>,

                                    handleKeyPress: handleKeyPress,


                                })}
                                {inputForm({title: '매입처명', id: 'agencyName'})}
                                {inputForm({title: '매입처 관리번호', id: 'attnTo'})}
                                {inputForm({title: '담당자', id: 'attnTo'})}
                            </BoxCard>

                            <BoxCard title={'담당자 정보'}>
                                {inputForm({title: '작성자', id: 'managerId', onChange: onChange, data: info})}
                                {/*{inputForm({title: 'TEL', id: 'managerPhoneNumber', onChange: onChange, data: info})}*/}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber'})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber'})}

                                {inputForm({title: 'E-Mail', id: 'managerEmail'})}
                            </BoxCard>
                            <BoxCard title={'세부사항'}>
                                <div style={{paddingBottom: 10}}>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>결제조건</div>
                                    <select name="languages" id="paymentTerms"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 22,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        <option value={'발주시 50% / 납품시 50%'}>발주시 50% / 납품시 50%</option>
                                        <option value={'현금결제'}>현금결제</option>
                                        <option value={'선수금'}>선수금</option>
                                        <option value={'정기결제'}>정기결제</option>
                                    </select>
                                </div>
                                {inputForm({
                                    title: '납기',
                                    id: 'deliveryTerms',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'Maker', id: 'maker', onChange: onChange, data: info})}
                                {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                {datePickerForm({title: '예상 입고일', id: 'delivery'})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager'})}
                                {textAreaForm({title: '비고란', rows: 9, id: 'remarks'})}
                            </BoxCard>
                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     infoRef={infoRef}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>

                <Table data={tableData} column={orderInfo['write']} funcButtons={['print']} ref={tableRef}/>

            </div>
        </>
    </Spin>
}
