import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {tableCodeDomesticWriteColumn,} from "@/utils/columnList";
import {codeDomesticSalesWriteInitial, codeOverseasSalesWriteInitial, orderWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {BoxCard, datePickerForm, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import Table from "@/component/util/Table";
import {OCInfo, projectInfo} from "@/utils/column/ProjectInfo";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment/moment";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import DomesticCustomerUpdate from "@/component/page/data/customer/domestic/DomesticCustomerUpdate";

const listType = 'overseasCustomerManagerList'


function OverseasCustomerWrite({ copyPageInfo, getPropertyId}:any) {
    const notificationAlert = useNotificationAlert();

    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const tableRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const [mini, setMini] = useState(true);
    const [tableData, setTableData] = useState([]);
    const copyInit = _.cloneDeep(codeOverseasSalesWriteInitial)

    const adminParams = {}

    const infoInit = {
        ...copyInit,
        ...adminParams
    }

    const [info, setInfo] = useState<any>({...copyInit})


    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setInfo(infoInit)
            setTableData(commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...copyPageInfo, ...adminParams,
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo[listType])
        }
    }, [copyPageInfo]);


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_customer_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태




    async function saveFunc() {
        const dom = infoRef.current.querySelector('#customerName');
        let infoData = commonManage.getInfo(infoRef, infoInit);
        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        infoData[listType] = filterTableList
        await getData.post('customer/addOverseasCustomer', infoData).then(v => {
            if (v.data.code === 1) {

                notificationAlert('success', '💾해외 고객사 등록완료',
                    <>
                        <div>상호 : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,
                    function () {
                        getPropertyId('overseas_customer_update', v.data?.entity?.overseasCustomerId)
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
        copyData['customerManagerList'] = uncheckedData;

        setInfo(copyData);

    }


    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/customer/overseas/customer_write?${query}`)
    }

    function clearAll() {
        commonManage.setInfo(infoRef, OCInfo['defaultInfo'], OCInfo['adminId']);
        setTableData(commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000))
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 150}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_customer_write'}/>
            <MainCard title={'해외 고객사 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>


                {mini ? <div ref={infoRef}>
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {inputForm({title: '코드(약칭)', id: 'customerCode'})}
                                {inputForm({title: '지역', id: 'customerRegion'})}
                                {inputForm({title: 'FTA No', id: 'ftaNumber'})}
                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>화폐 단위</div>
                                    <select name="languages" id="currencyUnit"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        <option value={'KRW'}>KRW</option>
                                        <option value={'EUR'}>EUR</option>
                                        <option value={'JPY'}>JPY</option>
                                        <option value={'USD'}>USD</option>
                                        <option value={'GBP'}>GBP</option>

                                    </select>
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                {inputForm({title: '상호', id: 'customerName'})}
                                {inputForm({title: '주소', id: 'address'})}
                                {inputForm({title: '홈페이지', id: 'homepage'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {inputForm({title: '연락처', id: 'phoneNumber'})}
                                {inputForm({title: '팩스번호', id: 'faxNumber'})}
                                {inputForm({title: '만쿠 담당자', id: 'mankuTradeManager'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {textAreaForm({title: '업체확인사항', rows: 4, id: 'companyVerification'})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={5}>
                        </Panel>
                    </PanelGroup>
                </div> : <></>}
            </MainCard>
            <Table data={tableData} column={OCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_customer_write_column'}/>

        </div>
    </>
}

export default memo(OverseasCustomerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});