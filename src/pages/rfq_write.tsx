import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {
    CopyOutlined,
    DownCircleFilled,
    FileExcelOutlined,
    FileSearchOutlined,
    RetweetOutlined,
    SaveOutlined,
    UpCircleFilled,
    UploadOutlined
} from "@ant-design/icons";
import {subRfqWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {ModalInitList, modalList, rfqWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import nookies from "nookies";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {getData} from "@/manage/function/api";
import Upload from "antd/lib/upload";
import * as XLSX from "xlsx";


const BoxCard = ({children, title}) => {
    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                 }}>
        {children}
    </Card>
}


export default function rqfWrite() {
    const userInfo = useAppSelector((state) => state.user);


    const gridRef = useRef(null);


    const [info, setInfo] = useState<any>({
        ...rfqWriteInitial,
        adminId: userInfo['adminId'],
        adminName: userInfo['adminName']
    })
    const [mini, setMini] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;

        switch (id) {
            case 'customerName' :
            case 'managerName' :
            case 'phoneNumber' :
            case 'faxNumber' :
            case 'customerManagerEmail' :
                bowl = bowl['customerInfoList'][0]
        }

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}

            />
        </div>
    }

    const textAreaForm = ({title, id, rows = 5, disabled = false}) => {
        return <div>
            <div>{title}</div>
            <TextArea rows={rows} id={id} value={info[id]} disabled={disabled}
                      onChange={onChange}
                      size={'small'}/>
        </div>
    }


    const datePickerForm = ({title, id, disabled = false}) => {

        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
                            }
                        })
                        }
                        disabled={disabled}
                        disabledDate={disabledDate}
                        id={id} size={'small'}/>
        </div>
    }




    function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'agencyCode' :
                case 'customerName' :
                case 'maker' :
                    searchFunc(e)
                    break;
            }

        }
    }

    function openModal(e) {
        let bowl = {};
        bowl[e] = true
        setIsModalOpen(v => {
            return {...v, ...bowl}
        })
    }

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        switch (e.target.id) {
            case 'customerName' :
            case 'managerName' :
            case 'phoneNumber' :
            case 'faxNumber' :
            case 'customerManagerEmail' :
                setInfo(v => {
                    v['customerInfoList'][0][e.target.id] = e.target.value
                    return {...v}
                })
            break;

            default :
                setInfo(v => {
                    return {...v, ...bowl}
                })

        }

    }


    async function searchFunc(e) {

        const resultList = await getData.post(modalList[e.target.id]?.url, {
            "searchType": "1",
            "searchText": e.target.value,       // 대리점코드 or 대리점 상호명
            "page": 1,
            "limit": -1
        });

        const data = resultList?.data?.entity[modalList[e.target.id]?.list];
        const size = data?.length;

        if (size > 1) {
            return openModal(e.target.id);
        } else if (size === 1) {
            switch (e.target.id) {
                case 'agencyCode' :
                    const {agencyId, agencyCode, agencyName} = data[0];
                    setInfo(v => {
                        return {...v, agencyId: agencyId, agencyCode: agencyCode, agencyName: agencyName}
                    })
                    break;
                case 'customerName' :
                    const {customerName, managerName, directTel, faxNumber, email} = data[0];
                    setInfo(v => {
                        return {
                            ...v,
                            customerInfoList: [{
                                customerName: customerName,
                                managerName: managerName,
                                phoneNumber: directTel,
                                faxNumber: faxNumber,
                                customerManagerEmail: email
                            }]
                        }
                    })
                    break;

                case 'maker' :
                    break;

            }
        } else {
            message.warn('조회된 데이터가 없습니다.')
        }
    }


    const disabledDate = (current) => {
        // current는 moment 객체입니다.
        // 오늘 이전 날짜를 비활성화
        return current && current < moment().startOf('day');
    };


    async function saveFunc() {
        if (!info['estimateRequestDetailList'].length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        if (!info['agencyCode']) {
            return message.warn('매입처 코드가 누락되었습니다.')
        }


        const copyData = {...info}


        // todo : 테이블에서 업데이트 될때 내용이 자동으로 text로 변형되게 나중엔 변경 하여야함
        const changeTime = gridRef.current.props.context.map(v=>{
            return {...v, replyDate : moment(v['replyDate']).format('YYYY-MM-DD')}
        })

        copyData['estimateRequestDetailList'] = changeTime


        await getData.post('estimate/addEstimateRequest', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                // setInfo(rfqWriteInitial);

                window.location.href = '/rfq_read'
            } else {
                if(v.data.code === -20001){
                    setInfo(src => {
                        return {
                            ...src,
                            documentNumberFull : v.data.entity
                        }
                    })
                    message.error('문서번호가 중복되었습니다.');

                }

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
        copyData['estimateRequestDetailList'] = uncheckedData;
        setInfo(copyData);

    }

    function addRow() {
        let copyData = {...info};
        copyData['estimateRequestDetailList'].push({
            "model": "",             // MODEL
            "quantity": 0,           // 수량
            "unit": "ea",            // 단위
            "currency": "krw",       // CURR
            "net": 0,                // NET/P
            "serialNumber": 0,       // 항목 순서 (1부터 시작)
            "deliveryDate": "",      // 납기
            "content": "미회신",       // 내용
            "replyDate": moment().format('YYYY-MM-DD'),         // 회신일
            "remarks": ""            // 비고
        })
        setInfo(copyData)
    }


    function clearAll() {
        setInfo({
            ...rfqWriteInitial,
            adminId: userInfo['adminId'],
            adminName: userInfo['adminName']
        });
    }

    const handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // 첫 번째 시트 읽기
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 데이터를 JSON 형식으로 변환 (첫 번째 행을 컬럼 키로 사용)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 데이터 첫 번째 행을 컬럼 이름으로 사용
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);

            // 테이블 데이터 변환
            const tableData = dataRows.map((row) => {
                const rowData = {};
                // @ts-ignore
                row?.forEach((cell, cellIndex) => {
                    const header = headers[cellIndex];
                    if (header !== undefined) {
                        rowData[header] = cell ?? ''; // 값이 없으면 기본값으로 빈 문자열 설정
                    }
                });
                return rowData;
            });


            let copyData = {...info}
            copyData['estimateRequestDetailList'] = tableData;
            setInfo(copyData);

        };

        reader.readAsBinaryString(file);
    };

    const uploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.toLowerCase().endsWith('.xlsx') ||
                file.name.toLowerCase().endsWith('.xls');

            if (!isExcel) {
                message.error('엑셀 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
            }

            // 파일 읽기
            handleFile(file);

            // false를 반환하여 업로드 방지 (자동 업로드 차단)
            return false;
        },
    };

    // const downloadExcel = () => {
    //
    //     const worksheet = XLSX.utils.json_to_sheet(info['estimateRequestDetailList']);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //     XLSX.writeFile(workbook, "rfq_list.xlsx");
    // };


    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                {/*@ts-ignore*/}
                <SearchInfoModal type={'agencyList'} info={info} setInfo={setInfo}
                                 open={isModalOpen}
                                 setIsModalOpen={setIsModalOpen}/>
                <Card size={'small'} title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>견적의뢰 작성</div>
                    <div>
                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}
                        ><SaveOutlined/>저장</Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                                onClick={clearAll}><RetweetOutlined/>초기화</Button>
                    </div>
                </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                      extra={<span style={{fontSize: 20, cursor: 'pointer'}}
                                   onClick={() => setMini(v => !v)}> {!mini ?
                          <DownCircleFilled/> : <UpCircleFilled/>}</span>}>
                    <div>

                        <BoxCard title={'기본 정보'}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 0.6fr 1fr 1fr 1fr',
                                maxWidth: 900,
                                minWidth: 600,
                                columnGap: 15
                            }}>
                                {datePickerForm({title: '작성일', id: 'writtenDate', disabled: true})}
                                {inputForm({title: '만쿠담당자', id: 'adminName', disabled: true})}
                                {inputForm({title: 'INQUIRY NO.', id: 'documentNumberFull', disabled: true})}
                                {inputForm({title: 'RFQ NO.', id: 'rfqNo'})}
                                {inputForm({title: '프로젝트 제목', id: 'projectTitle'})}
                            </div>
                        </BoxCard>
                        <div style={{display: 'grid', gridTemplateColumns: "repeat(4, 1fr)"}}>
                            <BoxCard title={'매입처 정보'}>

                                {inputForm({
                                    title: '매입처코드',
                                    id: 'agencyCode',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('agencyCode');
                                        }
                                    }/>
                                })}
                                {inputForm({title: '매입처명', id: 'agencyName'})}
                                {datePickerForm({title: '마감일자(예상)', id: 'dueDate'})}
                            </BoxCard>
                            <BoxCard title={'거래처 정보'}>
                                {inputForm({
                                    title: '거래처명',
                                    id: 'customerName',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('customerName');
                                        }
                                    }/>
                                })}
                                {inputForm({title: '담당자명', id: 'managerName'})}
                                {inputForm({title: '전화번호', id: 'phoneNumber'})}
                                {inputForm({title: '팩스', id: 'faxNumber'})}
                                {inputForm({title: '이메일', id: 'customerManagerEmail'})}
                            </BoxCard>

                            <BoxCard title={'Maker 정보'}>
                                {inputForm({
                                    title: 'MAKER',
                                    id: 'maker',
                                    suffix: <FileSearchOutlined style={{cursor: 'pointer'}} onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            openModal('maker');
                                        }
                                    }/>
                                })}
                                {inputForm({title: 'ITEM', id: 'item'})}
                                {textAreaForm({title: '지시사항', id: 'instructions'})}

                            </BoxCard>
                            <BoxCard title={'ETC'}>
                                {inputForm({title: 'End User', id: 'endUser'})}
                                {textAreaForm({title: '비고란', rows: 7, id: 'remarks'})}
                            </BoxCard>
                        </div>
                    </div>

                </Card>


                <TableGrid
                    gridRef={gridRef}
                    columns={subRfqWriteColumn}
                    tableData={info['estimateRequestDetailList']}
                    listType={'estimateRequestId'}
                    listDetailType={'estimateRequestDetailList'}
                    setInfo={setInfo}
                    excel={true}
                    type={'write'}
                    funcButtons={<div style={{display : 'grid', gridTemplateColumns : '1fr 0.8fr 0.8fr 0.8fr',alignItems : 'end'}}>
                        {/*@ts-ignore*/}
                        <Upload {...uploadProps} size={'small'} style={{marginLeft: 5}} showUploadList={false}>
                            <Button  icon={<UploadOutlined />} size={'small'} >엑셀 업로드</Button>
                        </Upload>
                        {/*<Button type={'dashed'} size={'small'} style={{marginLeft:5}} onClick={downloadExcel}>*/}
                        {/*    <FileExcelOutlined/>출력*/}
                        {/*</Button>*/}
                        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                                onClick={addRow}>
                            <SaveOutlined/>추가
                        </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{ marginLeft: 5,}}
                            onClick={deleteList}
                        >
                            <CopyOutlined/>삭제
                        </Button>


                    </div>}
                />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);
    const cookies = nookies.get(ctx)
    const {display = 'horizon'} = cookies;


    if (!userInfo) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }


    store.dispatch(setUserInfo(userInfo));


    return {
        props: {}
    }
})