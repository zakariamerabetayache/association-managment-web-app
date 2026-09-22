import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

const documentTypesService = {
    async getAll(id, params = {}) {
        try {
            const response = await axiosClient.get("/document-types", { params });
            console.log("response document" + JSON.stringify(response))
            return response?.data?.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async getById(id) {
        try {
            const response = await axiosClient.get(`/document-types/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async create(data) {
        try {
            const response = await axiosClient.post("/document-types", data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async update(id, data) {
        try {
            const response = await axiosClient.put(`/document-types/${id}`, data);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async delete(id) {
        try {
            const response = await axiosClient.delete(`/document-types/${id}`);
            return response.data;
        } catch (error) {
            ErrorHandling(error);
        }
    },

    async getAllForDropdown() {
        try {
            const response = await axiosClient.get("/document-types");
            return response?.data?.data.map(item => ({
                value: item.id,
                label: item.designation_fr // or localized
            }));
        } catch (error) {
            ErrorHandling(error);
            return [];
        }
    }
};

export default documentTypesService;
