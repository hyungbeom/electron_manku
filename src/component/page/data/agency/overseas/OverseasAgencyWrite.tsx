import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {codeOverseasAgencyWriteInitial,} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard} from "@/utils/commonForm";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import Table from "@/component/util/Table";
import {DAInfo, OAInfo} from "@/utils/column/ProjectInfo";
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
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);
    const userInfo = useAppSelector((state) => state.user);

    const copyInit = _.cloneDeep(codeOverseasAgencyWriteInitial);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const infoInit = {
        ...copyInit,
        ...adminParams
    }
    const [info, setInfo] = useState<any>({...copyInit, ...adminParams});

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(OAInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...copyPageInfo, ...adminParams
            });
            setTableData(copyPageInfo[listType])
        }
    }, [copyPageInfo?._meta?.updateKey]);

    useEffect(() => {
        console.log(info, 'info')
        commonManage.setInfo(infoRef, info, userInfo['adminId']);
    }, [info]);

    useEffect(() => {
        tableRef.current?.setData(tableData);
    }, [tableData]);

    /**
     * @description 해외매입처 저장
     * 해외 매입처 등록 페이지 -> 저장 버튼
     */
    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        infoData[listType] = filterTableList

        setLoading(true)

        const agencyCode = infoRef.current.querySelector('#agencyCode')?.value || '';
        const agencyName = infoRef.current.querySelector('#agencyName')?.value || '';
        await getData.post('agency/addOverseasAgency', infoData).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 해외 매입처 등록완료',
                    <>
                        <div>코드(약칭) : {agencyCode}</div>
                        <div>상호 : {agencyName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('overseas_agency_update', v?.data?.entity?.overseasAgencyId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message);
            }
            setLoading(false);
        });
    }

    /**
     * @description 해외매입처 초기화
     * 해외 매입처 등록 페이지 -> 초기화 버튼
     */
    function clearAll() {
        commonManage.setInfo(infoRef, OAInfo['defaultInfo'], userInfo['adminId']);
        tableRef.current?.setData(commonFunc.repeatObject(OAInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
                rowGap: 10
            }}>
                <PanelSizeUtil groupRef={groupRef} storage={'overseas_agency_write'}/>
                <MainCard title={'해외 매입처 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>

                            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                        style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'코드 정보'}>
                                        {inputForm({title: '코드(약칭)', id: 'agencyCode'})}
                                        {inputForm({title: '상호', id: 'agencyName'})}
                                        {inputForm({title: '아이템', id: 'item'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'매입처 정보'}>
                                        {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                        <div>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>딜러/제조</div>
                                            <select name="languages" id="dealerType"
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
                                            </select>
                                        </div>

                                        <div style={{padding: '10px 0px'}}>
                                            <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>등급</div>
                                            <select name="languages" id="grade"
                                                    style={{
                                                        outline: 'none',
                                                        border: '1px solid lightGray',
                                                        height: 23,
                                                        width: '100%',
                                                        fontSize: 12,
                                                        paddingBottom: 0.5
                                                    }}>
                                                <option value={'A'}>A</option>
                                                <option value={'B'}>B</option>
                                                <option value={'C'}>C</option>
                                                <option value={'D'}>D</option>

                                            </select>
                                        </div>
                                        {inputNumberForm({title: '마진 (%)', id: 'margin', suffix: '%'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {inputForm({title: '송금중개은행', id: 'intermediaryBank'})}
                                        {inputForm({title: '주소', id: 'address'})}
                                        {inputForm({title: 'IBan Code', id: 'ibanCode'})}
                                        {inputForm({title: 'SWIFT CODE', id: 'swiftCode'})}
                                    </BoxCard>
                                </Panel>

                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {inputForm({title: '국가', id: 'country',})}
                                        {inputForm({title: 'ACCOUNT NO', id: 'bankAccountNumber'})}
                                        {inputForm({title: '화폐단위', id: 'currencyUnit'})}
                                        {inputForm({title: 'FTA NO', id: 'ftaNumber'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {inputForm({title: '담당자', id: 'manager'})}
                                        {inputForm({title: '홈페이지', id: 'homepage'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>
                {}
                <Table data={tableData} column={OAInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'overseas_agency_write_column'}/>
            </div>
        </>
    </Spin>
}

export default memo(OverseasAgencyWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});

