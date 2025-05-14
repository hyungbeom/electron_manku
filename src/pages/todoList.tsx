import React, {useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {Menu} from "antd";
import {CalendarOutlined, ScheduleOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import DatePicker from "antd/lib/date-picker";

const items = [
    {
        label: 'MICROSOFT TODL',
        key: 'todo',
        icon: <ScheduleOutlined/>,
    },
    {
        label: 'MICROSOFT SCHEDULE',
        key: 'schedule',
        icon: <CalendarOutlined/>,
    },
];


export default function todoList() {
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const [current, setCurrent] = useState('mail');

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return <>

        <div style={{padding : 10}}>

            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>

            {
                current === 'todo' ?


                    <div style={{padding: 20}}>
                        <div style={{fontWeight: 700}}>2월 5일 수요일</div>
                        <div style={{display: 'flex', paddingTop: 10, gap: 5}}>
                            <Button>Today</Button>
                            <Button>Tomorrow</Button>
                            <DatePicker/>
                            <Button>Create event</Button>
                        </div>

                        <div style={{padding: 5}}>Your schedule for <span style={{fontWeight: 600}}>today</span> is
                            empty
                        </div>


                        <div style={{padding: 5}}>Past event</div>


                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>
                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>



                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>


                    </div>

                    :


                    <div style={{padding: 20}}>
                        <div style={{fontWeight: 700}}>2월 5일 수요일</div>
                        <div style={{display: 'flex', paddingTop: 10, gap: 5}}>
                            <Button>Today</Button>
                            <Button>Tomorrow</Button>
                            <DatePicker/>
                            <Button>Create event</Button>
                        </div>

                        <div style={{padding: 5}}>Your schedule for <span style={{fontWeight: 600}}>today</span> is
                            empty
                        </div>


                        <div style={{padding: 5}}>Past event</div>


                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>
                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>
                        <div style={{borderBottom: '1px solid lightGray', padding: 5}}>
                            <div>daily scrum(_hblee@progist.co.kr)</div>
                            <div>오전 10:30 - 오전 10:45</div>
                        </div>


                    </div>
            }

        </div>
    </>
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

    // return {props: {dataInfo: 'asdf'}}
})