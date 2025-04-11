import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {companyAccountWriteInitial} from "@/utils/initialList";
import _ from "lodash";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import Spin from "antd/lib/spin";
import {Actions} from "flexlayout-react";

function CompanyAccountUpdate({updateKey, getCopyPage, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('company_account_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);

    const [info, setInfo] = useState({});

    async function getDataInfo() {
        const result = await getData.post('company/getCompanyAccountDetail', {
            "companyAccountId": updateKey['company_account_update'],
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        getDataInfo().then(v => {
            const {companyAccountDetail} = v;
            setInfo(companyAccountDetail);
            setLoading(false);
        })
    }, [updateKey['company_account_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo);
    }

    /**
     * @description 회사계정관리 유효성 체크
     * @param info
     */
    function checkValidate(info) {
        if (!info.companyName) {
            message.warning('회사 이름을 입력해주세요.');
            return false;
        }
        if (!info.userName) {
            message.warning('아이디를 입력해주세요.');
            return false;
        }
        if (!info.password) {
            message.warning('비밀번호를 입력해주세요.');
            return false;
        }
        return true;
    }

    /**
     * @description 수정 페이지 > 수정
     * 데이터 관리 > 회사계정관리
     */
    async function saveFunc() {
        if (!checkValidate(info)) return;

        setLoading(true);
        await getData.post('company/updateCompanyAccount', info).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 회사계정 수정완료',
                    <>
                        <div>회사 이름 : {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message);
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 삭제
     * 데이터 관리 > 회사계정관리
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('company/deleteCompanyAccount', {companyAccountId: updateKey['company_account_update']}).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '🗑️ 회사계정 삭제완료',
                    <>
                        <div>회사 이름 : {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                window.postMessage('delete', window.location.origin);
                getCopyPage('company_account_read', {})
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'company_account_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                message.error(v?.data?.message)
            }
        })
        setLoading(false);
    }

    /**
     * @description 수정 페이지 > 복제
     * 데이터 관리 > 회사계정관리
     */
    function copyPage() {
        getCopyPage('company_account_write', {...info, _meta: {updateKey: Date.now()}});
    }

    return <Spin spinning={loading}>
        <div>
            <PanelSizeUtil groupRef={groupRef} storage={'company_account_update'}/>
            <MainCard title={'회사계정관리 수정'} list={[
                {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
            ]}>
                <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                            style={{gap: 0.5, paddingTop: 3}}>
                    <Panel defaultSize={sizes[0]} minSize={5}>
                        <BoxCard title={'회사 정보'}>
                            {inputForm({title: '회사 이름', id: 'companyName', onChange: onChange, data: info})}
                            {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[1]} minSize={5}>
                        <BoxCard title={'계정 정보'}>
                            {inputForm({title: '아이디', id: 'userName', onChange: onChange, data: info})}
                            {inputForm({title: '비밀번호', id: 'password', onChange: onChange, data: info})}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[2]} minSize={5}>
                        <BoxCard title={'기타 정보'}>
                            {textAreaForm({title: '비고', id: 'remarks', onChange: onChange, data: info})}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[3]} minSize={0}></Panel>
                </PanelGroup>
            </MainCard>
        </div>
    </Spin>
}

export default memo(CompanyAccountUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});