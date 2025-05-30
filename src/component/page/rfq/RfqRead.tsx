import React, {memo, useEffect, useRef, useState} from "react";
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    RadiusSettingOutlined,
    SaveOutlined,
    SearchOutlined, SendOutlined
} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import {estimateRequestDetailUnit, subRfqReadInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, datePickerForm, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import ReceiveComponent from "@/component/ReceiveComponent";
import {getData} from "@/manage/function/api";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


function RfqRead({getPropertyId, getCopyPage}: any) {
    const notificationAlert = useNotificationAlert();
    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const groupRef = useRef<any>(null)

    const router = useRouter();
    const countRef = useRef(1);
    const infoRef = useRef(null);
    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(subRfqReadInitial)
    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(copyInit);
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(0);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchRfq({data: subRfqReadInitial}).then(v => {
            const {data} = v;
            setTotalRow(data?.length)

            params.api.applyTransaction({add: data});
        })
    };

    useEffect(() => {
        // searchInfo()
    }, []);


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_read');
        return savedSizes ? JSON.parse(savedSizes) : [25, 25, 25, 25]; // 기본값 [50, 50, 50]
    };


    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    useEffect(() => {
        infoRef.current = info
    }, [info]);


    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {

        commonManage.onChange(e, setInfo)
    }


    async function searchInfo() {
        let copyData: any = {...info}
        setLoading(true);
        copyData['searchDocumentNumber'] = copyData?.searchDocumentNumber.replace(/\s/g, "").toUpperCase();
        await searchRfq({
            data: copyData
        }).then(v => {
            countRef.current = 1;
            const {data} = v;
            setTotalRow(data?.length)
            gridManage.resetData(gridRef, data);
            setLoading(false)
            gridRef.current.ensureIndexVisible(0)
        })
    }


    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateRequestId: 'estimateRequestId',
            estimateRequestDetailId: 'estimateRequestDetailId'
        });
        const selectedRows = gridRef.current.getSelectedRows();

        await deleteRfq({data: {deleteList: deleteList}}).then((v: any) => {

            if (v.code === 1) {
                searchInfo();
                notificationAlert('success', '🗑️견적의뢰 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다.
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다. </div>*/}
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            } else {
                message.error(v.message)
            }
        })
    }


    function clearAll() {
        setInfo(copyInit);
        gridRef.current.deselectAll();
    }

    function moveRegist() {
        getCopyPage('rfq_write', {estimateRequestDetailList: commonFunc.repeatObject(estimateRequestDetailUnit, 1000)})
    }


    function sendAlert(){

        const list = gridRef.current.getSelectedRows();

        const grouped = {};

        list.forEach(item => {
            const key = item.managerAdminId;
            if (!grouped[key]) {
                grouped[key] = {
                    managerAdminId: key,
                    managerAdminName: item.managerAdminName,
                    children: []
                };
            }
            // 중복 체크용 key
            const childKey = item.documentNumberFull + '|' + item.agencyName;
            if (!grouped[key]._childSet) grouped[key]._childSet = new Set();
            if (!grouped[key]._childSet.has(childKey)) {
                grouped[key].children.push({
                    documentNumberFull: item.documentNumberFull,
                    agencyName: item.agencyName,
                    estimateRequestId: item.estimateRequestId,
                });
                grouped[key]._childSet.add(childKey);
            }
        });

// _childSet은 결과에서 제거
        const result = Object.values(grouped).map(g => {
            // @ts-ignore
            delete g._childSet;
            return g;
        });

        // console.log(result);
        result.forEach((v:any)=>{
            const childrenStr = v.children
                .map(child => `문서번호 : ${child.documentNumberFull} / 매입처 : ${child.agencyName}`)
                .join('\n');
            const findMember = adminList.find(v=> v.adminId === v.managerAdminId);


            getData.post('socket/send',{receiverId : v.managerAdminId,receiverName : findMember?.name,   title :'[회신알림]', message :childrenStr, pk : v.children[0]?.estimateRequestId})
        })

        sendMail(list)

    }
    
    function sendAlertMail(){

        const list = gridRef.current.getSelectedRows();

        const payload = [
            {
                email: "sales@manku.co.kr",
                managerAdminName: "김민국",
                detailList: list  // 이건 배열
            }

        ];


        getData.post('estimate/updateCheckEmail', {data : payload}).then(v=>{
            if(v?.data?.code === 1){
                message.success("요청메일 보내기가 완료되었습니다");
                searchInfo();
            }
        })
        
    }

    
    function sendMail(list){
       
    }
    return <>
        <Spin spinning={loading} tip={'견적의뢰 조회중...'}>
            <ReceiveComponent componentName={'rfq_read'} searchInfo={searchInfo}/>
            <PanelSizeUtil groupRef={groupRef} storage={'rfq_read'}/>
            <>

                <div style={{
                    display: 'grid',
                    gridTemplateRows: `${mini ? 270 : 65}px calc(100vh - ${mini ? 400 : 195}px)`,
                    // rowGap : 10
                }}>
                    <MainCard title={'견적의뢰 조회'} list={[
                        {
                            name: <div><SearchOutlined style={{paddingRight: 8}}/>조회</div>,
                            func: searchInfo,
                            type: 'primary'
                        },
                        {
                            name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                            func: clearAll,
                            type: 'danger'
                        },
                        {name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>, func: moveRegist, type: ''},
                    ]} mini={mini} setMini={setMini}>
                        {mini ? <div>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 25px 25px 25px',
                                            gap: 3
                                        }}>
                                            {rangePickerForm({
                                                title: '작성일자',
                                                id: 'searchDate',
                                                onChange: onChange,
                                                data: info
                                            })}
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>T</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'month').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>M</Button>
                                            <Button size={'small'} style={{fontSize: 12, marginTop: 25}}
                                                    onClick={() => {
                                                        setInfo(v => {
                                                            return {
                                                                ...v,
                                                                searchDate: [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                                                                "searchStartDate": moment().subtract(1, 'year').format('YYYY-MM-DD'),              // 작성일자 시작일
                                                                "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
                                                            }
                                                        })
                                                    }}>Y</Button>
                                        </div>
                                        {inputForm({
                                            title: '문서번호', id: 'searchDocumentNumber',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}

                                        {inputForm({
                                            title: 'Project No.', id: 'searchRfqNo',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}

                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard>
                                        {inputForm({
                                            title: '등록직원명', id: 'searchCreatedBy',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '고객사명', id: 'searchCustomerName',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '고객사담당자', id: 'searchManagerName',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}

                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard>
                                        {inputForm({
                                            title: 'Maker', id: 'searchMaker',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: 'Item', id: 'searchItem',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: 'Model', id: 'searchModel',
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard>
                                        <div style={{paddingBottom: 9}}>
                                            {selectBoxForm({
                                                title: '회신 여부',
                                                id: 'searchContent',
                                                onChange: onChange,
                                                data: info,
                                                list: [
                                                    {value: '', label: '전체'},
                                                    {value: '회신', label: '회신'},
                                                    {value: '미회신', label: '미회신'}
                                                ]
                                            })}
                                        </div>
                                        {datePickerForm({
                                            title: '회신일',
                                            onChange: onChange,
                                            id: 'searchReplyDate',
                                            data: info
                                        })}
                                        {selectBoxForm({
                                            title: '담당자 요청상태',
                                            id: 'searchReplyStatus',
                                            onChange: onChange,
                                            data: info,
                                            list: [

                                                {value: "", label: "전체"},
                                                {value: 0, label: "미요청"},
                                                {value: 1, label: "요청중"},
                                                {value: 2, label: "확인완료"}
                                            ]
                                        })}
                                    </BoxCard>
                                </Panel>


                            </PanelGroup>
                        </div> : <></>}
                    </MainCard>

                    {/*@ts-ignored*/}

                    <TableGrid deleteComp={<>
                        <Popconfirm
                            title="담당자에 알림을 보내겠습니까?"
                            onConfirm={sendAlert}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                            <Button type={'primary'} danger  size={'small'} style={{fontSize: 11}}>
                                <SendOutlined />(소켓) 알림 보내기
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title="담당자에 알림 메일을 보내겠습니까?"
                            onConfirm={sendAlertMail}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                            <Button type={'primary'}  size={'small'} style={{fontSize: 11}}>
                                <SendOutlined />알림메일 보내기
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title="삭제하시겠습니까?"
                            onConfirm={deleteList}
                            icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                            <Button type={'primary'} danger size={'small'} style={{fontSize: 11}}>
                                <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>
                            </Button>
                        </Popconfirm> </>}
                               totalRow={totalRow}
                               getPropertyId={getPropertyId}
                               gridRef={gridRef}
                               columns={rfqReadColumns}
                               onGridReady={onGridReady}
                               type={'read'}
                               funcButtons={['agPrint']}
                               reply={true}
                    />

                </div>
            </>
        </Spin>
    </>
}

export default memo(RfqRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});