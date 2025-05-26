import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    historyList : {}
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setHistoryList: (state, action) => {
            const {payload} = action;
            state.historyList = payload;
        },
    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: historyReducer } = historySlice;
export const { setHistoryList } = actions;
export default historyReducer;