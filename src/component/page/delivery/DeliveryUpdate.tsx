import React, {memo, useEffect, useRef, useState} from "react";
import {ModalInitList,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import {MainCard} from "@/utils/commonForm";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import {TabsProps} from "antd";
import Tabs from "antd/lib/tabs";
import ETC from "@/component/delivery/ETC";
import message from "antd/lib/message";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import Spin from "antd/lib/spin";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {
    CopyOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileDoneOutlined,
    FormOutlined
} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import Button from "antd/lib/button";
import Popconfirm from "antd/lib/popconfirm";
import {tableSelectOrderReadColumns} from "@/utils/columnList";
import moment from "moment/moment";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {DCInfo, deliveryInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Actions} from "flexlayout-react";
import {deleteDelivery} from "@/utils/api/mainApi";

function DeliveryUpdate({updateKey, layoutRef, getCopyPage}:any){
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const infoRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const adminParams = {
        createdId: userInfo['adminId'],
        createdBy: userInfo['name'],
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
    }
    const getDeliveryInit = () => {
        const copyInit = _.cloneDeep(deliveryInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams,
        }
    }
    const [info, setInfo] = useState(getDeliveryInit());

    const [selectOrderList, setSelectOrderList] = useState([]);
    const [totalRow, setTotalRow] = useState(0);
    const isGridLoad = useRef(false);

    useEffect(() => {
        setLoading(true);

        setInfo(getDeliveryInit());
        setTabNumb('CJ');
        setSelectOrderList([]);
        setTotalRow(0);

        getDataInfo().then(v => {})
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['delivery_update']])

    async function getDataInfo() {
        await getData.post('delivery/getDeliveryDetail', {deliveryId: updateKey['delivery_update']}).then(v => {
            const { deliveryDetailInfo: selectOrderList, deliveryInfo: deliveryDetail = {} } = v?.data?.entity ?? {};

            // 저장된 값으로 탭 선택
            setTabNumb(deliveryDetail.deliveryType ?? 'CJ');

            const orderDetailIds = deliveryDetail?.selectOrderList ? JSON.parse(deliveryDetail?.selectOrderList).join(', ') : '';
            setInfo({
                ...getDeliveryInit(),
                ...deliveryDetail,
                orderDetailIds
            })
            setSelectOrderList(selectOrderList);
        })
    }

    useEffect(() => {
        if(!isGridLoad.current) return;
        gridManage.resetData(gridRef, selectOrderList);
        setTotalRow(selectOrderList?.length ?? 0);
    }, [selectOrderList]);

    /**
     * @description ag-grid 테이블 초기 rowData 요소 '[]' 초기화 설정
     * @param params ag-grid 제공 event 파라미터
     */
    const onGridReady = async (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: []});
        setTotalRow(0);
        isGridLoad.current = true;
    };

    /**
     * @description 수정 페이지 > 수정 버튼
     * 배송 > 배송 수정
     */
    async function saveFunc() {
        try {
            setLoading(true);

            const selectOrderNos = selectOrderList.map(item => Number(item.orderDetailId))
            const copyInfo = {
                ..._.cloneDeep(info),
                sendSelectOrderList: selectOrderNos
            }
            console.log(copyInfo, 'info :::')
            const res = await getData.post('delivery/updateDelivery', copyInfo);
            if (res?.data?.code !== 1) {
                console.warn(res?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
                return;
            }
            window.postMessage({message: 'reload', target: 'delivery_read'}, window.location.origin);
            notificationAlert('success', '💾 배송정보 수정완료',
                <>
                    <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                </>
                , null, null, 2
            )
        } catch (err) {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        } finally {
            setLoading(false);
        }
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 배송 > 배송 수정
     */
    async function deleteFunc() {
        setLoading(true);
        deleteDelivery({data: { deleteIdList: [ updateKey['delivery_update']] }}).then(v => {
            const {code, message} = v;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'delivery_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 배송 삭제완료',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'delivery_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
                getCopyPage('delivery_read', {});
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
     * @description 수정 페이지 > 상단 탭 관련
     * 배송 > 배송 수정
     */
    const [tabNumb, setTabNumb] = useState('CJ')
    const items: TabsProps['items'] = [
        {
            key: 'CJ',
            label: '[대한통운]',
            children: <Deahan info={info} setInfo={setInfo} openModal={openModal}/>,
        },
        {
            key: 'DAESIN',
            label: '[대신택배]',
            children: <Deasin info={info} setInfo={setInfo} openModal={openModal}/>,
        },
        {
            key: 'QUICK',
            label: '[퀵 / 직납 / 대리점 출고]',
            children: <ETC info={info} setInfo={setInfo} openModal={openModal}/>,
        },
    ];
    const tabChange = (key: string) => {
        setInfo(prev => ({
            ...getDeliveryInit(),
            deliveryId: prev.deliveryId,
            deliveryType: key,
            connectInquiryNo: prev.connectInquiryNo,
            orderDetailIds: prev.orderDetailIds
        }))
        setTabNumb(key);
    };

    const getDeliveryInfoByType = (type, detail = {}) => {
        console.log(detail)
        const isEmpty = !detail || Object.keys(detail).length === 0;
        if (isEmpty) return;

        setInfo(prev => {
            let bowl = {};
            switch (type) {
                case 'CJ':
                    bowl = {
                        deliveryType: 'CJ',
                        customerName: detail?.['customerName'] ?? '',
                        customerOrderNo: detail?.['yourPoNo'] ?? '',
                        recipientName: detail?.['customerManagerName'] ?? '',
                        recipientPhone: detail?.['customerManagerPhoneNumber'] ?? '',
                        recipientAddress: detail?.['address'] ?? '',
                    };
                    break;
                case 'DAESIN':
                    bowl = {
                        deliveryType: 'DAESIN',
                        customerName: detail?.['customerName'] ?? '',
                        recipientName: detail?.['customerManagerName'] ?? '',
                        recipientPhone: detail?.['customerManagerPhoneNumber'] ?? '',
                        recipientAddress: detail?.['address'] ?? '',
                        destination: detail?.['freightBranch'] ?? '',
                    };
                    break;
                case 'QUICK':
                    bowl = {
                        deliveryType: 'QUICK',
                        customerName: detail?.['customerName'] ?? '',
                        recipientName: detail?.['customerManagerName'] ?? '',
                        recipientPhone: detail?.['customerManagerPhoneNumber'] ?? '',
                        recipientAddress: detail?.['address'] ?? '',
                    };
                    break;
                default:
                    bowl = {};
            }
            return {
                ...prev,
                ...bowl,
            };
        });
    };

    /**
     * @description 수정 페이지 > Inquiry No. 검색 버튼 > 발주서 조회 Modal
     * 배송 > 배송 수정
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
     */
    function modalSelected(list= []) {
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

            setInfo(prevInfo => {
                return {
                    ...prevInfo,
                    connectInquiryNo: connectInquiryNos.join(', '),
                    orderDetailIds,
                }
            });

            // 모달에서 가져오자마자 정보 바인딩하려면 주석 해제
            // getDeliveryInfoByType(tabNumb, updatedList[0]);

            return updatedList;
        });
    }

    /**
     * @description 수정 페이지 > 발주서 조회 테이블 > 배송 정보 불러오기 버튼
     * 배송 > 배송 슈정
     */
    function getDeliveryInfo() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('불러올 발주서 정보를 선택해주세요.');

        getDeliveryInfoByType(tabNumb, list?.[0]);
    }

    /**
     * @description 조회 테이블 > 삭제 버튼
     * 배송 > 배송 수정
     */
    async function confirm() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 발주서 정보를 선택해주세요.');
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {orderDetailId: 'orderDetailId'});
        const filterSelectList = selectOrderList.filter(selectOrder =>
            !deleteList.some(deleteItem => deleteItem.orderDetailId === Number(selectOrder.orderDetailId))
        );

        const idList = filterSelectList.map(v=> v.orderDetailId).join(', ');
        setInfo(v=>{
            return {
                ...v, orderDetailIds : idList
            }
        })
        setSelectOrderList(filterSelectList);
    }

    function deliveryPaperFunc(){

    }

    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        const allData = [];
        gridRef.current.forEachNode(node => {
            allData.push(node.data);
        });

        copyInfo['deliveryDetailInfo'] = allData;
        getCopyPage('delivery_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }



    return <Spin spinning={loading}>
        <SearchInfoModal info={selectOrderList} infoRef={infoRef} setInfo={setSelectOrderList}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen} returnFunc={modalSelected}/>
        <div style={{
            display: 'grid',
            // gridTemplateRows: `${mini ? '270px' : '65px'} calc(100vh - ${mini ? 400 : 195}px)`,
            gridTemplateRows: 'auto 1fr',
            columnGap: 5
        }}>

            <div style={{flexShrink: 0}}>
                <MainCard title={'배송 수정'} list={[
                    {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                    {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                    {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'}
                ]}>
                    <Tabs size={'small'} activeKey={tabNumb} items={items} onChange={tabChange}/>
                </MainCard>
            </div>

            <div style={{
                height: '330px',
            }}>
                <TableGrid
                    deleteComp={
                        <>
                            <Button type={'primary'} size={'small'} style={{fontSize : 11}} onClick={getDeliveryInfo}>
                                <div><FileDoneOutlined style={{paddingRight: 8}}/>배송 정보 불러오기</div>
                            </Button>
                            <Popconfirm
                                title="삭제하시겠습니까?"
                                onConfirm={confirm}
                                icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                                <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                    <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                                </Button>
                            </Popconfirm>
                        </>
                    }
                    totalRow={totalRow}
                    gridRef={gridRef}
                    columns={tableSelectOrderReadColumns}
                    customType={'delivery'}
                    onGridReady={onGridReady}
                    funcButtons={['agPrint']}
                />
            </div>

        </div>
    </Spin>
}

export default memo(DeliveryUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});