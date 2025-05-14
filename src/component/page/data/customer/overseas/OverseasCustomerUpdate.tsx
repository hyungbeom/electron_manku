import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";
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
import {useAppSelector} from "@/utils/common/function/reduxHooks";

const listType = 'overseasCustomerManagerList'

function OverseasCustomerUpdate({ updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const tableRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_customer_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const userInfo = useAppSelector((state) => state.user.userInfo);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getOCInit = () => {
        const copyInit = _.cloneDeep(OCInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getOCInit());
    const getOCValidateInit = () => _.cloneDeep(OCInfo['write']['validate']);
    const [validate, setValidate] = useState(getOCValidateInit());

    const [tableData, setTableData] = useState([]);

    async function getDataInfo() {
        const result = await getData.post('customer/getOverseasCustomerDetail', {
            "overseasCustomerId": updateKey['overseas_customer_update'],
            "overseasCustomerCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        setValidate(getOCValidateInit());
        setInfo(getOCInit());
        setTableData([]);
        getDataInfo().then(v => {
            const {overseasCustomerDetail} = v;
            setInfo({
                ...getOCInit(),
                ...overseasCustomerDetail
            });
            overseasCustomerDetail[listType] = [...overseasCustomerDetail[listType], ...commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000 - overseasCustomerDetail[listType].length)];
            setTableData(overseasCustomerDetail[listType]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['overseas_customer_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, OCInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        info[listType] = filterTableList;

        setLoading(true);
        await getData.post('customer/updateOverseasCustomer', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_customer_read'}, window.location.origin);
                notificationAlert('success', '💾 해외고객사 수정완료',
                    <>
                        <div>코드(약칭) : {info['customerCode']}</div>
                        <div>상호 : {info['customerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
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
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    function deleteFunc(){
        setLoading(true);
        getData.post('customer/deleteOverseasCustomer',{overseasCustomerId : updateKey['overseas_customer_update']}).then(v=>{
            if(v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_customer_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 해외고객사 삭제완료',
                    <>
                        <div>코드(약칭) : {info['customerCode']}</div>
                        <div>상호 : {info['customerName']}</div>
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
     * @description 수정 페이지 > 복제 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
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
            <MainCard title={'해외 고객사 수정'}
                      list={[
                          {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                          {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ? <div ref={infoRef}>
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                {inputForm({title: '코드(약칭)', id: 'customerCode', onChange: onChange, data: info})}
                                {inputForm({title: '지역', id: 'customerRegion', onChange: onChange, data: info})}
                                {inputForm({title: 'FTA No', id: 'ftaNumber', onChange: onChange, data: info})}
                                <div>
                                    {selectBoxForm({
                                        title: '화폐 단위',
                                        id: 'currencyUnit',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: 'KRW', label: 'KRW'},
                                            {value: 'EUR', label: 'EUR'},
                                            {value: 'JPY', label: 'JPY'},
                                            {value: 'USD', label: 'USD'},
                                            {value: 'GBP', label: 'GBP'}
                                        ]
                                    })}
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                                {inputForm({
                                    title: '상호',
                                    id: 'customerName',
                                    onChange: onChange,
                                    data: info,
                                    validate: validate['customerName'],
                                    key: validate['customerName']
                                })}
                                {inputForm({title: '주소', id: 'address', onChange: onChange, data: info})}
                                {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                {inputForm({title: '거래처', id: 'customerType', onChange: onChange, data: info})}
                                {inputForm({title: '연락처', id: 'phoneNumber', onChange: onChange, data: info})}
                                {inputForm({title: '팩스번호', id: 'faxNumber', onChange: onChange, data: info})}
                                {inputForm({title: '만쿠 담당자', id: 'mankuTradeManager', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                {textAreaForm({title: '업체확인사항', rows: 4, id: 'companyVerification', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                    </PanelGroup>
                </div>
                : <></>}
            </MainCard>

            <Table data={tableData} column={OCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_customer_update_column'}/>

        </div>
    </Spin>
}

export default memo(OverseasCustomerUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});