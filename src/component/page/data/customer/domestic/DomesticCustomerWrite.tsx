import React, {memo, useEffect, useRef, useState} from "react";
import {getData, getFormData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import _ from "lodash";
import {commonFunc, commonManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";
import Table from "@/component/util/Table";
import {DCInfo} from "@/utils/column/ProjectInfo";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Spin from "antd/lib/spin";
import {DriveUploadComp} from "@/component/common/SharePointComp";

const listType = 'customerManagerList'

function DomesticCustomerWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const tableRef = useRef(null);
    const fileRef = useRef(null);
    const uploadRef = useRef(null);
    const [driveKey, setDriveKey] = useState(0);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_customer_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [isFolderId, setIsFolderId] = useState(false);
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

    useEffect(() => {
        setLoading(true);
        setValidate(getDCValidateInit());
        setInfo(getDCInit());
        setDriveKey(prev => prev + 1);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getDCInit(),
                ..._.cloneDeep(copyPageInfo),
            });
            if(copyPageInfo?.['info']?.['connectDocumentNumberFull'] && copyPageInfo?.['info']?.['folderId']) setIsFolderId(true);
            setFileList(copyPageInfo?.['attachmentFileList'] ?? []);
            setTableData(copyPageInfo[listType])
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터 관리 > 고객사 > 국내고객사
     */
    async function saveFunc() {
        if (!commonManage.checkValidate(info, DCInfo['write']['validationList'], setValidate)) return;

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
        await getFormData.post('customer/addCustomer', formData).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_customer_read'}, window.location.origin);
                notificationAlert('success', '💾 국내고객사 등록완료',
                    <>
                        <div>코드(약칭) : {info['customerCode'] ? info['customerCode'] : v?.data?.entity?.customerId}</div>
                        <div>상호 : {info['customerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('domestic_customer_update', v.data?.entity?.customerId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('domestic_customer_update', v.data?.entity?.customerId);
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
     * 데이터 관리 > 고객사 > 국내고객사
     */
    function clearAll() {
        setValidate(getDCValidateInit());
        setInfo(getDCInit());
        tableRef?.current?.setData(commonFunc.repeatObject(DCInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '480px' : '65px'} calc(100vh - ${mini ? 575 : 160}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_customer_write'}/>
            <MainCard title={'국내 고객사 등록'}
                      list={[
                          {
                              name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>,
                              func: saveFunc,
                              type: 'primary'
                          },
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
                                <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                    {/*@ts-ignored*/}
                                    <div style={{overFlowY: "auto", maxHeight: 300}}>
                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef} ref={uploadRef}
                                                         info={info} type={'customer'} key={driveKey}/>
                                    </div>
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[5]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_customer_write_column'}/>

        </div>
    </Spin>
}

export default memo(DomesticCustomerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});