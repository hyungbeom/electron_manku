import React, {useEffect} from 'react';
import {wrapper} from "@/store/store";
import {Provider} from 'react-redux';
import '@/resources/css/index.css'
import 'antd/dist/antd.css';
import Script from "next/script";
import {useRouter} from "next/router";

function App({Component, pageProps = {title: ''}, ...rest}: any) {

    const {store, props} = wrapper.useWrappedStore(pageProps);
    const router = useRouter();

    useEffect(() => {
        if (window.electron && window.electron.onNavigate) {
            // Electron에서 보낸 'navigate-to' 이벤트를 수신하고 라우팅 수행
            window.electron.onNavigate((event, route) => {
                router.push(route); // Next.js 라우터를 통해 페이지 이동
            });
        }
    }, []);


      return   <>

            <Script src={"https://accounts.google.com/gsi/client"} async defer/>
          <Script src="https://apis.google.com/js/api.js" async defer/>

            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </>

}

export default App;

