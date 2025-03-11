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
    tooltipInfo, TopBoxCard
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
import SearchInfoModal from "@/component/SearchAgencyModal";
import {DownloadOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";

const listType = 'orderDetailList'
export default function OrderUpdate({updateKey, getCopyPage}) {
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const [memberList, setMemberList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20,0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

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
            console.log(orderDetail,'attachmentFileList:')
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





    function clearAll() {
        // setInfo({...infoInit});
    }


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <Spin spinning={loading} tip={'LOADING'}>
        <PanelSizeUtil groupRef={groupRef}  storage={'order_update'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}

                         setIsModalOpen={setIsModalOpen}/>
        <>
            {isModalOpen['event2'] &&
                <PrintPo data={info} gridRef={gridRef} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'발주서 수정'} list={[
                    {name: '거래명세표 출력', func: null, type: 'default'},
                    {name: '발주서 출력', func: printPo, type: 'default'},
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <TopBoxCard grid={'100px 70px 70px 120px 120px'}>
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
                            {inputForm({
                                title: '발주서 Po no',
                                id: 'documentNumberFull',
                                disabled : true
                            })}

                            {inputForm({title: '고객사 Po no', id: 'yourPoNo', onChange: onChange, data: info})}
                        </TopBoxCard>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
                                    {inputForm({
                                        title: '매입처코드',
                                        id: 'agencyCode',
                                        suffix: <span style={{cursor: 'pointer'}} onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                openModal('agencyCode');
                                            }
                                        }>🔍</span>,

                                        handleKeyPress: handleKeyPress,


                                    })}
                                    {inputForm({title: '매입처명', id: 'agencyName'})}
                                    {inputForm({title: '매입처 관리번호', id: 'attnTo'})}
                                    {inputForm({title: '담당자', id: 'agencyManagerName'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'담당자 정보'}>
                                    {inputForm({title: '작성자', id: 'managerId', onChange: onChange, data: info})}
                                    {/*{inputForm({title: 'TEL', id: 'managerPhoneNumber', onChange: onChange, data: info})}*/}
                                    {inputForm({title: 'TEL', id: 'managerPhoneNumber'})}
                                    {inputForm({title: 'Fax', id: 'managerFaxNumber'})}

                                    {inputForm({title: 'E-Mail', id: 'managerEmail'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'세부사항'}>
                                    <div style={{paddingBottom: 10}}>
                                        <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>결제조건</div>
                                        <select name="languages" id="paymentTerms"
                                                style={{
                                                    outline: 'none',
                                                    border: '1px solid lightGray',
                                                    height: 23,
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
                                        id: 'deliveryTerms'
                                    })}
                                    {inputForm({title: 'Maker', id: 'maker'})}
                                    {inputForm({title: 'Item', id: 'item'})}
                                    {datePickerForm({title: '예상 입고일', id: 'delivery'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '견적서담당자', id: 'estimateManager'})}
                                    {textAreaForm({title: '비고란', rows: 9, id: 'remarks'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>

                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     infoRef={infoRef}/>

                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[5]} minSize={5}></Panel>
                        </PanelGroup>

                    </div> : null}
                </MainCard>
                <Table data={tableData} column={orderInfo['write']} funcButtons={['print']} ref={tableRef}/>
            </div>
        </>
    </Spin>
}

