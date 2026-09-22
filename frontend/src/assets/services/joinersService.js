import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 * Joiners (Parents) Service - For admin/managers to manage joiners
 */
const joinersService = {
    /**
     * Get all joiners with pagination and filters
     */
    async getAll(params = {}) {
        try {
            const laravelParams = {
                page: params.page || 1,
                per_page: params.limit || 10,
                search: params.search || "",
                sort_by: params.sortBy || "created_at",
                sort_order: params.sortOrder || "desc",
            };

            // Remove empty params
            Object.keys(laravelParams).forEach((key) => {
                if (laravelParams[key] === "" || laravelParams[key] === undefined) {
                    delete laravelParams[key];
                }
            });

            const response = await axiosClient.get(`/joiners`, {
                params: laravelParams,
            });

            return {
                data: response?.data?.data || [],
                pagination: {
                    current: response?.data?.current_page || 1,
                    pageSize: response?.data?.per_page || 10,
                    total: response?.data?.total || 0,
                    totalPages: response?.data?.last_page || 1,
                },
            };
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Get joiner by ID
     */
    async getById(id) {
        try {
            const response = await axiosClient.get(`/users/${id}`);
            return response?.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Update joiner state
     */
    async updateState(id, state) {
        try {
            const response = await axiosClient.put(`/joiners/${id}/state`, { state });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Get joiners count
     */
    async getCount() {
        try {
            const response = await axiosClient.get(`/joiners/count`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            return {};
        }
    },

    /**
     * Delete a joiner
     */
    async delete(id) {
        try {
            const response = await axiosClient.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Bulk delete joiners
     */
    async bulkDelete(ids) {
        try {
            const response = await axiosClient.post("/users/bulk-delete", { ids });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    async getAllForDropdown() {
        try {
            const response = await axiosClient.get(`/joiners`, {
                params: { per_page: 1000 }
            });
            return response.data.data.map(u => ({
                value: u.id,
                label: `${u.nom_fr || ''} ${u.prenom_fr || ''}`.trim() || u.email
            }));
        } catch (error) {
            ErrorHandling(error);
            return [];
        }
    },

    /**
     * Update joining type and expiration date
     */
    async updateJoiningType(id, joining_type_id) {
        try {
            const response = await axiosClient.put(`/users/${id}/joining-type`, { joining_type_id });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },
};

export default joinersService;
