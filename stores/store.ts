import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertStore";
import productEditReducer from "./productEditStore";
import productsOrderReducer from "./productsOrderStore";
import userReducer from "./userStore";

export const stores = configureStore({
    reducer: {
        user: userReducer,
        alert: alertReducer,
        productsOrder: productsOrderReducer,
        productEdit: productEditReducer,
    }
});

export type RootState = ReturnType<typeof stores.getState>;
export type AppDispatch = typeof stores.dispatch;