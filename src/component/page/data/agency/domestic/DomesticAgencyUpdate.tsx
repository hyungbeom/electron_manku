import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    textAreaForm
} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Table from "@/component/util/Table";
import {DAInfo} from "@/utils/column/ProjectInfo";
import Spin from "antd/lib/spin";
import moment from "moment";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

const listType = 'agencyManagerList'

function DomesticAgencyUpdate({updateKey, getCopyPage, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const tableRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState<any>(false)
    const [mini, setMini] = useState(true);

    const userInfo = useAppSelector((state) => state.user);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getDAInit = () => {
        const copyInit = _.cloneDeep(DAInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState<any>(getDAInit());
    const getDAValidateInit = () => _.cloneDeep(DAInfo['write']['validate']);
    const [validate, setValidate] = useState(getDAValidateInit());

    const [tableData, setTableData] = useState([]);

    async function getDataInfo() {
        const result = await getData.post('agency/getAgencyDetail', {
            "agencyId": updateKey['domestic_agency_update'],
            "agencyCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        setValidate(getDAValidateInit());
        setInfo(getDAInit());
        setTableData([]);
        getDataInfo().then(v => {
            const {agencyDetail, attachmentFileList} = v;
            setInfo({
                ...getDAInit(),
                ...agencyDetail
            });
            agencyDetail[listType] = [...agencyDetail[listType], ...commonFunc.repeatObject(DAInfo['write']['defaultData'], 1000 - agencyDetail[listType].length)];
            setTableData(agencyDetail[listType]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['domestic_agency_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 수정버튼
     * 데이터 관리 > 매입처 > 국내매입처
     */
    async function saveFunc() {

        if (!commonManage.checkValidate(info, DAInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        info[listType] = filterTableList;

        setLoading(true);
        await getData.post('agency/updateAgency', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_agency_read'}, window.location.origin);
                notificationAlert('success', '💾 국내매입처 수정완료',
                    <>
                        <div>코드(약칭) : {info['agencyCode']}</div>
                        <div>상호 : {info['agencyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
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
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 매입처 > 국내매입처
     */
    function deleteFunc(){
        setLoading(true);
        getData.post('agency/deleteAgency',{agencyId : updateKey['domestic_agency_update']}).then(v=>{
            if(v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'domestic_agency_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 국내매입처 삭제완료',
                    <>
                        <div>코드(약칭) : {info['agencyCode']}</div>
                        <div>상호 : {info['agencyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('domestic_agency_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'domestic_agency_update');
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
     * 데이터 관리 > 매입처 > 국내매입처
     */
    function copyPage() {
        const copyInfo = _.cloneDeep(info);
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        copyInfo[listType] = [...totalList, ...commonFunc.repeatObject(DAInfo['write']['defaultData'], 1000 - totalList.length)];
        getCopyPage('domestic_agency_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    return <Spin spinning={loading}>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_agency_update'}/>
            <MainCard title={'국내 매입처 수정'}
                      list={[
                          {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                          {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ? <div>
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
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
                                    {inputForm({title: '사업자번호', id: 'businessRegistrationNumber', onChange: onChange, data: info})}
                                    {inputForm({title: '계좌번호', id: 'bankAccountNumber', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'Maker'}>
                                    {inputForm({title: 'Maker', id: 'maker', onChange: onChange, data: info})}
                                    {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                    {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'거래정보'}>
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
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {textAreaForm({ title: '지시사항', rows: 5, id: 'instructions', onChange: onChange, data: info})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_agency_update_column'}/>

        </div>
    </Spin>
}

export default memo(DomesticAgencyUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});