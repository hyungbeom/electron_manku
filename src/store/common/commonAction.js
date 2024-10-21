import {createAsyncThunk} from "@reduxjs/toolkit";
import {getData} from "../../manage/function/api";
import {type} from "node:os";

export const testFunc = createAsyncThunk(
    "common/test",
    async () => {
        try {

            //실제 axios 비동기 통신 [result => 통신 결과값]
            const result = await getData.post('api/common/getTemp?value=112233');
            console.log(result,'::::')
            return null;
            // return {data: result.data, f: f, s: s, type: type};

        } catch (error) {
            if (error.response) {
                // return rejectWithValue(error.response);
            } else {
                // return rejectWithValue(error.message);
            }
        }
    },
    "common/product",
    async () => {
        try {

            //실제 axios 비동기 통신 [result => 통신 결과값]
            const result = await getData.get(`api/product/${productNo}`);
            console.log(result,'::::')
            return {data: result.data, type: type};

        } catch (error) {
            if (error.response) {
                // return rejectWithValue(error.response);
            } else {
                // return rejectWithValue(error.message);
            }
        }
    },
);