import React, {useEffect, useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CreditCardOutlined, HomeOutlined, NotificationOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import _ from "lodash";

export default function getChatList() {
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState({});
    const router = useRouter();


    const list = [
        {img : '', name : '이덕재', uid : 2, content : '안녕하세요', time : '2025-02-10 17:05:22'},
        {img : '', name : '이형범', uid : 3, content : '네 안녕하세요', time : '2025-02-10 17:10:22'},
        {img : '', name : '이형범', uid : 3, content : '나야', time : '2025-02-10 18:2:22'},
        {img : '', name : '이형범', uid : 2, content : '들기름', time : '2025-02-10 18:08:22'},
        {img : '', name : '이덕재', uid : 3, content : '참기름', time : '2025-02-10 18:11:22'},
        {img : '', name : '이덕재', uid : 3, content : '방앗간', time : '2025-02-10 18:13:22'},
        {img : '', name : '이형범', uid : 2, content : '안녕하세요1', time : '2025-02-10 18:15:22'},
        {img : '', name : '이덕재', uid : 3, content : '안녕하세요2', time : '2025-02-10 18:16:22'},
        {img : '', name : '이덕재', uid : 3, content : '안녕하세요3', time : '2025-02-10 18:16:22'}
    ]

    const [chatList, setChatList] = useState(
        [
            {sender: '심재한', message: '1번 내용입니다.', isRead: false},
            {sender: '심재한', message: '2번 내용입니다.', isRead: false},
            {sender: '심재한', message: '3번 내용입니다.', isRead: false},
            {sender: '심재한', message: '4번 내용입니다.', isRead: false},
            {sender: '심재한', message: '5번 내용입니다.', isRead: false},
            {sender: '심재한', message: '6번 내용입니다.', isRead: false},
            {sender: '심재한', message: '7번 내용입니다.', isRead: false},
            {sender: '심재한', message: '8번 내용입니다.', isRead: false},
            {sender: '심재한', message: '9번 내용입니다.', isRead: false},
            {sender: '심재한', message: '10번 내용입니다.', isRead: false},
            {sender: '심재한', message: '10번 내용입니다.', isRead: false},
            {sender: '심재한', message: '10번 내용입니다.', isRead: false},
            {sender: '심재한', message: '10번 내용입니다.', isRead: false},
            {sender: '심재한', message: '10번 내용입니다.', isRead: false}
        ]
    )

    function openBox(chat, i) {
        let copyData = _.cloneDeep(chatList)
        copyData[i] = {...copyData[i], isRead : true};
        console.log(copyData,':::')
        setChatList(copyData)
        setInfo(chat)
        setOpen(true)
    }

    return <>
        {open ? <ChatOpenBox chat={info}/> : <></>}
        <LayoutComponent>
            {list.map(v=>{
                return <div></div>
            })}
            <div style={{padding: 5}}>
                <Card style={{borderRadius: 8}} title={'대화'}>
                    <div style={{display: 'flex', height: '100vh'}}>
                        <div style={{
                            width: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            paddingTop: '20px',
                            borderRadius: '8px 0 0 8px',
                            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                        }}>
                            <div onClick={() => router.push('/home')} style={{cursor: 'pointer', padding: '15px'}}>
                                <HomeOutlined style={{fontSize: '24px'}}/>
                            </div>
                            <div onClick={() => router.push('/notice')} style={{cursor: 'pointer', padding: '15px'}}>
                                <NotificationOutlined style={{fontSize: '24px'}}/>
                            </div>
                            <div onClick={() => router.push('/order_delivery')}
                                 style={{cursor: 'pointer', padding: '15px'}}>
                                <ShoppingCartOutlined style={{fontSize: '24px'}}/>
                            </div>
                            <div onClick={() => router.push('/remittance')}
                                 style={{cursor: 'pointer', padding: '15px'}}>
                                <CreditCardOutlined style={{fontSize: '24px'}}/>
                            </div>
                        </div>

                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            backgroundColor: '#ffffff',
                            borderRadius: '0 8px 8px 0',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            overflowY: 'auto',
                        }}>
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                {chatList.map((chat, i) => (
                                    <Content chat={chat} i={i} clickEvent={openBox}/>
                                ))}
                            </div>
                        </div>

                    </div>

                </Card>
            </div>
        </LayoutComponent>
    </>
}

export function Content({chat, i, clickEvent}) {
    return <div
        key={i}
        style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '15px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
        }}
        onClick={() => clickEvent(chat, i)}>
        <div
            style={{display: 'flex', justifyContent: 'space-between', fontWeight: 600}}>
            <div>
                {chat.sender} <span
                style={{color: '#888', fontSize: '12px'}}>{chat.time}</span>
            </div>
            {chat.isRead == false && (
                <span style={{
                    fontSize: '14px',
                    color: '#ff4d4f',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    backgroundColor: '#ffe6e6',
                }}>
                    N
                  </span>
            )}
        </div>
        <div style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>
            {chat.message.length > 50 ? chat.message.substring(0, 50) + '...' : chat.message}
        </div>
    </div>
}

export function ChatOpenBox({chat}){

    useEffect(()=>{
    },[chat])

    return <div style={{position : 'fixed', left : '50%', top : 50, zIndex : 200}}>
        <div>{chat.sender}</div>
        <div>{chat.message}</div>
    </div>
}