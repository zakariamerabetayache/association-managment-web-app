/**
 * API Utility Functions
 * Common utilities for API handling
 */

/**
 * Transform API response to consistent format
 * @param {Object} response - Axios response object
 * @returns {Object} Transformed response
 */
export const transformResponse = (response) => {
  return response.data?.data || response.data;
};

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {Error} Formatted error
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  let message = defaultMessage;
  let details = null;

  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;
    
    if (data?.message) {
      message = data.message;
    }
    
    if (data?.errors) {
      details = data.errors;
    }
    
    // Handle specific status codes
    switch (status) {
      case 401:
        message = 'Authentication required';
        break;
      case 403:
        message = 'Access denied';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        message = 'Validation failed';
        break;
      case 500:
        message = 'Server error occurred';
        break;
    }
  } else if (error.request) {
    // Network error
    message = 'Network error - please check your connection';
  }

  const formattedError = new Error(message);
  formattedError.details = details;
  formattedError.status = error.response?.status;
  formattedError.originalError = error;

  return formattedError;
};

/**
 * Build query string from parameters
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(`${key}[]`, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

/**
 * Retry API call with exponential backoff
 * @param {Function} apiCall - API call function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} API response
 */
export const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        break;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
