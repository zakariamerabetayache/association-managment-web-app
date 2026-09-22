// Real API service for CRUD operations
import axiosClient from '../../axios-client';
import ErrorHandling from '../components/ErrorHandling';

// Entity endpoint mapping
const getEntityEndpoint = (entity) => {
  const endpoints = {
    user: '/users',
    // Add more entities here as needed
  };
  
  return endpoints[entity] || `/${entity}s`;
};

// Transform backend response to match frontend expectations
const transformResponse = (backendResponse) => {
  if (!backendResponse.success) {
    return backendResponse;
  }

  // Transform pagination format
  if (backendResponse.pagination) {
    return {
      success: true,
      result: backendResponse.data,
      pagination: {
        current: backendResponse.pagination.currentPage,
        pageSize: backendResponse.pagination.itemsPerPage,
        total: backendResponse.pagination.totalItems,
        totalPages: backendResponse.pagination.totalPages,
        hasNextPage: backendResponse.pagination.hasNextPage,
        hasPrevPage: backendResponse.pagination.hasPrevPage,
      },
    };
  }

  // For single item responses
  return {
    success: true,
    result: backendResponse.data,
    message: backendResponse.message,
  };
};

// Transform search fields for backend
const buildSearchParams = (options, searchFields = []) => {
  const params = {
    page: options.page || 1,
    limit: options.pageSize || options.limit || 10,
  };

  // Add search parameter
  if (options.search) {
    params.search = options.search;
  }

  // Add role filter for users
  if (options.role) {
    params.role = options.role;
  }

  // Add sorting
  if (options.sortBy) {
    params.sortBy = options.sortBy;
    params.sortOrder = options.sortOrder || 'DESC';
  }

  return params;
};

export const crudService = {
  // List items with pagination and search
  async list({ entity, options = {} }) {
    try {
      const endpoint = getEntityEndpoint(entity);
      const params = buildSearchParams(options);
      
      const response = await axiosClient.get(endpoint, { params });
      return transformResponse(response);
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to load ${entity} list`,
        result: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }
  },

  // Create new item
  async create({ entity, data }) {
    try {
      const endpoint = getEntityEndpoint(entity);
      const response = await axiosClient.post(endpoint, data);
      return transformResponse(response);
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to create ${entity}`,
      };
    }
  },

  // Read single item
  async read({ entity, id }) {
    try {
      const endpoint = `${getEntityEndpoint(entity)}/${id}`;
      const response = await axiosClient.get(endpoint);
      return transformResponse(response);
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to load ${entity}`,
      };
    }
  },

  // Update item
  async update({ entity, id, data }) {
    try {
      const endpoint = `${getEntityEndpoint(entity)}/${id}`;
      const response = await axiosClient.put(endpoint, data);
      return transformResponse(response);
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to update ${entity}`,
      };
    }
  },

  // Delete item
  async delete({ entity, id }) {
    try {
      const endpoint = `${getEntityEndpoint(entity)}/${id}`;
      const response = await axiosClient.delete(endpoint);
      return {
        success: true,
        message: response.message || `${entity} deleted successfully`,
      };
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to delete ${entity}`,
      };
    }
  },

  // Get statistics (for users)
  async getStats({ entity }) {
    try {
      const endpoint = `${getEntityEndpoint(entity)}/stats`;
      const response = await axiosClient.get(endpoint);
      return transformResponse(response);
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to load ${entity} statistics`,
      };
    }
  },

  // Bulk delete (for users)
  async bulkDelete({ entity, ids }) {
    try {
      const endpoint = `${getEntityEndpoint(entity)}/bulk-delete`;
      const response = await axiosClient.post(endpoint, { ids });
      return {
        success: true,
        message: response.message || `${entity}s deleted successfully`,
        result: response.data,
      };
    } catch (error) {
      ErrorHandling(error);
      return {
        success: false,
        message: error.message || `Failed to delete ${entity}s`,
      };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await axiosClient.get('/health');
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      return false;
    }
  },
};
