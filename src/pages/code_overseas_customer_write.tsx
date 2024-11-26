import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {tableCodeDomesticWriteColumn,} from "@/utils/columnList";
import {codeDomesticSalesWriteInitial, codeOverseasSalesWriteInitial,} from "@/utils/initialList";
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


export default function code_domestic_agency_write() {
    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState(codeOverseasSalesWriteInitial);


    useEffect(() => {
        let copyData: any = {...codeOverseasSalesWriteInitial}
        // @ts-ignored
        copyData['tradeStartDate'] = moment();

        setInfo(copyData);

    }, [])


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

        await getData.post('customer/addOverseasCustomer', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeOverseasSalesWriteInitial);
                deleteList()
                window.location.href = '/code_overseas_customer'
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
        copyData['overseasCustomerManagerList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }


    function addRow() {
        let copyData = {...info};
        copyData['overseasCustomerManagerList'].push({
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
            <Card title={'해외 거래처 등록'} style={{fontSize: 12, border: '1px solid lightGray'}} extra={<span style={{fontSize : 20, cursor : 'pointer'}} onClick={()=>setMini(v => !v)}> {!mini ? <UpCircleFilled/> : <DownCircleFilled/>}</span>} >
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
                                <div>FTA No</div>
                                <Input id={'ftaNumber'} value={info['ftaNumber']}
                                       onChange={onChange}
                                       size={'small'}/>
                            </div>

                            <div>
                                <div style={{paddingTop: 8}}>화폐단위</div>
                                <Select id={'currencyUnit'}
                                        onChange={(src) => onChange({target: {id: 'currencyUnit', value: src}})}
                                        size={'small'} value={info['currencyUnit']} options={[
                                    {value: '0', label: 'KRW'},
                                    {value: '1', label: 'EUR'},
                                    {value: '2', label: 'JPY'},
                                    {value: '3', label: 'USD'},
                                    {value: '4', label: 'GBP'},
                                ]} style={{width: '100%',}}/>
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



                        </Card>


                        <Card size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>

                            <div>
                                <div style={{paddingTop: 8}}>전화번호</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>팩스번호</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>만쿠 담당자</div>
                                <Input id={'mankuTradeManager'} value={info['mankuTradeManager']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                        </Card>


                        <Card size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>
                            <div>
                                <div style={{paddingTop: 8}}>업체확인사항</div>
                                <TextArea id={'companyVerification'} value={info['companyVerification']}
                                          onChange={onChange}
                                          size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>비고란</div>
                                <TextArea id={'remarks'} value={info['remarks']} onChange={onChange}
                                          size={'small'} style={{height: 100}}/>
                            </div>

                        </Card>

                    </div>
                    <div style={{paddingTop: 15, textAlign: 'right', width: '100%'}}>

                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>저장</Button>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'}
                                onClick={() => setInfo(codeOverseasSalesWriteInitial)}><RetweetOutlined/>초기화</Button>

                    </div>
                </> : null}
            </Card>


            <TableGrid
                gridRef={gridRef}
                columns={tableCodeDomesticWriteColumn}
                tableData={info['overseasCustomerManagerList']}
                listType={'customerCode'}
                listDetailType={'overseasCustomerManagerList'}
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

    const {userInfo} = await initialServerRouter(ctx, store);
    const cookies = nookies.get(ctx)
    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));


    return param
})