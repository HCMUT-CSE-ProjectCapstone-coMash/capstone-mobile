import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertStore";
import userReducer from "./userStore";

export const stores = configureStore({
    reducer: {
        user: userReducer,
        alert: alertReducer,
    }
});

export type RootState = ReturnType<typeof stores.getState>;
export type AppDispatch = typeof stores.dispatch;