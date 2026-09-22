import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

/**
 * Dashboard service for API calls
 */
const dashboardService = {
  /**
   * Fetches dashboard statistics from the backend API
   * @param {number} month - Selected month (1-12)
   * @param {number} year - Selected year (e.g., 2024)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(month, year) {
    try {
      const response = await axiosClient.get('/dashboard/stats', {
        params: { month, year }
      });
      
      return response.data;
    } catch (error) {
      ErrorHandling.handleRequestError(error, 'dashboardService.getDashboardStats');
      throw error;
      console.error('Error setting up request:', error.message);
      throw new Error('Failed to setup request. Please try again.');
    }
  }
};

export default dashboardService;
