import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {codeOverseasAgencyInitial, codeOverseasAgencyWriteInitial,} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard} from "@/utils/commonForm";
import _ from "lodash";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import Table from "@/component/util/Table";
import {OAInfo} from "@/utils/column/ProjectInfo";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";

const listType = 'overseasAgencyManagerList'


export default function OverseasAgencyWrite({copyPageInfo, getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [validate, setValidate] = useState({agencyCode: true});
    const copyInit = _.cloneDeep(codeOverseasAgencyWriteInitial);
    const adminParams = {agencyCode: ''}
    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [tableData, setTableData] = useState([]);
    const [info, setInfo] = useState<any>({...copyInit, ...adminParams})

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_agency_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    useEffect(() => {

        if (!isEmptyObj(copyPageInfo['overseas_agency_write'])) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(OAInfo['write']['defaultData'], 100))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...copyPageInfo['overseas_agency_write'], ...adminParams,
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo['overseas_agency_write'][listType])
        }
    }, [copyPageInfo['overseas_agency_write']]);


    async function saveFunc() {
        const dom = infoRef.current.querySelector('#agency');
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const tableList = tableRef.current?.getSourceData();

        console.log(tableList,'tableList:')
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        infoData[listType] = filterTableList

        await getData.post('agency/addOverseasAgency', infoData).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '💾해외 매입처 등록완료',
                    <>
                        <div>상호 : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('overseas_agency_update', v.data?.entity?.overseasAgencyId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });


        await getData.post('agency/addOverseasAgency', infoData).then(v => {
            if (v.data.code === 1) {
                window.opener?.postMessage('write', window.location.origin);
                message.success('저장되었습니다.')
                setInfo(codeOverseasAgencyInitial);
                deleteList()
                window.location.href = '/code_overseas_agency'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }


    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['overseasAgencyManagerList'] = uncheckedData;

        setInfo(copyData);

    }

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
            rowGap: 10
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_agency_write'}/>
            <MainCard title={'해외 매입처 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>


                {mini ? <div ref={infoRef}>
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'코드 정보'}>
                                    {inputForm({title: '코드(약칭)', id: 'agencyCode', validate: validate['agencyCode']})}
                                    {inputForm({title: '상호', id: 'agencyName'})}
                                    {inputForm({title: '아이템', id: 'item'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
                                    {inputForm({title: '딜러/제조', id: 'dealerType'})}
                                    {/*{selectBoxForm({*/}
                                    {/*    title: '등급', id: 'grade',     list: [*/}
                                    {/*        {value: 'A', label: 'A'},*/}
                                    {/*        {value: 'B', label: 'B'},*/}
                                    {/*        {value: 'C', label: 'C'},*/}
                                    {/*        {value: 'D', label: 'D'},*/}
                                    {/*    ]*/}
                                    {/*})}*/}
                                    {inputNumberForm({title: '마진', id: 'margin', suffix: '%'})}
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
                                    {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                    {inputForm({title: '담당자', id: 'manager'})}
                                    {inputForm({title: '홈페이지', id: 'homepage'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle/>
                            <Panel defaultSize={sizes[5]} minSize={5}>
                            </Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>
            {}
            <Table data={tableData} column={OAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_agency_write_column'}/>
        </div>
    </>
}
