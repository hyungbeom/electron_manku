import React, {memo, useEffect, useRef, useState} from "react";
import message from "antd/lib/message";
import {codeDomesticAgencyWriteInitial,} from "@/utils/initialList";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard} from "@/utils/commonForm";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveDomesticAgency} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {DAInfo, projectInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";

const listType = 'agencyManagerList'
function DomesticAgencyWrite({copyPageInfo, getPropertyId}:any) {
    const notificationAlert = useNotificationAlert();
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);
    const groupRef = useRef<any>(null)
    const router = useRouter();
    const gridRef = useRef(null);


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('domestic_agency_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);
    const userInfo = useAppSelector((state) => state.user);

    const copyInit = _.cloneDeep(codeDomesticAgencyWriteInitial)


    const adminParams = {}
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
            setInfo(copyPageInfo);
            setTableData(copyPageInfo[listType])
        }
    }, [copyPageInfo]);


    async function saveFunc() {
        const dom = infoRef.current.querySelector('#agencyName');
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        infoData[listType] = filterTableList
        await getData.post('agency/addAgency', infoData).then(v => {
            if (v.data.code === 1) {

                notificationAlert('success', '💾국내매입처 등록완료',
                    <>
                        <div>상호 : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('domestic_agency_update', v.data?.entity?.agencyId)
                    },
                    {cursor: 'pointer'}
                )
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
        copyData['agencyManagerList'] = uncheckedData;
        setInfo(copyData);
    }


    function addRow() {
        let copyData = {...info};
        copyData['agencyManagerList'].push({
            "managerName": "",        // 담당자
            "phoneNumber": "",   // 연락처
            "faxNumber": "",      // 팩스번호
            "email": "",       // 이메일
            "address": "",              //  주소
            "countryAgency": "",            // 국가대리점
            "mobilePhone": "",             // 핸드폰
            "remarks": ""                // 비고
        })

        setInfo(copyData)
    }

    function clearAll() {
        setInfo({...infoInit});
        gridManage.deleteAll(gridRef);
    }


    return <>
        <div ref={infoRef} style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '440px' : '65px'} calc(100vh - ${mini ? 535 : 195}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'domestic_agency_update'}/>
            <MainCard title={'국내 매입처 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight : 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
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
                            </Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>

            <Table data={tableData} column={DAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'domestic_agency_update_column'}/>

        </div>
    </>
}

export default memo(DomesticAgencyWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});
