import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import LayoutComponent from "@/component/LayoutComponent";
import {getData} from "@/manage/function/api";
import Card from "antd/lib/card/Card";
import Table from "antd/lib/table";
import Tabs from "antd/lib/tabs";
import TotalUser from "@/component/manage/totalUser";
import ApproveUser from "@/component/manage/approveUser";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {getCookie} from "@/manage/function/cookie";
import {useEffect, useState} from "react";
import HistoryPage from "@/component/manage/HistoryPage";

export default function Manage(any) {

    const [memberList, setMemberList] = useState([])

    useEffect(()=>{
        getInfo()
    },[])

    async function getInfo(){
        return await getData.post('admin/getAdminList',{
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v=>{
            setMemberList(v.data.entity.adminList)
        })
    }


    const items = [
        {
            key: '1',
            label: '전체 사용자',
            children: <TotalUser/>  ,
        },
        {
            key: '2',
            label: '승인 대기 사용자',
            children: <ApproveUser memberList={memberList}/>,
        },
        {
            key: '3',
            label: '작업이력 목록',
            children: <HistoryPage/>,
        },
    ];


    const onChange = (key) => {

    };

    return <LayoutComponent>
    <div style={{padding : 20}}>
        <Card title={'관리자 페이지'}>

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            {/*<Table />*/}
        </Card>
    </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
    }
})