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
import {Actions} from "flexlayout-react";
import {makerInfo} from "@/utils/column/ProjectInfo";
import Spin from "antd/lib/spin";

function MakerUpdate({updateKey, getCopyPage, layoutRef}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('maker_update');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getMakerInit = () => _.cloneDeep(makerInfo['defaultInfo']);
    const [info, setInfo] = useState(getMakerInit());
    const getMakerValidateInit = () => _.cloneDeep(makerInfo['write']['validate']);
    const [validate, setValidate] = useState(getMakerValidateInit());

    async function getDataInfo() {
        const result = await getData.post('maker/getMakerDetail', {
            "makerId": updateKey['maker_update'],
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true);
        getDataInfo().then(v => {
            const {makerDetail} = v;
            setInfo(makerDetail);
        })
        setValidate(getMakerValidateInit());
        setLoading(false);
    }, [updateKey['maker_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo)

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 수정 페이지 > 수정 버튼
     * 데이터 관리 > 메이커
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, makerInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('maker/updateMaker', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'maker_read'}, window.location.origin);
                notificationAlert('success', '💾 메이커 수정완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                console.warn(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Maker : {info['makerName']}</div>
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
     * @description 수정 페이지 > 삭제 버튼
     * 데이터 관리 > 메이커
     */
    function deleteFunc() {
        setLoading(true);
        getData.post('maker/deleteMaker', {makerId: updateKey['maker_update']}).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'maker_read'}, window.location.origin);
                notificationAlert('success', '🗑️ Maker 삭제완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
                getCopyPage('maker_read', {})
                const {model} = layoutRef.current.props;
                const targetNode = model.getRoot().getChildren()[0]?.getChildren()
                    .find((node: any) => node.getType() === "tab" && node.getComponent() === 'maker_update');
                if (targetNode) {
                    model.doAction(Actions.deleteTab(targetNode.getId())); // ✅ 기존 로직 유지
                }
            } else {
                console.warn(v?.data?.message);
                notificationAlert('error', '⚠️ 작업실패',
                    <>
                        <div>Maker : {info['makerName']}</div>
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
     * @description 수정 페이지 > 복제 버튼
     * 데이터 관리 > 메이커
     */
    function copyPage() {
        getCopyPage('maker_write', {...info, _meta: {updateKey: Date.now()}})
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'maker_update'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '370px' : '65px'} calc(100vh - ${mini ? 455 : 150}px)`,
            columnGap: 5
        }}>
            <MainCard title={'메이커 수정'}
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
                            <BoxCard title={'메이커 정보'}>
                                {inputForm({
                                    title: 'Maker',
                                    id: 'makerName',
                                    onChange: onChange,
                                    data: info,
                                    validate: validate['makerName'],
                                    key: validate['makerName']
                                })}
                                {inputForm({
                                    title: 'Item',
                                    id: 'item',
                                    onChange: onChange,
                                    data: info,
                                    validate: validate['item'],
                                    key: validate['item']
                                })}
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
                                {inputForm({title: 'FTA-No', id: 'ftaNumber', onChange: onChange, data: info})}
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
                    : <></>}
            </MainCard>
        </div>
    </Spin>
}

export default memo(MakerUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});