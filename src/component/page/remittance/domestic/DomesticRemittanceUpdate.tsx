import React, {useEffect, useRef, useState} from "react";
import {ModalInitList} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, MainCard, radioForm, textAreaForm, TopBoxCard} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {updateRemittance} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {DeleteOutlined, FolderOpenOutlined, FormOutlined} from "@ant-design/icons";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {DRInfo} from "@/utils/column/ProjectInfo";
import {getData} from "@/manage/function/api";
import Tabs from "antd/lib/tabs";
import message from "antd/lib/message";
import {TabsProps} from "antd";
import Order from "@/component/remittance/Order";
import Remittance from "@/component/remittance/Remittance";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Spin from "antd/lib/spin";
import {Actions} from "flexlayout-react";

const listType = 'list';

export default function DomesticRemittanceUpdate({ updateKey, layoutRef, getCopyPage }: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const tableRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 25, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const adminParams = {
        createdId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        managerAdminEmail: userInfo['email']
    }
    const getRemittanceInit = () => {
        const copyInit = _.cloneDeep(DRInfo['defaultInfo'])
        return {
            ...copyInit,
            ...adminParams,
        }
    }


    const [info, setInfo] = useState(getRemittanceInit());
    const [selectOrderList, setSelectOrderList] = useState([]);
    const [sendRemittanceList, setSendRemittanceList] = useState([]);
    console.log(info,'::asd::')
    const getOrderInit = () => {
        return {
            documentNumberFull: '',
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

        setTabNumb('History');

        getDataInfo().then(v => {})
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['domestic_remittance_update']])

    async function getDataInfo() {
        await getData.post('remittance/getRemittanceDetail', {
            "remittanceId": updateKey['domestic_remittance_update']
        }).then(v => {
            const { selectOrderList: garbageList, orderDetailList, remittanceDetail, ...restDetail } = v?.data?.entity;

            // 담당자 찾기
            const findCreator = adminList.find(m => m.adminId === restDetail.createdId);
            const findManager = adminList.find(m => m.adminId === restDetail.managerAdminId);

            // 부분송금액 (송금내역 총액) 계산
            const partialRemittance = remittanceDetail.reduce((sum, row) => sum + ((Number(row.supplyAmount) || 0) + (Number(row.tax) || 0)), 0);

            // 발주서 날짜 정리
            const orderList = orderDetailList.map(v => ({ ...v, writtenDate: v.createdDate }));

            setInfo({
                ...getRemittanceInit(),
                ...restDetail,
                writtenDate: moment(restDetail?.createdDate).format('YYYY-MM-DD'),
                createdBy: findCreator?.name || '',
                managerAdminName : findManager?.name || '',
                partialRemittance: partialRemittance.toLocaleString()
            })
            modalSelected(orderList, partialRemittance);
            const sendRemittanceList = [...remittanceDetail, ...commonFunc.repeatObject(DRInfo['write']['defaultData'], 100 - remittanceDetail?.length)];
            setSendRemittanceList(sendRemittanceList);
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
        if (!selectOrderList?.length) return message.warn('발주서 데이터가 1개 이상이여야 합니다.');
        const tableList = tableRef.current?.getSourceData();
        if (!tableList?.length) return message.warn('송금 데이터가 1개 이상이여야 합니다.');
        const requiredFields = { remittanceRequestDate: '송금 요청 일자', supplyAmount: '공급가액', sendStatus: '송금 상태' };
        const filterTableList = tableList.slice(0, -1).filter(row =>
            Object.keys(requiredFields).some(field => !!row[field])
        );

        if (!filterTableList?.length) return message.warn('송금 데이터가 1개 이상이여야 합니다.');
        for (const [field, label] of Object.entries(requiredFields)) {
            const missing = filterTableList.filter(row => !row[field]);
            if (missing?.length) {
                return message.error(`하위 데이터의 ${label} 을/를 입력해야 합니다.`);
            }
        }

        const selectOrderNos = selectOrderList.map(item => Number(item.orderDetailId))

        const remittanceList = filterTableList.map(v => {
            const tax = v.supplyAmount ? v.supplyAmount * 0.1 : 0;
            const {total, ...item} = v;
            return {
                ...item,
                tax
            }
        })
        console.log(info, 'info:::')
        console.log(selectOrderList, 'selectOrderList:::')
        console.log(remittanceList, 'remittanceList:::')

        setLoading(true);

        delete info['selectOrderList'];
        const formData: any = new FormData();
        Object.entries(info).forEach(([key, value]) => {
            formData.append(key, value ?? '');
        });
        formData.append('selectOrderList',JSON.stringify(selectOrderNos));
        formData.append('sendRemittanceList',JSON.stringify(remittanceList));

        await updateRemittance({data: formData})
            .then(v => {
                if (v?.data?.code === 1) {
                    window.postMessage({message: 'reload', target: 'domestic_remittance_read'}, window.location.origin);
                    notificationAlert('success', '💾 국내 송금 수정완료',
                        <>
                            <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                        </>
                        , null, null, 2
                    )
                    getDataInfo();
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
     * @description 수정 페이지 > 삭제 버튼
     * 송금 > 국내송금 수정
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('remittance/deleteRemittance', {remittanceId: updateKey['domestic_remittance_update']}).then(v => {
            const {code, message} = v.data;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_remittance_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 국내송금 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'domestic_remittance_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
                getCopyPage('domestic_remittance_read', {});
            } else {
                console.log(v?.data?.message);
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
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 하단 탭 관련
     * 송금 > 국내송금 수정
     */
    const [tabNumb, setTabNumb] = useState('History');
    const items: TabsProps['items'] = [
        {
            key: 'Order',
            label: '선택한 발주서 항목',
            children: (
                <div style={{height: 285}}>
                    <Order key={tabNumb} gridRef={gridRef}
                           tableData={selectOrderList} setTableData={setSelectOrderList}
                           setInfo={setInfo} customFunc={getOrderFile}/>
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
        if (tabNumb === 'History' && key === 'Order') {
            const tableList = tableRef.current?.getSourceData();
            // table 컴포넌트 내부에서 total 데이터를 concat 하므로 total 행은 삭제
            const remittanceList = tableList.slice(0, -1);
            setSendRemittanceList(remittanceList);
        }
        setTabNumb(key);
    };

    /**
     * @description 수정 페이지 > 조회 테이블 발주서 항목 더블클릭
     * 송금 > 국내송금 수정
     * 하단의 선택 발주서 리스크 항목 더블클릭시 발주서 상세 조회 > folderId, 파일 리스트 조회
     * @param orderDetail
     */
    async function getOrderFile(orderDetail) {
        if(!orderDetail['documentNumberFull']) {
            message.warn('선택한 발주서 정보를 확인해주세요.');
            return;
        }
        if(orderInfo['documentNumberFull'] === orderDetail['documentNumberFull']) return;

        setLoading(true);
        await getData.post('common/getFileList', orderDetail?.documentNumberFull)
            .then(v => {
                setOrderInfo({
                    documentNumberFull: orderDetail['documentNumberFull'],
                    uploadType: 5,
                    folderId: v?.data?.entity?.folderId
                });
                setFileList(fileManage.getFormatFiles(v?.data?.entity?.fileList));
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
     * 발주서 조회 Modal 에서 선택한 항목 가져오기
     * @param list
     * @param remittance 첫 조회시 넘겨준 부분송금액
     */
    function modalSelected(list = [], remittance = '') {
        if (!list?.length) return;

        setSelectOrderList(prevList => {
            // 발주서 Modal에서 같은 발주서 항목 필터
            const newItems = list.filter(
                newItem => !prevList.some(existing => existing.orderDetailId === newItem.orderDetailId)
            );
            const updatedList = [...prevList, ...newItems];

            // Inquiry No. 정리
            const connectInquiryNos = [];
            for (const item of updatedList || []) {
                const inquiryNo = item.documentNumberFull;
                if (inquiryNo && !connectInquiryNos.includes(inquiryNo)) {
                    connectInquiryNos.push(inquiryNo);
                }
            }
            // 항목 번호 정리
            const orderDetailIds = updatedList.map(row => row.orderDetailId).join(', ');

            // 발주서 총액 계산
            const total = updatedList.reduce((sum, row) => sum + ((Number(row.quantity) || 0) * (Number(row.unitPrice) || 0)), 0);
            const totalAmount = total + (total * 0.1 * 10 / 10);
            let partialRemittance = Number(String(remittance || info.partialRemittance).replace(/,/g, ''));

            // 잔액 계산
            const balance= totalAmount - partialRemittance;

            setInfo(prevInfo => {
                return {
                    ...prevInfo,
                    customerName: updatedList?.[0]?.customerName || '',
                    agencyName: updatedList?.[0]?.agencyName || '',
                    connectInquiryNo: connectInquiryNos.join(', '),
                    orderDetailIds,
                    totalAmount: totalAmount.toLocaleString(),
                    balance: balance.toLocaleString()
                }
            });
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
                gridTemplateRows: `${mini ? '495px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                // overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'국내 송금 수정'} list={[
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'}
                ]} mini={mini} setMini={setMini}>
                    <div ref={infoRef}>
                        <TopBoxCard grid={'110px 70px 70px 120px'}>
                            {datePickerForm({
                                title: '작성일',
                                id: 'writtenDate',
                                disabled: true,
                                data: info
                            })}
                            {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>담당자</div>
                                <select name="languages" id="managerAdminId" onChange={e => {
                                    // 담당자 정보가 현재 작성자 정보가 나와야한다고 함
                                    const admin = adminList.find(v => v.adminId === parseInt(e.target.value))

                                    const adminInfo = {
                                        managerAdminId: admin['adminId'],
                                        managerAdminName: admin['name'],
                                        managerAdminEmail: admin['email']
                                    }
                                    setInfo(v => ({...v, ...adminInfo}))
                                }} style={{
                                    outline: 'none',
                                    border: '1px solid lightGray',
                                    height: 23,
                                    width: '100%',
                                    fontSize: 12,
                                    paddingBottom: 0.5
                                }} value={info?.managerAdminId ?? ''}>
                                    { adminList.map(admin => (
                                        <option key={admin.adminId} value={admin.adminId}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {inputForm({
                                title: '만쿠발주서 No.',
                                id: 'connectInquiryNo',
                                disabled: true,
                                suffix: <span style={{cursor: 'pointer'}} onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        openModal('connectInquiryNo');
                                    }
                                }>🔍</span>,
                            })}
                        </TopBoxCard>

                        <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'발주서 정보'}>
                                    {inputForm({
                                        title: '발주서 No.',
                                        id: 'connectInquiryNo',
                                        onChange: onChange,
                                        data: info,
                                        disabled: true,
                                    })}
                                    {textAreaForm({title: '발주서 항목번호', rows: 4, id: 'orderDetailIds', onChange: onChange, data: info, disabled: true})}
                                    {inputForm({title: '고객사명', id: 'customerName', onChange: onChange, data: info})}
                                    {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'금액 정보'}>
                                    <div style={{fontSize: 12, paddingBottom: 10}}>
                                        <div style={{paddingBottom: 12 / 2, fontWeight: 700}}>총액 (공급가액 + 부가세)</div>
                                        <div style={{display: 'flex'}}>
                                            <input placeholder={''}
                                                   id={'totalAmount'}
                                                   value={info ? info['totalAmount'] : null}
                                                   onKeyDown={(e) => {
                                                       if(e.key === 'Enter') {
                                                           e.currentTarget.blur();
                                                       }
                                                   }}
                                                   onChange={onChange}
                                                   onFocus={(e) => {
                                                       setInfo(prev => ({
                                                           ...prev,
                                                           totalAmount: Number((e.target.value || '0').toString().replace(/,/g, ''))
                                                       }));
                                                   }}
                                                   onBlur={(e) => {
                                                       setInfo(prev => {
                                                           const totalAmount = Number((e.target.value || '0').toString().replace(/,/g, ''));
                                                           const partialRemittance = Number((prev.partialRemittance || '0').toString().replace(/,/g, ''));
                                                           const balance = totalAmount - partialRemittance;
                                                           return {
                                                               ...prev,
                                                               totalAmount: totalAmount.toLocaleString(),
                                                               balance: balance.toLocaleString()
                                                           }
                                                       })
                                                   }}
                                            />
                                            <span style={{marginLeft: -22, paddingTop: 1.5}}></span>
                                        </div>
                                    </div>
                                    {inputForm({
                                        title: '부분송금액',
                                        id: 'partialRemittance',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                    })}
                                    {inputForm({
                                        title: '합계',
                                        id: 'balance',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                    })}
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
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'확인 정보'}>
                                    {textAreaForm({title: '비고란', rows: 13, id: 'remarks', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>드라이브 목록</div>
                                        {
                                            orderInfo['folderId'] ?
                                                <span style={{fontSize: 10, display: 'inline-flex', alignItems: 'center'}}>
                                                    <FolderOpenOutlined style={{paddingRight: 4}}/>{`${orderInfo['documentNumberFull']}`}
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
                            <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                </MainCard>

                <Tabs size={'small'} tabBarStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: 0}} activeKey={tabNumb} items={items} onChange={tabChange}/>

            </div>
    </Spin>
}
