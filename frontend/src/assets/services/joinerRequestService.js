import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 * Joiner Request Service
 */
const joinerRequestService = {
    /**
     * Get joiner requests
     */
    async getAll(params = {}) {
        try {
            const response = await axiosClient.get("/joiner-requests", { params });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Get joiner requests by establishment
     */
    async getByEstablishment(etablissement_id, params = {}) {
        try {
            const response = await axiosClient.get(`/joiner-requests/establishment/${etablissement_id}`, { params });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Create a new joiner request
     */
    async create(data) {
        try {
            const response = await axiosClient.post("/joiner-requests", data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Update joiner request
     */
    async update(id, data) {
        try {
            const response = await axiosClient.put(`/joiner-requests/${id}`, data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Delete joiner request
     */
    async delete(id) {
        try {
            const response = await axiosClient.delete(`/joiner-requests/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Upload PDF for joiner request
     */
    async uploadPdf(id, formData) {
        try {
            const response = await axiosClient.post(`/joiner-requests/${id}/upload-pdf`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },

    /**
     * Update PDF state
     */
    async updatePdfState(id, pdf_state) {
        try {
            const response = await axiosClient.put(`/joiner-requests/${id}/pdf-state`, { pdf_state });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
            throw error;
        }
    },
};

export default joinerRequestService;
