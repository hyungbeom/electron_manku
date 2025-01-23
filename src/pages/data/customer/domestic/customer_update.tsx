import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, EditOutlined, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {tableCodeDomesticWriteColumn,} from "@/utils/columnList";
import {codeDomesticSalesWriteInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import moment from "moment/moment";
import DatePicker from "antd/lib/date-picker";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import initialServerRouter from "@/manage/function/initialServerRouter";
import nookies from "nookies";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import TextArea from "antd/lib/input/TextArea";


export default function code_domestic_agency_write({data}) {
    const gridRef = useRef(null);
    const router=useRouter();

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>(data);


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        const copyData = {...info}
        copyData['tradeStartDate'] = moment(info['tradeStartDate']).format('YYYY-MM-DD');

        await getData.post('customer/updateCustomer', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeDomesticSalesWriteInitial);
                deleteList()
                window.location.href = '/code_domestic_customer'
            } else {
                message.error('저장에 실패하였습니다.')
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
        copyData['customerManagerList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }


    function addRow() {
        let copyData = {...info};
        copyData['customerManagerList'].push({
            "managerName": "",       // 담당자명
            "directTel": "",     // 직통전화
            "faxNumber": "",   // 팩스번호
            "mobileNumber": "", // 휴대폰번호
            "email": "",        // 이메일
            "remarks": ""
        })

        setInfo(copyData)
    }

    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows:  `${mini ? 'auto' : '65px'} 1fr`, height: '100vh', columnGap: 5,}}>
            <Card title={'국내 고객사 수정'} style={{fontSize: 12, border: '1px solid lightGray'}} extra={<span style={{fontSize : 20, cursor : 'pointer'}} onClick={()=>setMini(v => !v)}> {!mini ? <UpCircleFilled/> : <DownCircleFilled/>}</span>} >
                {mini ?<>
                    <div style={{display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1.5fr', columnGap: 20}}>
                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div>코드(약칭)</div>
                                <Input id={'customerCode'} value={info['customerCode']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>지역</div>
                                <Input id={'customerRegion'} value={info['customerRegion']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>업태</div>
                                <Input id={'businessType'} value={info['businessType']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>종목</div>
                                <Input id={'businessItem'} value={info['businessItem']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>대표자</div>
                                <Input id={'representative'} value={info['representative']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                            <div>
                                <div>거래시작일</div>
                                {/*@ts-ignore*/}
                                <DatePicker value={moment(info['tradeStartDate'])} style={{width: '100%'}}
                                            onChange={(date, dateString) => onChange({
                                                target: {
                                                    id: 'tradeStartDate',
                                                    value: date
                                                }
                                            })
                                            } id={'tradeStartDate'} size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>상호</div>
                                <Input id={'customerName'} value={info['customerName']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>주소</div>
                                <Input id={'address'} value={info['address']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>홈페이지</div>
                                <Input id={'homepage'} value={info['homepage']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>전화번호</div>
                                <Input id={'customerTel'} value={info['customerTel']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>팩스번호</div>
                                <Input id={'customerFax'} value={info['customerFax']} onChange={onChange}
                                       size={'small'}/>
                            </div>


                        </Card>


                        <Card size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>
                            <div>
                                <div>사업자번호</div>
                                <Input id={'businessRegistrationNumber'} value={info['businessRegistrationNumber']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>업체확인사항</div>
                                <TextArea id={'companyVerify'} value={info['companyVerify']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>비고란</div>
                                <TextArea id={'remarks'} value={info['remarks']} onChange={onChange}
                                       size={'small'} style={{height: 150}}/>
                            </div>

                        </Card>


                        <Card size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>
                            <div>
                                <div style={{paddingTop: 8}}>화물운송료</div>
                                <Select id={'freightCharge'}
                                        onChange={(src) => onChange({target: {id: 'freightCharge', value: src}})}
                                        size={'small'} value={info['freightCharge']} options={[
                                    {value: '0', label: '화물 선불'},
                                    {value: '1', label: '화물 후불'},
                                    {value: '2', label: '택배 선불'},
                                    {value: '3', label: '택배 후불'},
                                ]} style={{width: '100%',}}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>화물지점</div>
                                <Input id={'freightBranch'} value={info['freightBranch']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>결제방법</div>
                                <Select id={'paymentMethod'}
                                        onChange={(src) => onChange({target: {id: 'paymentMethod', value: src}})}
                                        size={'small'} value={info['paymentMethod']} options={[
                                    {value: '0', label: '현금 결제'},
                                    {value: '1', label: '선수금'},
                                    {value: '2', label: '정기 결제'},
                                ]} style={{width: '100%',}}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>업체형태</div>
                                <Select id={'grade'}
                                        onChange={(src) => onChange({target: {id: 'grade', value: src}})}
                                        size={'small'} value={info['grade']} options={[
                                    {value: '0', label: '딜러'},
                                    {value: '1', label: '제조'},
                                    {value: '2', label: '공공기관'},
                                ]} style={{width: '100%',}}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>만쿠담당자</div>
                                <Input id={'mankuTradeManager'} value={info['mankuTradeManager']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                        </Card>

                    </div>
                    <div style={{paddingTop: 15, textAlign: 'right', width: '100%'}}>

                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>저장</Button>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'}
                                nClick={() => router?.push('/code_domestic_customer_write')}><EditOutlined/>신규</Button>

                    </div>
                </> : null}
            </Card>


            <TableGrid
                gridRef={gridRef}
                columns={tableCodeDomesticWriteColumn}
                tableData={info['customerManagerList']}
                listType={'customerCode'}
                listDetailType={'customerManagerList'}
                // dataInfo={tableOrderReadInfo}
                setInfo={setInfo}
                // setTableInfo={setTableInfo}
                excel={true}
                type={'write'}
                funcButtons={<div>
                    {/*@ts-ignored*/}
                    <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                            onClick={addRow}>
                        <SaveOutlined/>추가
                    </Button>
                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                            onClick={deleteList}>
                        <CopyOutlined/>삭제
                    </Button>
                </div>}
            />

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}


    const { query } = ctx;

    // 특정 쿼리 파라미터 가져오기
    const { customerCode } = query; // 예: /page?id=123&name=example

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

    const result = await getData.post('customer/getCustomerList', {
        searchType: 1,
        searchText: customerCode,
        page:1,
        limit:1,
    });


    return {
        props: {data: result?.data?.entity?.customerList?.[0]}
    }
})