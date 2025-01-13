import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {deliveryDaehanInitial, ModalInitList, tableOrderInventoryInitial,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import moment from "moment";
import message from "antd/lib/message";
import TextArea from "antd/lib/input/TextArea";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import {findCodeInfo} from "@/utils/api/commonApi";
import {DownCircleFilled, FileSearchOutlined, RetweetOutlined, SaveOutlined, UpCircleFilled} from "@ant-design/icons";
import SearchInfoModal from "@/component/SearchAgencyModal";
import Deahan from "@/component/delivery/Deahan";
import Deasin from "@/component/delivery/Deasin";
import {TabsProps} from "antd";
import Tabs from "antd/lib/tabs";
import ETC from "@/component/delivery/ETC";
import Button from "antd/lib/button";
import Card from "antd/lib/card/Card";
import {saveRfq} from "@/utils/api/mainApi";


export default function delivery_write() {

    const [tabNumb, setTabNumb] = useState('CJ')
    const [cjInfo, setCjInfo] = useState({...deliveryDaehanInitial, deliveryType : 'CJ'})
    const [daesinInfo, setDaesinInfo] = useState({...deliveryDaehanInitial, deliveryType : 'DAESIN'})
    const [quickInfo, setQuickInfo] = useState({...deliveryDaehanInitial, deliveryType : 'QUICK'})

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

        if(sendParam){
           await getData.post('delivery/addDelivery', sendParam).then(v=>{
               console.log(v,':::::::')
           },err=>console.log(err,'::::'))
        }
    }

    function clearAll() {

    }


    return <>
        <LayoutComponent>

            <MainCard title={'배송 등록'} list={[
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