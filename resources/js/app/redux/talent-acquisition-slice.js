import { createSlice } from "@reduxjs/toolkit";
import { setJobPostings } from "./job-posting-slice";

export const talentAcquisitionSlice = createSlice({
    name: "app",
    initialState: {
        schedules: [],
        interviews: [],
    },
    reducers: {
        setSchedules: (state, action) => {
            state.schedules = action.payload;
        },
        setInterviews: (state, action) => {
            state.interviews = action.payload;
        },
    },
});
export const { setSchedules,setInterviews } = talentAcquisitionSlice.actions;

export default talentAcquisitionSlice.reducer;
