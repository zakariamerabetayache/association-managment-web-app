import axiosClient from "../../axios-client";
import ErrorHandling from "../components/ErrorHandling";

const etablissementsService = {
  /**
   * Get all etablissements with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated etablissements data
   */
  async getAll(id, params = {}) {
    if (typeof id === 'object' && params === null) {
      params = id;
    }
    try {
      const response = await axiosClient.get("/etablissements", { params });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Get a single etablissement by ID
   * @param {number} id - Etablissement ID
   * @returns {Promise<Object>} Etablissement data
   */
  async getById(id) {
    try {
      const response = await axiosClient.get(`/etablissements/${id}`);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Create a new etablissement
   * @param {Object} etablissementData - Etablissement data
   * @returns {Promise<Object>} Created etablissement data
   */
  async create(etablissementData) {
    try {
      const response = await axiosClient.post(
        "/etablissements",
        etablissementData
      );
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Update an existing etablissement
   * @param {number} id - Etablissement ID
   * @param {Object} etablissementData - Updated etablissement data
   * @returns {Promise<Object>} Updated etablissement data
   */
  async update(id, etablissementData) {
    try {
      const response = await axiosClient.put(
        `/etablissements/${id}`,
        etablissementData
      );
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Delete an etablissement
   * @param {number} id - Etablissement ID
   * @returns {Promise<Object>} Deletion response
   */
  async delete(id) {
    try {
      const response = await axiosClient.delete(`/etablissements/${id}`);
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Get all etablissements for dropdown (simplified format)
   * @returns {Promise<Array>} Array of dropdown options
   */
  async getAllForDropdown() {
    try {
      const response = await axiosClient.get("/etablissements", {
        params: {
          per_page: 100,
          page: 1,
        },
      });

      // Transform to dropdown format
      if (response.data && response.data.data) {
        const dropdownOptions = response.data.data.map((etablissement) => ({
          value: etablissement.id,
          label: `${etablissement.designation_fr || etablissement.designation_ar
            }`,
          designation_ar: etablissement.designation_ar,
          designation_fr: etablissement.designation_fr,
          wilaya_id: etablissement.wilaya_id,
          commune_id: etablissement.commune_id,
        }));
        return dropdownOptions;
      }
      return [];
    } catch (error) {
      ErrorHandling(error);
      return [];
    }
  },

  /**
   * Get etablissements by wilaya
   * @param {number} wilayaId - Wilaya ID
   * @returns {Promise<Array>} Array of etablissements
   */
  async getByWilaya(wilayaId) {
    try {
      const response = await axiosClient.get("/etablissements", {
        params: { wilaya_id: wilayaId },
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      return [];
    }
  },

  /**
   * Get etablissements by commune
   * @param {number} communeId - Commune ID
   * @returns {Promise<Array>} Array of etablissements
   */
  async getByCommune(communeId) {
    try {
      const response = await axiosClient.get("/etablissements", {
        params: { commune_id: communeId },
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      return [];
    }
  },

  /**
   * Bulk delete etablissements
   * @param {Array<number>} ids - Array of etablissement IDs
   * @returns {Promise<Object>} Deletion response
   */
  async bulkDelete(ids) {
    try {
      const response = await axiosClient.post("/etablissements/bulk-delete", {
        ids,
      });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Get etablissements count by status
   * @returns {Promise<Object>} Count data by status
   */
  async getCount() {
    try {
      const response = await axiosClient.get("/etablissements/count");
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      return {};
    }
  },

  /**
   * Search etablissements
   * @param {string} query - Search query
   * @param {Object} additionalParams - Additional search parameters
   * @returns {Promise<Object>} Search results
   */
  async search(query, additionalParams = {}) {
    try {
      const params = {
        search: query,
        ...additionalParams,
      };
      const response = await axiosClient.get("/etablissements", { params });
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Upload logo for etablissement
   * @param {number} id - Etablissement ID
   * @param {File} logoFile - Logo file to upload
   * @param {Object} options - Upload options including progress callback
   * @returns {Promise<Object>} Upload response
   */
  async uploadLogo(id, logoFile, options = {}) {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Add progress callback if provided
      if (options.onUploadProgress) {
        config.onUploadProgress = options.onUploadProgress;
      }

      const response = await axiosClient.post(
        `/etablissements/${id}/upload-logo`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Delete logo for etablissement
   * @param {number} id - Etablissement ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteLogo(id) {
    try {
      const response = await axiosClient.delete(
        `/etablissements/${id}/delete-logo`
      );
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },

  /**
   * Update parameters for an etablissement (is_validation, etc.)
   * @param {number} id - Etablissement ID
   * @param {Object} parameterData - Parameter data to update
   * @returns {Promise<Object>} Updated etablissement data
   */
  async updateParameters(id, parameterData) {
    try {
      const response = await axiosClient.put(
        `/etablissements/${id}/parameters`,
        parameterData
      );
      return response.data;
    } catch (error) {
      ErrorHandling(error);
      throw error;
    }
  },
};

export default etablissementsService;
