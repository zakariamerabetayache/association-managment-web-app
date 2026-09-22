import React from "react";
import GenericCrud from "../components/GenericCrud";
import paymentsService from "../services/paymentsService";
import { getPaymentsConfig } from "../configs/paymentsConfig";
import { useStateContext } from "../contexts/ContextProvider";
import CrudProvider from "../contexts/CrudProvider";

const Payments = () => {
  const { user } = useStateContext();

  return (
    <CrudProvider config={getPaymentsConfig(user)} service={paymentsService}>
      <GenericCrud />
    </CrudProvider>
  );
};

export default Payments;
