import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as companyGalleryService from "@/app/services/engagement-gallery-service";

const initialState = {
    galleries: [],
    currentGallery: null,
    galleriesLoading: false,
    galleryLoading: false,
    error: null,
};

/**
 * Fetch all company galleries
 */
export const get_company_galleries_thunk = createAsyncThunk(
    "companyGallery/fetchGalleries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.get_company_galleries();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch galleries");
        }
    }
);

/**
 * Fetch a specific gallery
 */
export const get_company_gallery_thunk = createAsyncThunk(
    "companyGallery/fetchGallery",
    async (id, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.get_company_gallery(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch gallery");
        }
    }
);

/**
 * Create a new gallery
 */
export const create_company_gallery_thunk = createAsyncThunk(
    "companyGallery/createGallery",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.create_company_gallery(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create gallery");
        }
    }
);

/**
 * Update gallery metadata
 */
export const update_company_gallery_thunk = createAsyncThunk(
    "companyGallery/updateGallery",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.update_company_gallery(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update gallery");
        }
    }
);

/**
 * Delete a gallery
 */
export const delete_company_gallery_thunk = createAsyncThunk(
    "companyGallery/deleteGallery",
    async (id, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.delete_company_gallery(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete gallery");
        }
    }
);

/**
 * Delete a file from gallery
 */
export const delete_gallery_file_thunk = createAsyncThunk(
    "companyGallery/deleteFile",
    async (fileId, { rejectWithValue }) => {
        try {
            const response = await companyGalleryService.delete_gallery_file(fileId);
            return { fileId, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete file");
        }
    }
);

const companyGallerySlice = createSlice({
    name: "companyGallery",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentGallery: (state) => {
            state.currentGallery = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all galleries
        builder
            .addCase(get_company_galleries_thunk.pending, (state) => {
                state.galleriesLoading = true;
                state.error = null;
            })
            .addCase(get_company_galleries_thunk.fulfilled, (state, action) => {
                state.galleriesLoading = false;
                state.galleries = action.payload;
            })
            .addCase(get_company_galleries_thunk.rejected, (state, action) => {
                state.galleriesLoading = false;
                state.error = action.payload;
            });

        // Fetch specific gallery
        builder
            .addCase(get_company_gallery_thunk.pending, (state) => {
                state.galleryLoading = true;
                state.error = null;
            })
            .addCase(get_company_gallery_thunk.fulfilled, (state, action) => {
                state.galleryLoading = false;
                state.currentGallery = action.payload;
            })
            .addCase(get_company_gallery_thunk.rejected, (state, action) => {
                state.galleryLoading = false;
                state.error = action.payload;
            });

        // Create gallery
        builder
            .addCase(create_company_gallery_thunk.pending, (state) => {
                state.galleriesLoading = true;
                state.error = null;
            })
            .addCase(create_company_gallery_thunk.fulfilled, (state, action) => {
                state.galleriesLoading = false;
                state.galleries.unshift(action.payload);
            })
            .addCase(create_company_gallery_thunk.rejected, (state, action) => {
                state.galleriesLoading = false;
                state.error = action.payload;
            });

        // Update gallery
        builder
            .addCase(update_company_gallery_thunk.pending, (state) => {
                state.galleriesLoading = true;
                state.error = null;
            })
            .addCase(update_company_gallery_thunk.fulfilled, (state, action) => {
                state.galleriesLoading = false;
                const index = state.galleries.findIndex((g) => g.id === action.payload.id);
                if (index !== -1) {
                    state.galleries[index] = action.payload;
                }
                if (state.currentGallery?.id === action.payload.id) {
                    state.currentGallery = action.payload;
                }
            })
            .addCase(update_company_gallery_thunk.rejected, (state, action) => {
                state.galleriesLoading = false;
                state.error = action.payload;
            });

        // Delete gallery
        builder
            .addCase(delete_company_gallery_thunk.pending, (state) => {
                state.galleriesLoading = true;
                state.error = null;
            })
            .addCase(delete_company_gallery_thunk.fulfilled, (state, action) => {
                state.galleriesLoading = false;
                state.galleries = state.galleries.filter((g) => g.id !== action.payload.id);
                if (state.currentGallery?.id === action.payload.id) {
                    state.currentGallery = null;
                }
            })
            .addCase(delete_company_gallery_thunk.rejected, (state, action) => {
                state.galleriesLoading = false;
                state.error = action.payload;
            });

        // Delete file
        builder
            .addCase(delete_gallery_file_thunk.pending, (state) => {
                state.error = null;
            })
            .addCase(delete_gallery_file_thunk.fulfilled, (state, action) => {
                if (state.currentGallery?.files) {
                    state.currentGallery.files = state.currentGallery.files.filter(
                        (f) => f.id !== action.payload.fileId
                    );
                }
            })
            .addCase(delete_gallery_file_thunk.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearError, clearCurrentGallery } = companyGallerySlice.actions;
export default companyGallerySlice.reducer;
