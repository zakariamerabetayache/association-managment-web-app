import React from "react";
import GenericCrud from "../components/GenericCrud";
import wilayasService from "../services/wilayasService";
import { wilayasConfig } from "../configs/wilayasConfig";
import CrudProvider from "../contexts/CrudProvider";

const Wilayas = () => {
  return (
    <CrudProvider config={wilayasConfig} service={wilayasService}>
      <GenericCrud />
    </CrudProvider>
  );
};

export default Wilayas;
