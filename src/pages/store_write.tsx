import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import TextArea from "antd/lib/input/TextArea";
import {CopyOutlined, SaveOutlined} from "@ant-design/icons";
import {projectWriteColumn} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {projectDetailUnit, projectWriteInitial, storeWriteInitial} from "@/utils/initialList";
import moment from "moment";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import TableGrid from "@/component/tableGrid";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {useRouter} from "next/router";
import {commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import {saveProject} from "@/utils/api/mainApi";
import InputNumber from "antd/lib/input-number";

const listType = 'projectDetailList'

export default function storeWrite() {
    const fileRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const copyInit = _.cloneDeep(storeWriteInitial)
    const copyUnitInit = _.cloneDeep(projectDetailUnit)

    const userInfo = useAppSelector((state) => state.user);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name']
    }

    const [info, setInfo] = useState<any>(infoInit)
    const [mini, setMini] = useState(true);


    // =============================================================================================================
    const inputForm = ({title, id, disabled = false, suffix = null, placeholder = ''}) => {

        let bowl = info;

        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   placeholder={placeholder}
                   onChange={onChange}
                   size={'small'}
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

    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={commonManage.disabledDate}
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
        let bowl = {};
        bowl[e.target.id] = e.target.value;
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        if (!info['documentNumberFull']) {
            return message.warn('프로젝트 번호가 누락되었습니다.')
        }
        const tableList = gridManage.getAllData(gridRef);

        if (!tableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }

        const formData: any = new FormData();

        const handleIteration = () => {
            for (const {key, value} of commonManage.commonCalc(info)) {
                if (key !== listType) {
                    formData.append(key, value);
                }
            }
        };

        handleIteration();
        tableList.forEach((detail, index) => {
            console.log(detail, 'detail:::::')
            Object.keys(detail).forEach((key) => {
                formData.append(`${listType}[${index}].${key}`, detail[key]);
            });
        });

        const filesToSave = fileRef.current.fileList.map((item) => item.originFileObj).filter((file) => file instanceof File);
        filesToSave.forEach((file, index) => {
            formData.append(`attachmentFileList[${index}].attachmentFile`, file);
            formData.append(`attachmentFileList[${index}].fileName`, file.name.replace(/\s+/g, ""));
        });

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        await saveProject({data: formData, router: router})
    }


    function deleteList() {
        let copyData = {...info}
        copyData[listType] = commonManage.getUnCheckList(gridRef.current.api);
        setInfo(copyData);
    }

    function addRow() {
        // 새로운 행 데이터 생성
        const newRow = {...copyUnitInit};

        // ag-Grid API를 사용하여 데이터 추가
        gridRef.current.api.applyTransaction({add: [newRow]});

    }


    function clearAll() {
        setInfo({...infoInit});
    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div style={{display: 'flex', alignItems: 'end'}}>
        {/*@ts-ignore*/}
        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}>
            <SaveOutlined/>발주서 조회
        </Button>
        <Button type={'primary'} size={'small'} style={{marginLeft: 5}}
                onClick={addRow}>
            <SaveOutlined/>추가
        </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
    </div>

    return <>

        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>

                <MainCard title={'입고 등록'} list={[
                    {name: '저장', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr'}>

                                {inputForm({title: 'B/L No.', id: 'blNo'})}
                                {inputForm({title: '운수사명', id: 'carrierName'})}
                                {datePickerForm({title: '입고일자', id: 'arrivalDate'})}

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "300px 300px 1fr  ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'비용 정보'}>
                                    {inputNumberForm({title: '부가세', id: 'vatAmount'})}
                                    {inputNumberForm({title: '관세', id: 'commissionFee', placeholder: '매입처 당담자 입력 필요'})}
                                    {inputNumberForm({title: '운임비', id: 'shippingFee'})}
                                </BoxCard>
                                <BoxCard title={'매입금액 정보'}>

                                    {inputNumberForm({title: '합계', id: 'total', disabled: true})}
                                    {inputNumberForm({title: '합계 (VAT포함)', id: 'totalVat', disabled: true})}
                                </BoxCard>

                                <BoxCard title={'매출금액 정보'}>

                                    {inputNumberForm({title: '판매금액합계',  id: 'saleTotal', disabled :  true})}
                                    {inputNumberForm({title: '판매금액 합계 (VAT포함)', id: 'saleVatTotal', disabled :  true})}
                                    {inputNumberForm({title: '영업이익금', id: 'operationIncome', disabled :  true})}
                                </BoxCard>

                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={projectWriteColumn}
                    tableData={info[listType]}
                    type={'write'}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

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

})