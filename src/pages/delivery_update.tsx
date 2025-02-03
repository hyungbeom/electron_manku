import React, {useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {deliveryDaehanInitial,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import {MainCard} from "@/utils/commonForm";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import {TabsProps} from "antd";
import Tabs from "antd/lib/tabs";
import ETC from "@/component/delivery/ETC";
import {setUserInfo} from "@/store/user/userSlice";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {wrapper} from "@/store/store";
import message from "antd/lib/message";


export default function delivery_update({dataInfo}) {

    const [tabNumb, setTabNumb] = useState(dataInfo['deliveryType'])
    const [cjInfo, setCjInfo] = useState({...dataInfo, deliveryType: 'CJ'})
    const [daesinInfo, setDaesinInfo] = useState({...dataInfo, deliveryType: 'DAESIN'})
    const [quickInfo, setQuickInfo] = useState({...dataInfo, deliveryType: 'QUICK'})


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
            await getData.post('delivery/updateDelivery', sendParam).then(v => {
                if (v.data.code === 1) {
                    window.opener?.postMessage('write', window.location.origin);
                    return message.success('수정되었습니다.')
                }
            }, err => console.log(err, '::::'))
        }
    }

    function clearAll() {

    }

    return <>
        <LayoutComponent>

            <MainCard title={'배송 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]}>
                <Tabs activeKey={tabNumb} items={items} onChange={onChange}/>
            </MainCard>

        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {query} = ctx;

    const {deliveryId} = query;


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);


    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        const result = await getData.post('delivery/getDeliveryDetail', {deliveryId: deliveryId});


        // result?.data?.entity?.estimateRequestList
        param = {
            props: {dataInfo: result?.data?.entity?.deliveryDetail}
        }
    }


    return param
})