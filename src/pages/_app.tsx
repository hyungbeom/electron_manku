import React, {useEffect} from 'react';
import {wrapper} from "@/store/store";
import {Provider} from 'react-redux';
import '@/resources/css/index.css'
import 'antd/dist/antd.css';
import Script from "next/script";
import {useRouter} from "next/router";
import Head from 'next/head';
import "flexlayout-react/style/light.css";
import {NoticeProvider} from "@/component/util/NoticeProvider";



function App({Component, pageProps = {title: ''}, ...rest}: any) {

    const {store, props} = wrapper.useWrappedStore(pageProps);
    const router = useRouter();

    useEffect(() => {
        // @ts-ignored
        if (window.electron && window.electron.onNavigate) {
            // Electron에서 보낸 'navigate-to' 이벤트를 수신하고 라우팅 수행
            // @ts-ignored
            window.electron.onNavigate((event, route) => {
                router.push(route); // Next.js 라우터를 통해 페이지 이동
            });
        }
    }, []);


    return <>

        <Script src={"https://accounts.google.com/gsi/client"} async defer/>
        <Script src="https://apis.google.com/js/api.js" async defer/>
        <Head>
            <title>(주)만쿠무역 글로벌 무역의 가치</title>
            <meta property="og:title" content="미래의가치를 함께하는 만쿠무역"/>
            <meta property="og:description" content="글로벌 비지니스를 연결하며 가치를 확장합니다."/>
            <meta property="og:image" content="https://manku.progist.co.kr/homepage/preview.png"/>
            <meta property="og:url" content="https://manku.progist.co.kr/homepage"/>
        </Head>
        <Provider store={store}>
            <NoticeProvider>
            <Component {...pageProps} />
            </NoticeProvider>
        </Provider>
    </>

}

export default App;

