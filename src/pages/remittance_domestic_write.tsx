import React, {useRef, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {ModalInitList, remittanceDomesticInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import message from "antd/lib/message";
import {
    BoxCard,
    datePickerForm,
    inputForm,
    inputNumberForm,
    MainCard,
    numbFormatter,
    numbParser,
    TopBoxCard
} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Radio from "antd/lib/radio";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {commonManage} from "@/utils/commonManage";
import {saveRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import SearchInfoModal from "@/component/SearchAgencyModal";
import {FileSearchOutlined} from "@ant-design/icons";


export default function remittance_domestic_write({dataInfo}) {
    const fileRef = useRef(null);
    const copyInit = _.cloneDeep(remittanceDomesticInitial)

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(ModalInitList);

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const [info, setInfo] = useState<any>({...infoInit, ...dataInfo})
    const [fileList, setFileList] = useState([]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info['connectInquiryNo']) {
            return message.warn('Inquiry No. 가 누락되었습니다.')
        }
        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                formData.append(key, value);
            }
        };

        handleIteration();
        const uploadContainer = document.querySelector(".ant-upload-list"); // 업로드 리스트 컨테이너

        if (uploadContainer) {
            const fileNodes = uploadContainer.querySelectorAll(".ant-upload-list-item-name");
            const fileNames = Array.from(fileNodes).map((node:any) => node.textContent.trim());

            const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);

            filesToSave.forEach((file, index) => {
                formData.append(`attachmentFileList[${index}].attachmentFile`, file);
                formData.append(`attachmentFileList[${index}].fileName`, fileNames[index].replace(/\s+/g, ""));
            });
        }

        formData.delete('createdDate')
        formData.delete('modifiedDate')
        await saveRemittance({data: formData, router: router})
    }

    function clearAll() {
        setInfo(infoInit)
    }

    function openModal(e) {
        commonManage.openModal(e, setIsModalOpen)
    }

    return <>
        <LayoutComponent>
            <SearchInfoModal info={info} setInfo={setInfo}
                             open={isModalOpen}
                             setIsModalOpen={setIsModalOpen}/>

            <MainCard title={'국내 송금 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]}>


                <TopBoxCard title={'기본 정보'} grid={'250px 200px 200px 200px'}>
                    {inputForm({title: 'Inquiry No.', id: 'connectInquiryNo', onChange: onChange, data: info,  disabled:true,  suffix: <FileSearchOutlined style={{cursor: 'pointer', color : 'black'}} onClick={
                            (e) => {
                                e.stopPropagation();
                                openModal('orderList');
                            }
                        }/> })}
                    {inputForm({title: '거래처명', id: 'customerName', onChange: onChange, data: info})}
                    {inputForm({title: '매입처명', id: 'agencyName', onChange: onChange, data: info})}
                    {inputForm({title: '담당자', id: 'managerAdminName', onChange: onChange, data: info, disabled: true})}
                </TopBoxCard>

                <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>

                    <BoxCard title={'송금정보'}>
                        {datePickerForm({title: '송금요청일자', id: 'requestDate', onChange: onChange, data: info})}
                        {datePickerForm({title: '송금지정일자', id: 'assignedDate', onChange: onChange, data: info})}
                    </BoxCard>

                    <BoxCard title={'확인정보'}>
                        <div>송금여부</div>
                        <Radio.Group id={'isSend'} defaultValue={'X'} disabled={true}>
                            <Radio value={'O'}>O</Radio>
                            <Radio value={'X'}>X</Radio>
                        </Radio.Group>
                        <div>계산서 발행여부</div>
                        <Radio.Group id={'isInvoice'} defaultValue={'X'} disabled={true}>
                            <Radio value={'O'}>O</Radio>
                            <Radio value={'X'}>X</Radio>
                        </Radio.Group>
                    </BoxCard>


                    <BoxCard title={'금액정보'}>
                        {inputNumberForm({title: '공급가액', id: 'supplyAmount', onChange: onChange, data: info, formatter : numbFormatter, parser:numbParser})}
                        {inputNumberForm({title: '부가세', id: 'surtax', disabled: true, onChange: onChange, data: info, formatter : numbFormatter, parser:numbParser})}
                        {inputNumberForm({title: '합계', id: 'total', disabled: true, onChange: onChange, data: info, formatter : numbFormatter, parser:numbParser})}
                    </BoxCard>

                    <BoxCard title={'드라이브 목록'}>
                        {/*@ts-ignored*/}
                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                            <DriveUploadComp fileList={fileList} setFileList={setFileList} fileRef={fileRef}
                                             numb={4}/>
                        </div>
                    </BoxCard>
                </div>
            </MainCard>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;
    const {userInfo} = await initialServerRouter(ctx, store);

    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));

    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }
})