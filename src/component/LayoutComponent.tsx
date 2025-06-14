import React, {useMemo, useState} from "react";
import {Content} from "antd/lib/layout/layout";
import Dropdown from "antd/lib/dropdown";
import {AlertFilled, BellFilled, LogoutOutlined, SettingOutlined,} from '@ant-design/icons';
import {useRouter} from "next/router";
import {removeCookie} from "@/manage/function/cookie";
import {useAppDispatch, useAppSelector} from "@/utils/common/function/reduxHooks";
import Space from "antd/lib/space";
import {Switch} from "antd";
import {getData} from "@/manage/function/api";
import {setAdminList, setUserInfo} from "@/store/user/userSlice";

export default function LayoutComponent({children, setOpen = null, setOpen2 = null}) {
    const {historyList} = useAppSelector((state) => state.history);
    const {userInfo} = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const status = useMemo(() => {


        const hasUnconfirmed = Object.values(historyList)?.some((items: any) =>

            items.some(item => item.confirm?.toString().toUpperCase() === 'FALSE')
        );

        return hasUnconfirmed
    }, [historyList]);



    function alertSwitch(e){

            getData.post('admin/updateAlertStatus', {
                adminId: userInfo?.adminId,
                alertStatus: e ? 'on' : 'off'
            }).then(v => {
                console.log(v,':::')
                dispatch(setUserInfo({...userInfo, alertStatus : e ? 'on' : 'off'}));
            })

    }

    return <>
        <Content>
            <div style={{
                border: '1px solid lightGray',
                height: 55,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px 30px 0px 10px'
            }}>
                <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                    <img src="/installer-icon.ico" width={35} alt=""/>
                    <div style={{fontSize: 20, fontWeight: 500, paddingLeft: 5}}>MANKU</div>
                </div>
                <div style={{display: 'flex'}}>

                    {/*<div style={{fontSize : 12, padding : 5, paddingRight : 30, cursor : 'pointer'}} onClick={()=>setOpen2(true)}>학습데이터</div>*/}

                    {/*@ts-ignored*/}
                    <Switch checked={userInfo.alertStatus === 'on'} size={'small'} onChange={alertSwitch} style={{margin : 10}}/>
                    {!status ? <BellFilled style={{fontSize: 18, paddingRight: 10, cursor: 'pointer'}}
                                           onClick={() => setOpen(true)}/> : <><BellFilled
                        style={{fontSize: 18, paddingRight: 15, cursor: 'pointer'}}
                        onClick={() => setOpen(true)}/>
                        <div style={{backgroundColor: 'red', width: 3, height: 3, position: 'absolute'}}/>
                    </>}
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
    const userInfo = useAppSelector((state) => state.user.userInfo);
    const items: any = [
        {
            key: '1',
            label: <span onClick={() => {
                // @ts-ignore
                if (window.electron?.openMyAccountWindow) {
                    // @ts-ignore
                    window.electron.openMyAccountWindow();
                } else {
                    window.open(
                        "/myaccount", // 열 URL
                        "_blank",              // 새창
                        "width=600,height=800,top=100,left=100,scrollbars=yes,resizable=yes"
                    );
                }
            }}>My Account
            </span>
        }, {
            key: '2',
            label: <span onClick={() => {
                // @ts-ignore
                if (window.electron?.openTodoListWindow) {
                    // @ts-ignore
                    window.electron.openTodoListWindow();
                } else {
                    window.open(
                        "/todoList", // 열 URL
                        "_blank",              // 새창
                        "width=600,height=800,top=100,left=100,scrollbars=yes,resizable=yes"
                    );
                }
            }}>Todo List
            </span>
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: <span onClick={() => {
                removeCookie(null, 'token');
                router.push('/');
            }}><LogoutOutlined style={{color: 'red', paddingRight: 5}}/>
                Logout
            </span>
        },
        userInfo.authority === 1 && {
            key: '4',
            label: <span onClick={() => {

                // @ts-ignore
                if (window.electron?.openManageWindow) {
                    // @ts-ignore
                    window.electron.openManageWindow();
                } else {
                    window.open(
                        "/manage", // 열 URL
                        "_blank",              // 새창
                        "width=1366,height=868,top=100,left=100,scrollbars=yes,resizable=yes"
                    );
                }
                // router.push('/manage');
            }}><SettingOutlined style={{paddingRight: 5}}/>관리자</span>
        },
    ];
    const router = useRouter();

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