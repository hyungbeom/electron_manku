import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import _ from "lodash";
import Spin from "antd/lib/spin";
import {makerInfo} from "@/utils/column/ProjectInfo";

function MakerWrite({getPropertyId, copyPageInfo}: any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null);

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('maker_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 5]; // 기본값 [50, 50, 50]
    };
    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    const [loading, setLoading] = useState(false);
    const [mini, setMini] = useState(true);

    const getMakerInit = () => _.cloneDeep(makerInfo['defaultInfo']);
    const [info, setInfo] = useState(getMakerInit());
    const getMakerValidateInit = () => _.cloneDeep(makerInfo['write']['validate']);
    const [validate, setValidate] = useState(getMakerValidateInit());

    useEffect(() => {
        setLoading(true);
        setValidate(getMakerValidateInit());
        setInfo(getMakerInit());
        if (isEmptyObj(copyPageInfo)) {
            setInfo({
                ...getMakerInit(),
                ..._.cloneDeep(copyPageInfo)
            });
        }
        setLoading(false);
    }, [copyPageInfo?._meta?.updateKey]);

    function onChange(e) {
        commonManage.onChange(e, setInfo);

        const {id, value} = e?.target;
        commonManage.resetValidate(id, value, setValidate);
    }

    /**
     * @description 등록 페이지 > 저장 버튼
     * 데이터 관리 > 메이커
     */
    async function saveFunc() {
        console.log(info, 'info:::')
        if (!commonManage.checkValidate(info, makerInfo['write']['validationList'], setValidate)) return;

        setLoading(true);
        await getData.post('maker/addMaker', info).then(v => {
            if (v?.data?.code === 1) {
                window.postMessage({message: 'reload', target: 'maker_read'}, window.location.origin);
                notificationAlert('success', '💾 Maker 등록완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                        getPropertyId('maker_update', v?.data?.entity?.makerId)
                    },
                    {cursor: 'pointer'}
                )
                clearAll();
                getPropertyId('maker_update', v?.data?.entity?.makerId)
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
     * @description 등록 페이지 > 초기화 버튼
     * 데이터 관리 > 메이커
     */
    function clearAll() {
        setValidate(getMakerValidateInit());
        setInfo(getMakerInit());
    }

    return <Spin spinning={loading}>
        <PanelSizeUtil groupRef={groupRef} storage={'maker_write'}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '370px' : '65px'} calc(100vh - ${mini ? 455 : 150}px)`,
            columnGap: 5
        }}>
            <MainCard title={'메이커 등록'}
                      list={[
                          {
                              name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>,
                              func: saveFunc,
                              type: 'primary'
                          },
                          {
                              name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>,
                              func: clearAll,
                              type: 'danger'
                          }
                      ]}
                      mini={mini} setMini={setMini}>
                {mini ?
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('readProject')}>
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
                                {inputForm({title: '한국대리점', id: 'koreanAgency', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'담당자 정보'} tooltip={tooltipInfo('customer')}>
                                {inputForm({title: 'AREA', id: 'area', onChange: onChange, data: info})}
                                {inputForm({title: '원산지', id: 'origin', onChange: onChange, data: info})}
                                {inputForm({title: '담당자 확인', id: 'managerConfirm', onChange: onChange, data: info})}
                                {inputForm({title: '직접 확인', id: 'directConfirm', onChange: onChange, data: info})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
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

export default memo(MakerWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});