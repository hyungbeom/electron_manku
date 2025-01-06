import LayoutComponent from "@/component/LayoutComponent";
import initialServerRouter from "@/manage/function/initialServerRouter";
import Card from "antd/lib/card/Card";
import Badge from "antd/lib/badge";
import Calendar from "antd/lib/calendar";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {getData} from "@/manage/function/api";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {EditOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

const noticeList=[
    {title:'안녕하십니까', content:"안녕하세요", category:'회신', to:'김민국'},
    {title:'안뇽하세요', content:"안녕하세요", category:'회신', to:'김민국'},
    {title:'안녕하실까', content:"안녕하세요", category:'회신', to:'김민국'},
    {title:'안녕하시죠', content:"안녕하세요", category:'회신', to:'김민국'},
    {title:'안녕하십니까', content:"안녕하세요", category:'회신', to:'김민국'},
    //공지 : [카테고리] 인쿼리, 고객사명(판매처), 담당자, 제목 - 클릭시 견적의뢰 문서로...
    //송금 : 인쿼리넘버, 고객사명(판매처), 담당자
    //택배 : [택배종류] 인쿼리넘버, 고객사명(판매처), 지불방법, 담당자
    //계산서 : [상태] 인쿼리넘버, 고객사명, 금액, 담당자.
]






export default function Main({dataList=[], date}) {
    const userInfo = useAppSelector((state) => state.user);
    const router = useRouter();












    const [datas, setDatas] = useState(dataList)
    const [info, setInfo] = useState({
        searchDocumentNumber: '',
        searchCustomerName: '',
        year: date['year'],
        month: date['month']
    })


    const dateCellRender = (value) => {

        const date = moment(value).format('YYYY-MM-DD');
        return (
            <ul className="events">
                {datas[date]?.map((item) => {

                    const {documentNumberFull} = item;
                    return <li key={item.content} style={{
                        width: 'calc(100% + 40px)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginLeft: -40,
                        fontSize: 10
                    }}>
                        <Badge style={{fontSize: 14}} status={'success'}/>
                        <span style={{cursor: 'pointer'}}
                              className={'hoverText'}><span>{item.documentNumberFull}</span> {item.customerName}</span>

                    </li>
                })}
            </ul>
        )
    };

    // `monthCellRender` 함수도 필요시 추가할 수 있습니다.
    const monthCellRender = (value) => {


        // 예를 들어, 특정 월에 데이터를 넣고 싶은 경우
        if (value.month() === 8) {
            return <div>Special Month Data</div>;
        }

        return null;
    };
    const onPanelChange = (value) => {
        console.log(value, 'valuevalue:')
        console.log(value.year(), 'value.year():')
        console.log(value.month() + 1, 'value.year():')
    };

    async function searchInfo() {

        console.log(info['year'], 'info[\'year\']:')
        console.log(info['month'], 'info[\'year\']:')
        const result = await getData.post('order/getOrderListByMonth', {
            "year": info['year'],     // 조회년도
            "month": info['month'],       // 조회월

            "searchDocumentNumber": info['searchDocumentNumber'],     // 문서번호 검색
            "searchCustomerName": info['searchCustomerName']        // 고객사명 검색
        })

        setDatas(result.data.entity?.ordersCalendar)
    }

    function infoChange(e) {
        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {
                ...v, ...bowl
            }
        })
    }

    return <div>
        <LayoutComponent userInfo={userInfo}>
            <div style={{padding: 5}}>
                <Card style={{borderRadius: 8}} title={'HOME'}>
                    <div style={{display: "grid", gridTemplateColumns: '1fr 1fr', columnGap: 30, paddingTop: 10}}>

                        <div style={{display:'grid', gridTemplateRows:'200px 200px 200px', rowGap:30}}>
                            <Card title={<div style={{display:'flex', justifyContent:'space-between'}}><div onClick={() => router.push('/notice')} style={{
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: 15,
                            }}>공지사항</div><div onClick={()=>router.push('/notice_write')}
                                  style={{cursor: 'pointer', float: 'right', padding: '0 10px',}}><EditOutlined/></div>
                            </div>
                            } size='small'>
                                {noticeList.map((v,i)=>{
                                return (
                                    <div style={{marginTop:5, fontSize:13}}>
                                        <span style={{fontWeight:550,}}>[{v.category}]</span> {v.title}
                                    </div>
                                )})}
                            </Card>

                            <Card title={<div onClick={()=>router.push('/order_delivery')} style={{cursor:'pointer', fontWeight:600, fontSize: 15}}>금일 집하</div>} size='small'>
                                {noticeList.map((v,i)=>{
                                    return (
                                        <div style={{marginTop: 5, fontSize: 13}}>
                                            <span style={{fontWeight: 550}}>[{v.category}]</span> {v.title}
                                        </div>
                                    )
                                })}
                            </Card>

                            <Card title={<div onClick={()=>router.push('/order_delivery')} style={{cursor:'pointer', fontWeight:600, fontSize: 15}}>금일 계산서발행</div>} size='small'>
                                {noticeList.map((v,i)=>{
                                    return (
                                        <div style={{marginTop: 5, fontSize: 13}}>
                                            <span style={{fontWeight: 550}}>[{v.category}]</span> {v.title}
                                        </div>
                                    )
                                })}
                            </Card>

                            <Card title={<div onClick={()=>router.push('/remittance')} style={{cursor:'pointer', fontWeight:600, fontSize: 15}}>금일 송금</div>} size='small'>
                                {noticeList.map((v,i)=>{
                                    return (
                                        <div style={{marginTop: 5, fontSize: 13}}>
                                            <span style={{fontWeight: 550}}>[{v.category}]</span> {v.title}
                                        </div>
                                    )
                                })}
                            </Card>

                        </div>

                        <Card title={<div style={{fontWeight:600, fontSize: 15}}>거래 납기</div>}>
                            <Calendar mode={"month"}
                                      dateCellRender={dateCellRender}
                                      onPanelChange={onPanelChange}/>
                        </Card>
                    </div>
                </Card>
            </div>
        </LayoutComponent>
    </div>
}


// @ts-ignore
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


    const today = new Date();
    const year = today.getFullYear(); // 오늘의 연도
    const month = today.getMonth() + 1; // 오늘의 월 (0부터 시작하므로 +1)


    const result = await getData.post('order/getOrderListByMonth', {
        "year": '2024',     // 조회년도
        "month": '10',       // 조회월

        "searchDocumentNumber": "",     // 문서번호 검색
        "searchCustomerName": ""        // 고객사명 검색
    })


    return {
        props: {
            // dataList: result.data?.entity?.ordersCalendar,
            date: {year: year, month: month}
        }
    }
})