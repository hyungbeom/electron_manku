import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, MailOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import {subRfqReadMailInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import {searchRfq} from "@/utils/api/mainApi";
import PreviewMailModal from "@/component/PreviewMailModal";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";


export default function rfqRead({dataInfo}) {
    const router = useRouter();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(subRfqReadMailInitial)


    const [info, setInfo] = useState(copyInit);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);


    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo ? dataInfo : []});
    };

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo();
        }
    }


    async function searchInfo() {
        const copyData: any = {...info}

        const result = await searchRfq({
            data: copyData
        });
        gridManage.resetData(gridRef, result);
    }


    const handleSendMail = () => {
        const checkedData = gridManage.getSelectRows(gridRef);
        if (!checkedData.length) {
            return message.warn('선택된 데이터가 없습니다.')
        }

        const result = Object.values(
            checkedData.reduce((acc, items) => {
                const {
                    documentNumberFull,
                    model,
                    managerName,
                    quantity,
                    unit,
                    maker,
                    item,
                    endUser
                } = items;

                // documentNumberFull로 그룹화
                if (!acc[documentNumberFull]) {
                    acc[documentNumberFull] = {
                        documentNumberFull: documentNumberFull,
                        managerName: managerName,
                        unit: unit,
                        list: [],
                        totalQuantity: 0, // 총 수량 초기화
                    };
                }

                // 동일한 모델 찾기
                const existingModel = acc[documentNumberFull].list.find(
                    (entry) => entry.model === model && entry.unit === unit
                );

                if (existingModel) {
                    // 모델이 동일하면 수량 합산
                    existingModel.quantity += quantity;
                } else {
                    // 새로 추가
                    acc[documentNumberFull].list.push({model, quantity, unit});
                }

                // 총 수량 업데이트
                acc[documentNumberFull].totalQuantity += quantity;
                acc[documentNumberFull].maker = maker;
                acc[documentNumberFull].item = item;
                acc[documentNumberFull].endUser = endUser;
                return acc;
            }, {})
        );

        setPreviewData(result)
        setIsModalOpen(true)
    };

    function clearAll() {
        setInfo(copyInit)
    }

    const downloadExcel = async () => {
        gridManage.exportSelectedRowsToExcel(gridRef, '메일전송_목록')
    };


    const subTableUtil =
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5}} onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button>


    return <>
        <PreviewMailModal data={previewData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '220px' : '65px'} calc(100vh - ${mini ? 275 : 120}px)`,
                columnGap: 5
            }}>
                <MainCard title={'견적의뢰 메일전송'} list={[
                    {name: '조회', func: searchInfo, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '선택 견적의뢰 발송', func: handleSendMail, type: 'default'},
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div
                            style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                            <BoxCard title={''}>
                                {rangePickerForm({title: '작성일자', id: 'searchDate', onChange: onChange, data: info})}
                                {inputForm({
                                    title: '문서번호', id: 'searchDocumentNumber',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}

                            </BoxCard>

                            <BoxCard title={''}>
                                {inputForm({title: '대리점코드', id: 'searchAgencyCode', onChange: onChange, handleKeyPress:handleKeyPress, data: info})}
                                {inputForm({title: '고객사명', id: 'searchCustomerName', onChange: onChange, handleKeyPress:handleKeyPress, data: info})}
                            </BoxCard>

                            <BoxCard title={''}>
                                {selectBoxForm({
                                    title: '발송 여부', id: 'searchSentStatus', onChange: onChange, data: info, list: [
                                        {value: 0, label: '전체'},
                                        {value: 1, label: '발송'},
                                        {value: 2, label: '미발송'}
                                    ]
                                })}
                                {selectBoxForm({
                                    title: '회신 여부', id: 'searchReplyStatus', onChange: onChange, data: info, list: [
                                        {value: 0, label: '전체'},
                                        {value: 1, label: '회신'},
                                        {value: 2, label: '미회신'}
                                    ]
                                })}
                            </BoxCard>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={rfqReadColumns}
                    funcButtons={subTableUtil}

                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));

        const result = await searchRfq({data: subRfqReadMailInitial});

        return {
            props: {dataInfo: result ? result : null}
        }
    }

})