import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";

import {makerRegistInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqWriteInfo} from "@/utils/modalDataList";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import Button from "antd/lib/button";
import {RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {makerColumn} from "@/utils/columnList";

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function makerRead({dataList}) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [info, setInfo] = useState<any>(makerRegistInitial)
    const [listData, setListData] = useState<any>(dataList?.makerList)

    console.log(selectedRowKeys,'selectedRowKeys:')

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        if(!info['makerName'] || !info['item']){
           return message.warn('MAKER 또는 ITEM 내용을 입력하셔야 합니다')
        }
           const result = await getData.post('maker/addMaker', info)

            console.log(result,':::')

        // if (!info['estimateRequestDetailList'].length) {
        //     message.warn('하위 데이터 1개 이상이여야 합니다')
        // } else {
        //     const copyData = {...info}
        //     copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');
        //
        //     await getData.post('estimate/addEstimateRequest', copyData).then(v => {
        //     })
        // }
    }

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'메이커 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'makerName'} value={info['makerName']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'item'} value={info['item']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>홈페이지</div>
                                <Input id={'homepage'} value={info['homepage']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>AREA</div>
                                <Input id={'area'} value={info['area']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>원산지</div>
                                <Input id={'origin'} value={info['origin']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>담당자확인</div>
                                <Input id={'managerConfirm'} value={info['managerConfirm']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>
                        <TwinInputBox>
                            <div>
                                <div style={{paddingBottom: 3}}>한국대리점</div>
                                <Input id={'koreanAgency'} value={info['koreanAgency']} onChange={onChange} size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingBottom: 3}}>직접확인</div>
                                <Input id={'directConfirm'} value={info['directConfirm']} onChange={onChange} size={'small'}/>
                            </div>
                        </TwinInputBox>

                        <div>
                            <div style={{paddingBottom: 3}}>FTA-No.</div>
                            <Input id={'ftaNumber'} value={info['ftaNumber']} onChange={onChange} size={'small'}/>
                        </div>
                        <div>
                            <div style={{paddingBottom: 3}}>지시사항</div>
                            <TextArea id={'instructions'} value={info['instructions']} onChange={onChange} size={'small'}/>
                        </div>
                    </Card>

                    <div style={{float :'right', paddingTop : 10}}>
                    <Button size={'small'} type={'primary'} style={{marginRight: 8}}
                            onClick={saveFunc}><SaveOutlined/>저장</Button>
                    {/*@ts-ignored*/}
                    <Button size={'small'} type={'danger'} style={{marginRight: 8}}
                            onClick={()=>setInfo(makerRegistInitial)}><RetweetOutlined/>초기화</Button>
                    </div>
                </Card>


                <CustomTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} columns={makerColumn} initial={subRfqWriteInitial} dataInfo={subRfqWriteInfo} setInfo={setInfo} info={listData} />
            </div>
        </LayoutComponent>
    </>
}

// @ts-ignored
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const userAgent = ctx.req.headers['user-agent'];
    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('maker/getMakerList', {
        "searchType": "",       // 구분 1: MAKER, 2: ITEM, 3: "AREA"
        "searchText": "",       // 검색어
        "page": 1,
        "limit": 20
    });


    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    return {
        props: {dataList: result?.data?.entity}
    }
})