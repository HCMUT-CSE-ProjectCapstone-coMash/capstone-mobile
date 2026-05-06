import { ProductsOrder } from "@/types/productsOrder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductsOrderState {
    productsOrder: ProductsOrder | null;
}

const initialState: ProductsOrderState = {
    productsOrder: null,
}

const productsOrderSlice = createSlice({
    name: "productsOrder",
    initialState,
    reducers: {
        setProductsOrder: (state, action: PayloadAction<ProductsOrder>) => {
            state.productsOrder = action.payload;
        },

        clearProductsOrder: (state) => {
            state.productsOrder = null;
        }
    }
});

export const { setProductsOrder, clearProductsOrder } = productsOrderSlice.actions;
export default productsOrderSlice.reducer;
