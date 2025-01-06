import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    estimateRequestList : []
};


const testSlice = createSlice({
    name: "test", initialState,
    reducers: {
        setTestInfo: (state, action) => {
            const {payload} = action;
            return {...state, ...payload };
        }

    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: testReducer } = testSlice;
export const { setTestInfo, getTestInfo } = actions;
export default testReducer;