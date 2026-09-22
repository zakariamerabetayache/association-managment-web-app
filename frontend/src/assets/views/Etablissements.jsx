import React from "react";
import GenericCrud from "../components/GenericCrud";
import etablissementsService from "../services/etablissementsService";
import { getEtablissementsConfig } from "../configs/etablissementsConfig";
import { useStateContext } from "../contexts/ContextProvider";
import CrudProvider from "../contexts/CrudProvider";

const Etablissements = () => {
  const { user } = useStateContext();

  return (
    <CrudProvider config={getEtablissementsConfig(user)} service={etablissementsService}>
      <GenericCrud />
    </CrudProvider>
  );
};

export default Etablissements;
