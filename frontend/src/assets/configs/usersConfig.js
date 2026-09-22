import React from "react";
import usersService from "../services/usersService";
import wilayasService from "../services/wilayasService";
import communesService from "../services/communesService";
import etablissementsService from "../services/etablissementsService";
import ErrorHandling from "../components/ErrorHandling";
// Users CRUD Configuration
export const getUsersConfig = (user) => ({
  title: "users",
  entityName: "user",
  entityDisplayName: "user",




  filters: [
    {
      key: "role_id",
      label: "role",
      type: "select",
      options: [

        user?.role_id === "admin" && { value: "national", label: "مسير وطني" },
        user?.role_id === "national" && { value: "wilaya", label: "مسير ولائي" },
        user?.role_id === "national" && { value: "printer", label: "طابع" },
        user?.role_id === "wilaya" && { value: "baladi", label: "مسير بلدي" },
      ].filter(Boolean),
    },
    user?.role_id === "admin" && {
      key: "etablissement_id",
      label: "etablissement",
      type: "select",
      loadOptions: async () => {
        try {
          const etablissements = await etablissementsService.getAllForDropdown();
          return etablissements;
        } catch (error) {
          ErrorHandling(error);
          return [];
        }
      },
    },
  ].filter(Boolean),

  // Table columns configuration
  columns: [
    {
      title: "last_name",
      dataIndex: "nom_ar",
      key: "full_last_name",
      render: (text, record) => {
        return React.createElement('div', { style: { lineHeight: '1.2' } }, [
          React.createElement('div', {
            key: 'ar',
            style: { fontWeight: '500', color: '#1f2937' }
          }, record.nom_ar || '-'),
          React.createElement('div', {
            key: 'fr',
            style: { fontSize: '12px', color: '#6b7280', marginTop: '2px' }
          }, record.nom_fr || '-')
        ]);
      },
    },
    {
      title: "first_name",
      dataIndex: "prenom_ar",
      key: "full_first_name",
      render: (text, record) => {
        return React.createElement('div', { style: { lineHeight: '1.2' } }, [
          React.createElement('div', {
            key: 'ar',
            style: { fontWeight: '500', color: '#1f2937' }
          }, record.prenom_ar || '-'),
          React.createElement('div', {
            key: 'fr',
            style: { fontSize: '12px', color: '#6b7280', marginTop: '2px' }
          }, record.prenom_fr || '-')
        ]);
      },
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "wilaya",
      dataIndex: "wilaya_designation_ar",
      key: "wilaya_designation",
    },
    {
      title: "commune",
      dataIndex: "commune_designation_ar",
      key: "commune_designation",
    },
    user?.role_id === "admin" && {
      title: "etablissement",
      dataIndex: "etablissement_designation",
      key: "etablissement_designation",
    },
    {
      title: "role",
      dataIndex: "role_id",
      key: "role_id",
      render: (status, record, helpers) => {
        const { StatusPill, getStatusConfig } = helpers;
        const config = getStatusConfig(status, "user");
        return React.createElement(StatusPill, config);
      },
    },

  ].filter(Boolean),

  // Form fields configuration
  fields: [
    {
      key: "nom_ar",
      label: "nom_ar",
      type: "text",
      rules: [{ required: true, message: "please_enter_nom_ar" }],
    },
    {
      key: "nom_fr",
      label: "nom_fr",
      type: "text",
      rules: [{ required: true, message: "please_enter_nom_fr" }],
    },
    {
      key: "prenom_ar",
      label: "prenom_ar",
      type: "text",
      rules: [{ required: true, message: "please_enter_prenom_ar" }],
    },
    {
      key: "prenom_fr",
      label: "prenom_fr",
      type: "text",
      rules: [{ required: true, message: "please_enter_prenom_fr" }],
    },
    {
      key: "role_id",
      label: "role",
      type: "select",
      options: (() => {
        const options = [];
        if (user?.role_id === "admin") {
          options.push({ value: "national", label: "مسير وطني" });
        }
        if (user?.role_id === "national") {
          options.push({ value: "wilaya", label: "مسير ولائي" });
          options.push({ value: "printer", label: "طابع" });
        }
        if (user?.role_id === "wilaya") {
          options.push({ value: "baladi", label: "مسير بلدي" });
        }
        return options;
      })(),
      rules: [{ required: true, message: "please_select_role" }],
    },
    {
      key: "email",
      label: "email",
      type: "text",
      rules: [
        { required: true, message: "please_enter_email" },
        { type: "email", message: "please_enter_valid_email" },
      ],
    },
    user?.role_id === "admin" && {
      key: "etablissement_id",
      label: "etablissement",
      type: "select",
      loadOptions: async () => {
        try {
          const etablissements = await etablissementsService.getAllForDropdown();
          return etablissements;
        } catch (error) {
          ErrorHandling(error);
          return [];
        }
      },
      rules: [{ required: false, message: "please_select_etablissement" }],
    },
    user?.role_id !== "wilaya" && {
      key: "wilaya_id",
      label: "wilaya",
      type: "select",
      loadOptions: async () => {
        try {
          const wilayas = await wilayasService.getAllForDropdown();
          return wilayas;
        } catch (error) {
          ErrorHandling(error);
          return [];
        }
      },
      rules: [{ required: true, message: "please_select_wilaya" }],
    },
    {
      key: "commune_id",
      label: "commune",
      type: "select",
      relation: user?.role_id === "wilaya" ? null : "wilaya_id", // No dependency if wilaya is fixed
      loadOptions: async (wilayaId) => {
        // If current user is wilaya manager, use their wilaya_id
        if (user?.role_id === "wilaya") {
          wilayaId = user?.wilaya_id;
        }

        if (!wilayaId) return [];

        try {
          const communes = await communesService.getByWilaya(wilayaId);
          return communes;
        } catch (error) {
          ErrorHandling(error);
          return [];
        }
      },
      rules: [{ required: true, message: "please_select_commune" }],
    },
    {
      key: "password",
      label: "password",
      type: "password",
      rules: [
        {
          requiredcreate: true,
          requiredupdate: false,
          message: "please_enter_password",
        },
        { min: 6, message: "password_min_6_characters" },
      ],
    },
    {
      key: "password_confirmation",
      label: "password_confirmation",
      type: "password",
      rules: [
        {
          requiredcreate: true,
          requiredupdate: false,
          message: "please_enter_password_confirmation",
        },
        { min: 6, message: "password_min_6_characters" },
      ],
    },
  ].filter(Boolean),

  silencevalues: {
    app_id: 0, // Changed from 0 to 1 as it seems standard
    etablissement_id: user?.role_id === "admin" ? null : user?.etablissement_id,
    ...(user?.role_id === "wilaya" && { wilaya_id: user?.wilaya_id }),
  },
  // View fields configuration (for view modal)
  viewFields: [
    { key: "nom_ar", label: "nom_ar" },
    { key: "nom_fr", label: "nom_fr" },
    { key: "prenom_ar", label: "prenom_ar" },
    { key: "prenom_fr", label: "prenom_fr" },
    { key: "email", label: "email" },
    { key: "wilaya_designation_ar", label: "wilaya" },
    { key: "commune_designation_ar", label: "commune" },
    { key: "etablissement_designation", label: "etablissement" },
    {
      key: "role_id",
      label: "role",
      render: (status, record, helpers) => {
        const { StatusPill, getStatusConfig } = helpers;
        const config = getStatusConfig(status, "user");
        return React.createElement(StatusPill, config);
      },
    },
  ].filter(Boolean),

  // Actions configuration
  actions: {
    create: true,
    edit: true,
    delete: true,
    view: true,
  },

  // Color status configuration for statistics
  // colorStatus: {
  //   statusOptions: [
  //     user?.role_id === "admin" && {
  //       filter: "role_id",
  //       label: "national",
  //       initialColor: "#faad14",
  //       hoverColor: "#d48806",
  //     },

  //     user?.role_id === "national" && {
  //       filter: "role_id",
  //       label: "wilaya",
  //       initialColor: "#1890ff",
  //       hoverColor: "#1880cc",
  //     },
  //     user?.role_id === "wilaya" && {
  //       filter: "role_id",
  //       label: "baladi",
  //       initialColor: "#722ed1",
  //       hoverColor: "#531dab",
  //     },
  //   ].filter(Boolean),
  //   loadCount: async (etablissement_id) => {
  //     try {
  //       const response = await usersService.getCount(etablissement_id);
  //       return response || {};
  //     } catch (error) {
  //       ErrorHandling(error);
  //       return {};
  //     }
  //   },
  // },
})
