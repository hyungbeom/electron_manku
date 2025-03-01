import LayoutComponent from "@/component/LayoutComponent";
import { wrapper } from "@/store/store";
import { useAppSelector } from "@/utils/common/function/reduxHooks";
import React, {useEffect, useRef, useState} from "react";
import { DownOutlined } from "@ant-design/icons";
import {Actions, Layout, Model, TabNode} from "flexlayout-react";
import Tree from "antd/lib/tree/Tree";
import ProjectWrite from "@/component/page/project/ProjectWrite";
import ProjectRead from "@/component/page/project/ProjectRead";
import _ from "lodash";

const treeData = [
    { title: "HOME", key: "home" },
    {
        title: "프로젝트",
        key: "project",
        children: [
            { title: "프로젝트 등록", key: "project_write" },
            { title: "프로젝트 조회", key: "project_read" },
        ],
    },
    {
        title: "견적의뢰",
        key: "rfq",
        children: [
            { title: "견적의뢰 등록", key: "rfq_write" },
            { title: "견적의뢰 수정", key: "rfq_read" },
            { title: "메일전송", key: "rfq_mail_send" },
        ],
    },
];

// 각 탭에 대한 매핑 정의
const tabComponents = {
    project_write: { name: "프로젝트 등록", component: <ProjectWrite dataInfo={[]} managerList={[]} /> },
    project_read: { name: "프로젝트 조회", component: <ProjectRead dataInfo={[]} /> },
    rfq_write: { name: "견적의뢰 등록", component: <div>견적의뢰 등록 화면</div> },
    rfq_read: { name: "견적의뢰 수정", component: <div>견적의뢰 수정 화면</div> },
    rfq_mail_send: { name: "메일전송", component: <div>메일전송 화면</div> },
};

export default function Main() {
    const layoutRef = useRef<any>(null);

    const userInfo = useAppSelector((state) => state.user);


    const [selectMenu, setSelectMenu] = useState('')
    const [tabs, setTabs] = useState({
        global: { tabEnablePopout: true },
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

    // flexlayout-react의 Model 생성
    const [model, setModel] = useState(Model.fromJson(tabs));

    // 탭을 렌더링할 Factory 함수
    const factory = (node: TabNode) => {
        const componentKey = node.getComponent();
        return tabComponents[componentKey]?.component || <div>Unknown Component</div>;
    };

    // 트리 항목 클릭 시 실행될 함수
    const onSelect = (selectedKeys, b) => {
        const selectedKey = selectedKeys[0];

        const result = model.toJson().layout.children.map((v) => {
            return v.children.map((src) => src.component);
        });

        setSelectMenu(b.node.title)
        if (result.flat().includes(selectedKey)) {
            return; // 이미 존재하면 추가하지 않음
        }

        // 선택한 항목이 등록된 탭인지 확인
        if (tabComponents[selectedKey]) {
            const newTab = {
                type: "tab",
                name: tabComponents[selectedKey].name,
                component: selectedKey,
            };

            const updatedLayout = _.cloneDeep(tabs);
            const firstObject = updatedLayout.layout.children[0];

            // 나머지 객체들
            const remainingObjects = updatedLayout.layout.children.slice(1);

            // 기존 모델을 변경하고 새로운 탭 추가
            updatedLayout.layout.children = [
                {
                    ...firstObject, // 기존 탭셋 유지
                    children: [...firstObject.children, newTab], // 새로운 탭 추가
                },
                ...remainingObjects,
            ];

            // 모델 업데이트
            const updatedModel = Model.fromJson(updatedLayout);
            setTabs(updatedLayout);
            setModel(updatedModel);
            // const rootNode = updatedModel.getRoot();
            // const tabsets = rootNode.getChildren();
            // for (const tabset of tabsets) {
            //     // 각 tabset의 자식들 (탭들)을 가져옵니다
            //     const tabs = tabset.getChildren();
            //
            //     for (const tab of tabs) {
            //         // 탭의 이름을 확인하고 일치하는지 검사
            //         if (tab.getName() === '프로젝트 조회') {
            //
            //             model.doAction(Actions.selectTab(tab.getId()))
            //         }
            //     }
            // }

            // 모든 노드를 순회하면서 이름이 일치하는 탭을 찾습니다
            // for (const node of nodes) {
            //     // 탭이 가지고 있는 name 값을 가져옵니다
            //     if (node.getName() === tabName) {
            //         // 이름이 일치하면 해당 탭의 ID를 반환합니다
            //         return node.getId();
            //     }
            // }

        }
    };


    useEffect(() => {
        const rootNode = model.getRoot();
        const tabsets = rootNode.getChildren();
        for (const tabset of tabsets) {
            // 각 tabset의 자식들 (탭들)을 가져옵니다
            const tabs = tabset.getChildren();

            for (const tab of tabs) {
                // 탭의 이름을 확인하고 일치하는지 검사
                if (tab.getName() === selectMenu) {

                    model.doAction(Actions.selectTab(tab.getId()))
                }
            }
        }
    }, [selectMenu]);
    function onLayoutChange(action: any) {
        // 모델이 준비되면 탭 활성화 코드 추가
        const tabNode = model.getNodeById("#0c2b4265-60c4-41af-95a4-fdd876475818");  // 예시로 ID를 사용
        console.log(action,'::')
        if (tabNode) {

            // model.setActiveTabById(tabNode.getId());
        }
    }

    return (
        <LayoutComponent userInfo={userInfo}>
            <div style={{ display: "grid", gridTemplateColumns: "150px auto", height: "100vh" }}>
                <div style={{ borderRight: "1px solid lightGray", padding: 3, paddingTop: 10 }}>
                    <Tree
                        showLine
                        switcherIcon={<DownOutlined />}
                        onSelect={onSelect}
                        treeData={treeData}
                    />
                </div>
                <Layout model={model} factory={factory} onModelChange={onLayoutChange} ref={layoutRef} />
            </div>
        </LayoutComponent>
    );
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    return { props: null };
});