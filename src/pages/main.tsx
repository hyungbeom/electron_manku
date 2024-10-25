import LayoutComponent from "@/component/LayoutComponent";
import initialServerRouter from "@/manage/function/initialServerRouter";
import Card from "antd/lib/card/Card";
import Badge from "antd/lib/badge";
import Calendar from "antd/lib/calendar";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {getData} from "@/manage/function/api";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

const getListData = (value) => {
    let listData = []; // Specify the type of listData
    switch (value.date()) {
        case 8:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
            ];
            break;
        case 10:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event.',
                },
                {
                    type: 'success',
                    content: 'This is usual event.',
                },
                {
                    type: 'error',
                    content: 'This is error event.',
                },
            ];
            break;
        case 15:
            listData = [
                {
                    type: 'warning',
                    content: 'This is warning event',
                },
                {
                    type: 'success',
                    content: 'This is very long usual event......',
                },
                {
                    type: 'error',
                    content: 'This is error event 1.',
                },
                {
                    type: 'error',
                    content: 'This is error event 2.',
                },
                {
                    type: 'error',
                    content: 'This is error event 3.',
                },
                {
                    type: 'error',
                    content: 'This is error event 4.',
                },
            ];
            break;
        default:
    }
    return listData || [];
};

const getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394;
    }
};

export default function Main(props){
    const userInfo = useAppSelector((state) => state.user);

    const monthCellRender = (value) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };
    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    return <>
        <LayoutComponent userInfo={userInfo}>
            <div style={{padding : 5}}>
            <Card style={{borderRadius : 8}} title={'업무일정'}>
                {/*@ts-ignored*/}
                <Calendar cellRender={cellRender}  />
            </Card>
            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const userAgent = ctx.req.headers['user-agent'];
    const isMobile = /mobile/i.test(userAgent);

    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }


    return param
})