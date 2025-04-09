import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import _ from "lodash";
import {useRouter} from "next/router";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {CopyOutlined, DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Actions} from "flexlayout-react";


function MakerUpdate({updateKey, getCopyPage, layoutRef}:any) {
    const notificationAlert = useNotificationAlert();
    const router = useRouter();
    const [info, setInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const groupRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('maker_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {
        const result = await getData.post('maker/getMakerDetail', {
            "makerId": updateKey['maker_update'],
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {makerDetail} = v;
            setInfo(makerDetail);
            setLoading(false)
        })
    }, [updateKey['maker_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        await getData.post('maker/updateMaker', info).then(v => {
            if (v?.data?.code === 1) {
                notificationAlert('success', '💾 메이커 수정완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
        });
    }

    function deleteFunc(){
        setLoading(true);
        getData.post('maker/deleteMaker',{makerId : updateKey['maker_update']}).then(v=>{
            if(v?.data?.code === 1){
                notificationAlert('success', '🗑️ Maker 삭제완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                const {model} = layoutRef.current.props;
                window.postMessage('delete', window.location.origin);
                getCopyPage('maker_read', {})
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'maker_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false);
        })
    }

    function copyPage() {
        let copyInfo = _.cloneDeep(info)
        getCopyPage('maker_write', {...copyInfo, _meta: {updateKey: Date.now()}})
    }

    return <>
        <PanelSizeUtil groupRef={groupRef} storage={'maker_update'}/>
        <MainCard title={'메이커 수정'} list={[
            {name: <div><FormOutlined style={{paddingRight: 8}}/>수정</div>, func: saveFunc, type: 'primary'},
            {name: <div><DeleteOutlined style={{paddingRight: 8}}/>삭제</div>, func: deleteFunc, type: 'delete'},
            {name: <div><CopyOutlined style={{paddingRight: 8}}/>복제</div>, func: copyPage, type: 'default'},
        ]}>

            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                        style={{gap: 0.5, paddingTop: 3}}>
                <Panel defaultSize={sizes[0]} minSize={5}>
                    <BoxCard title={'메이커 정보'}>
                        {inputForm({title: 'Maker', id: 'makerName', onChange: onChange, data: info})}
                        {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                        {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        {inputForm({title: '한국매입처', id: 'koreanAgency', onChange: onChange, data: info})}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[1]} minSize={5}>
                    <BoxCard title={'세부 정보'}>
                        {inputForm({title: 'AREA', id: 'area', onChange: onChange, data: info})}
                        {inputForm({title: '원산지', id: 'origin', onChange: onChange, data: info})}
                        {inputForm({title: '담당자 확인', id: 'managerConfirm', onChange: onChange, data: info})}
                        {inputForm({title: '직접 확인', id: 'directConfirm', onChange: onChange, data: info})}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[2]} minSize={5}>
                    <BoxCard title={'기타 정보'}>
                        {inputForm({
                            title: 'FTA-No',
                            id: 'ftaNumber',
                            onChange: onChange,
                            data: info
                        })}
                        {textAreaForm({
                            title: '지시사항',
                            rows: 7,
                            id: 'instructions',
                            onChange: onChange,
                            data: info
                        })}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[3]} minSize={0}></Panel>
            </PanelGroup>
        </MainCard>
    </>
}

export default memo(MakerUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});