import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    userInfo : {

    }
};


const userSlice = createSlice({
    name: "user", initialState,
    reducers: {
        setUserInfo: (state, action) => {
            const {payload} = action;
            return {...state, ...payload };
        },
        getProductInfo: (state, action) => {
            state.productInfo = action.payload.data.productInfo;
        },

    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: userReducer } = userSlice;
export const { setUserInfo, getProductInfo } = actions;
export default userReducer;