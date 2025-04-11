import React, {memo, useEffect, useRef, useState} from "react";
import {getFormData} from "@/manage/function/api";
import message from "antd/lib/message";
import {codeDomesticSalesWriteInitial,} from "@/utils/initialList";
import moment from "moment/moment";
import _ from "lodash";
import {commonFunc, commonManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import Table from "@/component/util/Table";
import {DCInfo} from "@/utils/column/ProjectInfo";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Spin from "antd/lib/spin";

const listType = 'customerManagerList'

function DomesticCustomerWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);

    const userInfo = useAppSelector((state) => state.user);
    const copyInit = _.cloneDeep(codeDomesticSalesWriteInitial)

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const infoInit = {
        ...copyInit,
        ...adminParams
    }
    const [info, setInfo] = useState<any>({...copyInit, ...adminParams})

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_customer_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000))
        } else {

            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({...copyPageInfo, ...adminParams});
            setTableData(copyPageInfo[listType])
        }
    }, [copyPageInfo?._meta?.updateKey]);


    useEffect(() => {
        commonManage.setInfo(infoRef, info, userInfo['adminId']);
    }, [info]);

    useEffect(() => {
        tableRef.current?.setData(tableData);
    }, [tableData]);

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터 관리 > 고객사 > 국내고객사
     */
    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        infoData[listType] = filterTableList;

        setLoading(true);

        const customerCode = infoRef.current.querySelector('#customerCode')?.value || '';
        const customerName = infoRef.current.querySelector('#customerName')?.value || '';
        await getFormData.post('customer/addCustomer', infoData).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 국내고객사 등록완료',
                    <>
                        <div>코드(약칭) : {customerCode ? customerCode : v?.data?.entity?.customerId}</div>
                        <div>상호 : {customerName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('domestic_customer_update', v.data?.entity?.customerId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message);
            }
        });
        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 데이터 관리 > 고객사 > 국내고객사
     */
    function clearAll() {
        commonManage.setInfo(infoRef, DCInfo['defaultInfo'], userInfo['adminId']);
        tableRef.current?.setData(commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '480px' : '65px'} calc(100vh - ${mini ? 575 : 160}px)`,
                rowGap: 10,
            }}>
                <PanelSizeUtil groupRef={groupRef} storage={'domestic_customer_write'}/>
                <MainCard title={'국내 고객사 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div ref={infoRef}>
                            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                        style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'INQUIRY & PO no'}>
                                        {inputForm({title: '코드(약칭)', id: 'customerCode'})}
                                        {inputForm({title: '지역', id: 'customerRegion'})}
                                        {inputForm({title: '업태', id: 'businessType'})}
                                        {inputForm({title: '종목', id: 'businessItem'})}
                                        {inputForm({title: '대표자', id: 'representative'})}
                                        {inputForm({title: '거래처', id: 'customerType'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'INQUIRY & PO no'}>
                                        {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                        {inputForm({title: '상호', id: 'customerName'})}
                                        {inputForm({title: '주소', id: 'address'})}
                                        {inputForm({title: '홈페이지', id: 'homepage'})}
                                        {inputForm({title: '연락처', id: 'customerTel'})}
                                        {inputForm({title: '팩스번호', id: 'customerFax'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'INQUIRY & PO no'}>
                                        {inputForm({title: '사업자번호', id: 'businessRegistrationNumber'})}
                                        {textAreaForm({title: '업체확인사항', id: 'companyVerify'})}
                                        {textAreaForm({title: '비고란', id: 'remarks'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'INQUIRY & PO no'}>
                                        <div style={{paddingTop: 10, paddingBottom: 15}}>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>화물운송료</div>
                                            <select name="languages" id="freightCharge"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'화물 선불'}>화물 선불</option>
                                                <option value={'화물 후불'}>화물 후불</option>
                                                <option value={'택배 선불'}>택배 선불</option>
                                                <option value={'택배 후불'}>택배 후불</option>
                                            </select>
                                        </div>
                                        {inputForm({title: '화물지점', id: 'freightBranch'})}
                                        <div>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>결제방법</div>
                                            <select name="languages" id="paymentMethod"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'현금 결제'}>현금 결제</option>
                                                <option value={'선수금'}>선수금</option>
                                                <option value={'정기 결제'}>정기 결제</option>
                                                <option value={'택배 후불'}>택배 후불</option>
                                            </select>
                                        </div>
                                        <div style={{paddingTop: 15, paddingBottom: 10}}>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 6}}>업체형태</div>
                                            <select name="languages" id="companyType"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>

                                                <option value={'딜러'}>딜러</option>
                                                <option value={'제조'}>제조</option>
                                                <option value={'공공기관'}>공공기관</option>
                                            </select>
                                        </div>
                                        <div style={{paddingTop: 5}}>
                                            {inputForm({title: '만쿠담당자', id: 'mankuTradeManager'})}
                                        </div>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={DCInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'domestic_customer_write_column'}/>

            </div>
        </>
    </Spin>
}

export default memo(DomesticCustomerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});