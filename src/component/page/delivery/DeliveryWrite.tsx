import React, {memo, useState} from "react";
import {deliveryDaehanInitial,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import {MainCard} from "@/utils/commonForm";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import {TabsProps} from "antd";
import Tabs from "antd/lib/tabs";
import ETC from "@/component/delivery/ETC";
import {useRouter} from "next/router";
import message from "antd/lib/message";
import {RadiusSettingOutlined, SaveOutlined} from "@ant-design/icons";
import _ from "lodash";

function DeliveryWrite({copyPageInfo}) {

    const router = useRouter();

    const [tabNumb, setTabNumb] = useState('CJ')
    const [cjInfo, setCjInfo] = useState({...deliveryDaehanInitial, deliveryType: 'CJ'})
    const [daesinInfo, setDaesinInfo] = useState({...deliveryDaehanInitial, deliveryType: 'DAESIN'})
    const [quickInfo, setQuickInfo] = useState({...deliveryDaehanInitial, deliveryType: 'QUICK'})


    const onChange = (key: string) => {
        setTabNumb(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'CJ',
            label: '대한통운',
            children: <Deahan info={cjInfo} setInfo={setCjInfo}/>,
        },
        {
            key: 'DAESIN',
            label: '대신택배',
            children: <Deasin info={daesinInfo} setInfo={setDaesinInfo}/>,
        },
        {
            key: 'QUICK',
            label: '퀵/직납/대리점 출고',
            children: <ETC info={quickInfo} setInfo={setQuickInfo}/>,
        },
    ];


    async function saveFunc() {
        let sendParam = null
        switch (tabNumb) {
            case 'CJ' :
                sendParam = cjInfo;
                break;
            case 'DAESIN' :
                sendParam = daesinInfo;
                break;
            case 'QUICK' :
                sendParam = quickInfo;
                break;
        }

        if (sendParam) {
            await getData.post('delivery/addDelivery', sendParam).then(v => {
                if (v.data.code === 1) {
                    message.success('저장에 성공하였습니다.')
                } else {
                    message.error('저장에 실패하였습니다..')

                }
            }, err => console.log(err, '::::'))
        }
    }

    function clearAll() {
        setCjInfo({...deliveryDaehanInitial, deliveryType: 'CJ'})
        setDaesinInfo({...deliveryDaehanInitial, deliveryType: 'DAESIN'})
        setQuickInfo({...deliveryDaehanInitial, deliveryType: 'QUICK'})
    }


    return <>
        <>

            <MainCard title={'배송 등록'} list={[
                {name: <div><SaveOutlined style={{paddingRight: 8}}/>저장</div>, func: saveFunc, type: 'primary'},
                {name: <div><RadiusSettingOutlined style={{paddingRight: 8}}/>초기화</div>, func: clearAll, type: 'danger'}
            ]}>
                <Tabs size={'small'} activeKey={tabNumb} items={items} onChange={onChange}/>
            </MainCard>

        </>
    </>
}

export default memo(DeliveryWrite, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});