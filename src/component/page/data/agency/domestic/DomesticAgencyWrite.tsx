import React, {memo, useEffect, useRef, useState} from "react";
import message from "antd/lib/message";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {DAInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import Spin from "antd/lib/spin";

const listType = 'agencyManagerList'

function DomesticAgencyWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const groupRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);
    const userInfo = useAppSelector((state) => state.user);

    const copyInit = _.cloneDeep(codeDomesticAgencyWriteInitial)

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

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(DAInfo['write']['defaultData'], 1000))
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
     * @description 둥록 페이지 > 저장 버튼
     * 데이터 관리 > 매입처 > 국내매입처
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

        const agencyCode = infoRef.current.querySelector('#agencyCode')?.value || '';
        const agencyName = infoRef.current.querySelector('#agencyName')?.value || '';
        await getData.post('agency/addAgency', infoData).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 국내매입처 등록완료',
                    <>
                        <div>코드(약칭) : {agencyCode}</div>
                        <div>상호 : {agencyName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('domestic_agency_update', v.data?.entity?.agencyId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message)
            }
        });
        setLoading(false);

    }

    /**
     * @description 등록 페이지 > 초기화
     * 데이터 관리 > 매입처 > 국내매입처
     */
    function clearAll() {
        commonManage.setInfo(infoRef, DAInfo['defaultInfo'], userInfo['adminId']);
        tableRef.current?.setData(commonFunc.repeatObject(DAInfo['write']['defaultData'], 1000));
    }

    return <Spin spinning={loading}>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
                rowGap: 10,
            }}>
                <PanelSizeUtil groupRef={groupRef} storage={'domestic_agency_write'}/>
                <MainCard title={'국내 매입처 등록'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    },
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>

                            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                        style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'매입처 정보'}>
                                        {inputForm({title: '코드(약칭)', id: 'agencyCode'})}
                                        {inputForm({title: '상호', id: 'agencyName'})}
                                        {inputForm({title: '사업자번호', id: 'businessRegistrationNumber'})}
                                        {inputForm({title: '계좌번호', id: 'bankAccountNumber'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'Maker'}>
                                        {inputForm({title: 'Maker', id: 'maker'})}
                                        {inputForm({title: 'Item', id: 'item'})}
                                        {inputForm({title: '홈페이지', id: 'homepage'})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'거래정보'}>
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
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {textAreaForm({
                                            title: '지시사항',
                                            rows: 5,
                                            id: 'instructions',

                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={DAInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'domestic_agency_write_column'}/>

            </div>
        </>
    </Spin>
}

export default memo(DomesticAgencyWrite, (prevProps, nextProps) =>
    {
        return _.isEqual(prevProps, nextProps);
    }
)
    ;
