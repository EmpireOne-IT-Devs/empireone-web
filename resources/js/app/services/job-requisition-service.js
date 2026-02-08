import axios from "axios";

export const getJobRequisitionsService = async () => {
    try {
        const response = await axios.get("/api/job-requisitions");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getJobRequisitionByIdService = async (id) => {
    try {
        const response = await axios.get(`/api/job-requisitions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createJobRequisitionService = async (data) => {
    try {
        const response = await axios.post("/api/job-requisitions", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateJobRequisitionService = async (id, data) => {
    try {
        const response = await axios.put(`/api/job-requisitions/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteJobRequisitionService = async (id) => {
    try {
        const response = await axios.delete(`/api/job-requisitions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};