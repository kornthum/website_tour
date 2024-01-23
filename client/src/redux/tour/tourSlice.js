import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    n_new_tour: 0,
    group_mapper: {}
};

const tourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
        setNumberNewTour: (state, action) => {
            state.n_new_tour = action.payload;
        },
        setGroupMapper: (state, action) => {
            state.group_mapper = action.payload;
        }
    }
});

export const {setNumberNewTour, setGroupMapper}  = tourSlice.actions;

export default tourSlice.reducer;