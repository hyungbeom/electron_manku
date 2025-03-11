import React, {useEffect, useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {orderWriteInitial, printEstimateInitial,} from "@/utils/initialList";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useRouter} from "next/router";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    tooltipInfo
} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {tableOrderWriteColumn} from "@/utils/columnList";
import PrintPo from "@/component/printPo";
import PrintTransactionModal from "@/component/printTransaction";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {getAttachmentFileList, updateOrder} from "@/utils/api/mainApi";
import _ from "lodash";
import {findEstDocumentInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Select from "antd/lib/select";
import Spin from "antd/lib/spin";
import {estimateInfo, orderInfo, rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";

const listType = 'orderDetailList'
export default function OrderUpdate({updateKey, getCopyPage}) {
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);

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


    const userInfo = useAppSelector((state) => state.user);
    // const infoInit = dataInfo?.orderDetail
    // let infoInitFile = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>(orderInfo['defaultInfo'])

    const [mini, setMini] = useState(true);
    const [customerData, setCustomerData] = useState<any>(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [fileList, setFileList] = useState();
    const [originFileList, setOriginFileList] = useState();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {orderDetail, attachmentFileList} = v;
            console.log(attachmentFileList,'attachmentFileList:')
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            setOriginFileList(attachmentFileList);
            setInfo({
                ...orderDetail,
                uploadType: 4,
                managerAdminId: orderDetail['managerAdminId'] ? orderDetail['managerAdminId'] : ''
            })
            orderDetail[listType] = [...orderDetail[listType], ...commonFunc.repeatObject(orderInfo['write']['defaultData'], 100 - orderDetail[listType].length)]

            setTableData(orderDetail[listType]);

            setLoading(false)
        })
    }, [updateKey['order_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);


    async function getDataInfo() {
        return await getData.post('order/getOrderDetail', {
            orderId: updateKey['order_update'],
        }).then(v => {
            return v?.data?.entity;
        })
    }

    const onGridReady = (params) => {
        gridRef.current = params.api;
        // params.api.applyTransaction({add: dataInfo?.orderDetail[listType]});
    };


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        infoData['orderId'] = updateKey['order_update']
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


        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(infoData, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateOrder({data: formData, returnFunc: returnFunc})
    }

    async function returnFunc(e) {
        if (e) {
            await getAttachmentFileList({
                data: {
                    "relatedType": "ORDER",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": info['orderId']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    async function printTransactionStatement() {
        await searchCustomer();
        setIsModalOpen({event1: true, event2: false});
    }

    function printPo() {
        setIsModalOpen({event1: false, event2: true});
    }

    async function searchCustomer() {
        const result = await getData.post('customer/getCustomerListForOrder', {
            customerName: info['customerName']
        })

        if (result?.data?.code === 1) {

            if (result?.data?.entity?.customerList.length) {
                const totalList = gridManage.getAllData(gridRef);
                setCustomerData(v => {
                    return {...v, receiveComp: result?.data?.entity?.customerList[0], list: totalList}
                })
            }
        }

    }


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'documentNumberFull' :
                    await findEstDocumentInfo(e, setInfo)
                    break;
            }
        }
    }


    function copyPage() {

        const totalList = tableRef.current.getSourceData();
        totalList.pop();


        const result = Object.keys(orderInfo['defaultInfo']).map(v => `#${v}`)
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

        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(orderInfo['write']['defaultData'], 100 - totalList.length)];

        getCopyPage('order_write', copyInfo)
    }

    const onCChange = (value: string, e: any) => {
        const findValue = memberList.find(v => v.adminId === value)
        setInfo(v => {
            return {
                ...v,
                estimateManager: findValue.name,
                managerAdminId: e.adminId,
                managerAdminName: e.name,
                managerId: findValue.name,
                managerPhoneNumber: findValue.contactNumber,
                managerFaxNumber: findValue.faxNumber,
                managerEmail: findValue.email
            }
        })
    };

    console.log(info, 'info:s')


    return <Spin spinning={loading} tip={'발주서 수정중...'}>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '505px' : '65px'} calc(100vh - ${mini ? 635 : 195}px)`,
                columnGap: 5
            }}>
                {/*@ts-ignore*/}
                <PrintTransactionModal data={info} customerData={customerData} isModalOpen={isModalOpen}
                                       setIsModalOpen={setIsModalOpen}/>
                {isModalOpen['event2'] &&
                    <PrintPo data={info} gridRef={gridRef} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}

                <MainCard title={'발주서 수정'} list={[
                    {name: '거래명세표 출력', func: printTransactionStatement, type: 'default'},
                    {name: '발주서 출력', func: printPo, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <BoxCard title={''}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 0.6fr 1fr 1fr 1fr',
                                maxWidth: 900,
                                minWidth: 600,
                                columnGap: 15
                            }}>

                                {inputForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,

                                })}
                                {inputForm({
                                    title: '작성자',
                                    id: 'createdBy',
                                    disabled: true,

                                })}

                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                    <select name="languages" id="managerAdminId"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
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


                                {/*{inputForm({title: '담당자', id: 'managerAdminName'})}*/}

                                {inputForm({
                                    title: 'PO No.',
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: '고객사 PO no', id: 'yourPoNo'})}
                            </div>
                        </BoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '150px 200px 200px 1fr 300px',
                            columnGap: 10,
                            marginTop: 10
                        }}>

                            <BoxCard title={'매입처 정보'}>

                                {inputForm({title: 'Messrs', id: 'agencyCode'})}
                                {/*수신자*/}
                                {inputForm({title: 'Attn To', id: 'attnTo'})}
                                {inputForm({title: '매입처명', id: 'agencyName'})}
                            </BoxCard>


                            <BoxCard title={'담당자 정보'}>
                                {inputForm({title: 'Responsibility', id: 'managerId'})}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber'})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber'})}
                                {inputForm({title: 'E-Mail', id: 'managerEmail'})}

                            </BoxCard>
                            <BoxCard title={'세부사항'}>
                                {selectBoxForm({
                                    title: 'Payment Terms', id: '결제 조건', onChange: onChange, data: info, list: [
                                        {value: 'By in advance T/T1', label: '정기결제'},
                                        {value: 'By in advance T/T', label: '현금결제'},
                                        {value: 'Credit Card', label: '카드결제'}
                                    ]
                                })}
                                {inputForm({
                                    title: '납기',
                                    id: 'deliveryTerms',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'Maker', id: 'maker'})}
                                {inputForm({title: 'Item', id: 'item'})}
                                {datePickerForm({title: '예상 입고일', id: 'delivery'})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager'})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                                {textAreaForm({title: '하단태그', rows: 4, id: 'footer'})}
                            </BoxCard>


                            <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                     disabled={!userInfo['microsoftId']}>
                                <DriveUploadComp fileList={fileList} setFileList={setFileList}
                                                 fileRef={fileRef}
                                                 infoRef={infoRef}/>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>


                <Table data={tableData} column={orderInfo['write']} funcButtons={['print']} ref={tableRef}/>
            </div>
        </>
    </Spin>
}

