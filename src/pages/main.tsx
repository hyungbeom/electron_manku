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
import {useState} from "react";


export default function Main({dataList=[], date}) {
    const userInfo = useAppSelector((state) => state.user);

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
            "searchCustomerName": info['searchCustomerName']        // 거래처명 검색
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

    return <>
        <LayoutComponent userInfo={userInfo}>
            <div style={{padding: 5}}>
                <Card style={{borderRadius: 8}} title={'업무일정'}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 100px', width: 750}}>
                        <div style={{display: 'grid', gridTemplateColumns: '50px 1fr', width: 300}}>
                            <span>문서번호</span> <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                                     onChange={infoChange}/>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '50px 1fr', width: 300}}>
                            <span>거래처명</span> <Input id={'searchCustomerName'} value={info['searchCustomerName']}
                                                     onChange={infoChange}/>
                        </div>
                        <Button type={'primary'} onClick={searchInfo}>조회</Button>
                    </div>
                    {/*@ts-ignored*/}
                    <div style={{display: "grid", gridTemplateColumns: '1fr 1fr', columnGap: 30, paddingTop: 50}}>
                        <Card title={'거래 예상 납기'}>
                            <Calendar mode={"month"}
                                      dateCellRender={dateCellRender}
                                // monthCellRender={monthCellRender}
                                      onPanelChange={onPanelChange}/>
                        </Card>
                        <Card title={'거래 납기'}>
                            <Calendar mode={"month"}
                                      dateCellRender={dateCellRender}
                                // monthCellRender={monthCellRender}
                                      onPanelChange={onPanelChange}/>
                        </Card>
                    </div>
                </Card>
            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    let param = {}

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

    const today = new Date();
    const year = today.getFullYear(); // 오늘의 연도
    const month = today.getMonth() + 1; // 오늘의 월 (0부터 시작하므로 +1)


    const result = await getData.post('order/getOrderListByMonth', {
        "year": '2024',     // 조회년도
        "month": '10',       // 조회월

        "searchDocumentNumber": "",     // 문서번호 검색
        "searchCustomerName": ""        // 거래처명 검색
    })


    return {
        props: {
            // dataList: result.data?.entity?.ordersCalendar,
            date: {year: year, month: month}
        }
    }
})