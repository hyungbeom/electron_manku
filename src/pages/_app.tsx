import React from 'react';
import {wrapper} from "@/store/store";
import {Provider} from 'react-redux';
import '@/resources/css/index.css'
import 'antd/dist/antd.css';
import Script from "next/script";

function App({Component, pageProps = {title: ''}, ...rest}: any) {

    const {store, props} = wrapper.useWrappedStore(pageProps);


      return   <>
            <Script src={"https://accounts.google.com/gsi/client"} async defer/>
          <Script src="https://apis.google.com/js/api.js" async defer/>

            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </>


}

export default App;

