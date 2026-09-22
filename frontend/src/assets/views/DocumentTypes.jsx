import React from "react";
import GenericCrud from "../components/GenericCrud";
import documentTypesService from "../services/documentTypesService";
import { documentTypesConfig } from "../configs/documentTypesConfig";
import CrudProvider from "../contexts/CrudProvider";

const DocumentTypes = () => {
    return (
        <CrudProvider config={documentTypesConfig} service={documentTypesService}>
            <GenericCrud />
        </CrudProvider>
    );
};

export default DocumentTypes;
