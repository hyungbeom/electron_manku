import React from 'react';
import {wrapper} from "@/store/store";
import {Provider} from 'react-redux';
import '@/resources/css/index.css'
import 'antd/dist/antd.css';

function App({Component, pageProps = {title: ''}, ...rest}: any) {

    const {store, props} = wrapper.useWrappedStore(pageProps);

    return (

        <>


                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
        </>

    )
}

export default App;

