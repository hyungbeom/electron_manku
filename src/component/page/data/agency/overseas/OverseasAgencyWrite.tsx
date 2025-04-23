import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import _ from "lodash";
import {commonFunc, commonManage} from "@/utils/commonManage";
import Table from "@/component/util/Table";
import {OAInfo} from "@/utils/column/ProjectInfo";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Spin from "antd/lib/spin";

const listType = 'overseasAgencyManagerList'

function OverseasAgencyWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const groupRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_agency_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const userInfo = useAppSelector((state) => state.user);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getOAInit = () => {
        const copyInit = _.cloneDeep(OAInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getOAInit());
    const getOAValidateInit = () => _.cloneDeep(OAInfo['write']['validate']);
    const [validate, setValidate] = useState(getOAValidateInit());

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getOAValidateInit());
        setInfo(getOAInit());
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(OAInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getOAInit(),
                ..._.cloneDeep(copyPageInfo)
            });
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
     * 데이터 관리 > 매입처 > 해외매입처
     */
    async function saveFunc() {
        console.log(info, 'info:::');
        if (!commonManage.checkValidate(info, OAInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        info[listType] = filterTableList;

        setLoading(true);
        await getData.post('agency/addOverseasAgency', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_agency_read'}, window.location.origin);
                notificationAlert('success', '💾 해외 매입처 등록완료',
                    <>
                        <div>코드(약칭) : {info['agencyCode']}</div>
                        <div>상호 : {info['agencyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('overseas_agency_update', v?.data?.entity?.overseasAgencyId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('overseas_agency_update', v.data?.entity?.overseasAgencyId);
            } else if (v?.data?.code === -90009) {
                message.error('코드(약칭)이(가) 중복되었습니다.');
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
     * 데이터 관리 > 매입처 > 해외매입처
     */
    function clearAll() {
        setValidate(getOAValidateInit());
        setInfo(getOAInit());
        tableRef.current?.setData(commonFunc.repeatObject(OAInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
            rowGap: 10
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_agency_write'}/>
            <MainCard title={'해외 매입처 등록'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                          {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ? <div>
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'코드 정보'}>
                                    {inputForm({
                                        title: '코드(약칭)',
                                        id: 'agencyCode',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['agencyCode'],
                                        key: validate['agencyCode']
                                    })}
                                    {inputForm({
                                        title: '상호',
                                        id: 'agencyName',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['agencyName'],
                                        key: validate['agencyName']
                                    })}
                                    {inputForm({title: '아이템', id: 'item', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
                                    {datePickerForm({title: '거래시작일', id: 'tradeStartDate', onChange: onChange, data: info})}
                                    <div style={{paddingBottom: 10}}>
                                        {selectBoxForm({
                                            title: '딜러/제조',
                                            id: 'dealerType',
                                            onChange: onChange,
                                            data: info,
                                            list: [
                                                {value: '딜러', label: '딜러'},
                                                {value: '제조', label: '제조'}
                                            ]
                                        })}
                                    </div>
                                    <div style={{paddingBottom: 9}}>
                                        {selectBoxForm({
                                            title: '등급',
                                            id: 'grade',
                                            onChange: onChange,
                                            data: info,
                                            list: [
                                                {value: 'A', label: 'A'},
                                                {value: 'B', label: 'B'},
                                                {value: 'C', label: 'C'},
                                                {value: 'D', label: 'D'}
                                            ]
                                        })}
                                    </div>
                                    {inputNumberForm({title: '마진 (%)', id: 'margin', suffix: '%', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '송금중개은행', id: 'intermediaryBank', onChange: onChange, data: info})}
                                    {inputForm({title: '주소', id: 'address', onChange: onChange, data: info})}
                                    {inputForm({title: 'IBan Code', id: 'ibanCode', onChange: onChange, data: info})}
                                    {inputForm({title: 'SWIFT CODE', id: 'swiftCode', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>

                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '국가', id: 'country', onChange: onChange, data: info})}
                                    {inputForm({title: 'ACCOUNT NO', id: 'bankAccountNumber', onChange: onChange, data: info})}
                                    {inputForm({title: '화폐단위', id: 'currencyUnit', onChange: onChange, data: info})}
                                    {inputForm({title: 'FTA NO', id: 'ftaNumber', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '담당자', id: 'manager', onChange: onChange, data: info})}
                                    {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[5]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={OAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_agency_write_column'}/>

        </div>
    </Spin>
}

export default memo(OverseasAgencyWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});

