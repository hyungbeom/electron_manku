import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {tableCodeDomesticAgencyWriteColumns,} from "@/utils/columnList";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Table from "@/component/util/Table";
import {DAInfo, projectInfo} from "@/utils/column/ProjectInfo";
import Spin from "antd/lib/spin";
import moment from "moment";


const listType = 'agencyManagerList'
function DomesticAgencyUpdate({updateKey, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const groupRef = useRef<any>(null)

    const gridRef = useRef(null);
    const router = useRouter();


    // const {agencyList} = data;
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>(codeDomesticAgencyWriteInitial)
    const [validate, setValidate] = useState({agencyCode: true});
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState<any>(false)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20,20, 20]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('agency/getAgencyDetail', {
            "agencyId": updateKey['domestic_agency_update'],
            "agencyCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {

            const {agencyDetail, attachmentFileList} = v;

            setInfo(agencyDetail);
            agencyDetail[listType] = [...agencyDetail[listType], ...commonFunc.repeatObject(DAInfo['write']['defaultData'], 1000 - agencyDetail[listType].length)];
            setTableData(agencyDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['domestic_agency_update']])


    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);



    async function saveFunc() {
        const dom = infoRef.current.querySelector('#agencyCode');
        let infoData = commonManage.getInfo(infoRef, DAInfo['defaultInfo']);
        infoData['overseas_agency_update'] = updateKey['overseas_agency_update']

        if(!infoData['agencyCode']){
            return message.error('코드(약칭)이 누락되었습니다.')
        }


        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName','phoneNumber'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        // console.log(filterTableList,'infoData::')
        // setLoading(true)
        infoData[listType] = filterTableList;
        infoData['agencyId'] = updateKey['domestic_agency_update']
        await getData.post('agency/updateAgency', infoData).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '💾 국내매입처 수정완료',
                    <>
                        <div>코드 : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                )
            } else {
                message.error('저장에 실패하였습니다.')
            }
        })

    }


    function clearAll() {
        setInfo(codeDomesticAgencyWriteInitial);
        gridRef.current.deselectAll();
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/agency/domestic/agency_write?${query}`)
    }

    return <Spin spinning={loading}>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '440px' : '65px'} calc(100vh - ${mini ? 535 : 195}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_agency_update'}/>
            <MainCard title={'국내 매입처 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '삭제', func: saveFunc, type: 'danger'},
                {name: '초기화', func: clearAll, type: ''},
                {name: '복제', func: copyPage, type: 'default'},
            ]} mini={mini} setMini={setMini}>

                {mini ? <div>

                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                        <BoxCard title={'매입처 정보'}>
                            {inputForm({
                                title: '코드(약칭)',
                                id: 'agencyCode'
                            })}
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
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>달러/제조</div>
                                <select name="languages" id="dealerType"
                                        style={{
                                            outline: 'none',
                                            border: '1px solid lightGray',
                                            height: 23,
                                            width: '100%',
                                            fontSize: 12,
                                            paddingBottom: 0.5
                                        }}>
                                    <option value={'달러'}>달러</option>
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

                            {inputNumberForm({title: '마진', id: 'margin', suffix: '%'})}
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
                        <Panel></Panel>
                    </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DAInfo['write']} funcButtons={['print']} ref={tableRef} type={'domestic_agency_update_column'}/>

        </div>
    </Spin>
}

export default memo(DomesticAgencyUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});
