import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {CopyOutlined, DeleteOutlined, FormOutlined,} from "@ant-design/icons";
import message from "antd/lib/message";
import moment from "moment/moment";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import _ from "lodash";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {OAInfo, OCInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Actions} from "flexlayout-react";

const listType = 'overseasAgencyManagerList'

function OverseasAgencyUpdate({ updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState<any>(false);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('agency/getOverseasAgencyDetail', {
            "overseasAgencyId": updateKey['overseas_agency_update'],
            "overseasAgencyCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        getDataInfo().then(v => {
            const {overseasAgencyDetail} = v;
            setInfo(overseasAgencyDetail);
            overseasAgencyDetail[listType] = [...overseasAgencyDetail[listType], ...commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000 - overseasAgencyDetail[listType].length)];
            setTableData(overseasAgencyDetail[listType]);
            setLoading(false);
        })
    }, [updateKey['overseas_agency_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);

    /**
     * @description 수정 페이지 > 저장 버튼
     * 데이터 관리 > 매입처 > 해외매입처
     */
    async function saveFunc() {
        let infoData = commonManage.getInfo(infoRef, OAInfo['defaultInfo']);
        infoData['overseasAgencyId'] = updateKey['overseas_agency_update'];
        infoData['overseas_agency_update'] = updateKey['overseas_agency_update']
        if(!infoData['agencyCode']){
            return message.error('코드(약칭)이 누락되었습니다.')
        }
        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 담당자 데이터가 1개 이상 이여야 합니다.');
        }
        infoData[listType] = filterTableList;

        setLoading(true);

        const agencyCode = infoRef.current.querySelector('#agencyCode')?.value || '';
        const agencyName = infoRef.current.querySelector('#agencyName')?.value || '';
        await getData.post('agency/updateOverseasAgency',  infoData).then(v => {
            if (v.data.code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_agency_read'}, window.location.origin);
                notificationAlert('success', '💾 해외매입처 수정완료',
                    <>
                        <div>코드(약칭) : {agencyCode}</div>
                        <div>상호 : {agencyName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                )
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 매입처 > 해외매입처
     */
    function deleteFunc(){
        setLoading(true);
        const agencyCode = infoRef.current.querySelector('#agencyCode')?.value || '';
        const agencyName = infoRef.current.querySelector('#agencyName')?.value || '';
        getData.post('agency/deleteOverseasAgency',{overseasAgencyId : updateKey['overseas_agency_update']}).then(v=>{
            const {code, message} = v.data;
            if(code === 1) {
                window.postMessage({message: 'reload', target: 'overseas_agency_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 해외매입처 삭제완료',
                    <>
                        <div>코드(약칭) : {agencyCode}</div>
                        <div>상호 : {agencyName}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('overseas_agency_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'overseas_agency_update');

                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                message.error(v?.data?.message);
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제 버튼
     * 데이터 관리 > 매입처 > 해외매입처
     */
    function copyPage() {
        const totalList = tableRef.current.getSourceData();
        totalList.pop();
        const list = totalList.map(v => { return v })

        const result = Object.keys(OAInfo['defaultInfo']).map(v => `#${v}`)
        const test = `${result.join(',')}`;
        const elements = infoRef.current.querySelectorAll(test);

        let copyInfo = {}
        for (let element of elements) {
            copyInfo[element.id] = element.value
        }

        copyInfo[listType] = [...list, ...commonFunc.repeatObject(OAInfo['write']['defaultData'], 1000 - list.length)];
        getCopyPage('overseas_agency_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    return <Spin spinning={loading}>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
            rowGap: 10
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_agency_update'}/>
            <MainCard title={'해외 매입처'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
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
            <Table data={tableData} column={OAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_agency_update_column'}/>
        </div>
    </Spin>
}

export default memo(OverseasAgencyUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});