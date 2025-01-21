import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import message from "antd/lib/message";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import Radio from "antd/lib/radio";
import InputNumber from "antd/lib/input-number";
import {commonManage, fileManage, gridManage} from "@/utils/commonManage";
import {saveRemittance, updateRemittance} from "@/utils/api/mainApi";
import {useRouter} from "next/router";
import _ from "lodash";

export default function remittance_domestic({dataInfo}) {


    const infoInit = dataInfo?.remittanceDetail
    const infoFileInit = dataInfo?.attachmentFileList

    const fileRef = useRef(null);
    const router = useRouter();


    const [info, setInfo] = useState(infoInit)
    const [mini, setMini] = useState(true);

    const [fileList, setFileList] = useState(fileManage.getFormatFiles(infoFileInit));
    const [originFileList, setOriginFileList] = useState(infoFileInit);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        setInfo(v=>{
            return {
                ...v,
                surtax: Math.round(v.supplyAmount * 0.1),
                total: v.supplyAmount + Math.round(v.supplyAmount * 0.1)
            }
        })
    },[infoInit])
    console.log(info,'info:')

    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {
        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                // onKeyDown={handleKeyPress}
                   placeholder={placeholder}
                   suffix={suffix}
            />
        </div>
    }


    const inputNumberForm = ({title, id, disabled = false, placeholder = ''}) => {
        let bowl = info;


        return <div>
            <div>{title}</div>
            <InputNumber id={id} value={bowl[id]} disabled={disabled}
                         style={{width: '100%'}}
                         onBlur={() => console.log('!!!')}
                         formatter={(value) =>
                             `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                         }
                         parser={(value) => value.replace(/₩\s?|(,*)/g, '')}
                         onChange={value => {

                             setInfo(v => {
                                 return {
                                     ...v,
                                     supplyAmount: value,
                                     surtax: Math.round(value * 0.1),
                                     total: value + Math.round(value * 0.1)
                                 }
                             })
                         }}
                         size={'small'}
                         placeholder={placeholder}
            />
        </div>
    }

    const radioForm = ({title, id, disabled = false}) => {
        let bowl = info;

        return <>
            <div>{title}</div>
            <Radio.Group id={id} value={info[id]} disabled={disabled}
                         onChange={e => {
                             e.target['id'] = id
                             onChange(e);
                         }}>
                <Radio value={'O'}>O</Radio>
                <Radio value={'X'}>X</Radio>
            </Radio.Group>
        </>
    }

    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={moment(info[id]).isValid() ? moment(info[id]) : ''} style={{width: '100%'}}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: moment(date).format('YYYY-MM-DD')
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }

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
                if(!(key === 'modifiedId' || key === 'modifiedDate'))
                formData.append(key, value);
            }
        };

        handleIteration();
        const uploadContainer = document.querySelector(".ant-upload-list"); // 업로드 리스트 컨테이너

        if (uploadContainer) {
            const fileNodes = uploadContainer.querySelectorAll(".ant-upload-list-item-name");
            const fileNames = Array.from(fileNodes).map((node:any) => node.textContent.trim());

            let count = 0
            fileRef.current.fileList.forEach((item, index) => {
                if(item?.originFileObj){
                    formData.append(`attachmentFileList[${count}].attachmentFile`, item.originFileObj);
                    formData.append(`attachmentFileList[${count}].fileName`, fileNames[index].replace(/\s+/g, ""));
                    count += 1;
                }
            });

        }
        //기존 기준 사라진 파일
        const result = infoFileInit.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));
        result.map((v, idx) => {
            formData.append(`deleteAttachmentIdList[${idx}]`, v.id);
        })

        formData.delete('createdDate')
        formData.delete('modifiedDate')

        await updateRemittance({data: formData, router: router})

    }

    function clearAll() {

    }

    function copyPage(){
        let copyInfo = _.cloneDeep(info)
        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/remittance_domestic?${query}`)
    }
    return <>
        <LayoutComponent>

            <MainCard title={'국내 송금 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'},
                {name: '복제', func: copyPage, type: 'default'}
            ]}>


                <TopBoxCard title={'기본 정보'} grid={'250px 200px 200px 200px'}>
                    {inputForm({title: 'Inquiry No.', id: 'connectInquiryNo'})}
                    {inputForm({title: '거래처명', id: 'customerName'})}
                    {inputForm({title: '매입처명', id: 'agencyName'})}
                    {inputForm({title: '담당자', id: 'managerAdminName', disabled: true})}
                </TopBoxCard>

                <div style={{display: 'grid', gridTemplateColumns: "250px 250px 250px 350px"}}>

                    <BoxCard title={'송금정보'}>
                        {datePickerForm({title: '송금요청일자', id: 'requestDate'})}
                        {datePickerForm({title: '송금지정일자', id: 'assignedDate'})}
                    </BoxCard>

                    <BoxCard title={'확인정보'}>
                        {radioForm({title: '송금여부', id: 'isSend'})}
                        {radioForm({title: '계산서 발행여부', id: 'isInvoice'})}
                    </BoxCard>

                    <BoxCard title={'금액정보'}>
                        {inputNumberForm({title: '공급가액', id: 'supplyAmount'})}
                        {inputNumberForm({title: '부가세', id: 'surtax', disabled: true})}
                        {inputNumberForm({title: '합계', id: 'total', disabled: true})}
                    </BoxCard>

                    <BoxCard title={'드라이브 목록'}>
                        {/*@ts-ignored*/}
                        <div style={{overFlowY: "auto", maxHeight: 300}}>
                            <DriveUploadComp  fileList={fileList} setFileList={setFileList} fileRef={fileRef}/>
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

    const {remittanceId} = query;

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

    const result = await getData.post('remittance/getRemittanceDetail', {
        remittanceId: remittanceId
    });

    return {
        props: {dataInfo: result.data.entity, remittanceId:remittanceId}
    }
})