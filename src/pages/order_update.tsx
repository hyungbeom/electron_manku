import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {printEstimateInitial,} from "@/utils/initialList";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useRouter} from "next/router";
import {BoxCard, inputForm, MainCard, selectBoxForm, textAreaForm} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {tableOrderWriteColumn} from "@/utils/columnList";
import PrintPo from "@/component/printPo";
import PrintTransactionModal from "@/component/printTransaction";
import {commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {getAttachmentFileList, updateOrder} from "@/utils/api/mainApi";
import _ from "lodash";
import {findEstDocumentInfo} from "@/utils/api/commonApi";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

const listType = 'orderDetailList'
export default function order_update({dataInfo}) {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    console.log(dataInfo, 'dataInfo:')
    const userInfo = useAppSelector((state) => state.user);
    const infoInit = dataInfo?.orderDetail
    let infoInitFile = dataInfo?.attachmentFileList

    const [info, setInfo] = useState<any>(infoInit)

    const [mini, setMini] = useState(true);
    const [customerData, setCustomerData] = useState<any>(printEstimateInitial)
    const [isModalOpen, setIsModalOpen] = useState({event1: false, event2: false});
    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoInitFile));
    const [originFileList, setOriginFileList] = useState(infoInitFile);
    const [loading, setLoading] = useState(false);

    const onGridReady = (params) => {
        gridRef.current = params.api;
        params.api.applyTransaction({add: dataInfo?.orderDetail[listType]});
    };


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        gridRef.current.clearFocusedCell();
        const list = gridManage.getAllData(gridRef)
        if (!list.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다')
        }
        setLoading(true)
        const formData: any = new FormData();
        commonManage.setInfoFormData(info, formData, listType, list)
        commonManage.getUploadList(fileRef, formData);
        commonManage.deleteUploadList(fileRef, formData, originFileList)

        formData.delete('createdDate')
        formData.delete('modifiedDate')


        await updateOrder({data: formData, returnFunc: returnFunc})
    }

    async function returnFunc(e) {
        if (e) {
            await getAttachmentFileList({
                getAttachmentFileList: {
                    "relatedType": "ORDER",   // ESTIMATE, ESTIMATE_REQUEST, ORDER, PROJECT, REMITTANCE
                    "relatedId": infoInit['orderId']
                }
            }).then(v => {
                const list = fileManage.getFormatFiles(v);
                setFileList(list)
                setOriginFileList(list)
                setLoading(false)
            })
        } else {
            setLoading(false)
        }
    }

    async function printTransactionStatement() {
        await searchCustomer();
        setIsModalOpen({event1: true, event2: false});
    }

    function printPo() {
        setIsModalOpen({event1: false, event2: true});
    }

    async function searchCustomer() {
        const result = await getData.post('customer/getCustomerListForOrder', {
            customerName: info['customerName']
        })

        if (result?.data?.code === 1) {

            if (result?.data?.entity?.customerList.length) {
                const totalList = gridManage.getAllData(gridRef);
                setCustomerData(v=> {
                    return {...v, receiveComp: result?.data?.entity?.customerList[0], list: totalList}
                })
            }
        }

    }


    async function handleKeyPress(e) {
        if (e.key === 'Enter') {

            switch (e.target.id) {
                case 'documentNumberFull' :
                    await findEstDocumentInfo(e, setInfo)
                    break;
            }
        }
    }


    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/order_write?${query}`)
    }

    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '470px' : '65px'} calc(100vh - ${mini ? 525 : 120}px)`,
                columnGap: 5
            }}>
                {/*@ts-ignore*/}
                <PrintTransactionModal data={info} customerData={customerData} isModalOpen={isModalOpen}
                                       setIsModalOpen={setIsModalOpen}/>
                <PrintPo data={dataInfo} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

                <MainCard title={'발주서 수정'} list={[
                    {name: '거래명세표 출력', func: printTransactionStatement, type: 'default'},
                    {name: '발주서 출력', func: printPo, type: 'default'},
                    {name: '수정', func: saveFunc, type: 'primary'},
                    {name: '복제', func: copyPage, type: 'default'},
                ]} mini={mini} setMini={setMini}>


                    {mini ? <div>

                        <BoxCard title={''}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 0.6fr 1fr 1fr 1fr',
                                maxWidth: 900,
                                minWidth: 600,
                                columnGap: 15
                            }}>

                                {inputForm({
                                    title: '작성일',
                                    id: 'writtenDate',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '작성자',
                                    id: 'createdBy',
                                    disabled: true,
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({
                                    title: '담당자',
                                    id: 'estimateManager',
                                    onChange: onChange,
                                    data: info
                                })}
                                {/*{inputForm({title: '담당자', id: 'managerAdminName'})}*/}

                                {inputForm({
                                    title: '연결 PO No.',
                                    id: 'documentNumberFull',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: '고객사 PO no', id: 'yourPoNo', onChange: onChange, data: info})}
                            </div>
                        </BoxCard>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '150px 200px 200px 1fr 300px',
                            columnGap: 10,
                            marginTop: 10
                        }}>

                            <BoxCard title={'매입처 정보'}>

                                {inputForm({title: 'Messrs', id: 'agencyCode', onChange: onChange, data: info})}
                                {/*수신자*/}
                                {inputForm({title: 'Attn To', id: 'attnTo', onChange: onChange, data: info})}
                                {inputForm({title: '고객사명', id: 'agencyName', onChange: onChange, data: info})}
                            </BoxCard>


                            <BoxCard title={'당담자 정보'}>
                                {inputForm({title: 'Responsibility', id: 'managerId', onChange: onChange, data: info})}
                                {inputForm({title: 'TEL', id: 'managerPhoneNumber', onChange: onChange, data: info})}
                                {inputForm({title: 'Fax', id: 'managerFaxNumber', onChange: onChange, data: info})}
                                {inputForm({title: 'E-Mail', id: 'managerEmail', onChange: onChange, data: info})}

                            </BoxCard>
                            <BoxCard title={'LOGISTICS'}>
                                {selectBoxForm({
                                    title: 'Payment Terms', id: 'paymentTerms', onChange: onChange, data: info, list: [
                                        {value: '0', label: 'By in advance T/T'},
                                        {value: '1', label: 'Credit Card'},
                                        {value: '2', label: 'L/C'},
                                        {value: '3', label: 'Order 30% Before Shipping 70%'},
                                        {value: '4', label: 'Order 50% Before Shipping 50%'},
                                    ]
                                })}
                                {inputForm({
                                    title: 'Delivery Terms',
                                    id: 'deliveryTerms',
                                    onChange: onChange,
                                    data: info
                                })}
                                {inputForm({title: 'MAKER', id: 'maker', onChange: onChange, data: info})}
                                {inputForm({title: 'ITEM', id: 'item', onChange: onChange, data: info})}
                                {inputForm({title: 'Delivery(weeks)', id: 'delivery', onChange: onChange, data: info})}
                            </BoxCard>

                            <BoxCard title={'ETC'}>
                                {inputForm({title: '견적서담당자', id: 'estimateManager', onChange: onChange, data: info})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks', onChange: onChange, data: info})}
                                {textAreaForm({title: '하단태그', rows: 3, id: 'footer', onChange: onChange, data: info})}
                            </BoxCard>


                            <BoxCard title={'드라이브 목록'} disabled={!userInfo['microsoftId']}>
                                {/*@ts-ignored*/}
                                <div style={{overFlowY: "auto", maxHeight: 300}}>
                                    <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                                     numb={4}/>
                                </div>
                            </BoxCard>
                        </div>
                    </div> : null}
                </MainCard>


                <TableGrid
                    gridRef={gridRef}
                    onGridReady={onGridReady}
                    columns={tableOrderWriteColumn}
                    type={'write'}
                    funcButtons={['orderUpload', 'orderAdd', 'delete', 'print']}
                />

            </div>
        </LayoutComponent>
    </>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {orderId} = ctx.query;

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));
    const result = await getData.post('order/getOrderDetail', {
        orderId: orderId
    });
    const dataInfo = result?.data?.entity;
    return {
        props: {dataInfo: dataInfo ? dataInfo : null}
    }


})