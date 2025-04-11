import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {makerWriteInitial,} from "@/utils/initialList";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";
import Spin from "antd/lib/spin";


function MakerWrite({getPropertyId, copyPageInfo}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const [loading, setLoading] = useState(false);

    const copyInit = _.cloneDeep(makerWriteInitial);
    const [info, setInfo] = useState({...copyInit});


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('maker_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    useEffect(() => {
        if (!isEmptyObj(copyPageInfo)) {
            setInfo(makerWriteInitial)
        } else {
            setInfo(copyPageInfo);
        }
    }, [copyPageInfo?._meta?.updateKey]);

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {
        setLoading(true);
        await getData.post('maker/addMaker', info).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '💾 Maker 등록완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('maker_update', v.data.entity.makerId)
                    },
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false);
        });
    }

    function clearAll() {
        const init = _.cloneDeep(makerWriteInitial);
        setInfo(init)
        commonManage.setInfo(infoRef, init);
    }

    return <Spin spinning={loading}>
        <div ref={infoRef}>
            <PanelSizeUtil groupRef={groupRef} storage={'maker_write'}/>
            <MainCard title={'메이커 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {
                    name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                    func: clearAll,
                    type: 'danger'
                },
            ]}>
                <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                            style={{gap: 0.5, paddingTop: 3}}>
                    <Panel defaultSize={sizes[0]} minSize={5}>
                        <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('readProject')}>
                            {inputForm({
                                title: 'Maker',
                                id: 'makerName',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: 'Item',
                                id: 'item',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: '홈페이지',
                                id: 'homepage',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: '한국대리점',
                                id: 'koreanAgency',
                                onChange: onChange,
                                data: info
                            })}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[1]} minSize={5}>
                        <BoxCard title={'담당자 정보'} tooltip={tooltipInfo('customer')}>
                            {inputForm({
                                title: 'AREA',
                                id: 'area',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: '원산지',
                                id: 'origin',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: '담당자 확인',
                                id: 'managerConfirm',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: '직접 확인',
                                id: 'directConfirm',
                                onChange: onChange,
                                data: info
                            })}
                        </BoxCard>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={sizes[2]} minSize={5}>
                        <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
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
        </div>
    </Spin>
}

export default memo(MakerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});