import axios from "axios";

const API_BASE = "/api/engagement/engagement_company_galleries";

/**
 * Get all company galleries
 */
export const get_company_galleries = async () => {
    try {
        const response = await axios.get(API_BASE);
        return response.data;
    } catch (error) {
        console.error("Error fetching company galleries:", error);
        throw error;
    }
};

/**
 * Get a specific gallery by ID
 */
export const get_company_gallery = async (id) => {
    try {
        const response = await axios.get(`${API_BASE}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching gallery ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new gallery with images
 * @param {FormData} formData - Must contain: title, description (optional), drive_link (optional), images (array)
 */
export const create_company_gallery = async (formData) => {
    try {
        const response = await axios.post(API_BASE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating gallery:", error);
        throw error;
    }
};

/**
 * Update gallery metadata
 * @param {number} id - Gallery ID
 * @param {Object} data - Contains: title, description, drive_link
 */
export const update_company_gallery = async (id, data) => {
    try {
        const response = await axios.patch(`${API_BASE}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating gallery ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a gallery
 */
export const delete_company_gallery = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting gallery ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a single file from a gallery
 */
export const delete_gallery_file = async (fileId) => {
    try {
        const response = await axios.delete(`${API_BASE}/files/${fileId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
        throw error;
    }
};
