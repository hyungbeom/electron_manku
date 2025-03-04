import React from "react";
import {Content} from "antd/lib/layout/layout";
import Dropdown from "antd/lib/dropdown";
import {LogoutOutlined, SettingOutlined,} from '@ant-design/icons';
import {useRouter} from "next/router";
import {removeCookie} from "@/manage/function/cookie";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import Space from "antd/lib/space";


export default function LayoutComponent({children}) {

    const router = useRouter();


    return <>

        {/*<div style={{*/}
        {/*    backgroundColor: '#f5f5f5',*/}
        {/*    width: '100%',*/}
        {/*    borderBottom: '1px solid lightGray',*/}
        {/*    display: 'flex'*/}
        {/*}}>*/}
        {/*    <Menu onClick={onClick}*/}
        {/*          selectedKeys={null} mode="horizontal" items={items}*/}
        {/*          style={{width: '100%', fontSize: 10}} className="custom-menu"/>*/}
        {/*    <UserMenu/>*/}
        {/*</div>*/}

        <Content>
            <div style={{
                border: '1px solid lightGray',
                height: 55,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px 30px 0px 10px'
            }}>
                <div style={{display: 'flex', alignItems: 'center', cursor : 'pointer'}} onClick={()=>router.push('/main')}>
                    <img src="/installer-icon.ico" width={35} alt=""/>
                    <div style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>MANKU</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{alignItems: 'center', display: 'flex', gap: 20, paddingRight: 20}}>
                        <svg style={{cursor: 'pointer'}} onClick={() => window.open('/erp_rule', '_blank')}
                             viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em"
                             height="1em" fill="currentColor" aria-hidden="true">
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                            <path
                                d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path>
                        </svg>
                    </div>
                    <UserMenu/>
                </div>
            </div>
            {children}
        </Content>

    </>
}

export function UserMenu() {
    const items: any = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: <span onClick={() => {
                removeCookie(null, 'token');
                router.push('/');
            }}><LogoutOutlined style={{color: 'red', paddingRight: 5}}/>Logout</span>
        },
        {
            key: '4',
            label: <span  onClick={() => {
                router.push('/manage');
            }}><SettingOutlined style={{ paddingRight: 5}}/>관리자</span>
        },
    ];

    const userInfo = useAppSelector((state) => state.user);
    const router = useRouter();
    // const items = [
    //     {
    //         label: <div style={{width: 100}}>마이페이지</div>,
    //         key: '1',
    //         icon: <UserOutlined/>,
    //     },
    //     {
    //         label: <div style={{width: 100, color: 'red'}} onClick={() => {
    //             removeCookie(null, 'token')
    //             router.push('/')
    //         }}>로그아웃</div>,
    //         key: '2',
    //         icon: <LogoutOutlined style={{color: 'red'}}/>
    //     }
    // ];
    return <Dropdown menu={{items}}>
        <Space>
            <div style={{display: 'flex',}}>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' width={25}
                     alt=""/>
                <div style={{paddingLeft: 10, display: 'flex', alignItems: 'center', color: 'gray'}}>
                    <div>{userInfo.name}</div>
                    {/*<div>{userInfo.email}</div>*/}
                </div>
            </div>
        </Space>
    </Dropdown>
}