import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
    isOpen: boolean;
    type: AlertType;
    message: string;
}

const initialState: AlertState = {
    isOpen: false,
    type: "info",
    message: "",
};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<{ type: AlertType; message: string }>) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },

        clearAlert: (state) => {
            state.isOpen = false;
        },
    },
});

export const { addAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;