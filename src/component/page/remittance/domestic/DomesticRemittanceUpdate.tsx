import React, {useEffect, useRef, useState} from "react";
import {domesticRemittanceInitial, ModalInitList} from "@/utils/initialList";
import {
    BoxCard,
    inputForm,
    inputNumberForm,
    MainCard,
    numbFormatter,
    numbParser,
    radioForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {saveRemittance} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {FolderOpenOutlined, RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {orderInfo, remittanceInfo} from "@/utils/column/ProjectInfo";
import {getData} from "@/manage/function/api";
import Tabs from "antd/lib/tabs";
import message from "antd/lib/message";
import {TabsProps} from "antd";
import Order from "@/component/remittance/Order";
import Remittance from "@/component/remittance/Remittance";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Spin from "antd/lib/spin";

const listType = 'list';

export default function DomesticRemittanceUpdate({ updateKey, getCopyPage }: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const tableRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_update');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

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

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const userInfo = useAppSelector((state) => state.user);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getRemittanceInit = () => {
        const copyInit = _.cloneDeep(domesticRemittanceInitial)
        return {
            ...copyInit,
            ...adminParams,
        }
    }

    const [info, setInfo] = useState(getRemittanceInit());
    const [selectOrderList, setSelectOrderList] = useState([]);
    const [sendRemittanceList, setSendRemittanceList] = useState([]);

    const getOrderInit = () => {
        return {
            orderId: 0,
            uploadType: 5,
            folderId: ''
        }
    }
    const [orderInfo, setOrderInfo] = useState(getOrderInit());
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setLoading(true);
        setInfo(getRemittanceInit());
        setSelectOrderList([]);
        setSendRemittanceList([]);
        setOrderInfo(getOrderInit());
        setFileList([]);
        getDataInfo().then(v => {
            const { remittanceDetail, selectOrderList, remittanceList } = v;
            console.log(remittanceDetail, 'ㅇㅇㅇㅇ:::')
            setInfo({
                ...getRemittanceInit(),
                ...remittanceDetail,
                managerAdminId: remittanceDetail['managerAdminId'] ? remittanceDetail['managerAdminId'] : '',
                managerAdminName: remittanceDetail['managerAdminName'] ? remittanceDetail['managerAdminName'] : '',
                createdBy: remittanceDetail['createdBy'] ? remittanceDetail['createdBy'] : ''
            })
            setSelectOrderList(selectOrderList);
            const sendRemittanceList = [...remittanceList, ...commonFunc.repeatObject(remittanceInfo['write']['defaultData'], 100 - remittanceList?.length)];
            setSendRemittanceList(sendRemittanceList);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['domestic_remittance_update']])

    async function getDataInfo() {
        return await getData.post('remittance/getRemittanceDetail', {
            "remittanceId": updateKey['domestic_remittance_update']
        }).then(v => {
            const { orderDetailList, remittanceDetail, ...restDetail } = v?.data?.entity;

            const findAdmin = memberList.find(m => m.adminId === restDetail.managerAdminId);
            // Inquiry No. 정리
            const connectInquiryNos = [];
            for (const item of orderDetailList) {
                const inquiryNo = item.documentNumberFull;
                if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                    connectInquiryNos.push(inquiryNo);
                }
            }
            // 항목 번호 정리
            const selectOrderList = JSON.parse(restDetail?.selectOrderList || '[]');

            // 선택 발주서 리스트 작성일자 정리
            const orderList = orderDetailList.map(v => {
                return { ...v, writtenDate: v.createdDate}
            });
            const total = orderList.reduce((sum, row) => {
                const quantity = parseFloat(row.quantity);
                const unitPrice = parseFloat(row.unitPrice);

                const q = isNaN(quantity) ? 0 : quantity;
                const p = isNaN(unitPrice) ? 0 : unitPrice;

                return sum + q * p;
            }, 0);


            return {
                remittanceDetail: {
                    ...restDetail,
                    connectInquiryNo: Array.isArray(connectInquiryNos) ? connectInquiryNos.join(', ') : '',
                    orderDetailIds: Array.isArray(selectOrderList) ? selectOrderList.join(', ') : '',
                    managerAdminName : findAdmin?.name || '',
                    totalAmount: total,
                    balance: total - (restDetail.partialRemittance || 0)
                },
                selectOrderList: orderList,
                remittanceList: remittanceDetail
            }
        });
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 송금 > 국내송금 수정
     */
    async function saveFunc() {
        // if (!info['connectInquiryNo']) {
        //     return message.warn('Inquiry No. 가 누락 되었습니다.')
        // }

        const selectOrderList = [];
        gridRef.current.forEachNode(node => selectOrderList.push(node.data));
        if (!selectOrderList?.length) return message.warn('발주서 데이터가 1개 이상이여야 합니다.');
        const selectOrderNos = selectOrderList.map(item => item.orderDetailId)
        console.log(selectOrderList, '선택한 발주서 리스트:::')

        const tableList = tableRef.current?.getSourceData();
        if (!tableList?.length) return message.warn('송금 데이터가 1개 이상이여야 합니다.');
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['supplyAmount'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.sendStatus)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 송금 여부를 입력해야 합니다.')
        }

        const remittanceList = filterTableList.map(v => {
            const tax = v.supplyAmount ? v.supplyAmount * 0.1 : 0;
            const { total, ...item } = v;
            return {
                ...item,
                tax,
                // total: (v.supplyAmount || 0) + tax
            }
        })
        console.log(remittanceList, '부분송금 입력한 리스트:::')
        console.log(info, 'info::::')

        setLoading(true);

        const formData: any = new FormData();
        Object.entries(info).forEach(([key, value]) => {
            formData.append(key, value ?? '');
        });
        formData.append('selectOrderList',JSON.stringify(selectOrderNos));
        formData.append('sendRemittanceList',JSON.stringify(remittanceList));

        await saveRemittance({data: formData})
            .then(v => {
                console.log(v,'v:::')
                if (v?.data?.code === 1) {
                    window.postMessage({message: 'reload', target: 'domestic_remittance_read'}, window.location.origin);
                    notificationAlert('success', '💾 국내 송금 등록완료',
                        <>
                            <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        ,
                        // function () {
                        //     getPropertyId('domestic_remittance_update', v?.data?.entity?.remittanceId)
                        // },
                        // {cursor: 'pointer'}
                    )
                } else {
                    console.warn(v?.data?.message);
                    notificationAlert('error', '⚠️ 작업실패',
                        <>
                            <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , function () {
                            alert('작업 로그 페이지 참고')
                        },
                        {cursor: 'pointer'}
                    )
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /**
     * @description 수정 페이지 > 하단 탭 관련
     * 송금 > 국내송금 수정
     */
    const [tabNumb, setTabNumb] = useState('Order');
    const items: TabsProps['items'] = [
        {
            key: 'Order',
            label: '선택한 발주서 항목',
            children: (
                <div style={{height: 285}}>
                    <Order key={tabNumb} gridRef={gridRef}
                           tableData={selectOrderList} setTableData={setSelectOrderList}
                           setInfo={setInfo} customFunc={getOrderDetail}/>
                </div>
            )
        },
        {
            key: 'History',
            label: '송금 내역 리스트',
            children: (
                <div style={{height: 330}}>
                    <Remittance key={tabNumb} tableRef={tableRef} tableData={sendRemittanceList}
                                setInfo={setInfo}/>
                </div>
            )
        }
    ];
    const tabChange = (key: string) => {
        setTabNumb(key);
    };

    /**
     * @description 수정 페이지 > 조회 테이블 발주서 항목 더블클릭
     * 송금 > 국내송금 수정
     * 하단의 선택 발주서 리스크 항목 더블클릭시 발주서 상세 조회 > folderId, 파일 리스트 조회
     * @param orderDetail
     */
    async function getOrderDetail(orderDetail) {
        if(!orderDetail['orderId']) {
            message.warn('선택한 발주서 정보를 확인해주세요.');
            return;
        }
        if(orderInfo['orderId'] === orderDetail['orderId']) return;

        setLoading(true);
        await getData.post('order/getOrderDetail', {orderId: orderDetail['orderId']})
            .then(v => {
                setOrderInfo({
                    ...v?.data?.entity?.orderDetail,
                    uploadType: 5
                })
                setFileList(fileManage.getFormatFiles(v?.data?.entity?.attachmentFileList));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    /**
     * @description 수정 페이지 > Inquiry No. 검색 버튼 > 발주서 조회 Modal
     * 송금 > 국내송금 수정
     * 발주서 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 수정 페이지 > 발주서 조회 Modal
     * Return Function
     * 발주서 조회 Modal에서 선택한 항목 가져오기
     * @param list
     */
    function modalSelected(list) {
        setSelectOrderList(prevList => {
            const newItems = list.filter(
                newItem => !prevList.some(existing => existing.orderDetailId === newItem.orderDetailId)
            );
            const updatedList = [...prevList, ...newItems];
            const total = updatedList.reduce((sum, row) => {
                const quantity = parseFloat(row.quantity);
                const unitPrice = parseFloat(row.unitPrice);

                const q = isNaN(quantity) ? 0 : quantity;
                const p = isNaN(unitPrice) ? 0 : unitPrice;

                return sum + q * p;
            }, 0);

            const orderDetailIds = updatedList.map(row => row.orderDetailId).join(', ');

            const connectInquiryNos = [];
            for (const item of updatedList) {
                const inquiryNo = item.documentNumberFull;
                if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                    connectInquiryNos.push(inquiryNo);
                }
            }

            setInfo(prevInfo => ({
                ...prevInfo,
                customerName: updatedList[0].customerName,
                agencyName: updatedList[0].agencyName,
                connectInquiryNo: connectInquiryNos.join(', '),
                orderDetailIds,
                totalAmount: total,
                balance: total - (prevInfo.partialRemittance || 0),
            }));
            return updatedList;
        });
    }

    return <Spin spinning={loading}>
        {/*<div style={{height: 'calc(100vh - 90px)'}}>*/}
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_remittance_update'}/>
            <SearchInfoModal info={selectOrderList} infoRef={infoRef} setInfo={setSelectOrderList}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen} returnFunc={modalSelected}/>

            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '490px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                // overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'국내 송금 수정'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    // {
                    //     name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                    //     func: clearAll,
                    //     type: 'danger'
                    // }
                ]} mini={mini} setMini={setMini}>
                    <div ref={infoRef}>
                        <TopBoxCard grid={'200px 200px 200px 200px 180px'}>
                            {/*{inputForm({*/}
                            {/*    title: 'Inquiry No.',*/}
                            {/*    id: 'connectInquiryNo',*/}
                            {/*    onChange: onChange,*/}
                            {/*    data: info,*/}
                            {/*    disabled: true,*/}
                            {/*    suffix: <FileSearchOutlined style={{cursor: 'pointer', color: 'black'}} onClick={*/}
                            {/*        (e) => {*/}
                            {/*            e.stopPropagation();*/}
                            {/*            openModal('connectInquiryNo');*/}
                            {/*        }*/}
                            {/*    }/>*/}
                            {/*})}*/}
                            {inputForm({
                                title: 'Inquiry No.',
                                id: 'connectInquiryNo',
                                onChange: onChange,
                                data: info,
                                disabled: true,
                                suffix: <span style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('connectInquiryNo');
                                    }
                                }>🔍</span>,
                            })}
                            {inputForm({title: '항목번호', id: 'orderDetailIds', onChange: onChange, data: info})}
                            {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
                            {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info})}
                            {inputForm({
                                title: '담당자',
                                id: 'managerAdminName',
                                onChange: onChange,
                                data: info
                            })}
                        </TopBoxCard>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'금액 정보'}>
                                    {inputForm({
                                        title: '총액',
                                        id: 'totalAmount',
                                        onChange: onChange,
                                        data: info,
                                        // parser: numbParser
                                    })}
                                    {inputForm({
                                        title: '부분송금액',
                                        id: 'partialRemittance',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        // formatter: numbFormatter,
                                        // parser: numbParser
                                    })}
                                    {inputForm({
                                        title: '합계',
                                        id: 'balance',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        // formatter: numbFormatter,
                                        // parser: numbParser
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'확인 정보'}>
                                    {radioForm({
                                        title: '부분 송금 진행 여부',
                                        id: 'partialRemittanceStatus',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '완료', title: '완료'},
                                            {value: '진행중', title: '진행중'},
                                            {value: '', title: '해당없음'}
                                        ]
                                    })}
                                    {textAreaForm({title: '비고란', rows: 10, id: 'remarks'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                {/*<BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>*/}
                                {/*    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}*/}
                                {/*                     info={orderInfo} type={'remittance'} key={orderInfo?.orderId}/>*/}
                                {/*</BoxCard>*/}

                                <BoxCard title={
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>드라이브 목록</div>
                                        {
                                            orderInfo['folderId'] ?
                                                <span>
                                                    <FolderOpenOutlined/> {`${orderInfo['documentNumberFull']}`}
                                                </span>
                                                : <></>
                                        }
                                    </div>
                                } disabled={!userInfo['microsoftId'] || !orderInfo?.folderId}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                         info={orderInfo} type={'remittance'} key={orderInfo?.folderId}/>
                                    </div>
                                </BoxCard>


                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                </MainCard>

                <Tabs size={'small'} tabBarStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: 0}} activeKey={tabNumb} items={items} onChange={tabChange}/>

            </div>
    </Spin>
}
