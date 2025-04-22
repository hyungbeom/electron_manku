import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";
import Spin from "antd/lib/spin";
import {companyAccountInfo} from "@/utils/column/ProjectInfo";

function CompanyAccountWrite({getPropertyId, copyPageInfo}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('company_account_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getCompanyAccountInit = () => _.cloneDeep(companyAccountInfo['defaultInfo']);
    const [info, setInfo] = useState(getCompanyAccountInit());
    const getCompanyAccountValidateInit = () => _.cloneDeep(companyAccountInfo['write']['validate']);
    const [validate, setValidate] = useState(getCompanyAccountValidateInit());

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            setInfo(getCompanyAccountInit());
        } else {
            setInfo(_.cloneDeep(copyPageInfo));
        }
        setValidate(getCompanyAccountValidateInit());
    }, [copyPageInfo?._meta?.updateKey]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터관리 > 회사계정관리
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, companyAccountInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('company/addCompanyAccount', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'company_account_read'}, window.location.origin);
                notificationAlert('success', '💾 회사계정 등록완료',
                    <>
                        <div>회사 이름: {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('company_account_update', v?.data?.entity?.companyAccountId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('company_account_update', v?.data?.entity?.companyAccountId)
            } else {
                console.warn(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>회사 이름: {info['companyName']}</div>
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
     * @description 등록 페이지 > 초기화
     * 데이터관리 > 회사계정관리
     */
    function clearAll() {
        setInfo(getCompanyAccountInit());
        setValidate(getCompanyAccountValidateInit());
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'company_account_write'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '275px' : '65px'} calc(100vh - ${mini ? 360 : 150}px)`,
            columnGap: 5
        }}>
            <MainCard title={'회사계정관리 등록'}
                      list={[
                          {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                          {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
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
                    : <></>}
            </MainCard>
        </div>
    </Spin>
}

export default memo(CompanyAccountWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});