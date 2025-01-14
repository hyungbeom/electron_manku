import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {remittanceDomesticSearchInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import _ from "lodash";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import InputNumber from "antd/lib/input-number";
import {commonManage} from "@/utils/commonManage";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import {remittanceReadColumn} from "@/utils/columnList";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const {RangePicker} = DatePicker
export default function remittance_domestic({dataInfo}) {

    const gridRef = useRef(null);
    const copyInit = _.cloneDeep(remittanceDomesticSearchInitial)

    const [mini, setMini] = useState(true);

    const userInfo = useAppSelector((state) => state.user);

    const [tableData, setTableData] = useState(dataInfo);

    const infoInit = {
        ...copyInit,
        managerAdminId: userInfo['adminId'],
        managerAdminName: userInfo['name'],
        adminName: userInfo['name'],
    }

    const [info, setInfo] = useState(infoInit)


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
    const radioForm = ({title, id, disabled = false}) => {
        let bowl = info;

        return <>
            <div>{title}</div>
            <Radio.Group id={id} value={info[id]} disabled={disabled}
                         onChange={e => {
                             e.target['id'] = id
                             onChange(e);
                         }}
            >
                <Radio value={'O'}>O</Radio>
                <Radio value={'X'}>X</Radio>
            </Radio.Group>
        </>
    }


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function searchFunc() {
        const result = await getData.post('remittance/getRemittanceList', info);
        setTableData(result.data.entity.remittanceList)
    }


    async function deleteList() {

    }


    async function downloadExcel() {

    }


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
        <CopyOutlined/>복사
    </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>


    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <MainCard title={'국내송금 조회'} list={[
                    {name: '조회', func: searchFunc, type: 'primary'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                        <TopBoxCard title={'기본 정보'} grid={'250px 200px 200px 200px'}>

                            {inputForm({title: 'Inquiry No.', id: 'searchConnectInquiryNo'})}
                            {inputForm({title: '거래처명', id: 'searchCustomerName'})}
                            {inputForm({title: '매입처명', id: 'searchAgencyName'})}
                            {inputForm({title: '담당자', id: 'searchManagerAdminName'})}
                        </TopBoxCard>

                        <div style={{display: 'grid', gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>

                            <BoxCard title={'거래 정보'}>
                                <div>
                                    <div style={{marginBottom: 3}}>발주일자</div>
                                    <RangePicker style={{width: '100%'}}
                                                 value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                                 id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                        onChange({
                                            target: {
                                                id: 'searchDate',
                                                value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                            }
                                        })
                                    }
                                    }/>
                                </div>
                            </BoxCard>

                            <BoxCard title={'확인정보'}>
                                {radioForm({title: '송금여부', id: 'searchIsSend'})}
                                {radioForm({title: '계산서 발행여부', id: 'searchIsInvoice'})}
                            </BoxCard>
                        </div>
                    </div> : <></>}
                </MainCard>
                <TableGrid
                    gridRef={gridRef}
                    columns={remittanceReadColumn}
                    tableData={tableData}
                    funcButtons={subTableUtil}
                />
            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


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

    const result = await getData.post('remittance/getRemittanceList', remittanceDomesticSearchInitial);

    return {
        props: {dataInfo: result?.data?.entity?.remittanceList}
    }
})