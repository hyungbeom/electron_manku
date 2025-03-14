import React, {useRef, useState} from "react";
import {rfqReadColumns} from "@/utils/columnList";
import {subRfqReadMailInitial} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, inputForm, MainCard, rangePickerForm, selectBoxForm} from "@/utils/commonForm";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import PreviewMailModal from "@/component/PreviewMailModal";
import _ from "lodash";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import Button from "antd/lib/button";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {getData} from "@/manage/function/api";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";


export default function RfqMailSend({getPropertyId}: any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(subRfqReadMailInitial)
    const [totalRow, setTotalRow] = useState(0);

    const [info, setInfo] = useState(copyInit);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState({});

    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {

        gridRef.current = params.api;


        await searchRfq({data: subRfqReadMailInitial}).then(v => {
            setTotalRow(v.pageInfo.totalRow);
            params.api.applyTransaction({add: v.data});
        })
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
            data: {...copyData, page: 1, limit: -1}
        }).then(v => {
            console.log(v.data,'v.data:')
            gridManage.resetData(gridRef, v.data);
            setTotalRow(v.pageInfo.totalRow)
            setLoading(false)
            gridRef.current.ensureIndexVisible(0)
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

        await getData.post('common/getAttachmentFileLists', {
            attachmentFileItemList: data.map(v => {
                return {relatedType: 'ESTIMATE_REQUEST', relatedId: v}
            })
        }).then(v => {
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
        const selectedRows = gridRef.current.getSelectedRows();

        await deleteRfq({data: {deleteList: deleteList}}).then((v: any) => {

            if (v.code === 1) {
                searchInfo();
                notificationAlert('success', '🗑️견적의뢰 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다 </div>*/}
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

    return <Spin spinning={loading} tip={'견적의뢰 조회중...'}>
        {isModalOpen && <PreviewMailModal data={previewData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                                          fileList={fileList}/>}
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '210px' : '65px'} calc(100vh - ${mini ? 340 : 195}px)`,
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
                <TableGrid deleteComp={<Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={deleteList}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>}
                           totalRow={totalRow}
                           getPropertyId={getPropertyId}
                           gridRef={gridRef}
                           onGridReady={onGridReady}
                           columns={rfqReadColumns}
                           funcButtons={['agPrint']}
                />
            </div>
        </>
    </Spin>
}
