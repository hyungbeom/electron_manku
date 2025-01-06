import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {useEffect} from "react";

export default function Sample({data}){

    useEffect(()=>{
        console.log(data,'::::::')
    },[data])




}

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

    console.log(result,'result:')

    return {
        props: {
            // dataList: result.data?.entity?.ordersCalendar,
            data : result
        }
    }
})