import React from "react";
import wilayasService from "../services/wilayasService";
import communesService from "../services/communesService";
import etablissementsService from "../services/etablissementsService";
import ErrorHandling from "../components/ErrorHandling";
// import { isRTL } from "../locale/LanguageContext";

// Etablissements CRUD Configuration
export const getEtablissementsConfig = (user) => ({
  title: "etablissements",
  entityName: "etablissement",
  entityDisplayName: "etablissement",

  // filters: [
  //   {
  //     key: "wilaya_id",
  //     label: "wilaya",
  //     type: "select",
  //     loadOptions: async () => {
  //       try {
  //         const wilayas = await wilayasService.getAllForDropdown();
  //         return wilayas;
  //       } catch (error) {
  //         ErrorHandling(error);
  //         return [];
  //       }
  //     },
  //   },
  //   {
  //     key: "commune_id",
  //     label: "commune",
  //     type: "select",
  //     loadOptions: async (wilayaId) => {
  //       if (!wilayaId) return [];
  //       try {
  //         const communes = await communesService.getByWilaya(wilayaId);
  //         return communes;
  //       } catch (error) {
  //         ErrorHandling(error);
  //         return [];
  //       }
  //     },
  //   },
  // ],

  // Table columns configuration
  columns: [
    {
      title: "designation_ar",
      dataIndex: "designation_ar",
      key: "designation_ar",
    },
    {
      title: "designation_fr",
      dataIndex: "designation_fr",
      key: "designation_fr",
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
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        if (!price) return '-';
        return `${parseFloat(price).toFixed(2)} DA`;
      }
    },
    {
      title: "adress",
      dataIndex: "adress",
      key: "adress",
      render: (adress) => {
        if (!adress) return '-';
        return adress.length > 50 ? `${adress.substring(0, 50)}...` : adress;
      }
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "opening_hour",
      dataIndex: "opening_hour",
      key: "opening_hour",
      render: (time) => {
        if (!time) return '-';
        return time;
      }
    },
    {
      title: "closing_hour",
      dataIndex: "closing_hour",
      key: "closing_hour",
      render: (time) => {
        if (!time) return '-';
        return time;
      }
    },
    {
      title: "logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => {
        if (!logo) return null;
        return React.createElement('img', {
          src: `http://localhost:8000/${logo}`,
          alt: "Logo",
          style: { width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }
        });
      }
    },
  ],

  // Form fields configuration
  fields: [
    {
      key: "designation_ar",
      label: "designation_ar",
      type: "text",
      rules: [{ required: true, message: "please_enter_designation_ar" }],
    },
    {
      key: "designation_fr",
      label: "designation_fr",
      type: "text",
      rules: [{ required: true, message: "please_enter_designation_fr" }],
    },
    {
      key: "logo",
      label: "logo",
      type: "file",
      accept: "image/*",
      rules: [],
    },
    {
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
      relation: "wilaya_id", // This field depends on wilaya_id
      loadOptions: async (wilayaId) => {
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
      key: "owner_name_ar",
      label: "owner_name_ar",
      type: "text",
      rules: [{ max: 255, message: "owner_name_ar_max_255" }],
    },
    {
      key: "owner_name_fr",
      label: "owner_name_fr",
      type: "text",
      rules: [{ max: 255, message: "owner_name_fr_max_255" }],
    },
    {
      key: "owner_last_name_ar",
      label: "owner_last_name_ar",
      type: "text",
      rules: [{ max: 255, message: "owner_last_name_ar_max_255" }],
    },
    {
      key: "owner_last_name_fr",
      label: "owner_last_name_fr",
      type: "text",
      rules: [{ max: 255, message: "owner_last_name_fr_max_255" }],
    },
    {
      key: "rip",
      label: "rip",
      type: "text",
      rules: [{ max: 20, message: "rip_max_20" }],
    },
    {
      key: "price",
      label: "price",
      type: "number",
      rules: [
        {
          type: 'number',
          min: 0,
          message: "price_must_be_positive"
        }
      ],
    },
    {
      key: "adress",
      label: "adress",
      type: "textarea",
      rules: [{ max: 500, message: "adress_max_500" }],
    },
    {
      key: "phone",
      label: "phone",
      type: "text",
      rules: [
        { max: 20, message: "phone_max_20" },
        { pattern: /^[0-9+\-\s()]*$/, message: "phone_invalid_format" }
      ],
    },
    {
      key: "email",
      label: "email",
      type: "email",
      rules: [
        { type: 'email', message: "email_invalid_format" },
        { max: 255, message: "email_max_255" }
      ],
    },
    {
      key: "opening_hour",
      label: "opening_hour",
      type: "time",
      rules: [],
    },
    {
      key: "closing_hour",
      label: "closing_hour",
      type: "time",
      rules: [],
    },
  ],

  // View modal fields configuration
  viewFields: [
    { key: "designation_ar", label: "designation_ar" },
    { key: "designation_fr", label: "designation_fr" },
    // { 
    //   key: "logo", 
    //   label: "logo",
    //   render: (logo) => {
    //     if (logo) {
    //       return (
    //         <img 
    //           src={`${import.meta.env.VITE_API_BASE_URL}/${logo}`} 
    //           alt="Logo" 
    //           style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }}
    //         />
    //       );
    //     }
    //     return <span>No Logo</span>;
    //   },
    // },
    { key: "wilaya_designation_ar", label: "wilaya" },
    { key: "wilaya_designation_fr", label: "wilaya" },
    { key: "owner_name_ar", label: "owner_name_ar" },
    { key: "owner_name_fr", label: "owner_name_fr" },
    { key: "owner_last_name_ar", label: "owner_last_name_ar" },
    { key: "owner_last_name_fr", label: "owner_last_name_fr" },
    { key: "rip", label: "rip" },
    { key: "price", label: "price" },
    { key: "adress", label: "adress" },
    { key: "phone", label: "phone" },
    { key: "email", label: "email" },
    { key: "opening_hour", label: "opening_hour" },
    { key: "closing_hour", label: "closing_hour" },
  ],

  // Actions configuration
  actions: {
    create: true,
    edit: true,
    delete: true,
    view: true,
  },
});

