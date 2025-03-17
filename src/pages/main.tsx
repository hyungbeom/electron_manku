import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {DownOutlined} from "@ant-design/icons";
import {Actions, DockLocation, Layout, Model, TabNode} from "flexlayout-react";
import Tree from "antd/lib/tree/Tree";
import ProjectWrite from "@/component/page/project/ProjectWrite";
import ProjectRead from "@/component/page/project/ProjectRead";
import _ from "lodash";
import RfqWrite from "@/component/page/rfq/RfqWrite";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {introMenulist, treeData, updateList} from "@/component/util/MenuData";
import ProjectUpdate from "@/component/page/project/ProjectUpdate";
import RfqRead from "@/component/page/rfq/RfqRead";
import RqfUpdate from "@/component/page/rfq/RfqUpdate";
import RfqMailSend from "@/component/page/rfq/RfqMailSend";
import EstimateWrite from "@/component/page/estimate/EstimateWrite";
import EstimateRead from "@/component/page/estimate/EstimateRead";
import EstimateUpdate from "@/component/page/estimate/EstimateUpdate";
import OrderWrite from "@/component/page/order/OrderWrite";
import OrderUpdate from "@/component/page/order/OrderUpdate";
import OrderRead from "@/component/page/order/OrderRead";
import StoreRead from "@/component/page/store/StoreRead";
import StoreWrite from "@/component/page/store/StoreWrite";
import DeliveryWrite from "@/component/page/delivery/DeliveryWrite";
import DeliveryRead from "@/component/page/delivery/DeliveryRead";
import DeliveryUpdate from "@/component/page/delivery/DeliveryUpdate";
import RemittanceDomesticWrite from "@/component/page/remittance/RemittanceDomesticWrite";
import RemittanceDomesticRead from "@/component/page/remittance/RemittanceDomesticRead";
import RemittanceDomesticUpdate from "@/component/page/remittance/RemittanceDomesticUpdate";
import MakerWrite from "@/component/page/data/maker/MakerWrite";
import MakerRead from "@/component/page/data/maker/MakerRead";
import MakerUpdate from "@/component/page/data/maker/MakerUpdate";
import HcodeRead from "@/component/page/data/hscode/HcodeRead";
import DomesticAgencyWrite from "@/component/page/data/agency/domestic/DomesticAgencyWrite";
import DomesticAgencyUpdate from "@/component/page/data/agency/domestic/DomesticAgencyUpdate";
import DomesticAgencyRead from "@/component/page/data/agency/domestic/DomesticAgencyRead";
import OverseasAgencyWrite from "@/component/page/data/agency/overseas/OverseasAgencyWrite";
import OverseasAgencyRead from "@/component/page/data/agency/overseas/OverseasAgencyRead";
import OverseasAgencyUpdate from "@/component/page/data/agency/overseas/OverseasAgencyUpdate";
import DomesticCustomerWrite from "@/component/page/data/customer/domestic/DomesticCustomerWrite";
import OverseasCustomerWrite from "@/component/page/data/customer/overseas/OverseasCustomerWrite";
import OverseasCustomerRead from "@/component/page/data/customer/overseas/OverseasCustomerRead";
import OverseasCustomerUpdate from "@/component/page/data/customer/overseas/OverseasCustomerUpdate";
import DomesticCustomerRead from "@/component/page/data/customer/domestic/DomesticCustomerRead";
import DomesticCustomerUpdate from "@/component/page/data/customer/domestic/DomesticCustomerUpdate";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import StoreUpdate from "@/component/page/store/StoreUpdate";
import {useRouter} from "next/router";


function findTitleByKey(data, key) {
    for (const item of data) {

        if (item.key === key) {
            return item.title;
        }

        if (item.children) {
            const title = findTitleByKey(item.children, key);
            if (title) {
                return title;
            }
        }
    }
    return null;
}


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
    const [selectMenu, setSelectMenu] = useState('')


    const tabCounts = useMemo(() => {
        let tabCount = 0;
        modelRef.current.visitNodes((node) => {
            if (node.getType() === "tab") {
                tabCount++;
            }
        });
        return tabCount;
    }, [modelRef.current.toJson()]); // 🔥 model이 변경될 때만 실행

    const [updateKey, setUpdateKey] = useState({})
    const [copyPageInfo, setCopyPageInfo] = useState({})

    function getPropertyId(key, id) {
        let copyObject = _.cloneDeep(updateKey);
        copyObject[key] = id;
        setUpdateKey(copyObject);
        onSelect([key]);
    }


    function getCopyPage(page, v) {
        let copyObject = _.cloneDeep(copyPageInfo);
        copyObject[page] = v;
        setCopyPageInfo(copyObject);
        console.log('check')
        onSelect([page])
    }

    const onSelect = (selectedKeys, event?) => {
        const selectedKey = selectedKeys[0];

        // 🔥 modelRef.current 사용하여 불필요한 JSON 변환 제거
        const existingTabs = modelRef.current.getRoot().getChildren().flatMap(tabset =>
            tabset.getChildren().map((tab: any) => tab.getComponent())
        );

        const title = findTitleByKey(treeData, selectedKey);

        if (title) {
            if (selectMenu !== title) {
                setSelectMenu(title);
                updateSelectTab();
            }
        } else {
            const result = updateList.find(v => v.key === selectedKey);
            if (result?.title && selectMenu !== result.title) {
                setSelectMenu(result.title);
            }
        }

        // if (event?.event === 'select') {
        // 🔥 useRef 활용하여 불필요한 리렌더링 방지
        if (!copyPageInfo[selectedKey]) {
            setCopyPageInfo(prev => ({...prev, [selectedKey]: {}}));
        }
        // }

        // 🔥 이미 존재하는 탭이면 추가하지 않음
        if (existingTabs.includes(selectedKey)) {
            return;
        }

        // 선택한 항목이 등록된 탭인지 확인 후 추가
        if (tabComponents[selectedKey]) {
            addTab(selectedKey);
        }
    };
    const tabComponents = {
        project_write: {name: "프로젝트 등록", component: <ProjectWrite/>},
        project_read: {
            name: "프로젝트 조회",
            component: <ProjectRead/>
        },
        project_update: {name: "프로젝트 수정", component: <ProjectUpdate updateKey={updateKey}/>},

        rfq_write: {name: "견적의뢰 등록", component: <RfqWrite/>},
        rfq_read: {name: "견적의뢰 조회", component: <RfqRead/>},
        rfq_update: {name: "견적의뢰 수정", component: <RqfUpdate updateKey={updateKey}/>},
        rfq_mail_send: {name: "메일전송", component: <RfqMailSend/>},

        estimate_write: {name: "견적서 등록", component: <EstimateWrite/>},
        estimate_read: {
            name: "견적서 조회",
            component: <EstimateRead/>
        },
        estimate_update: {name: "견적서 수정", component: <EstimateUpdate updateKey={updateKey}/>},

        order_write: {name: "발주서 등록", component: <OrderWrite/>},
        order_read: {name: "발주서 조회", component: <OrderRead/>},
        order_update: {name: "발주서 수정", component: <OrderUpdate updateKey={updateKey}/>},

        store_write: {name: "입고 등록", component: <StoreWrite/>},
        store_read: {name: "입고 조회", component: <StoreRead/>},
        store_update: {name: "입고 수정", component: <StoreUpdate updateKey={updateKey}/>},

        delivery_write: {name: "배송 등록", component: <DeliveryWrite/>},
        delivery_read: {
            name: "배송 조회",
            component: <DeliveryRead/>
        },
        delivery_update: {name: "배송 수정", component: <DeliveryUpdate updateKey={updateKey}/>},


        remittance_domestic_write: {name: "국내송금 등록", component: <RemittanceDomesticWrite/>},
        remittance_domestic_read: {
            name: "국내송금 조회",
            component: <RemittanceDomesticRead/>
        },
        remittance_domestic_update: {name: "국내송금 수정", component: <RemittanceDomesticUpdate updateKey={updateKey}/>},


        domestic_agency_write: {name: "국내매입처 등록", component: <DomesticAgencyWrite/>},
        domestic_agency_read: {
            name: "국내매입처 조회",
            component: <DomesticAgencyRead/>
        },
        domestic_agency_update: {
            name: "국내매입처 수정",
            component: <DomesticAgencyUpdate updateKey={updateKey}/>
        },

        overseas_agency_write: {name: "해외매입처 등록", component: <OverseasAgencyWrite/>},
        overseas_agency_read: {
            name: "해외매입처 조회",
            component: <OverseasAgencyRead/>
        },
        overseas_agency_update: {
            name: "해외매입처 수정",
            component: <OverseasAgencyUpdate updateKey={updateKey}/>
        },


        domestic_customer_write: {name: "국내고객사 등록", component: <DomesticCustomerWrite/>},
        domestic_customer_read: {
            name: "국내고객사 조회",
            component: <DomesticCustomerRead/>
        },
        domestic_customer_update: {name: "국내고객사 수정", component: <DomesticCustomerUpdate updateKey={updateKey}/>},

        overseas_customer_write: {name: "해외고객사 등록", component: <OverseasCustomerWrite/>},
        overseas_customer_read: {
            name: "해외고객사 조회", component: <OverseasCustomerRead/>
        },
        overseas_customer_update: {
            name: "해외고객사 수정",
            component: <OverseasCustomerUpdate updateKey={updateKey}/>
        },


        maker_write: {name: "메이커 등록", component: <MakerWrite/>},
        maker_read: {name: "메이커 조회", component: <MakerRead/>},
        maker_update: {name: "메이커 수정", component: <MakerUpdate updateKey={updateKey}/>},


        hscode_read: {
            name: "HS CODE 조회",
            component: <HcodeRead/>
        },


    };

    const factory = (node: TabNode) => {
        const componentKey = node.getComponent();
        return <div style={{padding: '0px 5px 0px 5px'}}
                    className={`tab-content ${node.getId() === activeTabId ? "active-tab" : ""}`}>
            {/*{tabComponents[componentKey]?.component}*/}
            {React.cloneElement(tabComponents[componentKey].component, {
                getPropertyId: getPropertyId,
                copyPageInfo: copyPageInfo,
                layoutRef: layoutRef,
                getCopyPage: getCopyPage
            })}
        </div>;
    };

    const addTab = (selectedKey) => {
        if (!tabComponents[selectedKey]) return;

        const model = modelRef.current;
        if (!model || !(model instanceof Model)) {
            console.error("❌ modelRef.current가 Model 인스턴스가 아닙니다!", model);
            return;
        }

        const rootNode = model.getRoot();
        const tabset = rootNode.getChildren()[0]; // 첫 번째 tabset 가져오기
        if (!tabset) return;

        // 🔥 이미 존재하는 탭인지 확인
        // @ts-ignored
        const existingTabs = tabset.getChildren().map(tab => tab.getComponent());
        if (existingTabs.includes(selectedKey)) {
            return; // 이미 있으면 추가하지 않음
        }

        // 새로운 탭 추가
        const newTab = {
            type: "tab",
            name: tabComponents[selectedKey].name,
            component: selectedKey,
            enableRename: false,
        };

        // 🔥 올바른 DockLocation 객체 사용
        model.doAction(Actions.addNode(newTab, tabset.getId(), DockLocation.CENTER, -1, true));
    };
    useEffect(() => {
        updateSelectTab();
    }, [selectMenu]);

    const updateSelectTab = () => {
        const rootNode = modelRef.current.getRoot();
        const tabsets = rootNode.getChildren();
        for (const tabset of tabsets) {
            const tabs: any = tabset.getChildren();
            for (const tab of tabs) {
                if (tab.getName() === selectMenu) {
                    modelRef.current.doAction(Actions.selectTab(tab.getId()));
                }
            }
        }
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
                <Layout model={modelRef.current} factory={factory} onModelChange={onLayoutChange} ref={layoutRef}
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
})