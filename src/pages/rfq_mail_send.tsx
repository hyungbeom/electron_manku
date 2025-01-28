import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {rfqReadColumns} from "@/utils/columnList";
import {subRfqReadMailInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import PreviewMailModal from "@/component/PreviewMailModal";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import {useRouter} from "next/router";
import Spin from "antd/lib/spin";
import Button from "antd/lib/button";
import {CopyOutlined} from "@ant-design/icons";
import {getData} from "@/manage/function/api";


export default function rfqRead({dataInfo}) {
    const router = useRouter();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(subRfqReadMailInitial)


    const [info, setInfo] = useState(copyInit);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState({});

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true)
        await searchRfq({
            data: copyData
        }).then(v => {
            gridManage.resetData(gridRef, v);
            setLoading(false)
        })

    }

    const handleSendMail = async () => {
        const checkedData = gridManage.getSelectRows(gridRef);
        if (!checkedData.length) {
            return message.warn('선택된 데이터가 없습니다.')
        }




        const groupedData = {};
        const fileIdList = [];

        checkedData.forEach(record => {
            const agencyCode = record.agencyCode || "unknown";
            const docNumber = record.documentNumberFull || "unknown";
            fileIdList.push(record.estimateRequestId)
            if (!groupedData[agencyCode]) {
                groupedData[agencyCode] = {};
            }

            if (!groupedData[agencyCode][docNumber]) {
                groupedData[agencyCode][docNumber] = [];
            }

            groupedData[agencyCode][docNumber].push(record);
        });

        // @ts-ignore
        const data = [...new Set(fileIdList)]

        setPreviewData(groupedData)

        await getData.post('common/getAttachmentFileList',{attachmentFileItemList :data.map(v=>{
            return {relatedType : 'ESTIMATE_REQUEST' ,relatedId : v}
            })}).then(v=>{

            setFileList(v.data.entity.attachmentFiles)
        })
        setIsModalOpen(true)
    };

    function clearAll() {
        setInfo(copyInit)
        gridRef.current.deselectAll()
    }

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }

        const deleteList = gridManage.getFieldDeleteList(gridRef, {
            estimateRequestId: 'estimateRequestId',
            estimateRequestDetailId: 'estimateRequestDetailId'
        });
        await deleteRfq({data: {deleteList: deleteList}, returnFunc: searchInfo});

    }

    return <Spin spinning={loading} tip={'견적의뢰 조회중...'}>
        <PreviewMailModal data={previewData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} fileList={fileList}/>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '195px' : '65px'} calc(100vh - ${mini ? 295 : 165}px)`,
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
                                {inputForm({
                                    title: '대리점코드',
                                    id: 'searchAgencyCode',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
                                {inputForm({
                                    title: '고객사명',
                                    id: 'searchCustomerName',
                                    onChange: onChange,
                                    handleKeyPress: handleKeyPress,
                                    data: info
                                })}
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
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={rfqReadColumns}
                           funcButtons={['print']}/>
            </div>
        </LayoutComponent>
    </Spin>
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