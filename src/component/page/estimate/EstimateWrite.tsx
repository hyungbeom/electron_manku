import React, {memo, useEffect, useRef, useState} from "react";
import {DownloadOutlined, RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {commonFunc, commonManage, fileManage} from "@/utils/commonManage";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    selectBoxForm,
    SelectForm,
    textAreaForm,
    TopBoxCard
} from "@/utils/commonForm";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {saveEstimate} from "@/utils/api/mainApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Spin from "antd/lib/spin";
import {getData} from "@/manage/function/api";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import moment from "moment";
import {estimateInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {PdfForm} from "@/component/견적서/PdfForm";
import {pdf as pdfs} from '@react-pdf/renderer';

const listType = 'estimateDetailList'

function EstimateWrite({copyPageInfo = {}, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);
    const infoRef = useRef<any>(null);
    const fileRef = useRef(null);
    const uploadRef = useRef(null);
    const tableRef = useRef(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('estimate_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 25, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);
    const [mini, setMini] = useState(true);

    const { userInfo, adminList } = useAppSelector((state) => state.user);
    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getEstimateInit = () => {
        const copyInit = _.cloneDeep(estimateInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState(getEstimateInit());
    const getEstimateValidateInit = () => _.cloneDeep(estimateInfo['write']['validate']);
    const [validate, setValidate] = useState(getEstimateValidateInit());

    const [fileList, setFileList] = useState([]);
    const [isFolderId, setIsFolderId] = useState(false);
    const [driveKey, setDriveKey] = useState(0);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);

        setValidate(getEstimateValidateInit());
        setInfo(getEstimateInit());

        setFileList([]);
        setIsFolderId(false);
        setDriveKey(prev => prev + 1);

        setTableData([]);

        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting
            setInfo({
                ...getEstimateInit(),
                ...copyPageInfo?.['info'],
                writtenDate: moment().format('YYYY-MM-DD'),
            });
            if(copyPageInfo?.['info']?.['connectDocumentNumberFull'] && copyPageInfo?.['info']?.['folderId']) setIsFolderId(true);
            setFileList(copyPageInfo?.['attachmentFileList'] ?? []);
            setTableData(copyPageInfo?.[listType] ?? []);

        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    /**
     * @description 등록 페이지 > input창 아이콘 버튼
     * 견적서 > 견적서 등록
     * @param e
     */
    async function handleKeyPress(e) {
        if (e.key === 'Enter') {
            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
                case 'connectDocumentNumberFull' :
                     const connValue = e.target.value
                    if (!e.target.value) {
                        return message.warn('의뢰자료 No.를 입력해주세요.');
                    }

                    setLoading(true);
                    await getData.post('estimate/getEstimateRequestDetail', {
                        estimateRequestId: '',
                        documentNumberFull: e.target.value.toUpperCase(),
                    }).then(async v => {
                        if (v?.data?.code === 1) {
                            const {estimateRequestDetail = {}, attachmentFileList = []} = v?.data?.entity;
                            if(!isEmptyObj(estimateRequestDetail)){
                                setLoading(false);
                                return message.warn('조회데이터가 없습니다.')
                            }
                            setInfo(getEstimateInit());
                            setFileList([]);
                            setTableData([]);

                            await getData.post('estimate/generateDocumentNumberFull', {
                                type: 'ESTIMATE',
                                documentNumberFull: info?.connectDocumentNumberFull.toUpperCase()
                            })
                            .then(src => {
                                console.log(src?.data?.entity)
                                const result = connValue.replace(/^[a-zA-Z]+/, match => match.toUpperCase());
                                console.log(estimateRequestDetail.folderId,':??::')
                                setInfo({
                                    ...getEstimateInit(),
                                    ...estimateRequestDetail,
                                    connectDocumentNumberFull : result,
                                    documentNumberFull: src?.data?.code === 1 ? src?.data?.entity?.newDocumentNumberFull : '',
                                    validityPeriod: '견적 발행 후 10일간',
                                    paymentTerms: '발주시 50% / 납품시 50%',
                                    shippingTerms: '귀사도착도',
                                    createdBy: adminParams.createdBy,
                                    writtenDate: moment().format('YYYY-MM-DD')
                                })
                                // folderId 가져오면 연결 inquiry 수정 못하게 막기
                                if(estimateRequestDetail.folderId) setIsFolderId(true);
                                setFileList(fileManage.getFormatFiles(attachmentFileList));
                                // setFileList(fileManage.getFormatFiles(src?.data?.entity.attachmentFileList));
                                if (estimateRequestDetail?.estimateRequestDetailList?.length) {
                                    setTableData([...estimateRequestDetail['estimateRequestDetailList'], ...commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000 - estimateRequestDetail['estimateRequestDetailList'].length)])
                                }
                                // 만쿠 견적서 No. 가져오면 유효성 초기화
                                if(src.data.entity.newDocumentNumberFull) setValidate(v => {return {...v, documentNumberFull: true}});
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                        }
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                    break;
            }
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        // 값 입력되면 유효성 초기화
        const { id, value } = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    useEventListener('keydown', (e: any) => {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            const model = layoutRef.current.props.model;
            const activeTab = model.getActiveTabset()?.getSelectedNode();
            if (activeTab?.renderedName === '견적서 등록') {
                saveFunc();
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 등록 페이지 > 저장 버튼
     * 견적서 > 견적서 등록
     */
    async function saveFunc() {
        // 유효성 체크 추가
        if(!commonManage.checkValidate(info, estimateInfo['write']['validationList'], setValidate)) return;

        const findMember = adminList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];
        info['name'] = findMember['name'];
        info['contactNumber'] = findMember['contactNumber'];
        info['email'] = findMember['email'];
        info['customerManagerName'] = info['managerName'];
        info['customerManagerPhone'] = info['phoneNumber'];

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList);
        const result =fileRef.current.fileList.filter(v=>{
            if(!v.driveId){
                return v;
            }
        });

        const filterTotalList = tableList.filter(v => !!v.model)
        const data = commonManage.splitDataWithSequenceNumber(filterTotalList, 18, 28);
        // =========================================PDF FILE====================================================

        const list = Object.values(data);
        let bowl = {quantity: 0, net: 0, total: 0, unit: list.length ? list[0][0]['unit'] : ''}

        let results = filterTotalList.reduce((acc, cur, idx) => {
            const {quantity, net} = cur
            acc['quantity'] += quantity;
            acc['net'] += net;
            acc['total'] += (quantity * net)
            return acc
        }, {quantity: 0, net: 0, total: 0})

        results['unit'] = filterTotalList[0]['unit'];
        const blob = await pdfs(<PdfForm data={data} topInfoData={info} totalData={results}
                                         key={Date.now()}/>).toBlob();

        // File 객체로 만들기 (선택 사항)
        const file = new File([blob], '견적서.pdf', {type: 'application/pdf'});
        // =====================================================================================================

        const resultCount = commonManage.getUploadList(fileRef, formData);
        const findNumb = commonManage.findNextAvailableNumber(fileList, '03');
        const fileName =  `${findNumb} ${info?.documentNumberFull}_${info?.customerName}_QUOTE.pdf`;
        formData.append(`attachmentFileList[${resultCount}].attachmentFile`, file);
        formData.append(`attachmentFileList[${resultCount}].fileName`, fileName);

        formData.delete('createdDate');
        formData.delete('modifiedDate');

        await saveEstimate({data: formData}).then(async v => {
            const {code, message: msg, entity} = v;
            if (code === 1) {
                window.postMessage({message: 'reload', target: 'estimate_read'}, window.location.origin);
                notificationAlert('success', '💾 견적서 등록완료',
                    <>
                        <div>Inquiry No. : {info.documentNumberFull}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('estimate_update', entity?.estimateId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('estimate_update', entity?.estimateId)
            } else if (code === -20001) {
                setValidate(v => {
                    return {...v, documentNumberFull: false}
                })
                message.error(msg);
            } else {
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('관리자 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 견적서 > 견적서 등록
     */
    function clearAll() {
        setLoading(true);

        setValidate(getEstimateValidateInit())
        setInfo(getEstimateInit());

        setFileList([]);
        setIsFolderId(false);

        function calcData(sourceData) {
            const keyOrder = Object.keys(estimateInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(estimateInfo['write']['excelExpert'])
                .concat(estimateInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }
        setTableData(calcData(commonFunc.repeatObject(estimateInfo['write']['defaultData'], 1000)))

        setLoading(false);
    }

    /**
     * @description 등록 페이지 > 돋보기 버튼
     * 견적서 > 견적서 등록
     * 매앱처, 고객사, Maker 조회 Modal
     * @param e
     */
    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <div style={{overflow: 'hidden'}}><Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'estimate_write'}/>
        <SearchInfoModal info={info} infoRef={infoRef} setInfo={setInfo}
                         open={isModalOpen}
                         setIsModalOpen={setIsModalOpen}/>
        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '500px' : '65px'} calc(100vh - ${mini ? 595 : 195}px)`,
                overflowY: 'hidden',
                rowGap: 10,
            }}>
                <MainCard title={'견적서 작성'} list={[
                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard grid={'110px 70px 70px 120px 120px 120px'}>
                                {datePickerForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    data: info
                                })}
                                {inputForm({title: '작성자', id: 'createdBy', disabled: true, data: info})}
                                <div>
                                    {selectBoxForm({
                                        title: '담당자',
                                        id: 'managerAdminId',
                                        onChange: onChange,
                                        data: info,
                                        validate: validate['managerAdminId'],
                                        list: adminList?.map((item) => ({
                                            ...item,
                                            value: item.adminId,
                                            label: item.name,
                                        }))
                                    })}
                                </div>
                                {inputForm({
                                    title: '의뢰자료 No.',
                                    id: 'connectDocumentNumberFull',
                                    suffix: <DownloadOutlined style={{cursor: 'pointer'}} onClick={(e) => {
                                        handleKeyPress({key: 'Enter', target: {id: 'connectDocumentNumberFull', value: info.connectDocumentNumberFull}})
                                    }}/>,
                                    handleKeyPress: handleKeyPress,
                                    onChange: onChange,
                                    data: info,
                                    disabled: isFolderId
                                })}
                                {inputForm({
                                    title: '만쿠견적서 No.',
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    data: info,
                                    validate: validate['documentNumberFull'],
                                    key: validate['documentNumberFull']
                                })}
                                {inputForm({
                                    title: 'Project No.',
                                    id: 'rfqNo',
                                    onChange: onChange,
                                    data: info
                                })}

                            </TopBoxCard>

                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'매입처 정보'}>
                                        {inputForm({
                                            title: '매입처 코드',
                                            id: 'agencyCode',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('agencyCode');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info,
                                            validate: validate['agencyCode'],
                                            key: validate['agencyCode']
                                        })}
                                        {inputForm({
                                            title: '회사명',
                                            id: 'agencyName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '담당자',
                                            id: 'agencyManagerName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'agencyTel',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'agencyManagerEmail',
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[1]} minSize={5}>
                                    <BoxCard title={'고객사 정보'}>
                                        {inputForm({
                                            title: '고객사명',
                                            id: 'customerName',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('customerName');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '담당자명',
                                            id: 'managerName',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '팩스',
                                            id: 'faxNumber',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputForm({
                                            title: '이메일',
                                            id: 'customerManagerEmail',
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[2]} minSize={5}>
                                    <BoxCard title={'운송 정보'}>

                                        <SelectForm id={'validityPeriod'} list={['견적 발행 후 10일간', '견적 발행 후 30일간']}
                                                    title={'유효기간'}
                                                    onChange={onChange}
                                                    data={info}/>
                                        <div style={{paddingTop: 10}}>
                                            <SelectForm id={'paymentTerms'}
                                                        list={['발주시 50% / 납품시 50%', '현금결제', '선수금', '정기결제']}
                                                        title={'결제조건'}
                                                        onChange={onChange}
                                                        data={info}/>
                                        </div>

                                        <div style={{paddingTop: 10, paddingBottom: 10}}>
                                            <SelectForm id={'shippingTerms'}
                                                        list={['귀사도착도', '화물 및 택배비 별도']}
                                                        title={'운송조건'}
                                                        onChange={onChange}
                                                        data={info}/>
                                        </div>

                                        {inputNumberForm({
                                            title: '납기',
                                            id: 'delivery',
                                            min: 0,
                                            max: 10,
                                            addonAfter: '주',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {inputNumberForm({
                                            title: '환율',
                                            id: 'exchangeRate',
                                            min: 0,
                                            step: 0.01,
                                            onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'Maker 정보'}>
                                        {inputForm({
                                            title: 'Maker',
                                            id: 'maker',
                                            suffix: <span style={{cursor: 'pointer'}} onClick={
                                                (e) => {
                                                    e.stopPropagation();
                                                    openModal('maker');
                                                }
                                            }>🔍</span>,
                                            onChange: onChange,
                                            handleKeyPress: handleKeyPress,
                                            data: info
                                        })}
                                        {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'ETC'}>
                                        {textAreaForm({
                                            title: '지시사항',
                                            rows: 5,
                                            id: 'instructions',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '비고란', rows: 5, id: 'remarks', onChange: onChange,
                                            data: info
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[5]} minSize={5}>
                                    <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                        {/*@ts-ignored*/}
                                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef} ref={uploadRef}
                                                             info={info} key={driveKey}/>
                                        </div>
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[6]} minSize={0}></Panel>
                            </PanelGroup>
                        </div>
                        : <></>}
                </MainCard>

                <Table data={tableData} column={estimateInfo['write']} funcButtons={['print']} ref={tableRef}
                       type={'estimate_write_column'}/>
            </div>
        </>
    </Spin></div>
}

export default memo(EstimateWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});