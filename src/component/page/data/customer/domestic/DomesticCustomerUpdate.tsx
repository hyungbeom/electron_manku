import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    tooltipInfo
} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import _ from "lodash";
import Table from "@/component/util/Table";
import {DCInfo} from "@/utils/column/ProjectInfo";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Spin from "antd/lib/spin";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'customerManagerList'

function DomesticCustomerUpdate({updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const tableRef = useRef(null);
    const uploadRef = useRef(null);
    const fileRef = useRef(null);
    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_customer_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태
    const [driveKey, setDriveKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState([]);
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getDCInit = () => {
        const copyInit = _.cloneDeep(DCInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getDCInit());
    const getDCValidateInit = () => _.cloneDeep(DCInfo['write']['validate']);
    const [validate, setValidate] = useState(getDCValidateInit());

    const [tableData, setTableData] = useState([]);

    async function getDataInfo() {
        const result = await getData.post('customer/getCustomerDetail', {
            "customerId": updateKey['domestic_customer_update'],
            "customerCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        setValidate(getDCValidateInit());
        setInfo(getDCInit());
        setTableData([]);
        setFileList([]);
        setDriveKey(prev => prev + 1);
        getDataInfo().then(v => {
            const {customerDetail, attachmentFileList} = v;
            setInfo({
                ...getDCInit(),
                ...customerDetail
            });
            setFileList(fileManage.getFormatFiles(attachmentFileList));
            customerDetail[listType] = [...customerDetail[listType], ...commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000 - customerDetail[listType].length)];
            setTableData(customerDetail[listType]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['domestic_customer_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 고객사 > 국내고객사
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, DCInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        info[listType] = filterTableList;

        setLoading(true);
        await getData.post('customer/updateCustomer', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_customer_read'}, window.location.origin);
                notificationAlert('success', '💾 국내고객사 수정완료',
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
     * 데이터 관리 > 고객사 > 국내고객사
     */
    function deleteFunc(){
        setLoading(true);
        getData.post('customer/deleteCustomer',{customerId : updateKey['domestic_customer_update']}).then(v=>{
            if(v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_customer_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 국내고객사 삭제완료',
                    <>
                        <div>코드(약칭) : {info['customerCode']}</div>
                        <div>상호 : {info['customerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('domestic_customer_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'domestic_customer_update');
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
     * 데이터 관리 > 고객사 > 국내고객사
     */
    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
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
            <MainCard title={'국내 고객사 수정'}
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
                                {inputForm({title: '업태', id: 'businessType', onChange: onChange, data: info})}
                                {inputForm({title: '종목', id: 'businessItem', onChange: onChange, data: info})}
                                {inputForm({title: '대표자', id: 'representative', onChange: onChange, data: info})}
                                {inputForm({title: '거래처', id: 'customerType', onChange: onChange, data: info})}
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
                                {inputForm({title: '연락처', id: 'customerTel', onChange: onChange, data: info})}
                                {inputForm({title: '팩스번호', id: 'customerFax', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                {inputForm({
                                    title: '사업자번호',
                                    id: 'businessRegistrationNumber',
                                    onChange: onChange,
                                    data: info
                                })}
                                {textAreaForm({title: '업체확인사항', id: 'companyVerify', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', id: 'remarks', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'고객사 정보'}>
                                <div style={{paddingBottom: 9}}>
                                    {selectBoxForm({
                                        title: '화물운송료',
                                        id: 'freightCharge',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '화물 선불', label: '화물 선불'},
                                            {value: '화물 후불', label: '화물 후불'},
                                            {value: '택배 선불', label: '택배 선불'},
                                            {value: '택배 후불', label: '택배 후불'}
                                        ]
                                    })}
                                </div>
                                {inputForm({title: '화물지점', id: 'freightBranch', onChange: onChange, data: info})}
                                <div style={{paddingBottom: 10}}>
                                    {selectBoxForm({
                                        title: '결제방법',
                                        id: 'paymentMethod',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '현금 결제', label: '현금 결제'},
                                            {value: '선수금', label: '선수금'},
                                            {value: '정기 결제', label: '정기 결제'},
                                            {value: '택배 후불', label: '택배 후불'}
                                        ]
                                    })}
                                </div>
                                <div style={{paddingBottom: 9}}>
                                    {selectBoxForm({
                                        title: '업체형태',
                                        id: 'companyType',
                                        onChange: onChange,
                                        data: info,
                                        list: [
                                            {value: '딜러', label: '딜러'},
                                            {value: '제조', label: '제조'},
                                            {value: '공공기관', label: '공공기관'}
                                        ]
                                    })}
                                </div>
                                {inputForm({title: '만쿠담당자', id: 'mankuTradeManager', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={5}>
                            <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                     disabled={!userInfo['microsoftId']}>

                                <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                 ref={uploadRef}
                                                 info={info} key={driveKey} type={'customer'} />
                            </BoxCard>
                        </Panel>

                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={0}></Panel>
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