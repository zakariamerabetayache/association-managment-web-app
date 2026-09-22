import React from "react";
import GenericCrud from "../components/GenericCrud";
import documentsService from "../services/documentsService";
import { getDocumentsConfig } from "../configs/documentsConfig";
import { useStateContext } from "../contexts/ContextProvider";
import CrudProvider from "../contexts/CrudProvider";

const Documents = () => {
    const { user } = useStateContext();

    return (
        <CrudProvider config={getDocumentsConfig(user)} service={documentsService}>
            <GenericCrud />
        </CrudProvider>
    );
};

export default Documents;
