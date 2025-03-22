import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";

import Button from "antd/lib/button";
import {RadiusSettingOutlined, RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {makerWriteInitial, sourceWriteInitial,} from "@/utils/initialList";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";
import {commonFunc, commonManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";
import {isEmptyObj} from "@/utils/common/function/isEmptyObj";
import {projectInfo} from "@/utils/column/ProjectInfo";
import _ from "lodash";
import SourceRead from "@/component/page/data/source/SourceRead";



function SourceUpdate({updateKey, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const [info, setInfo] = useState(sourceWriteInitial);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('source_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    useEffect(() => {
        getData.post('inventory/getInventoryDetail',updateKey['source_update']).then(v=>{
            const {code, entity} = v?.data;
            if(code === 1){
                setInfo(entity.inventoryItemList[0])
            }
        })
        setInfo(updateKey['source_update'].key)
    }, [updateKey['source_update']])




    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    console.log(info,'::')

    async function saveFunc() {

        await getData.post('inventory/updateInventory', info).then(v => {
            if (v.data.code === 1) {

                notificationAlert('success', '💾재고 수정완료',
                    <>
                        <div>Inventory : {info['maker']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null,
                )
            } else {
                message.error('수정에 실패하였습니다.')
            }
        });
    }


    function clearAll(){
        setInfo(v=>{
            return {...v, inventoryId : updateKey['source_update'].key}
        })
    }

    return <div ref={infoRef}>
        <PanelSizeUtil groupRef={groupRef} storage={'source_write'}/>
        <MainCard title={'재고관리 수정'} list={[
            {name: <div><SaveOutlined style={{paddingRight : 8}}/>수정</div>, func: saveFunc, type: 'primary'},
            {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
        ]}>
            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                        style={{gap: 0.5, paddingTop: 3}}>
                <Panel defaultSize={sizes[0]} minSize={5}>
                    <BoxCard title={'기본 정보'}>
                        {datePickerForm({title: '입고일자', id: 'receiptDate',onChange: onChange,
                            data: info})}

                        {inputForm({
                            title: '문서번호',
                            id: 'documentNumber',
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: 'Maker',
                            id: 'maker',
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: 'Model',
                            id: 'model',
                            onChange: onChange,
                            data: info
                        })}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[1]} minSize={5}>
                    <BoxCard title={'수량정보'} tooltip={tooltipInfo('customer')}>
                        {inputForm({
                            title: '수입단가',
                            id: 'importUnitPrice',
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: '화폐단위',
                            id: 'currencyUnit',
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: '입고수량',
                            id: 'receivedQuantity',
                            onChange: onChange,
                            data: info
                        })}
                        {inputForm({
                            title: '단위',
                            id: 'unit',
                            onChange: onChange,
                            data: info
                        })}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[2]} minSize={5}>
                    <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                        {inputForm({
                            title: '위치',
                            id: 'location',
                            onChange: onChange,
                            data: info
                        })}
                        {textAreaForm({
                            title: '비고',
                            rows: 10,
                            id: 'remarks',
                            onChange: onChange,
                            data: info
                        })}
                    </BoxCard>
                </Panel>

            </PanelGroup>
        </MainCard>
    </div>
}
export default memo(SourceUpdate, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});