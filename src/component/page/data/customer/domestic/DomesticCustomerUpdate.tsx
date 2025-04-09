import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import Table from "@/component/util/Table";
import {DCInfo, DCWInfo} from "@/utils/column/ProjectInfo";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Spin from "antd/lib/spin";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";

const listType = 'customerManagerList'

function DomesticCustomerUpdate({updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [info, setInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_customer_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('customer/getCustomerDetail', {
            "customerId": updateKey['domestic_customer_update'],
            "customerCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {customerDetail} = v;
            setInfo(customerDetail);
            customerDetail[listType] = [...customerDetail[listType], ...commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000 - customerDetail[listType].length)];
            setTableData(customerDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['domestic_customer_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);

    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, DCInfo['defaultInfo']);
        infoData['customerId'] = updateKey['domestic_customer_update']
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        infoData[listType] = filterTableList

        setLoading(true);

        const customerCode = infoRef.current.querySelector('#customerCode')?.value || '';
        const customerName = infoRef.current.querySelector('#customerName')?.value || '';
        await getData.post('customer/updateCustomer', infoData).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 국내고객사 수정완료',
                    <>
                        <div>코드(약칭) : {customerCode}</div>
                        <div>상호 : {customerName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 3
                )
            } else {
                message.error(v?.data?.message);
            }
            setLoading(false);
        });
    }

    function deleteFunc(){
        setLoading(true);
        const customerCode = infoRef.current.querySelector('#customerCode')?.value || '';
        const customerName = infoRef.current.querySelector('#customerName')?.value || '';
        getData.post('customer/deleteCustomer',{customerId : updateKey['domestic_customer_update']}).then(v=>{
            if(v?.data?.code === 1){
                notificationAlert('success', '🗑️ 국내고객사 삭제완료',
                    <>
                        <div>코드(약칭) : {customerCode}</div>
                        <div>상호 : {customerName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null, null, 3
                )
                const {model} = layoutRef.current.props;
                window.postMessage('delete', window.location.origin);
                getCopyPage('domestic_customer_read', {})
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'domestic_customer_update');

                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false);
        })
    }

    function copyPage() {
        const totalList = tableRef.current.getSourceData();
        totalList.pop();

        const result = Object.keys(DCInfo['defaultInfo']).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }

        copyInfo['customerId'] = updateKey['domestic_customer_update']
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000 - totalList.length)];
        getCopyPage('domestic_customer_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '480px' : '65px'} calc(100vh - ${mini ? 575 : 160}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_customer_update'}/>
            <MainCard title={'국내 고객사 수정'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
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
                        <Panel></Panel>
                    </PanelGroup>
                </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_customer_update_column'}/>

        </div>
    </Spin>
}

export default memo(DomesticCustomerUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});