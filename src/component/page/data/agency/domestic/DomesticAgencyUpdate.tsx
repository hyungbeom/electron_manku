import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {tableCodeDomesticAgencyWriteColumns,} from "@/utils/columnList";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard} from "@/utils/commonForm";
import {commonFunc, commonManage, fileManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import Table from "@/component/util/Table";
import {DAInfo, projectInfo} from "@/utils/column/ProjectInfo";


const listType = 'agencyManagerList'
export default function DomesticAgencyUpdate({updateKey, getCopyPage}) {
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


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20,20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('agency/getAgencyList', {
            "agencyId": parseInt(updateKey['domestic_agency_update']),
            "documentNumberFull": ""
        });
        console.log(result,':::')
        return result?.data?.entity;
    }

    useEffect(() => {
        // setLoading(true)
        getDataInfo().then(v => {
            console.log(v,'::')
            // const {projectDetail, attachmentFileList} = v;
            // setFileList(fileManage.getFormatFiles(attachmentFileList))
            // setOriginFileList(attachmentFileList)
            // setInfo(projectDetail);
            // projectDetail[listType] = [...projectDetail[listType], ...commonFunc.repeatObject(projectInfo['write']['defaultData'], 100 - projectDetail[listType].length)];
            // setTableData(projectDetail[listType]);
            // setLoading(false)
        })
    }, [updateKey['domestic_agency_update']])


    useEffect(() => {

        commonManage.setInfo(infoRef, info);
    }, [info]);



    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef)
        if (!info['agencyCode']) {
            setValidate(v => {
                return {...v, agencyCode: false}
            })
            return message.warn('코드(약칭)을 입력하셔야 합니다.')
        }
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        await getData.post('agency/updateAgency', copyInfo).then(v => {
            if (v.data.code === 1) {
                window.opener?.postMessage('write', window.location.origin);
                message.success('수정되었습니다.')
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

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

    return <>
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
                        <PanelResizeHandle id={'resize'} className={'ground'}/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                        <BoxCard title={'Maker'}>
                            {inputForm({title: 'Maker', id: 'maker'})}
                            {inputForm({title: 'Item', id: 'item'})}
                            {inputForm({title: '홈페이지', id: 'homepage'})}
                        </BoxCard>
                        </Panel>
                        <PanelResizeHandle id={'resize'} className={'ground'}/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                        <BoxCard title={'ETC'}>
                            {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                            <div>
                                <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>달러/제조</div>
                                <select name="languages" id="currencyUnit"
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
                                <select name="languages" id="currencyUnit"
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
                        <PanelResizeHandle id={'resize'} className={'ground'}/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                        </Panel>
                    </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DAInfo['write']} funcButtons={['print']} ref={tableRef} type={'domestic_agency_update_column'}/>

        </div>
    </>
}
