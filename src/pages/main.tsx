import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DownOutlined} from "@ant-design/icons";
import {Actions, DockLocation, Layout, Model, TabNode} from "flexlayout-react";
import Tree from "antd/lib/tree/Tree";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setAdminList, setUserInfo} from "@/store/user/userSlice";
import {introMenulist, treeData} from "@/component/util/MenuData";
import {useAppDispatch, useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import {tabComponents, tabShortcutMap} from "@/utils/commonForm";

import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import {getData} from "@/manage/function/api";
import {getCookie} from "@/manage/function/cookie";
import Drawer from "antd/lib/drawer";
import AlertHistoryRead from "@/component/page/etc/AlertHistoryRead";
import {setHistoryList} from "@/store/history/historySlice";
import GPT from "@/component/page/etc/GPT";

function summarizeNotifications(notifications) {
    const grouped = {};

    // 1. title 기준으로 그룹화
    notifications?.forEach((item) => {
        if (!grouped[item.title]) {
            grouped[item.title] = [];
        }
        grouped[item.title].push(item);
    });

    // 2. 그룹별 요약 생성
    const summarized = Object.entries(grouped).map(([title, group]: any) => {
        const count = group.length;
        const displayTitle = count > 1 ? `${title} 외 ${count - 1}건` : title;
        const first = group[0];

        return {
            title: displayTitle,
            message: first.message,
            pk: first.pk
        };
    });
    console.log(notifications,'summarized::::')

    return summarized;
}

export default function Main() {
    const notificationAlert = useNotificationAlert();
    const {userInfo, adminList} = useAppSelector((state) => state.user);

    // 만쿠 관리자 리스트 store에 추가
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    const [activeTabId, setActiveTabId] = useState<string | null>(null);



    useEffect(() => {

        getData.post('socket/getQueue').then(v => {
            if(v?.data.length) {
                const summary = summarizeNotifications(v?.data);
                summary.forEach(data => {
                    notificationAlert('success', "🔔" + data.title,
                        <>
                            {data.message}
                        </>

                        , function () {
                            if (data.title.includes('[회신알림]')) {
                                getPropertyId('rfq_update', data?.pk);
                            } else if (data.title.includes('[견적서알림]')) {
                                getPropertyId('estimate_update', data?.pk);
                            }
                        },

                        {cursor: 'pointer'},
                        null
                    )
                })
            }
        })
        getData.post('socket/getQueue').then(v => {
            if(v?.data.length) {
                const summary = summarizeNotifications(v?.data);
                summary.forEach(data => {
                    notificationAlert('success', "🔔" + data.title,
                        <>
                            {data.message}
                        </>

                        , function () {
                            if (data.title.includes('[회신알림]')) {
                                getPropertyId('rfq_update', data?.pk);
                            } else if (data.title.includes('[견적서알림]')) {
                                getPropertyId('estimate_update', data?.pk);
                            }
                        },

                        {cursor: 'pointer'},
                        null
                    )
                })
            }
        })
        const socket = new SockJS(`https://server.progist.co.kr/ws?userId=${userInfo.adminId}`);
        // const socket = new SockJS(`http://localhost:3002/ws?userId=${userInfo.adminId}`);


        // STOMP 클라이언트 생성 및 설정
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {

                console.log('[WebSocket 연결 성공]');
                client.subscribe('/user/queue/notifications', async (msg) => {
                    const data = JSON.parse(msg.body);


                    await getData.post('history/getHistoryReceiveList').then(v => {


                        const rawData = v?.data;

// 날짜 기준으로 묶기

                        if (rawData?.length) {
                            const groupedByDate = rawData?.reduce((acc, curr) => {
                                const date = curr.writtenDate;
                                if (!acc[date]) {
                                    acc[date] = [];
                                }
                                acc[date].push(curr);
                                return acc;
                            }, {});
                            dispatch(setHistoryList(groupedByDate))

                        }
                    })


                    // OS 알림 띄우기 (preload에서 노출한 API 호출)
                    const findMember = adminList.find(v => v.adminId === data.senderId)

                    notificationAlert('success', "🔔" + data.title + `  요청자 : ${findMember?.name}`,
                        <>
                            {data.message}
                        </>
                        , function () {
                            if (data.title.includes('[회신알림]')) {
                                getPropertyId('rfq_update', data?.pk);
                            }else if (data.title.includes('[견적서알림]')) {
                                getPropertyId('estimate_update', data?.pk);
                            }
                        },
                        {cursor: 'pointer'},
                        null
                    )
                    // @ts-ignore
                    if (window.electron && window.electron.notify) {
                        // @ts-ignore
                        window.electron.notify(data.title + `  요청자 : ${findMember.name}`, data.message);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error: ', frame.headers['message']);
            },
        });


        client.activate();
        // @ts-ignore
        if (window?.electron) {
            // @ts-ignore
            window.electron.onNotificationClicked(({title, body}) => {
                // console.log('Notification clicked:', title, body);
                // 여기서 원하는 동작 실행
                alert(`알림 클릭됨: ${title}`);
                // 또는 React 상태 업데이트, 라우팅 등
            });
        }


        return () => {
            client.deactivate();
        };
    }, [activeTabId]);

    const modelRef = useRef(Model.fromJson({
        global: {},
        borders: [],
        layout: {
            type: "row",
            weight: 100,
            children: [{type: "tabset", weight: 50, children: []}],
        },
    }));

    const layoutRef = useRef<any>(null);

    const router = useRouter();
    const [tabCounts, setTabCounts] = useState(0);

    useEffect(() => {
        let count = 0;
        modelRef.current.visitNodes((node) => {
            if (node.getType() === "tab") {
                count++;
            }
        });
        setTabCounts(count);
    }, [activeTabId]);

    const [updateKey, setUpdateKey] = useState({})
    const [copyPageInfo, setCopyPageInfo] = useState({})

    /**
     * @description 탭을 추가 및 활성화 시키는 로직입니다
     * @param selectedKeys 활성화에 필요한 tab key 입니다 (ex : 'rfq_write')
     */
    const onSelect = useCallback((selectedKeys) => {
        const selectedKey = selectedKeys[0];

        //활성화 된 탭 찾기
        const existingTabs = modelRef.current.getRoot().getChildren().flatMap(tabset =>
            tabset.getChildren().map((tab: any) => tab.getComponent())
        );
        if (!copyPageInfo[selectedKey]) {
            setCopyPageInfo(prev => ({...prev, [selectedKey]: {}}));
        }

        //중복처리
        if (existingTabs.includes(selectedKey)) {
            const model = modelRef.current;

            const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                .find((node: any) => node.getType() === "tab" && node.getComponent() === selectedKey);
            if (targetNode) {
                model.doAction(Actions.selectTab(targetNode.getId()));
            }
            return;
        } else {
            //추가처리
            if (!selectedKey) {
                return false;
            }
            if (!tabComponents[selectedKey]?.name) {
                return false;
            }
            const newTab = {
                type: "tab",
                name: tabComponents[selectedKey].name,
                component: selectedKey,
                enableRename: false,
            };
            const rootNode = modelRef.current.getRoot();
            const tabset = rootNode.getChildren()[0];
            modelRef.current.doAction(Actions.addNode(newTab, tabset.getId(), DockLocation.CENTER, -1, true));
        }
    }, []);


    //활성화탭 단축키
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && tabShortcutMap[e.key]) {
                e.preventDefault();
                const targetKey = tabShortcutMap[e.key];
                onSelect([targetKey]); // 기존에 있는 onSelect 그대로 사용
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSelect]);


    const getPropertyId = useCallback((key, id) => {
        setUpdateKey(prev => ({
            ...prev,
            [key]: id
        }));
        onSelect([key]);
    }, [onSelect]);

    const getCopyPage = useCallback((page, v) => {
        onSelect([page]);
        setCopyPageInfo(prev => ({
            ...prev,
            [page]: v
        }));
    }, [onSelect, setCopyPageInfo]); // ✅ 의존성 배열 추가


    const factory = (node: TabNode) => {
        const componentKey = node.getComponent();
        return <div style={{padding: '0px 5px 0px 5px'}}
                    className={`tab-content ${node.getId() === activeTabId ? "active-tab" : ""}`}>
            {React.cloneElement(tabComponents[componentKey].component, {
                getPropertyId: getPropertyId,
                layoutRef: layoutRef,
                getCopyPage: getCopyPage,
                copyPageInfo: copyPageInfo[componentKey],
                updateKey: updateKey
            })}
        </div>;
    };


    // 탭이(CURD)변화하는 순간을 캐치 하기위함
    const onLayoutChange = (action: any) => {
        modelRef.current = action;
        const activeTab = modelRef.current.getActiveTabset()?.getSelectedNode();
        setActiveTabId(activeTab ? activeTab.getId() : null);
    };

    const getRootKeys = (data) => data.map((node) => node.key);
    console.log(getRootKeys(treeData))
    const [expandedKeys, setExpandedKeys] = useState(getRootKeys(treeData));

    // 노드 확장/축소 이벤트 핸들러
    const onExpand = (keys) => {
        setExpandedKeys(keys);
    };

    const transformTreeData = (data) =>
        data.map((node) => ({
            ...node,
            title: node.children ? ( // 자식이 있는 경우만 아이콘 추가
                <>
                    {expandedKeys.includes(node.key) ? (
                        <span style={{marginRight: 2, fontSize: 11}}>📂 </span>

                    ) : (
                        <span style={{marginRight: 2, fontSize: 11}}>📁 </span>
                    )}
                    <span style={{fontSize: 12}}>{node.title}</span>
                </>
            ) : (
                <>
                    <span style={{marginRight: 2, fontSize: 10}}>📄 </span>
                    <span style={{fontSize: 12}}>{node.title}</span>
                </>
            ),
            children: node.children ? transformTreeData(node.children) : undefined,
        }));

    // @ts-ignore
    return (
        <LayoutComponent setOpen={setOpen} setOpen2={setOpen2}>
            <div style={{display: "grid", gridTemplateColumns: "205px auto"}}>
                <div style={{
                    borderRight: "1px solid lightGray",
                    paddingTop: 15,
                    height: 'calc(100vh - 56px)',
                    overflowY: "auto",

                }}>
                    <Tree
                        // defaultExpandedKeys={getRootKeys(treeData)}
                        defaultExpandedKeys={['project', 'rfq', 'estimate', 'order', 'remittance', 'data']}
                        showLine
                        switcherIcon={<DownOutlined/>}
                        onSelect={onSelect}
                        treeData={transformTreeData(treeData)}
                        onExpand={onExpand}
                    />
                </div>
                {!tabCounts && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        gap: 70,
                        gridTemplateRows: '200px auto'
                    }}>

                        {introMenulist.map(v => {
                            if (v.title === '시스템관리' && userInfo.authority === 0) {
                                return false;
                            }
                            return <div>
                                <div style={{
                                    border: '1px solid lightGray',
                                    width: 70,
                                    height: 70,
                                    borderRadius: 10,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: '0px auto'
                                }}>
                                    <div style={{fontSize: 40, color: v.color}}>
                                        {v.icon}
                                    </div>
                                </div>
                                <div style={{textAlign: 'center', fontSize: 16, fontWeight: 500, paddingTop: 10}}>
                                    {v.title}
                                </div>
                                <div style={{paddingTop: 10, cursor: 'pointer', textAlign: 'center'}}>
                                    {v.children.map(src => {
                                        return <div style={{color: v.color, paddingTop: 3}} onClick={() => {

                                            if (src.key === 'accept_member') {
                                                router.push('/manage')
                                            } else if (src.key === 'data_log') {
                                                router.push('/logData')
                                            } else {
                                                onSelect([src.key])
                                            }
                                        }}>{src.name}</div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                </div>}

                {/*<Layout model={model} factory={factory} onModelChange={onLayoutChange} ref={layoutRef}*/}
                <Layout popoutURL={'/flex-popout'} model={modelRef.current} factory={factory}
                        onModelChange={onLayoutChange} ref={layoutRef}
                        onRenderTab={(node, renderValues: any) => {
                            // ✅ 활성화된 탭이면 CSS 클래스 추가
                            if (node.getId() === activeTabId) {
                                renderValues.className = "active-tab"; // ✅ 동적으로 클래스 추가
                            }
                            renderValues.content = (
                                <span
                                    onMouseDown={(event) => {
                                        if (event.button === 1) { // 🔥 가운데 버튼 클릭 감지
                                            event.preventDefault(); // 기본 동작 방지 (브라우저 탭 닫힘 방지)
                                            event.stopPropagation(); // 🔥 이벤트 버블링 방지 (다른 핸들러로 전달되지 않도록)

                                            if (modelRef.current) {
                                                modelRef.current.doAction(Actions.deleteTab(node.getId())); // ✅ 탭 삭제
                                            }
                                        }
                                    }}
                                >
        {node.getName()}
      </span>
                            );
                        }}
                />

            </div>
       <AlertHistoryRead open={open} setOpen={setOpen} getPropertyId={getPropertyId}/>
       <GPT open={open2} setOpen={setOpen2} />
        </LayoutComponent>
    );
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo, adminList} = await initialServerRouter(ctx, store);

    getData.defaults.headers["authorization"] = `Bearer ${getCookie(ctx, 'token')}`;
    getData.defaults.headers["refresh_token"] = getCookie(ctx, "refreshToken");
    await getData.post('admin/getAdminList', {
        "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
        "searchAuthority": null,    // 1: 일반, 0: 관리자
        "page": 1,
        "limit": -1
    }).then(v => {
        console.log(v?.data?.entity?.adminList, 'v?.data?.entity?.adminList')
        store.dispatch(setAdminList(v?.data?.entity?.adminList));
    })

    const {first} = ctx.query;

    if (codeInfo !== 1) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));

    }

    return {props: {alarm: first === 'true'}}
})