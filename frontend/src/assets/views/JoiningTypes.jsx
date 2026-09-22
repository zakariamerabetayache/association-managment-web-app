import React from "react";
import GenericCrud from "../components/GenericCrud";
import joiningTypesService from "../services/joiningTypesService";
import { getJoiningTypesConfig } from "../configs/joiningTypesConfig";
import { useStateContext } from "../contexts/ContextProvider";
import CrudProvider from "../contexts/CrudProvider";

const JoiningTypes = () => {
    const { user } = useStateContext();

    return (
        <CrudProvider config={getJoiningTypesConfig(user)} service={joiningTypesService}>
            <GenericCrud />
        </CrudProvider>
    );
};

export default JoiningTypes;
