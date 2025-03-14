import React, {useEffect, useRef, useState} from "react";
import {DownloadOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {getAttachmentFileList, saveOrder} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData} from "@/manage/function/api";
import Spin from "antd/lib/spin";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import PrintPo from "@/component/printPo";
import moment from "moment/moment";
import {estimateInfo, orderInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";


const listType = 'orderDetailList'
export default function OrderWrite({copyPageInfo, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('order_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false, event3: false});
    const [memberList, setMemberList] = useState([]);
    const [originFileList, setOriginFileList] = useState([]);
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



    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            console.log(layoutRef.current,'layoutRef.current:')
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if(activeTab?.renderedName === '발주서 등록'){
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'ourPoNo' :
                    setLoading(true)
                    await getData.post('estimate/getEstimateDetail', {
                        "estimateId": '',
                        documentNumberFull: e.target.value.toUpperCase()
                    }).then(async v => {
                        if (v.data.code === 1) {
                            const {estimateDetail} = v.data?.entity
                            setFileList([])
                            setOriginFileList([])
                            const dom = infoRef.current.querySelector('#ourPoNo');
                            // const result = await findDocumentInfo(e, setInfo);
                            await getData.post('estimate/generateDocumentNumberFull', {
                                type: 'ORDER',
                                documentNumberFull: dom.value.toUpperCase()
                            }).then(src => {

                                console.log(estimateDetail, 'estimateDetail::')
                                commonManage.setInfo(infoRef, {
                                    ...estimateDetail,
                                    documentNumberFull: src.data.code === 1 ? src.data.entity.newDocumentNumberFull : '',
                                    validityPeriod: '견적 발행 후 10일간',
                                    paymentTerms: '발주시 50% / 납품시 50%',
                                    shippingTerms: '귀사도착도',
                                    writtenDate: moment().format('YYYY-MM-DD'),
                                })
                                if(estimateDetail) {
                                    setTableData([...estimateDetail?.estimateDetailList, ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 100 - estimateDetail?.estimateDetailList.length)])
                                }
                            }, err => console.log('???'));
                            setLoading(false)
                        } else {
                            setLoading(false)
                        }
                    }, err => {
                        console.log(err, ':::err:::')
                        setLoading(false)
                    })


                    // await findOrderDocumentInfo(e, setInfo, setTableData, memberList)
                    break;
                case 'agencyCode' :

                    await findCodeInfo(e, setInfo, openModal, infoRef)
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

        if (!infoData['documentNumberFull']) {
            const dom = infoRef.current.querySelector('#documentNumberFull');
            dom.style.borderColor = 'red'
            return message.warn('Inquiry No. 정보가 누락되었습니다.')
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

        await saveOrder({data: formData, router: router, returnFunc: returnFunc})
        setLoading(false)
    }

    async function returnFunc(code, msg, data) {
        const dom = infoRef.current.querySelector('#documentNumberFull');
        if (code === 1) {

            await getAttachmentFileList({
                data: {
                    "relatedType": "ORDER",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": data?.orderId
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                notificationAlert('success', '💾발주서 등록완료',
                    <>
                        <div>Inquiry No. : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('order_update', data?.orderId)
                    },
                    {cursor: 'pointer'}
                )
                setLoading(false)
            })
            setLoading(false)
        } else {
            notificationAlert('error', '⚠️작업실패',
                <>
                    <div>Inquiry No. : {dom.value}</div>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , function () {
                    alert('작업 로그 페이지 참고')
                },
                {cursor: 'pointer'}
            )
            setLoading(false)
        }
    }

    function clearAll() {
        setInfo({...infoInit});
    }


    function printPo() {
        setIsModalOpen({event1: false, event2: false, event3: true});
    }


    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }


    async function printTransactionStatement() {
        alert('쉐어포인트 자동저장')
    }

    console.log(isModalOpen,'isModalOpen:')
    return <Spin spinning={loading} tip={'LOADING'}>
        <PanelSizeUtil groupRef={groupRef} storage={'order_write'}/>
        {(isModalOpen['event1']  || isModalOpen['agencyCode'] || isModalOpen['event2'] )&&<SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                                                                             open={isModalOpen}

                                                                             setIsModalOpen={setIsModalOpen}/>}
        <>
            {isModalOpen['event3'] &&
                <PrintPo data={info} infoRef={infoRef} tableRef={tableRef} isModalOpen={isModalOpen}
                         setIsModalOpen={setIsModalOpen} memberList={memberList}/>}
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'발주서 작성'} list={[
                    {name: '거래명세표 출력', func: printTransactionStatement, type: 'default'},
                    {name: '발주서 출력', func: printPo, type: 'default'},
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <TopBoxCard grid={'100px 70px 70px 120px 120px 120px'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,

                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                <select name="languages" id="managerAdminId" onChange={e => {
                                    const member = memberList.find(v => v.adminId === parseInt(e.target.value))

                                    if (member) {
                                        const {name, faxNumber, contactNumber, email} = member;

                                        const sendObj = {
                                            managerId: name,
                                            managerPhoneNumber: contactNumber,
                                            managerFaxNumber: faxNumber,
                                            managerEmail: email
                                        }
                                        commonManage.setInfo(infoRef, sendObj);
                                    }
                                }}
                                        style={{
                                            outline: 'none',
                                            border: '1px solid lightGray',
                                            height: 23,
                                            width: '100%',
                                            fontSize: 12,
                                            paddingBottom: 0.5
                                        }}>
                                    {
                                        options?.map(v => {
                                            return <option value={v.value}>{v.label}</option>
                                        })
                                    }
                                </select>
                            </div>
                            {inputForm({
                                title: '연결 Inquiry No.',
                                id: 'ourPoNo',
                                suffix: <DownloadOutlined style={{cursor: 'pointer'}}/>,
                                handleKeyPress: handleKeyPress
                            })}
                            {inputForm({
                                title: '발주서 Po no',
                                id: 'documentNumberFull',

                            })}

                            {inputForm({title: '고객사 Po no', id: 'yourPoNo'})}
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
                <Table data={tableData} column={orderInfo['write']} funcButtons={['print']} ref={tableRef} type={'order_write_column'}/>
            </div>
        </>
    </Spin>
}
