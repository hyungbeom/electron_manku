import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import _ from "lodash";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import Spin from "antd/lib/spin";
import {Actions} from "flexlayout-react";
import {companyAccountInfo} from "@/utils/column/ProjectInfo";

function CompanyAccountUpdate({updateKey, getCopyPage, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('company_account_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getCompanyAccountInit = () => _.cloneDeep(companyAccountInfo['defaultInfo']);
    const [info, setInfo] = useState(getCompanyAccountInit());
    const getCompanyAccountValidateInit = () => _.cloneDeep(companyAccountInfo['write']['validate']);
    const [validate, setValidate] = useState(getCompanyAccountValidateInit());

    async function getDataInfo() {
        const result = await getData.post('company/getCompanyAccountDetail', {
            "companyAccountId": updateKey['company_account_update'],
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        setValidate(getCompanyAccountValidateInit());
        setInfo(getCompanyAccountInit());
        getDataInfo().then(v => {
            const {companyAccountDetail} = v;
            setInfo({
                ...getCompanyAccountInit(),
                ...companyAccountDetail
            });
        })
        .finally(() => {
            setLoading(false);
        });
    }, [updateKey['company_account_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 회사계정관리
     */
    async function saveFunc() {

        if (!commonManage.checkValidate(info, companyAccountInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('company/updateCompanyAccount', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'company_account_read'}, window.location.origin);
                notificationAlert('success', '💾 회사계정 수정완료',
                    <>
                        <div>회사 이름 : {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.warn(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 삭제
     * 데이터 관리 > 회사계정관리
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('company/deleteCompanyAccount', {companyAccountId: updateKey['company_account_update']}).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'company_account_read'}, window.location.origin);
                notificationAlert('success', '🗑️ 회사계정 삭제완료',
                    <>
                        <div>회사 이름 : {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('company_account_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'company_account_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                console.warn(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        alert('작업 로그 페이지 참고')
                    },
                    {cursor: 'pointer'}
                )
            }
        })
        .catch((err) => {
            notificationAlert('error', '❌ 네트워크 오류 발생', <div>{err.message}</div>);
            console.error('에러:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    /**
     * @description 수정 페이지 > 복제
     * 데이터 관리 > 회사계정관리
     */
    function copyPage() {
        getCopyPage('company_account_write', {...info, _meta: {updateKey: Date.now()}});
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'company_account_update'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '275px' : '65px'} calc(100vh - ${mini ? 360 : 150}px)`,
            columnGap: 5
        }}>
            <MainCard title={'회사계정관리 수정'}
                      list={[
                          {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
                          {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
                          {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                            style={{gap: 0.5, paddingTop: 3}}>
                    <Panel defaultSize={sizes[0]} minSize={5}>
                        <BoxCard title={'회사 정보'}>
                            {inputForm({
                                title: '회사 이름',
                                id: 'companyName',
                                onChange: onChange,
                                data: info,
                                validate: validate['companyName'],
                                key: validate['companyName']
                            })}
                            {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[1]} minSize={5}>
                        <BoxCard title={'계정 정보'}>
                            {inputForm({
                                title: '아이디',
                                id: 'userName',
                                onChange: onChange,
                                data: info,
                                validate: validate['userName'],
                                key: validate['userName']
                            })}
                            {inputForm({
                                title: '비밀번호',
                                id: 'password',
                                onChange: onChange,
                                data: info,
                                validate: validate['password'],
                                key: validate['password']
                            })}
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
                    :<></>}
            </MainCard>
        </div>
    </Spin>
}

export default memo(CompanyAccountUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});