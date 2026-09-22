import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

const documentsService = {
    async getAll(id, params = {}) {
        try {
            const response = await axiosClient.get("/documents", { params });
            return {
                data: response?.data?.data

            };
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async getById(id) {
        try {
            const response = await axiosClient.get(`/documents/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async create(data) {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            const response = await axiosClient.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async update(id, data) {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            formData.append("_method", "PUT");
            const response = await axiosClient.post(`/documents/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async delete(id) {
        try {
            const response = await axiosClient.delete(`/documents/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    }
};

export default documentsService;
