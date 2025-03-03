import React from "react";
import {Content} from "antd/lib/layout/layout";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import {
    AlertOutlined, BankOutlined, BellFilled,
    DatabaseOutlined,
    DiffOutlined,
    DropboxOutlined,
    FormOutlined,
    FundProjectionScreenOutlined, HomeOutlined, LogoutOutlined, PieChartFilled,
    PullRequestOutlined,
    SendOutlined, SettingFilled, SettingOutlined, SlidersFilled, ToolFilled,
    TruckOutlined, UserOutlined,
} from '@ant-design/icons';
import {useRouter} from "next/router";
import {removeCookie} from "@/manage/function/cookie";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


export default function LayoutComponent({children}) {

    const router = useRouter();

    const userInfo = useAppSelector((state) => state.user);

    console.log(userInfo, 'userInfo:')

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
                padding: '0px 20px'
            }}>
                <div style={{display: 'flex', alignItems : 'center'}}>
                    <img src="/installer-icon.ico" width={50} alt=""/>
                    <div style={{fontSize: 20, fontWeight: 500, paddingLeft : 5}}>MANKU</div>

                </div>
                <div style={{display: 'flex'}}>
                    <div style={{alignItems : 'center', display : 'flex', gap : 20, paddingRight : 20}}>
                        <SettingFilled style={{fontSize : 25, color : 'dimgray', cursor : 'pointer'}} />
                        <PieChartFilled style={{fontSize : 25, color : 'blueviolet', cursor : 'pointer'}} />
                        <BellFilled style={{fontSize : 25, color : "gold", cursor : 'pointer'}} />
                        <SlidersFilled style={{fontSize : 25, color : 'darkcyan', cursor : 'pointer'}} />
                    </div>
                <div style={{ display: 'flex',borderLeft : '1px solid lightGray'}}>
                    <UserOutlined style={{fontSize: 30, paddingLeft : 10}}/>

                    <div style={{paddingLeft: 12}}>
                        <div>{userInfo.name}님 환영합니다</div>
                        <div>{userInfo.email}</div>
                    </div>
                </div>
                </div>
            </div>
            {children}
        </Content>

    </>
}

export function UserMenu() {
    const router = useRouter();
    const items = [
        {
            label: <div style={{width: 100}}>마이페이지</div>,
            key: '1',
            icon: <UserOutlined/>,
        },
        {
            label: <div style={{width: 100, color: 'red'}} onClick={() => {
                removeCookie(null, 'token')
                router.push('/')
            }}>로그아웃</div>,
            key: '2',
            icon: <LogoutOutlined style={{color: 'red'}}/>
        }
    ];
    return <Dropdown menu={{items}}>
        <UserOutlined style={{
            fontSize: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            cursor: 'pointer'
        }}/>
    </Dropdown>
}