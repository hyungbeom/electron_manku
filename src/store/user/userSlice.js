import { createSlice } from "@reduxjs/toolkit";


const initialState  = {
    userInfo : {},
    adminList: []
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            const {payload} = action;
            state.userInfo = payload;
        },
        setAdminList: (state, action) => {
            state.adminList = action.payload;
        }
    }, extraReducers: (builder) => {
        //api service 호출관련
    }
});


const { actions, reducer: userReducer } = userSlice;
export const { setUserInfo, setAdminList } = actions;
export default userReducer;