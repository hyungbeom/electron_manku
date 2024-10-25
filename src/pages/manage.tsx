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

export default function Manage({memberList}:any) {
    const userInfo = useAppSelector((state) => state.user);
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
    ];


    const onChange = (key) => {

    };

    return <LayoutComponent userInfo={userInfo}>
    <div style={{padding : 20}}>
        <Card title={'관리자 페이지'}>

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            {/*<Table />*/}
        </Card>
    </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const userAgent = ctx.req.headers['user-agent'];
    const isMobile = /mobile/i.test(userAgent);

    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);
    const result = await getData.post('admin/getAdminList',{
        "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
        "searchAuthority": null,    // 1: 일반, 0: 관리자
        "page": 1,
        "limit": 20
    });

    console.log(result,'result::')
    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }


    return {props : {memberList : result?.data?.entity?.adminList}}
})