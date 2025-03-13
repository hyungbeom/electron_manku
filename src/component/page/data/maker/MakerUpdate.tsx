import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import message from "antd/lib/message";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {makerWriteInitial} from "@/utils/initialList";
import _ from "lodash";
import {useRouter} from "next/router";

export default function MakerUpdate({dataInfo={}, updateKey}) {

    const router = useRouter();
    const [info, setInfo] = useState<any>(dataInfo);


    useEffect(()=>{
        setInfo(updateKey['maker_update'])
    },[updateKey['maker_update']])

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        await getData.post('maker/updateMaker', info).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다')
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }


    function copyPage() {
        let copyInfo = _.cloneDeep(info)

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/maker_write?${query}`)
    }

    function clearAll() {
        setInfo(makerWriteInitial);
    }

    return <>
        <div style={{
            display: 'grid',
            gridTemplateRows: `340px`,
            columnGap: 5
        }}>

            <MainCard title={'메이커 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'},
                {name: '복제', func: copyPage, type: 'default'},
            ]}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 250px 300px 1fr 300px',
                    columnGap: 10,
                    marginTop: 10
                }}>
                    <BoxCard >

                        {inputForm({title: 'Maker', id: 'makerName', onChange: onChange, data: info})}
                        {inputForm({title: 'Item', id: 'item', onChange: onChange, data: info})}
                        {inputForm({title: '홈페이지', id: 'homepage', onChange: onChange, data: info})}
                        {inputForm({title: '한국매입처', id: 'koreanAgency', onChange: onChange, data: info})}
                    </BoxCard>
                    <BoxCard >
                        {inputForm({title: 'AREA', id: 'area', onChange: onChange, data: info})}
                        {inputForm({title: '원산지', id: 'origin', onChange: onChange, data: info})}
                        {inputForm({title: '담당자 확인', id: 'managerConfirm', onChange: onChange, data: info})}
                        {inputForm({title: '직접 확인', id: 'directConfirm', onChange: onChange, data: info})}
                    </BoxCard>
                    <BoxCard>
                        {textAreaForm({title: '지시사항', id: 'instructions', onChange: onChange, data: info})}
                    </BoxCard>
                </div>

            </MainCard>
        </div>
    </>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const {makerName} = ctx.query;


    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));

    const result = await getData.post('maker/getMakerList', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: Maker
        "searchText": makerName,
        "page": 1,
        "limit": -1
    });


    const list = result?.data?.entity?.makerList[0];
    param = {
        props: {dataInfo: list ? list : null}
    }

    return param
})