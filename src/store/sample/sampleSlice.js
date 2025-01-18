import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    estimateRequestList : []
};


const sampleSlice = createSlice({
    name: "sample", initialState,
    reducers: {
        setSampleInfo: (state, action) => {
            const {payload} = action;
            return {...state, ...payload };
        },

    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: sampleReducer } = sampleSlice;
export const { setSampleInfo } = actions;
export default sampleReducer;