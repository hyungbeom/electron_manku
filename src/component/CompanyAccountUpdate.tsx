import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {makerWriteInitial} from "@/utils/initialList";
import _ from "lodash";
import {useRouter} from "next/router";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";



function CompanyAccountUpdate({updateKey, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const router = useRouter();
    const [info, setInfo] = useState<any>({
        companyName : '',
        homepage : '',
        userName : '',
        password : '',
        remarks : '',
    });

    const groupRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('company_account_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태




    useEffect(() => {
        setInfo(updateKey['company_account_update'])
    }, [updateKey['company_account_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        await getData.post('company/updateCompanyAccount', info).then(v => {
            if (v.data.code === 1) {

                notificationAlert('success', '💾회사계정 수정완료',
                    <>
                        <div>회사이름 : {info['companyName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null,
                )
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });
    }


    function copyPage() {
        let copyInfo = _.cloneDeep(info)
        getCopyPage('company_account_write', copyInfo)
    }

    function clearAll() {
        setInfo(makerWriteInitial);
    }

    return <>
        <PanelSizeUtil groupRef={groupRef} storage={'company_account_update'}/>
        <MainCard title={'회사계정관리 수정'} list={[
            {name: '수정', func: saveFunc, type: 'primary'},
            {name: '초기화', func: clearAll, type: 'danger'},
            {name: '복제', func: copyPage, type: 'default'},
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
    </>
}

export default memo(CompanyAccountUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});