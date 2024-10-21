import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    isMobile : false
};


const commonSlice = createSlice({
    name: "common", initialState,
    reducers: {
        setMobile: (state, action) => {
            const {payload} = action;
            return {...state, ...payload };
        }

    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: commonReducer } = commonSlice;
export const { setMobile } = actions;
export default commonReducer;