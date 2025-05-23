import React, {memo, useEffect, useRef, useState} from "react";
import {deliveryDaehanInitial, ModalInitList,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import {MainCard} from "@/utils/commonForm";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import {TabsProps} from "antd";
import Tabs from "antd/lib/tabs";
import ETC from "@/component/delivery/ETC";
import message from "antd/lib/message";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileDoneOutlined,
    RadiusSettingOutlined,
    SaveOutlined
} from "@ant-design/icons";
import _ from "lodash";
import TableGrid from "@/component/tableGrid";
import Popconfirm from "antd/lib/popconfirm";
import Button from "antd/lib/button";
import {tableSelectOrderReadColumns} from "@/utils/columnList";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import Spin from "antd/lib/spin";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonManage, gridManage} from "@/utils/commonManage";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {deliveryInfo, DRInfo} from "@/utils/column/ProjectInfo";

function DeliveryWrite({copyPageInfo}:any) {
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
     * @description 등록 페이지 > 등록 버튼
     * 배송 > 배송 등록
     */
    async function saveFunc() {
        let sendParam = null;

        if (sendParam) {
            await getData.post('delivery/addDelivery', sendParam).then(v => {
                if (v.data.code === 1) {
                    message.success('저장에 성공하였습니다.')
                } else {
                    message.error('저장에 실패하였습니다..')

                }
            }, err => console.log(err, '::::'))
        }
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 배송 > 배송 등록
     */
    function clearAll() {
        setLoading(true);

        setInfo(getDeliveryInit());

        setTabNumb('CJ');

        setSelectOrderList([]);
        setTotalRow(0);

        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 상단 탭 관련
     * 배송 > 배송 등록
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
            deliveryType: key,
        }))
        setTabNumb(key);
    };

    /**
     * @description 조회 페이지 테이블 > 삭제 버튼
     * 배송 > 배송 등록
     */
    async function confirm() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('삭제할 송금내역을 선택해주세요.');

        setLoading(true);

        const filterList = list.map(v => parseInt(v.remittanceDetailId));
        await getData.post('remittance/deleteRemittances', {deleteRemittanceIdList: filterList}).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '🗑️ 국내송금 삭제완료',
                    <>
                        <div>선택한 송금내역이 삭제되었습니다.</div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
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
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 등록 페이지 > Inquiry No. 검색 버튼 > 발주서 조회 Modal
     * 배송 > 배송 등록
     * 발주서 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    /**
     * @description 등록 페이지 > 발주서 조회 Modal
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
            return updatedList;
        });
    }

    const getInfoByType = (type, detail = {}) => {
        const isEmpty = !detail || Object.keys(detail).length === 0;
        if (isEmpty) return;

        let shippingType = '';
        let paymentMethod = '';
        if (!detail?.['freightCharge']) {
            shippingType = detail?.['freightCharge'].startsWith('택배') ? '택배' : '화물';
            paymentMethod = detail?.['freightCharge'].endsWith('선불') ? '선불' : '후불';
        }
        setInfo(prev => {
            let bowl = {};
            switch (type) {
                case 'CJ':
                    bowl = {
                        deliveryType: 'CJ',
                        deliveryDate: detail?.['deliveryDate'] || moment().format('YYYY-MM-DD'),
                        customerName: detail?.['customerName'] || '',
                        customerOrderNo: detail?.['customerOrderNo'] || detail?.['yourPoNo'] || '',
                        trackingNumber: detail?.['trackingNumber'] || '',
                        recipientName: detail?.['recipientName'] || detail?.['customerManagerName'],
                        recipientPhone: detail?.['recipientPhone'] || detail?.['customerManagerPhoneNumber'],
                        recipientAltPhone: detail?.['recipientAltPhone'] || '',
                        recipientAddress: detail?.['recipientAddress'] || detail?.['address'],
                        recipientPostalCode: detail?.['recipientPostalCode'] || '',
                        productName: detail?.['productName'] || '부품',
                        quantity: detail?.['quantity'] || '',
                    };
                    break;
                case 'DAESIN':
                    bowl = {
                        deliveryType: 'DAESIN',
                        deliveryDate: detail?.['deliveryDate'] || moment().format('YYYY-MM-DD'),
                        customerName: detail?.['customerName'] || '',
                        recipientName: detail?.['recipientName'] || detail?.['customerManagerName'],
                        recipientPhone: detail?.['recipientPhone'] || detail?.['customerManagerPhoneNumber'],
                        recipientAddress: detail?.['recipientAddress'] || detail?.['address'],
                        destination: detail?.['freightBranch'] || '',
                        productName: detail?.['productName'] || '부품',
                        quantity: detail?.['quantity'] || '',
                        packagingType: detail?.['packagingType'] || '',
                        shippingType: detail?.['shippingType'] || '',
                        paymentMethod: detail?.['paymentMethod'] || '',
                    };
                    break;
                case 'QUICK':
                    bowl = {
                        deliveryType: 'QUICK',
                        deliveryDate: detail?.['deliveryDate'] || moment().format('YYYY-MM-DD'),
                        customerName: detail?.['customerName'] || '',
                        recipientName: detail?.['recipientName'] || detail?.['customerManagerName'],
                        recipientPhone: detail?.['recipientPhone'] || detail?.['customerManagerPhoneNumber'],
                        recipientAddress: detail?.['recipientAddress'] || detail?.['address'],
                        classification: detail?.['recipientAddress'] || '',
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

    function getDeliveryInfo() {
        const list = gridRef.current.getSelectedRows();
        if (!list?.length) return message.warn('불러올 발주서 내역을 선택해주세요.');

        getInfoByType(tabNumb, list?.[0]);
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
                <MainCard title={'배송 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
                ]}>
                    <Tabs size={'small'} activeKey={tabNumb} items={items} onChange={tabChange}/>
                </MainCard>
            </div>

            <div style={{
                height: '270px',
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

export default memo(DeliveryWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});