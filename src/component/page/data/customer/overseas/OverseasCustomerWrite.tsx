import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import Table from "@/component/util/Table";
import {OCInfo} from "@/utils/column/ProjectInfo";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Spin from "antd/lib/spin";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'overseasCustomerManagerList'

function OverseasCustomerWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const fileRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_customer_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
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

    const [fileList, setFileList] = useState([]);
    const [driveKey, setDriveKey] = useState(0);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getOCValidateInit());
        setInfo(getOCInit());
        setFileList([]);
        setDriveKey(prev => prev + 1);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getOCInit(),
                ..._.cloneDeep(copyPageInfo)
            });
            setTableData(copyPageInfo[listType])
            setFileList(copyPageInfo?.['attachmentFileList'] ?? []);
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록페이지 > 등록 버튼
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
        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList);
        commonManage.getUploadList(fileRef, formData);
        await getData.post('customer/addOverseasCustomer', formData).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_customer_read'}, window.location.origin);
                notificationAlert('success', '💾 해외 고객사 등록완료',
                    <>
                        <div>코드(약칭) : {info['customerCode']}</div>
                        <div>상호 : {info['customerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('overseas_customer_update', v.data?.entity?.overseasCustomerId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('overseas_customer_update', v.data?.entity?.overseasCustomerId);
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
     * @description 등록 페이지 > 초기화 버튼
     * 데이터 관리 > 고객사 > 해외고객사
     */
    function clearAll() {
        setValidate(getOCValidateInit());
        setInfo(getOCInit());
        setFileList([]);
        tableRef?.current?.setData(commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '415px' : '65px'} calc(100vh - ${mini ? 510 : 160}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_customer_write'}/>
            <MainCard title={'해외 고객사 등록'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                          {
                              name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                              func: clearAll,
                              type: 'danger'
                          },
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
                        <Panel defaultSize={sizes[4]} minSize={5}>
                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     info={info} key={driveKey} type={'customer'}/>
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[5]} minSize={0}></Panel>
                    </PanelGroup>
                </div>
                : <></>}
            </MainCard>

            <Table data={tableData} column={OCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_customer_write_column'}/>

        </div>
    </Spin>
}

export default memo(OverseasCustomerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});