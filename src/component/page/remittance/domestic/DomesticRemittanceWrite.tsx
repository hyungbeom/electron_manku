import React, {useEffect, useRef, useState} from "react";
import {deliveryDaehanInitial, domesticRemittanceInitial, ModalInitList} from "@/utils/initialList";
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
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {saveRemittance} from "@/utils/api/mainApi";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import Table from "@/component/util/Table";
import {remittanceInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import OrderListModal from "@/component/OrderListModal";
import Tabs from "antd/lib/tabs";
import {TabsProps} from "antd";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import ETC from "@/component/delivery/ETC";
import Order from "@/component/remittance/Order";
import Remittance from "@/component/remittance/Remittance";

const listType = 'list';

export default function DomesticRemittanceWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const tableRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_remittance_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

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
    const [remittanceHistoryList, setRemittanceHistoryList] = useState([]);


    useEffect(() => {
        setLoading(true);
        setInfo(getRemittanceInit());
        setFileList([]);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setRemittanceHistoryList(commonFunc.repeatObject(remittanceInfo['write']['defaultData'], 10))
        } else {
            // // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getRemittanceInit(),
                ...copyPageInfo,
                writtenDate: moment().format('YYYY-MM-DD')
            })
            setTableData(copyPageInfo[listType]);
        }
    }, [copyPageInfo]);




    const [tabNumb, setTabNumb] = useState('Order')
    const [orderInfo, setOrderInfo] = useState({...deliveryDaehanInitial, deliveryType: 'CJ'})

    const items: TabsProps['items'] = [
        {
            key: 'Order',
            label: '선택한 발주서 항목',
            children: <Order tableData={selectOrderList} info={orderInfo} setInfo={setOrderInfo} tableRef={tableRef}/>,
        },
        {
            key: 'History',
            label: '송금 내역 리스트',
            children: <Remittance tableData={remittanceHistoryList} info={orderInfo} setInfo={setRemittanceHistoryList} tableRef={tableRef}/>,
        }
    ];

    const tabChange = (key: string) => {
        setTabNumb(key);
    };




    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 송금 > 국내송금 등록
     */
    async function saveFunc() {
        // if (!info['connectInquiryNo']) {
        //     return message.warn('Inquiry No. 가 누락 되었습니다.')
        // }

        setLoading(true);

        const formData: any = new FormData();
        formData.append('customerName','한성웰테크');
        formData.append('agencyName','프로지스트');
        formData.append('managerAdminId',29);
        formData.append('partialRemittanceStatus',2);
        formData.append('remarks','비고란이다~!!!');
        formData.append('selectOrderList',JSON.stringify([100,101,105]));
        formData.append('sendRemittanceList',JSON.stringify([{
            "remittanceRequestDate": "2025-05-02",
            "remittanceDueDate": "2025-05-10",
            "supplyAmount": "50000000",
            "tax": "10%",
            "sendStatus": "SENT",
            "invoiceStatus": "ISSUED"
        },{
            "remittanceRequestDate": "2025-05-02",
            "remittanceDueDate": "2025-05-10",
            "supplyAmount": "50000000",
            "tax": "10%",
            "sendStatus": "SENT",
            "invoiceStatus": "ISSUED"
        }]));

        await saveRemittance({data: formData}).then(v => {
            console.log(v,'v:::')
            // if (v?.data?.code === 1) {
            //     window.postMessage({message: 'reload', target: 'domestic_remittance_read'}, window.location.origin);
            //     notificationAlert('success', '💾 국내 송금 등록완료',
            //         <>
            //             <div>Inquiry No. : {info.connectInquiryNo}</div>
            //             <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
            //         </>
            //         ,
            //         function () {
            //             getPropertyId('domestic_remittance_update', v.data?.entity?.remittanceId)
            //         },
            //         {cursor: 'pointer'}
            //     )
            // } else {
            //     message.error(v?.data?.message);
            // }
        })
        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 송금 > 국내송금 등록
     */
    function clearAll() {
        setInfo(getRemittanceInit())
    }

    /**
     * @description 등록 페이지 > Inquiry No. 검색 버튼
     * 송금 > 국내송금 등록
     * 발주서 조회 Modal > 발주서 선택 항목 가져오기
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    useEffect(() => {
        console.log(selectOrderList, 'selectOrderList:::')


    }, [selectOrderList]);

    return <>
        <PanelSizeUtil groupRef={groupRef} storage={'domestic_remittance_write'}/>
        <SearchInfoModal info={selectOrderList} infoRef={infoRef} setInfo={setSelectOrderList}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen}/>

            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '490px' : '65px'} calc(100vh - ${mini ? 590 : 195}px)`,
                // overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'국내 송금 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div ref={infoRef}>
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
                            {inputForm({title: '항목번호', id: 'customerName', onChange: onChange, data: info})}
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
                                    {inputNumberForm({
                                        title: '공급가액',
                                        id: 'supplyAmount',
                                        onChange: onChange,
                                        data: info,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '부가세',
                                        id: 'surtax',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                    {inputNumberForm({
                                        title: '합계',
                                        id: 'total',
                                        disabled: true,
                                        onChange: onChange,
                                        data: info,
                                        formatter: numbFormatter,
                                        parser: numbParser
                                    })}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'확인 정보'}>
                                    {radioForm({
                                        title: '부분 송금 진행 여부',
                                        id: 'isPartialSend',
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
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     info={info}/>
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                        </PanelGroup>
                    </div> : <></>}
                </MainCard>

                <Tabs size={'small'} tabBarStyle={{paddingLeft: 10, paddingRight: 10, marginBottom: 0}} activeKey={tabNumb} items={items} onChange={tabChange}/>

            </div>
    </>
}
