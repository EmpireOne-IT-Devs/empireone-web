import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const talentAcquisitionSlice = createSlice({
    name: "app",
    initialState: {
        schedules: [],
    },
    reducers: {
        setSchedules: (state, action) => {
            state.schedules = action.payload;
        },
    },
});
export const { setSchedules } = talentAcquisitionSlice.actions;

export default talentAcquisitionSlice.reducer;
