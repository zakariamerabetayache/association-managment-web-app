import axios from "axios";
import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 *
 * @param {Error} error
 * @param {string} context
 * @throws {Error}
 */

// Payments service for API calls
const paymentsService = {
  /**
   * Get all payments with pagination and filters
   * @param {Object} params - Query parameters for filtering, sorting, and pagination
   * @returns {Promise<Object>} - Tiscardhe response data with payments and pagination info
   */
  async getAll(etablissementId = null, params = {}) {
    try {
      
      // Map frontend params to Laravel params
      const laravelParams = {
        page: params.page || 1,
        per_page: params.limit || 10,
        search: params.search || "",
        sort_by: params.sortBy || "id",
        sort_order: params.sortOrder || "desc",
        state: params.state,
        user_id: params.user_id,
        child_id: params.child_id,
      };

      // Remove empty params
      Object.keys(laravelParams).forEach((key) => {
        if (laravelParams[key] === "" || laravelParams[key] === undefined) {
          delete laravelParams[key];
        }
      });

      const config = {
        params: laravelParams,
        // Cancel previous request if a new one is made
        cancelToken: new axios.CancelToken((c) => (this.cancelToken = c)),
      };

      const response = await axiosClient.get(`/payments`, config);

      // Transform Laravel paginated response to expected format
      return {
        data: response.data.data,
        total: response.data.total,
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        last_page: response.data.last_page,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        return { data: [], total: 0 };
      }
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Cancel the current payments request
   */
  cancelRequest() {
    if (this.cancelToken) {
      this.cancelToken();
    }
  },

  /**
   * Get all payments for dropdown (simplified format)
   */
  async getAllForDropdown() {
    try {
      const response = await axiosClient.get("/payments", {
        params: {
          per_page: 1000, // Get all for dropdown
          sort_by: "date",
          sort_order: "desc",
        },
      });

      // Transform to dropdown format
      return response.data.data.map((payment) => ({
        value: payment.id,
        label: `Payment #${payment.id} - ${payment.amount} DA - ${payment.date}`,
      }));
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
   * Create a new payment
   * @param {Object} paymentData - The payment data to create
   * @returns {Promise<Object>} - The created payment data
   */
  async create(paymentData) {
    try {
      const response = await axiosClient.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Update an existing payment
   * @param {number|string} id - The payment ID
   * @param {Object} paymentData - The updated payment data
   * @returns {Promise<Object>} - The updated payment data
   */
  async update(id, paymentData) {
    try {
      const response = await axiosClient.put(`/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Delete a payment
   * @param {number|string} id - The payment ID to delete
   * @returns {Promise<Object>} - The deletion result
   */
  async delete(id) {
    try {
      const response = await axiosClient.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Get payment statistics
   * @returns {Promise<Object>} - The payment statistics
   */
  async IsCard(user_id) {
    try {
      const response = await axiosClient.get(`/payments/${user_id}/iscard`);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },
  async getCount(params = {}) {
    try {
      const response = await axiosClient.get("/payments/count", {
        params,
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Bulk delete payments
   * @param {Array<number|string>} ids - Array of payment IDs to delete
   * @returns {Promise<Object>} - The bulk deletion result
   */
  async bulkDelete(ids) {
    try {
      const response = await axiosClient.delete("/payments/bulk", {
        data: { ids },
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Download payment receipt PDF
   * @param {number|string} id - The payment ID
   * @returns {Promise<Blob>} - The PDF file blob
   */
  async downloadReceipt(id) {
    try {
      const response = await axiosClient.get(`/payments/${id}/receipt`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },
};

export default paymentsService;
