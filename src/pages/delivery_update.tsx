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


export default function delivery_update() {

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
                console.log(v, ':::::::')
            }, err => console.log(err, '::::'))
        }
    }

    function clearAll() {

    }


    return <>
        <LayoutComponent>

            <MainCard title={'배송 수정'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]}>
                <Tabs activeKey={tabNumb} items={items} onChange={onChange}/>
            </MainCard>

        </LayoutComponent>
    </>
}
//
//
// // @ts-ignore
// export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
//
//
//     let param = {}
//
//     const {userInfo, codeInfo} = await initialServerRouter(ctx, store);
//
//     const result = await getData.post('inventory/getInventoryList', {
//         "searchInventoryId": "",
//         "searchMaker": "",          // MAKER 검색
//         "searchModel": "",          // MODEL 검색
//         "searchLocation": "",       // 위치 검색
//         "page": 1,
//         "limit": -1,
//     });
//
//
//     if (userInfo) {
//         store.dispatch(setUserInfo(userInfo));
//     }
//     if (codeInfo !== 1) {
//         param = {
//             redirect: {
//                 destination: '/', // 리다이렉트할 대상 페이지
//                 permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
//             },
//         };
//     } else {
//         // result?.data?.entity?.estimateRequestList
//         param = {
//             props: {dataList: result?.data?.entity}
//         }
//     }
//
//
//     return param
// })