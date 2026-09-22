import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 * Joiner Payments Service - For joiners to manage their own payments
 */
const joinerPaymentsService = {
  /**
   * Get all payments for the current parent
   * @param {Object} params - Query parameters for filtering, sorting, and pagination
   * @returns {Promise<Object>} - The response data with payments and pagination info
   */
  async getAll(params = {}) {
    try {
      // Map frontend params to Laravel params
      const laravelParams = {
        page: params.page || 1,
        per_page: params.limit || 10,
        search: params.search || "",
        sort_by: params.sortBy || "created_at",
        sort_order: params.sortOrder || "desc",
        state: params.state,
      };

      // Remove empty params
      Object.keys(laravelParams).forEach((key) => {
        if (laravelParams[key] === "" || laravelParams[key] === undefined) {
          delete laravelParams[key];
        }
      });

      const response = await axiosClient.get(`/payments/`, {
        params: laravelParams,
      });

      // Transform Laravel paginated response to expected format
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || 10,
        last_page: response.data.last_page || 1,
      };
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Create a new payment for the current joiner
   * @param {FormData} formData - The payment data with PDF file
   * @returns {Promise<Object>} - The created payment data
   */
  async create(formData) {
    try {
      const response = await axiosClient.post("/joiner/payments", formData, {
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
   * Create a new payment for the current joiner
   * @param {FormData} formData - The form data with PDF file
   * @returns {Promise<Object>} - The created payment data
   */
  async createPayment(formData) {
    try {
      const response = await axiosClient.post(`/joiner/payments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Upload PDF for an existing payment
   * @param {number|string} paymentId - The payment ID
   * @param {FormData} formData - The form data with PDF file
   * @returns {Promise<Object>} - The updated payment data
   */
  async uploadPdf(paymentId, formData) {
    try {
      const response = await axiosClient.post(`/payments/${paymentId}/upload-pdf`, formData, {
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
   * Get payment by ID
   * @param {number|string} id - The payment ID
   * @returns {Promise<Object>} - The payment data
   */
  async getById(id) {
    try {
      const response = await axiosClient.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },



  /**
   * Get payment statistics for the current joiner
   * @returns {Promise<Object>} - The payment statistics
   */
  async getStatistics() {
    try {
      const response = await axiosClient.get("/payments/statistics");
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },
};

export default joinerPaymentsService;
