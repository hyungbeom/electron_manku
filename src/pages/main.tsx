import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DownOutlined} from "@ant-design/icons";
import {Actions, DockLocation, Layout, Model, TabNode} from "flexlayout-react";
import Tree from "antd/lib/tree/Tree";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {introMenulist, treeData} from "@/component/util/MenuData";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {useRouter} from "next/router";
import {tabComponents} from "@/utils/commonForm";


const tabShortcutMap = {
    '1': 'rfq_write',
    '2': 'rfq_read',
    '3': 'estimate_write',
    '4': 'estimate_read',
    '5': 'order_write',
    '6': 'order_read',

    // 원하는 키와 컴포넌트 키 연결
};

export default function Main() {
    const modelRef = useRef(Model.fromJson({
        global: {},
        borders: [],
        layout: {
            type: "row",
            weight: 100,
            children: [{type: "tabset", weight: 50, children: []}],
        },
    }));


    const [activeTabId, setActiveTabId] = useState<string | null>(null);


    const layoutRef = useRef<any>(null);

    const userInfo = useAppSelector((state) => state.user);
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


        const existingTabs = modelRef.current.getRoot().getChildren().flatMap(tabset =>
            tabset.getChildren().map((tab: any) => tab.getComponent())
        );

        if (!copyPageInfo[selectedKey]) {
            setCopyPageInfo(prev => ({...prev, [selectedKey]: {}}));
        }

        if (existingTabs.includes(selectedKey)) {
            const model = modelRef.current;

            const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                .find((node: any) => node.getType() === "tab" && node.getComponent() === selectedKey);
            if (targetNode) {
                model.doAction(Actions.selectTab(targetNode.getId()));
            }
            return;
        } else {
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


    const onLayoutChange = (action: any) => {
        modelRef.current = action;
        const activeTab = modelRef.current.getActiveTabset()?.getSelectedNode();
        setActiveTabId(activeTab ? activeTab.getId() : null);
    };

    const getRootKeys = (data) => data.map((node) => node.key);

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
                        <span style={{marginRight: 2, fontSize: 11}}>📂</span>

                    ) : (
                        <span style={{marginRight: 2, fontSize: 11}}>📁</span>
                    )}
                    <span style={{fontSize: 12}}>{node.title}</span>
                </>
            ) : (
                <>
                    <span style={{marginRight: 2, fontSize: 10}}>📄</span>
                    <span style={{fontSize: 12}}>{node.title}</span>
                </>
            ),
            children: node.children ? transformTreeData(node.children) : undefined,
        }));
    return (
        <LayoutComponent>
            <div style={{display: "grid", gridTemplateColumns: "205px auto"}}>
                <div style={{
                    borderRight: "1px solid lightGray",
                    paddingTop: 15,
                    height: 'calc(100vh - 56px)',
                    overflowY: "auto"
                }}>
                    <Tree
                        defaultExpandedKeys={getRootKeys(treeData)}
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

        </LayoutComponent>
    );
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const {first} = ctx.query;
    if (!userInfo) {
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