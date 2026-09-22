import axios from "axios";
import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 * JoiningTypes service for API calls
 */
const joiningTypesService = {
    /**
     * Get all joining types with pagination and filters
     * @param {Object} params - Query parameters for filtering, sorting, and pagination
     * @returns {Promise<Object>} - The response data with joining types and pagination info
     */
    async getAll(id = null, params = {}) {
        // If only one parameter is passed and it's an object, treat it as params
        if (typeof id === 'object' && id !== null && Object.keys(params).length === 0) {
            params = id;
            id = null;
        }

        try {
            // Map frontend params to Laravel params
            const laravelParams = {
                page: params.page || 1,
                per_page: params.limit || 10,
                search: params.search || "",
                sort_by: params.sortBy || "id",
                sort_order: params.sortOrder || "desc",
            };

            // Remove empty params
            Object.keys(laravelParams).forEach((key) => {
                if (laravelParams[key] === "" || laravelParams[key] === undefined) {
                    delete laravelParams[key];
                }
            });

            const config = {
                params: laravelParams,
            };

            const response = await axiosClient.get("/joining-types", config);

            // Transform Laravel paginated response to expected format
            // Check if it's paginated (has data.data) or simple array (data)
            const entities = response.data?.data || response.data || [];
            const pagination = response.data?.current_page ? {
                current: response.data.current_page,
                pageSize: response.data.per_page,
                total: response.data.total,
                totalPages: response.data.last_page,
            } : null;

            return {
                data: entities,
                pagination: pagination
            };
        } catch (error) {
            ErrorHandling(error);
        }
    },

    /**
     * Get joining type by ID
     */
    async getById(id) {
        try {
            const response = await axiosClient.get(`/joining-types/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    /**
     * Create a new joining type
     */
    async create(data) {
        try {
            const response = await axiosClient.post("/joining-types", data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    /**
     * Update an existing joining type
     */
    async update(id, data) {
        try {
            const response = await axiosClient.put(`/joining-types/${id}`, data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    /**
     * Delete a joining type
     */
    async delete(id) {
        try {
            const response = await axiosClient.delete(`/joining-types/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    /**
     * Get all joining types for dropdown
     */
    async getAllForDropdown() {
        try {
            const response = await axiosClient.get("/joining-types/dropdown");
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            return [];
        }
    },
};

export default joiningTypesService;

