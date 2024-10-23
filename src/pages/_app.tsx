import React from 'react';
import {wrapper} from "@/store/store";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {Provider} from 'react-redux';
import '@/resources/css/index.css'
import 'antd/dist/antd.css';
import Header from "@/component/Header"; // Ant Design CSS import

function App({Component, pageProps = {title: ''}, ...rest}: any) {

    const {store, props} = wrapper.useWrappedStore(pageProps);

    return (

        <>
            {/*<Header/>*/}
            <DndProvider backend={HTML5Backend}>

                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </DndProvider>
        </>

    )
}

export default App;

