import React from "react";
import GenericCrud from "../components/GenericCrud";
import joinersService from "../services/joinersService";
import { getJoinersConfig } from "../configs/joinersConfig";
import { useStateContext } from "../contexts/ContextProvider";
import CrudProvider from "../contexts/CrudProvider";

const Joiners = () => {
  const { user } = useStateContext();

  return (
    <CrudProvider config={getJoinersConfig(user)} service={joinersService}>
      <GenericCrud />
    </CrudProvider>
  );
};

export default Joiners;
