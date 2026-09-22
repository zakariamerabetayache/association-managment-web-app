import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

Font.register({
  family: "Arial",
  src: "https://fonts.gstatic.com/s/tajawal/v13/Iura6YBj_oCad4k1HRwgE7Lr.ttf",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontFamily: "Arial",
    fontSize: 11,
    color: "#1f2933",
    backgroundColor: "#ffffff",
  },
  rtl: {
    direction: "rtl",
  },
  ltr: {
    direction: "ltr",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    fontSize: 10,
    color: "#52606d",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a202c",
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    border: "1 solid #e4e7eb",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  summaryItem: {
    width: "33%",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#52606d",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a202c",
  },
  table: {
    border: "1 solid #e4e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#eef2ff",
    borderBottom: "1 solid #e4e7eb",
  },
  tableRow: {
    borderBottom: "1 solid #e4e7eb",
  },
  rowRtl: {
    flexDirection: "row-reverse",
  },
  rowLtr: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 10,
    borderLeft: "1 solid #e4e7eb",
  },
  firstCell: {
    flex: 0.6,
  },
  typeCell: {
    flex: 1,
  },
  dateCell: {
    flex: 1.4,
  },
  childCell: {
    flex: 1.4,
  },
  checkerCell: {
    flex: 1.2,
  },
  emptyState: {
    padding: 24,
    textAlign: "center",
    color: "#52606d",
  },
});

const formatDate = (date, translate, isRTL) => {
  if (!date) {
    return translate("no_data");
  }
  return dayjs(date).format(isRTL ? "YYYY/MM/DD" : "DD MMM YYYY");
};

const formatDateTime = (date, hour, isRTL) => {
  if (!date || !hour) {
    return "—";
  }
  const datePart = dayjs(date).format(isRTL ? "YYYY/MM/DD" : "DD MMM YYYY");
  const timePart = dayjs(`2000-01-01 ${hour}`).format(isRTL ? "HH:mm" : "hh:mm A");
  return `${datePart}, ${timePart}`;
};

const JoinerChecksHistoryPDF = ({
  records = [],
  stats = {},
  dateRange = {},
  translate = (key) => key,
  isRTL = true,
}) => {
  const totalRecords = records.length;
  const totalCheckIns = stats.totalCheckIns ?? 0;
  const totalCheckOuts = stats.totalCheckOuts ?? 0;
  const startDate = dateRange.startDate;
  const endDate = dateRange.endDate;

  const rowDirectionStyle = isRTL ? styles.rowRtl : styles.rowLtr;

  return (
    <Document>
      <Page size="A4" style={[styles.page, isRTL ? styles.rtl : styles.ltr]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {translate("checks_history_report")}
          </Text>
          <Text style={styles.subText}>
            {translate("report_generated_on")}: {dayjs().format(
              isRTL ? "YYYY/MM/DD HH:mm" : "DD MMM YYYY HH:mm"
            )}
          </Text>
          <Text style={styles.subText}>
            {translate("period")}: {formatDate(startDate, translate, isRTL)} {" "}
            {translate("to")} {formatDate(endDate, translate, isRTL)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{translate("report_summary")}</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{translate("total_records")}</Text>
            <Text style={styles.summaryValue}>{totalRecords}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{translate("total_check_ins")}</Text>
            <Text style={styles.summaryValue}>{totalCheckIns}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{translate("total_check_outs")}</Text>
            <Text style={styles.summaryValue}>{totalCheckOuts}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>
          {translate("report_details")}
        </Text>
        <View style={[styles.table]}>
          <View style={[styles.tableHeader, rowDirectionStyle]}>
            <Text style={[styles.cell, styles.firstCell]}>{"#"}</Text>
            <Text style={[styles.cell, styles.childCell]}>{translate("child")}</Text>
            <Text style={[styles.cell, styles.typeCell]}>{translate("type")}</Text>
            <Text style={[styles.cell, styles.dateCell]}>{translate("date")}</Text>
            <Text style={[styles.cell, styles.checkerCell]}>
              {translate("checked_by")}
            </Text>
          </View>

          {records.length === 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.emptyState]}>
                {translate("no_data")}
              </Text>
            </View>
          )}

          {records.map((record, index) => {
            const childName = record.child
              ? `${record.child.prenom_ar || record.child.prenom_fr || ""} ${record.child.nom_ar || record.child.nom_fr || ""
                }`.trim() || translate("child")
              : translate("child");
            const checkerName = record.checker
              ? `${record.checker.prenom_ar || record.checker.prenom_fr || ""} ${record.checker.nom_ar || record.checker.nom_fr || ""
                }`.trim() || translate("checked_by")
              : translate("checked_by");
            const typeLabel =
              record.type === 0
                ? translate("check_in")
                : translate("check_out");

            return (
              <View
                key={record.id || `${record.date}-${index}`}
                style={[styles.tableRow, rowDirectionStyle]}
              >
                <Text style={[styles.cell, styles.firstCell]}>{index + 1}</Text>
                <Text style={[styles.cell, styles.childCell]}>{childName}</Text>
                <Text style={[styles.cell, styles.typeCell]}>{typeLabel}</Text>
                <Text style={[styles.cell, styles.dateCell]}>
                  {formatDateTime(record.date, record.hour, isRTL)}
                </Text>
                <Text style={[styles.cell, styles.checkerCell]}>{checkerName}</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default JoinerChecksHistoryPDF;
