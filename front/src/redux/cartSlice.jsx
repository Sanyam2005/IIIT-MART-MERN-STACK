import {createSlice} from "@reduxjs/toolkit"
const initialState = {
     products: [],
     total_qty:0,
     total_price:0
    }
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addtoCart(state, action) {
            const newItem = action.payload;
            const itemIndex  = state.products.findIndex((item) => item.id === newItem.id);
            // if item already exists in cart
            if(itemIndex){

            }
            else{
                state.products.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    total_price: 1,
                    image: newItem.image
                })
            }
            state.products.push(action.payload);

        }
    },
});
export const { addtoCart } = cartSlice.actions;
export default cartSlice.reducer;
