import {combineReducers, configureStore, PayloadAction} from "@reduxjs/toolkit";
import {createWrapper, HYDRATE} from "next-redux-wrapper";
import commonReducer from "@/store/common/commonSlice";
import userReducer from "@/store/user/userSlice";

const reducer = (state: any, action: PayloadAction<any>) => {
    //hydration 일어날떄 별도 처리 구간
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload
        };
    }

    return combineReducers({
        common : commonReducer,
        user : userReducer,
    })(state, action);
};



const initialState = {};
export const makeStore = () =>
    configureStore({
        reducer,
      //  devTools: process.env.NODE_ENV !== "production",
        preloadedState: initialState,
    });


const store = makeStore();

// wrapper 를 생성.
export const wrapper = createWrapper(makeStore, {
    // debug: process.env.NODE_ENV === "development"
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
