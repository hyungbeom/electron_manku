import React, {memo, useEffect, useRef, useState} from "react";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {ModalInitList} from "@/utils/initialList";
import message from "antd/lib/message";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    MainCard,
    selectBoxForm,
    textAreaForm,
    tooltipInfo,
    TopBoxCard
} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import _ from "lodash";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {getData, getFormData} from "@/manage/function/api";
import moment from "moment";
import Spin from "antd/lib/spin";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {rfqInfo} from "@/utils/column/ProjectInfo";
import Table from "@/component/util/Table";
import useEventListener from "@/utils/common/function/UseEventListener";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import SearchAgencyModal_test from "@/component/SearchAgencyModal_test";

const listType = 'estimateRequestDetailList'

function RqfWrite({copyPageInfo = {}, getPropertyId, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const fileRef = useRef(null);
    const uploadRef = useRef(null);
    const tableRef = useRef(null);
    const infoRef = useRef<any>(null)
    const checkInfoRef = useRef<any>({
        info: {},
        table: []
    })

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('rfq_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20]; // 기본값 [50, 50, 50]
    };
    const [sizes] = useState(getSavedSizes); // 패널 크기 상태



    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const { userInfo, adminList } = useAppSelector((state) => state.user);

    const adminParams = {
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        createdBy: userInfo['name'],
    }
    const getRfqInit = () => {
        const copyInit = _.cloneDeep(rfqInfo['defaultInfo']);
        return {
            ...copyInit,
            ...adminParams
        }
    }
    const [info, setInfo] = useState(getRfqInit());
    const getRfqValidateInit = () => _.cloneDeep(rfqInfo['write']['validate']);
    const [validate, setValidate] = useState(getRfqValidateInit());

    const [driveKey, setDriveKey] = useState(0);

    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setValidate(getRfqValidateInit());
        setInfo(getRfqInit());
        setFileList([]);
        setDriveKey(prev => prev + 1);
        setTableData([]);
        if (!isEmptyObj(copyPageInfo)) {
            // copyPageInfo 가 없을시
            setTableData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000))
        } else {
            // copyPageInfo 가 있을시(==>보통 수정페이지에서 복제시)
            // 복제시 info 정보를 복제해오지만 작성자 && 담당자 && 작성일자는 로그인 유저 현재시점으로 setting



            setInfo({
                ...getRfqInit(),
                ...copyPageInfo,
                documentNumberFull : '',
                writtenDate: moment().format('YYYY-MM-DD')
            });
            setTableData(copyPageInfo[listType]);

            getData.post('common/getDownloadFiles', {
                documentNumberFull: copyPageInfo['documentNumberFull'],
                filePath : `/root:/01.견적업무/${copyPageInfo['documentNumberFull']}:/children`
            }).then((v:any) => {
                console.log(v,'????')
                if(v.data.code === 1){
                    downloadFilesSequential(v.data.entity)
                        .then(src => {
                            // src는 File 객체 배열
                            console.log('다운로드된 File 객체 배열(src):', src);
                            src.forEach((file, idx) => {
                                console.log(`src[${idx}] - name:`, file.name,
                                    ' size:', file.size,
                                    ' type:', file.type,
                                    ' instanceof File?:', file instanceof File);
                            });

                            const uploadItems = src.map(file => {
                                const item = fileToUploadFile(file);
                                console.log('변환된 UploadFile 객체:', item);
                                return item;
                            });
                            console.log('최종 uploadItems 배열:', uploadItems);
                            setFileList(uploadItems);
                        })
                        .catch(err => {
                            console.error('downloadFilesSequential 중 에러:', err);
                        });
                }
            })

        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);



    async function downloadFilesSequential(fileList, {  onProgress = null, retryOptions = { retries: 0, delayMs: 1000 } } = {}) {
        const files = [];
        for (const info of fileList) {
            let attempts = 0;
            const maxRetries = retryOptions.retries;
            const retryDelay = retryOptions.delayMs;

            while (true) {
                try {
                    // downloadEndpoint가 상대경로라면, getData 인스턴스에 baseURL이 설정돼 있어야 하거나 절대 경로로 바꿔야 합니다.
                    const resp = await getData.get(info.downloadEndpoint, {
                        responseType: 'blob',
                        // Axios의 onDownloadProgress를 사용해 진행률을 추적할 수 있습니다.
                        onDownloadProgress: progressEvent => {
                            if (onProgress) {
                                // progressEvent.loaded, progressEvent.total가 있을 수 있음(일부 브라우저/서버 설정에 따라 total이 undefined일 수 있음)
                                const percent = progressEvent.total
                                    ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                    : null;
                                onProgress({ fileId: info.fileId, fileName: info.fileName, loaded: progressEvent.loaded, total: progressEvent.total, percent, attempt: attempts + 1 });
                            }
                        },
                        // 인증 쿠키나 헤더가 필요하면 getData 인스턴스에 설정되어 있어야 합니다.
                    });
                    const blob = resp.data;
                    const file = new File([blob], info.fileName, { type: blob.type });
                    files.push(file);
                    break; // 성공하면 while 루프 탈출
                } catch (err) {
                    attempts++;
                    console.error(`파일 다운로드 실패: ${info.fileName}, 시도 ${attempts}/${maxRetries + 1}`, err);
                    if (attempts > maxRetries) {
                        // 재시도 옵션을 모두 소진했으면 건너뛰고 다음 파일로
                        console.warn(`파일 ${info.fileName} 다운로드를 건너뜁니다.`);
                        break;
                    } else {
                        // 재시도 전 대기
                        await new Promise(res => setTimeout(res, retryDelay));
                    }
                }
            }
        }
        return files; // 성공적으로 다운로드한 File 객체 배열
    }


    function fileToUploadFile(file) {
        // uid: 고유하게 생성. timestamp + random 등으로.
        const uid = `rc-upload-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const name = file.name;
        const status = 'done'; // 이미 다운로드 완료된 파일이므로 'done'
        const originFileObj = file;
        // 이미지 미리보기용 Object URL
        let url;
        if (file.type.startsWith('image/')) {
            url = URL.createObjectURL(file);
        }
        // lastModified, lastModifiedDate, size, type 등 추가 정보도 담을 수 있음
        const lastModified = file.lastModified;
        const lastModifiedDate = new Date(file.lastModified);

        return {
            uid,
            name,
            status,
            originFileObj,
            url,
            thumbUrl: url,
            size: file.size,
            type: file.type,
            lastModified,
            lastModifiedDate,
            // percent 필드는 업로드 진행 상황 표시가 필요하면 동적으로 추가 가능
        };
    }

    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    await findCodeInfo(e, setInfo, openModal)
                    break;
            }
        }
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
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
            if (activeTab?.renderedName === '견적의뢰 등록') {
                saveFunc()
            }
        }
    }, typeof window !== 'undefined' ? document : null)

    /**
     * @description 등록 페이지 > 저장 버튼
     * 견적의뢰 > 견적의뢰 등록
     */
    async function saveFunc() {
        console.log(info, 'info:::');
        // 유효성 체크 추가
        if(!commonManage.checkValidate(info, rfqInfo['write']['validationList'], setValidate)) return;

        const tableList = tableRef.current?.getSourceData();
        const filterTableList = commonManage.filterEmptyObjects(tableList, ['model', 'item', 'maker'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터가 1개 이상이여야 합니다.');
        }
        const emptyQuantity = filterTableList.filter(v => !v.quantity)
        if (emptyQuantity.length) {
            return message.error('하위 데이터의 수량을 입력해야 합니다.')
        }

        // 하단의 model 중에서 납기가 제일 큰 값을 구해서 저장 (발주서에서 바인딩)
        const deliveryDateList = filterTableList
            .map(v => Number(v.deliveryDate))
            .filter(v => !isNaN(v) && v > 0);
        const maxDeliveryDate = deliveryDateList.length ? Math.max(...deliveryDateList) : '';
        info['deliveryDate'] = maxDeliveryDate;
        //

        const findMember = adminList.find(v => v.adminId === parseInt(info['managerAdminId']));
        info['managerAdminName'] = findMember['name'];

        setLoading(true);

        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, filterTableList)
        commonManage.getUploadList(fileRef, formData);
        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await getFormData.post('estimate/addEstimateRequest', formData).then(async (v: any) => {
            const {code, entity} = v?.data;
            if (code === 1) {
                const {documentNumberFull, estimateRequestId} = entity;
                window.postMessage({message: 'reload', target: 'rfq_read'}, window.location.origin);
                notificationAlert('success', '💾 견적의뢰 등록완료',
                    <>
                        <div>의뢰자료 No. : {documentNumberFull}</div>
                        <div>등록일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('rfq_update', estimateRequestId)
                    },
                    {cursor: 'pointer'}
                )
                checkInfoRef.current['info'] = info

                clearAll();
                getPropertyId('rfq_update', estimateRequestId);
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
            setLoading(false)
        }, err => setLoading(false))
    }

    /**
     * @description 등록 페이지 > 초기화 버튼
     * 견적의뢰 > 견적의뢰 등록
     */
    function clearAll() {
        setLoading(true);
        setValidate(getRfqValidateInit());
        setInfo(getRfqInit())
        setFileList([]);

        function calcData(sourceData) {
            const keyOrder = Object.keys(rfqInfo['write']['defaultData']);
            return sourceData
                .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
                .map(rfqInfo['write']['excelExpert'])
                .concat(rfqInfo['write']['totalList']); // `push` 대신 `concat` 사용
        }
        tableRef.current?.hotInstance?.loadData(calcData(commonFunc.repeatObject(rfqInfo['write']['defaultData'], 1000)));
        setLoading(false);
    }


    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'rfq_write'}/>
        <SearchAgencyModal_test info={info} setInfo={setInfo}
                                open={isModalOpen}
                                setIsModalOpen={setIsModalOpen}/>

        <>
            <div ref={infoRef} style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 495 : 65}px calc(100vh - ${mini ? 590 : 195}px)`,
                rowGap: 10,
            }}>
                <MainCard title={'견적의뢰 작성'} list={[

                    {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                    {
                        name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                        func: clearAll,
                        type: 'danger'
                    }
                ]} mini={mini} setMini={setMini}>
                    <div id={'agencyId'}/>
                    <div id={'agencyManagerPhoneNumber'}/>
                    {mini ? <div>
                            <TopBoxCard title={''} grid={'110px 80px 80px 110px 110px 110px 300px'}>
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
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    data: info,
                                    disabled: true,
                                    placeHolder: '자동생성'
                                })}
                                {datePickerForm({
                                    title: '마감일자(예상)', id: 'dueDate'
                                    , onChange: onChange, data: info
                                })}
                                {inputForm({
                                    title: 'Project No.',
                                    id: 'rfqNo',
                                    onChange: onChange,
                                    data: info
                                })}
                                {/*{inputForm({*/}
                                {/*    title: 'PROJECT NAME',*/}
                                {/*    id: 'projectTitle',*/}
                                {/*    onChange: onChange,*/}
                                {/*    data: info*/}
                                {/*})}*/}
                            </TopBoxCard>
                            <PanelGroup ref={groupRef} direction="horizontal" style={{gap: 0.5, paddingTop: 3}}>
                                <Panel defaultSize={sizes[0]} minSize={5}>
                                    <BoxCard title={'매입처 정보'} tooltip={tooltipInfo('agency')}>
                                        {inputForm({
                                            title: '매입처코드',
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
                                    <BoxCard title={'고객사 정보'} tooltip={tooltipInfo('customer')}>
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
                                            data: info,
                                        })}
                                        {inputForm({
                                            title: '연락처',
                                            id: 'phoneNumber',
                                            onChange: onChange,
                                            data: info,
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
                                    <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('maker')}>
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
                                        {inputForm({
                                            title: 'Item',
                                            id: 'item',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '지시사항',
                                            id: 'instructions',
                                            onChange: onChange,
                                            data: info,
                                            rows: 7
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[3]} minSize={5}>
                                    <BoxCard title={'ETC'} tooltip={tooltipInfo('etc')}>
                                        {inputForm({
                                            title: 'End User',
                                            id: 'endUser',
                                            onChange: onChange,
                                            data: info
                                        })}
                                        {textAreaForm({
                                            title: '비고란',
                                            rows: 10,
                                            id: 'remarks',
                                            onChange: onChange,
                                            data: info,
                                        })}
                                    </BoxCard>
                                </Panel>
                                <PanelResizeHandle/>
                                <Panel defaultSize={sizes[4]} minSize={5}>
                                    <BoxCard title={'드라이브 목록'} tooltip={tooltipInfo('drive')}
                                             disabled={!userInfo['microsoftId']}>

                                        <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef} ref={uploadRef}
                                                         info={info} key={driveKey}/>
                                    </BoxCard>
                                </Panel>
                            </PanelGroup>
                        </div> : <></>}
                </MainCard>

                <Table data={tableData} column={rfqInfo['write']} funcButtons={['print']} ref={tableRef}
                       infoRef={infoRef} type={'rfq_write_column'}/>
            </div>
        </>
    </Spin>
}

export default memo(RqfWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});