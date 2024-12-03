import {createSlice} from "@reduxjs/toolkit";
import {rfqWrite} from "@/store/rfq/rfqAction.js";

const initialState = {
    updateRiskSpace: false,


    addSpaceAtCanvas: false,
    pivot: false,
    editBackMotion: false,
    transformController: {show: false, obj: []},
    rotateController: {show: false, obj: []},
    multiCheck: false,
}

const rfqSlice = createSlice({
    name: "rfq", initialState, reducers: {
        setModeStore: (state, action) => {
            const {payload} = action;
            const {key, value} = payload;
            if(value === 'tempObj'){
                state['tempObj'] = payload.subValue
            }
            state[key] = value
        },

    }, extraReducers: (builder) => {
        builder.addCase(rfqWrite.pending, (state) => {
            state.error = null;
            state.loading = true;
        });
    }
});

const {actions, reducer: rfqReducer} = rfqSlice;

export const {
    setTransformController,
    setRotateController,
    setTempObj,
    setModeStore,
    setDrawingRiskSpace
} = actions;

export default rfqReducer;


