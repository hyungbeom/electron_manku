import React, {useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {ModalInitList, tableOrderInventoryInitial,} from "@/utils/initialList";
import {getData} from "@/manage/function/api";
import moment from "moment";
import message from "antd/lib/message";
import TextArea from "antd/lib/input/TextArea";
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
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

    const [mini, setMini] = useState(true);
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '대한통운',
            children: <Deahan/>,
        },
        {
            key: '2',
            label: '대신택배',
            children: <Deasin/>,
        },
        {
            key: '3',
            label: '퀵/직납/대리점 출고',
            children: <ETC/>,
        },
    ];

    function saveFunc() {

    }

    function clearAll() {

    }


    return <>
        <LayoutComponent>
            <Card size={'small'} title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{fontSize: 14, fontWeight: 550}}>프로젝트 등록</div>
                <div>
                    <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                            onClick={saveFunc}
                    ><SaveOutlined/>저장</Button>
                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{marginRight: 8}}
                            onClick={clearAll}><RetweetOutlined/>초기화</Button>
                </div>
            </div>} style={{fontSize: 12, border: '1px solid lightGray'}}
                  extra={<span style={{fontSize: 20, cursor: 'pointer'}}
                               onClick={() => setMini(v => !v)}> {!mini ?
                      <DownCircleFilled/> : <UpCircleFilled/>}</span>}>


                <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>

            </Card>
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