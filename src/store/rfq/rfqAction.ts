import { createAsyncThunk } from "@reduxjs/toolkit";
import {getData} from "@/manage/function/api";

export const rfqWrite = createAsyncThunk(
    "estimate/addEstimateRequest",
    async (props: any, { rejectWithValue }, ...rest) => {




        // try {
        //     const result = await getData.post("guest/login", { email, password });
        //     return {data:result.data, f:f, s:s, type:type};
        //
        // } catch (error:any) {
        //     if (error.response) {
        //         return rejectWithValue(error.response);
        //     } else {
        //         return rejectWithValue(error.message);
        //     }
        // }
    }
);




