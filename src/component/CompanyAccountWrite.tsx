import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {makerWriteInitial,} from "@/utils/initialList";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";

function CompanyAccountWrite({getPropertyId, copyPageInfo}:any) {
    const notificationAlert = useNotificationAlert();
    const [info, setInfo] = useState(makerWriteInitial);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('company_account_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    useEffect(() => {

        if (!isEmptyObj(copyPageInfo)) {
            setInfo(makerWriteInitial)
        } else {
            setInfo(copyPageInfo);
        }
    }, [copyPageInfo?.meta?.updateKey]);


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        await getData.post('company/addCompanyAccount', info).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '💾회사계정 등록완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {

                        getPropertyId('company_account_update', v.data.entity.companyAccountId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v.data.message)
            }
        });

    }

    return <div ref={infoRef}>
        <PanelSizeUtil groupRef={groupRef} storage={'company_account_update'}/>
        <MainCard title={'회사계정관리 등록'} list={[
            {name: <div><SaveOutlined style={{paddingRight : 8}}/>저장</div>, func: saveFunc, type: 'primary'},
            {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: '', type: 'danger'}
        ]}>

            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                        style={{gap: 0.5, paddingTop: 3}}>
                <Panel defaultSize={sizes[0]} minSize={5}>
                    <BoxCard title={'회사정보'}>
                        {inputForm({title: '회사이름', id: 'companyName', onChange: onChange, data: info})}
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
}
export default memo(CompanyAccountWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});