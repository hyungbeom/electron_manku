import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {DownOutlined} from "@ant-design/icons";
import {Actions, Layout, Model, TabNode} from "flexlayout-react";
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
import HcodeRead from "@/component/page/HcodeRead";
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
import {getData} from "@/manage/function/api";
import StoreUpdate from "@/component/page/store/StoreUpdate";


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
    const layoutRef = useRef<any>(null);

    const userInfo = useAppSelector((state) => state.user);

    const [selectMenu, setSelectMenu] = useState('')
    const [count, setCount] = useState(0)
    const [tabs, setTabs] = useState({
        global: {},
        borders: [],
        layout: {
            type: "row",
            weight: 100,
            children: [
                {
                    type: "tabset",
                    weight: 50,
                    children: [],
                },
            ],
        },
    });

    const [model, setModel] = useState<any>(Model.fromJson(tabs));

    const tabCounts = useMemo(() => {
        let tabCount = 0;


        model.visitNodes((node) => {
            if (node.getType() === "tab") {
                tabCount++;
            }
        });
        return tabCount
    }, [count]);

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

        const result = model.toJson().layout.children.map((v) => {
            return v.children.map((src) => src.component);
        });


        const title = findTitleByKey(treeData, selectedKey);

        if (title) {
            setSelectMenu(title);
            updateSelectTab();
        } else {
            const result = updateList.find(v => v.key === selectedKey)
            setSelectMenu(result?.title);
        }

        if(event?.event === 'select'){
            let copyObject = _.cloneDeep(copyPageInfo);
            copyObject[selectedKey] = {};
            setCopyPageInfo(copyObject);
        }


        if (result.flat().includes(selectedKey)) {
            return; // 이미 존재하면 추가하지 않음
        }


        // 선택한 항목이 등록된 탭인지 확인
        if (tabComponents[selectedKey]) {
            addTab(selectedKey)
        }
    };
    const tabComponents = {
        project_write: {name: "프로젝트 등록", component: <ProjectWrite copyPageInfo={copyPageInfo}/>},
        project_read: {
            name: "프로젝트 조회",
            component: <ProjectRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        project_update: {name: "프로젝트 수정", component: <ProjectUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>},

        rfq_write: {name: "견적의뢰 등록", component: <RfqWrite copyPageInfo={copyPageInfo}/>},
        rfq_read: {name: "견적의뢰 조회", component: <RfqRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>},
        rfq_update: {name: "견적의뢰 수정", component: <RqfUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>},
        rfq_mail_send: {name: "메일전송", component: <RfqMailSend getPropertyId={getPropertyId}/>},

        estimate_write: {name: "견적서 등록", component: <EstimateWrite copyPageInfo={copyPageInfo}/>},
        estimate_read: {
            name: "견적서 조회",
            component: <EstimateRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        estimate_update: {name: "견적서 수정", component: <EstimateUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>},

        order_write: {name: "발주서 등록", component: <OrderWrite copyPageInfo={copyPageInfo}/>},
        order_read: {name: "발주서 조회", component: <OrderRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>},
        order_update: {name: "발주서 수정", component: <OrderUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>},

        store_write: {name: "입고 등록", component: <StoreWrite copyPageInfo={copyPageInfo}/>},
        store_read: {name: "입고 조회", component: <StoreRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>},
        store_update: {name: "입고 수정", component: <StoreUpdate dataInfo={[]} />},

        delivery_write: {name: "배송 등록", component: <DeliveryWrite copyPageInfo={copyPageInfo}/>},
        delivery_read: {
            name: "배송 조회",
            component: <DeliveryRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        delivery_update: {name: "배송 수정", component: <DeliveryUpdate updateKey={updateKey}/>},


        remittance_domestic_write: {name: "국내송금 등록", component: <RemittanceDomesticWrite copyPageInfo={copyPageInfo}/>},
        remittance_domestic_read: {
            name: "국내송금 조회",
            component: <RemittanceDomesticRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        remittance_domestic_update: {name: "국내송금 수정", component: <RemittanceDomesticUpdate updateKey={updateKey}/>},


        domestic_agency_write: {name: "국내매입처 등록", component: <DomesticAgencyWrite copyPageInfo={copyPageInfo}/>},
        domestic_agency_read: {
            name: "국내매입처 조회",
            component: <DomesticAgencyRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        domestic_agency_update: {name: "국내매입처 수정", component: <DomesticAgencyUpdate updateKey={updateKey}/>},

        overseas_agency_write: {name: "해외매입처 등록", component: <OverseasAgencyWrite copyPageInfo={copyPageInfo}/>},
        overseas_agency_read: {
            name: "해외매입처 조회",
            component: <OverseasAgencyRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        overseas_agency_update: {
            name: "해외매입처 수정",
            component: <OverseasAgencyUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>
        },


        domestic_customer_write: {name: "국내고객사 등록", component: <DomesticCustomerWrite copyPageInfo={copyPageInfo}/>},
        domestic_customer_read: {
            name: "국내고객사 조회",
            component: <DomesticCustomerRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>
        },
        domestic_customer_update: {name: "국내고객사 수정", component: <DomesticCustomerUpdate updateKey={updateKey}/>},

        overseas_customer_write: {name: "해외고객사 등록", component: <OverseasCustomerWrite copyPageInfo={copyPageInfo}/>},
        overseas_customer_read: {
            name: "해외고객사 조회", component: <OverseasCustomerRead getPropertyId={getPropertyId}
                                                               getCopyPage={getCopyPage}/>
        },
        overseas_customer_update: {
            name: "해외고객사 수정",
            component: <OverseasCustomerUpdate updateKey={updateKey} getCopyPage={getCopyPage}/>
        },


        maker_write: {name: "메이커 등록", component: <MakerWrite copyPageInfo={copyPageInfo}/>},
        maker_read: {name: "메이커 조회", component: <MakerRead getPropertyId={getPropertyId} getCopyPage={getCopyPage}/>},
        maker_update: {name: "메이커 수정", component: <MakerUpdate updateKey={updateKey}/>},


        hcode_read: {name: "HS CODE 조회", component: <HcodeRead updateKey={updateKey} getCopyPage={getCopyPage}/>},

    };


    const factory = (node: TabNode) => {
        const componentKey = node.getComponent();
        return <div style={{padding: '0px 5px 0px 5px'}}>{tabComponents[componentKey]?.component}</div>;
    };


    function addTab(selectedKey) {
        const updatedLayout = _.cloneDeep(tabs);
        const firstObject = updatedLayout.layout.children[0];

        let newTab = {
            type: "tab",
            name: tabComponents[selectedKey].name,
            component: selectedKey,
        };

        const remainingObjects = updatedLayout.layout.children.slice(1);

        updatedLayout.layout.children = [
            {
                ...firstObject,
                children: [...firstObject.children, newTab],
            },
            ...remainingObjects,
        ];

        const updatedModel = Model.fromJson(updatedLayout);
        setModel(updatedModel);
        setTabs(updatedLayout);
    }

    useEffect(() => {
        updateSelectTab();
    }, [selectMenu, model, updateKey]);

    function updateSelectTab() {
        const rootNode = model.getRoot();
        const tabsets = rootNode.getChildren();
        for (const tabset of tabsets) {
            const tabs = tabset.getChildren();
            for (const tab of tabs) {
                if (tab.getName() === selectMenu) {
                    model.doAction(Actions.selectTab(tab.getId()));
                }
            }
        }
    }


    function onLayoutChange(action: any) {
        setCount(v => v + 1)
        setTabs(model.toJson())
        setModel(action);
    }

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
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gap: 100,
                        gridTemplateRows: '200px auto'
                    }}>

                        {introMenulist.map(v => {
                            return <div>
                                <div style={{
                                    border: '1px solid lightGray',
                                    width: 85,
                                    height: 85,
                                    borderRadius: 10,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{fontSize: 50, color: v.color}}>
                                        {v.icon}
                                    </div>
                                </div>
                                <div style={{textAlign: 'center', fontSize: 16, fontWeight: 500, paddingTop: 10}}>
                                    {v.title}
                                </div>
                                <div style={{paddingTop: 10, cursor: 'pointer', textAlign: 'center'}}>
                                    {v.children.map(src => {
                                        return <div style={{color: v.color, paddingTop: 3}} onClick={() => {
                                            onSelect([src.key])
                                        }}>{src.name}</div>
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
                </div>}

                <Layout model={model} factory={factory} onModelChange={onLayoutChange} ref={layoutRef}/>

            </div>
        </LayoutComponent>
    );
}

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
})