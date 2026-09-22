import React from "react";
import CheckJoiner from "../components/CheckJoiner";
import JoinerRequest from "../components/JoinerRequest";
import RFIDScanner from "../components/RFIDScanner";
import JoinerCardPDF from "../components/JoinerCardPDF";
import ChangeJoiningType from "../components/ChangeJoiningType";
import moment from "moment";

/**
 * Joiners (Parents) CRUD Config for GenericCrud component
 */
export const getJoinersConfig = (user) => ({
    title: "joiners",
    entityName: "joiner",
    entityDisplayName: "joiner",

    // Table columns
    columns: [
        {
            title: "member_name",
            key: "member_name",
            render: (text, record) => {
                return React.createElement("div", { style: { lineHeight: "1.2" } }, [
                    React.createElement(
                        "div",
                        {
                            key: "ar",
                            style: { fontWeight: "600", color: "#1f2937" },
                        },
                        `${record.nom_ar || ""} ${record.prenom_ar || ""}`
                    ),
                    React.createElement(
                        "div",
                        {
                            key: "fr",
                            style: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },
                        },
                        `${record.nom_fr || ""} ${record.prenom_fr || ""}`
                    ),
                ]);
            },
        },
        {
            title: "email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "phone",
            dataIndex: "telephone",
            key: "telephone",
        },
        {
            title: "joining_date",
            dataIndex: "joining_date",
            key: "joining_date",
            render: (date) => date ? moment(date).format("DD/MM/YYYY") : "-",
        },
        {
            title: "expiration_date",
            dataIndex: "expiration_date",
            key: "expiration_date",
            render: (date) => date ? moment(date).format("DD/MM/YYYY") : "-",
        },
        user?.role_id !== "printer" && {
            title: "change_period_of_card",
            key: "change_period_of_card",
            render: (_, record, { handleRefresh }) => {
                return React.createElement(ChangeJoiningType, {
                    record,
                    onSuccess: handleRefresh
                });
            }
        },
        {
            title: "state",
            dataIndex: "state",
            key: "state",
            render: (state, record, { StatusPill, getStatusConfig }) => {
                const config = getStatusConfig(state, "joiner");
                return React.createElement(StatusPill, config);
            },
        },
        user?.role_id !== "printer" && {
            title: "rfid",
            dataIndex: "rfid",
            key: "rfid",
            render: (text, record) => {
                return React.createElement(RFIDScanner, { record });
            },
        },
        {
            title: "actions",
            key: "actionss",
            render: (_, record) => {
                return React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } }, [
                    user?.role_id === "printer" && React.createElement(JoinerCardPDF, { record, key: "card" }),
                    user?.role_id !== "printer" && React.createElement(JoinerRequest, { record, key: "request" }),
                    user?.role_id !== "printer" && user?.etablissement?.is_validation == 1 && React.createElement(CheckJoiner, { record, key: "check" }),
                ]);
            },
            width: 100,
        },
    ].filter(Boolean),

    // View fields
    viewFields: [
        { key: "nom_ar", label: "last_name_arabic" },
        { key: "nom_fr", label: "last_name_french" },
        { key: "prenom_ar", label: "first_name_arabic" },
        { key: "prenom_fr", label: "first_name_french" },
        { key: "email", label: "email" },
        { key: "telephone", label: "phone" },
        { key: "adress", label: "address" },
    ],

    // Form fields
    fields: [],

    // Actions configuration
    actions: {
        create: false,
        edit: false,
        delete: false,
        view: true,
    },
});
