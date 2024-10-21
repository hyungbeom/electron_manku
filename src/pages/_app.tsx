import React from 'react';
import {wrapper} from "@/store/store";

import {Provider} from 'react-redux';
import '@/resources/css/index.css'
// import Header from "@/utils/ui/component/dashboard&etc/config";

// import {API_URL} from "@/utils/manage/function/api";

function App({Component, pageProps = {title: ''}, ...rest}: any) {

  const {store, props} = wrapper.useWrappedStore(pageProps);

  return (
      <>

        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
        {/*<Footer/>*/}
      </>
  )
}

export default App;

