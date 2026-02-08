import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const get_job_requisitions_thunk = createAsyncThunk(
    "jobRequisition/getJobRequisitions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/job-requisitions");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch job requisitions"
            );
        }
    }
);

export const create_job_requisition_thunk = createAsyncThunk(
    "jobRequisition/createJobRequisition",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/job-requisitions", data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create job requisition"
            );
        }
    }
);

export const update_job_requisition_thunk = createAsyncThunk(
    "jobRequisition/updateJobRequisition",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/job-requisitions/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update job requisition"
            );
        }
    }
);

export const delete_job_requisition_thunk = createAsyncThunk(
    "jobRequisition/deleteJobRequisition",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/job-requisitions/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete job requisition"
            );
        }
    }
);