import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {OCInfo} from "@/utils/column/ProjectInfo";
import Spin from "antd/lib/spin";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";

const listType = 'overseasCustomerManagerList'

function OverseasCustomerUpdate({ updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>({});
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_customer_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('customer/getOverseasCustomerDetail', {
            "overseasCustomerId": updateKey['overseas_customer_update'],
            "overseasCustomerCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {overseasCustomerDetail} = v;
            setInfo(overseasCustomerDetail);
            overseasCustomerDetail[listType] = [...overseasCustomerDetail[listType], ...commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000 - overseasCustomerDetail[listType].length)];
            setTableData(overseasCustomerDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['overseas_customer_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, OCInfo['defaultInfo']);
        infoData['overseasCustomerId'] = updateKey['overseas_customer_update']
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }

        infoData[listType] = filterTableList

        setLoading(true);

        const customerCode = infoRef.current.querySelector('#customerCode')?.value || '';
        const customerName = infoRef.current.querySelector('#customerName')?.value || '';
        await getData.post('customer/updateOverseasCustomer', infoData).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_customer_read'}, window.location.origin);
                notificationAlert('success', '💾 해외고객사 수정완료',
                    <>
                        <div>코드(약칭) : {customerCode}</div>
                        <div>상호 : {customerName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                )
            } else {
                message.error(v?.data?.message)
            }
        });
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    function deleteFunc(){
        setLoading(true);
        const customerCode = infoRef.current.querySelector('#customerCode')?.value || '';
        const customerName = infoRef.current.querySelector('#customerName')?.value || '';
        getData.post('customer/deleteOverseasCustomer',{overseasCustomerId : updateKey['overseas_customer_update']}).then(v=>{
            if(v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_customer_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 해외고객사 삭제완료',
                    <>
                        <div>코드(약칭) : {customerCode}</div>
                        <div>상호 : {customerName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('overseas_customer_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'overseas_customer_update');

                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false);
        })
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    function copyPage() {
        const totalList = tableRef.current.getSourceData();
        totalList.pop();

        const result = Object.keys(OCInfo['defaultInfo']).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }

        copyInfo['overseasCustomerId'] = updateKey['overseas_customer_update']
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000 - totalList.length)];
        getCopyPage('overseas_customer_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 150}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_customer_update'}/>
            <MainCard title={'해외 고객사 수정'} list={[
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
                                {inputForm({title: 'FTA No', id: 'ftaNumber'})}
                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>화폐 단위</div>
                                    <select name="languages" id="currencyUnit"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        <option value={'KRW'}>KRW</option>
                                        <option value={'EUR'}>EUR</option>
                                        <option value={'JPY'}>JPY</option>
                                        <option value={'USD'}>USD</option>
                                        <option value={'GBP'}>GBP</option>

                                    </select>
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                {inputForm({title: '상호', id: 'customerName'})}
                                {inputForm({title: '주소', id: 'address'})}
                                {inputForm({title: '홈페이지', id: 'homepage'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {inputForm({title: '거래처', id: 'customerType'})}
                                {inputForm({title: '연락처', id: 'phoneNumber'})}
                                {inputForm({title: '팩스번호', id: 'faxNumber'})}
                                {inputForm({title: '만쿠 담당자', id: 'mankuTradeManager'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {textAreaForm({title: '업체확인사항', rows: 4, id: 'companyVerification'})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                    </PanelGroup>
                </div> : <></>}
            </MainCard>
            <Table data={tableData} column={OCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_customer_update_column'}/>
        </div>
    </Spin>
}

export default memo(OverseasCustomerUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});