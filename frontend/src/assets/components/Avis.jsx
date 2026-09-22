import React from "react";
import {
  Page,

  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import PdfErrorBoundary from "../hooks/PdfErrorBoundary";
import { ArabicWords } from "./ArabicWords";
import { FileOutlined    } from "@ant-design/icons";

import logo from "../components/img/culture.png";

// Arabic font
import arialFont from "../fonts/arial.ttf";

Font.register({
  family: "Arial",
  src: arialFont,
  fontWeight: "normal",
});

// ============ STYLES ============
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Arial",
    fontSize: 12,
    direction: "rtl",
    lineHeight: 0.8,
    flexDirection: "column",
  },

  /* --- HEADER --- */
  republic: {
    fontSize: 11,
    //fontWeight: "bold",
    textAlign: "center",
        paddingVertical: 2, // reduce padding inside cells
  lineHeight: 0.6,    // reduce line height

  },




  republic2: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
        paddingVertical: 2, // reduce padding inside cells
  lineHeight: 0.5,    // reduce line height

  },
republic3: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
        paddingVertical: 2, // reduce padding inside cells
  lineHeight: 1,    // reduce line height

  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  headerRight: {
    textAlign: "right",
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    textAlign: "left",
  },

  logo: {
    width: 70,
    height: 70,
  },

  titleBoxOuter: {
    border: "2 solid #000",
    padding: 4,
    borderRadius: 8,
  },
  titleBoxInner: {
    border: "1 solid #000",
    padding: 8,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  /* --- COMPANY INFORMATION --- */
  companySection: {
    marginBottom: 10,
    border: "1 solid #000",
    padding: 8,
    borderRadius: 6,
  },
  companyRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  companyItem: {
    width: "33%",
    fontSize: 12,
  },

  /* --- TABLE --- */
  table: {
    border: "1 solid #000",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#ddd",
    borderBottom: "1 solid #000",
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1 solid #000",
  },
  cell: {
    flex: 1,
    padding: 1,
    fontSize: 10,
    borderLeft: "1 solid #000",
    textAlign: "right",
  },
  cell1: {
    flex: 1,
    padding: 1,
    fontSize: 8,
    borderLeft: "1 solid #000",
    textAlign: "center",
  },

  cell2: {
    flex: 1,
    padding: 1,
    fontSize: 9,
    borderLeft: "1 solid #000",
    textAlign: "right",
  },



  numericCell: {
    flex: 1,
    padding: 4,
    fontSize: 11,
    borderLeft: "1 solid #000",
    textAlign: "center",
  },
  headerCell: {
    flex: 1,
    padding: 1,
    fontSize: 11,
    fontWeight: "bold",
    borderLeft: "1 solid #000",
    textAlign: "center",
  },

 headerCell1: {
    flex: 1,
    padding: 1,
    fontSize: 7,
    fontWeight: "bold",
    borderLeft: "1 solid #000",
    textAlign: "center",   
  },



  /* --- SUMMARY --- */
  summarySection: {
    marginTop: 8,
    padding: 8,
    border: "1 solid #000",
    borderRadius: 6,
  },
  summaryRow: {
    padding:10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  summaryLabel: {
   // padding: 10,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 80,
    lineHeight :0.8,

  },
  summaryValue: {
    fontSize: 12,
  },

  /* --- FOOTER --- */
  footer: {
    marginTop: 1,
    padding:2,
   // flexDirection: "row-reverse",
    //justifyContent: "space-between",
  },
  footerLeft: {
    fontSize: 14,
    fontWeight: "bold",
        marginLeft: 40,

  },
  footerRight: {
   fontSize: 14,
    fontWeight: "bold",
  },

 row: {
    flexDirection: "row",
    width: "100%",

    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  leftTable: {
    width: "30%",
    border: "1pt solid #000",
  },
  


  tableRow1: {
    flexDirection: "row",
    borderBottom: "1pt solid #000",
  lineHeight: 0.5,    // reduce line height

  },



  
  tableCellLeft: {
    width: "50%",
    padding: 3,
    fontSize: 8,
    textAlign: "right",

  },
  tableCellRight: {
    width: "50%",
    padding: 3,
    fontSize: 8,
    textAlign: "center",
    borderRight: "1pt solid #000",

  },
  centerBox: {
    width: "30%",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSection: {
    width: "30%",
    textAlign: "right",
  },
  rightText: {
    fontSize: 10,
  },

});

// ============ MAIN COMPONENT ============

export default function Avis({
  

  entreprise = {},
  employees = [],
  mois='',
  annee='',
  agence='',
  corp='',
  numm='',
  datem='',
 typepaiement='',
  user = {},
}) {

const ROWS_PER_PAGE = 12; // adjust this number to fit rows per page in landscape
function getArabicMonthName(month) {
  const months = {
    "1": "جانفي",
    "2": "فيفري",
    "3": "مارس",
    "4": "أفريل",
    "5": "ماي",
    "6": "جوان",
    "7": "جويلية",
    "8": "أوت",
    "9": "سبتمبر",
    "10": "أكتوبر",
    "11": "نوفمبر",
    "12": "ديسمبر",
  };

  return months[month] || "";
}


  function paginate(data, rowsPerPage = ROWS_PER_PAGE) {
  const pages = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    pages.push(data.slice(i, i + rowsPerPage));
  }
  return pages;
}
  // SUMS
 const pages = paginate(employees);

// Total document (all pages)
const totalNetDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salnet) || 0),
  0
);
const totalBrutDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salbrut) || 0),
  0
);


const totalCnasDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.retcnas) || 0),
  0
);
const totalIrgDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.retirg) || 0),
  0
);
const totalMitDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.retmituel) || 0),
  0
);
const totalAbsDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.retabs) || 0),
  0
);
const totalRetDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.retretraite) || 0),
  0
);
const totalPrincDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salprinc) || 0),
  0
);
const totalPrimDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salprimes) || 0),
  0
);
const totalIndDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salposte) || 0),
  0
);
const totalUniDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salunique) || 0),
  0
);
const totalAfDocument = employees.reduce(
  (sum, e) => sum + (parseFloat(e.salaf) || 0),
  0
);




// Total per page
const totalNetPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salnet) || 0), 0)
);

const totalCnasPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.retcnas) || 0), 0)
);
const totalIrgPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.retirg) || 0), 0)
);
const totalMitPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.retmituel) || 0), 0)
);
const totalRetPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.retretraite) || 0), 0)
);

const totalAbsPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.retabs) || 0), 0)
);

const totalPrimPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salprimes) || 0), 0)
);
const totalPrincPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salprinc) || 0), 0)
);
const totalIndPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salposte) || 0), 0)
);
const totalAfPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salaf) || 0), 0)
);
const totalUniPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salunique) || 0), 0)
);


const totalBrutPerPage = pages.map(page =>
  page.reduce((sum, e) => sum + (parseFloat(e.salbrut) || 0), 0)
);

  return (
                <PdfErrorBoundary>
          <PDFViewer width="100%" height="100%">
    
  <Document>

  {/* EMPTY STATE */}
    <>  
       {pages.map((pageData, pageIndex) => (
  <Page
    key={pageIndex}
    size="A4"
    orientation="landscape"
    style={styles.page}
  >

        {/* REPUBLIC HEADER */}
        <Text style={styles.republic}>الجمهورية الجزائرية الديمقراطية الشعبية</Text>
        <Text style={styles.republic}>République Algérienne Démocratique et Populaire</Text>

        <Text style={styles.republic3}>بيان الدفع</Text>
        <Text style={styles.republic}>النفقات المقيدة على الميزانية العامة للدولة</Text>
        <Text style={styles.republic2}> الشهر : {getArabicMonthName(mois)} {annee}</Text>

        {/* HEADER */}
      
          <View style={styles.row}>

          {/* LEFT TABLE */}
          <View style={styles.leftTable}>
            <View style={styles.tableRow1}>
             <Text style={styles.tableCellRight}>{entreprise?.portefeuille}</Text>
              <Text style={styles.tableCellLeft}>محفظة البرنامج</Text>
            </View>
            <View style={styles.tableRow1}>
              <Text style={styles.tableCellRight}>{entreprise?.progr}</Text>
                 <Text style={styles.tableCellLeft}>البرنامج</Text>

            </View>
             <View style={styles.tableRow1}>
              <Text style={styles.tableCellRight}>{entreprise?.progsec}</Text>
                <Text style={styles.tableCellLeft}>البرنامج الفرعي</Text>

            </View>

            <View style={styles.tableRow1}>
              <Text style={styles.tableCellRight}>{entreprise?.activite}</Text>
                       <Text style={styles.tableCellLeft}>النشاط</Text>

            </View>
            <View style={styles.tableRow1}>
              <Text style={styles.tableCellRight}>{entreprise?.activsec}</Text>
              <Text style={styles.tableCellLeft}>النشاط الفرعي</Text>

            </View>



          </View>

          {/* CENTER ACCOUNT BOX */}
          <View style={styles.centerBox}>

            
            <Text style={{ fontSize: 10 }}>المحاسب العمومي المختص:أمين خزينة ولاية سكيكدة</Text>
            <Text style={{ fontSize: 10 }}> { typepaiement =='ccp' ?   entreprise?.ript :entreprise?.ribt}  : RIB/RIP </Text>


          </View>

          {/* RIGHT TEXT */}
          <View style={styles.rightSection}>
            <Text style={styles.rightText}>رمز الآمر بالصرف:   {' '} {entreprise?.nordonne}</Text>
            <Text style={styles.rightText}>السنة المالية:   {'          '} {entreprise?.anneegest}</Text>
            <Text style={styles.rightText}>رقم الحوالة:   {'           '} {numm}</Text>
            <Text style={styles.rightText}>تاريخ الحوالة:   {'        '} {datem}</Text>
            <Text style={styles.rightText}>طريقة الدفع:   {'          '} {agence}</Text>
            <Text style={styles.rightText}>سلك مناصب الشغل:   {' '} {corp}</Text>



          </View>   

        </View>

        {/* TABLE */}
        <View style={styles.table}>
  
          {/* HEADER */}
          <View style={styles.tableHeader}>











  <Text style={[styles.headerCell, { flex: 2.3 }]}>الاسم واللقب</Text>


            <Text style={[styles.headerCell1, { flex: 0.55 }]}>الرقم الإستدلالي</Text>
            <Text style={[styles.headerCell1, { flex: 0.5 }]}>الحالة العائلية</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>رقم الحساب</Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>صافي الدفع</Text>
              <Text style={[styles.headerCell, { flex: 1.1 }]}>إقتطاع الضمان الإجتماعي</Text>
                <Text style={[styles.headerCell, { flex: 1.1 }]}>إقتطاع الضريبة على الدخل الإجمالي</Text>
              <Text style={[styles.headerCell, { flex: 1.1 }]}>إقتطاع الغيابات</Text>

              <Text style={[styles.headerCell, { flex: 1.1 }]}>إقتطاع التعاضدية</Text>
              <Text style={[styles.headerCell, { flex: 1.1 }]}>إقتطاع التقاعد المسبق</Text>
   
            <Text style={[styles.headerCell, { flex: 1.1 }]}>المجموع الخام</Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>11110</Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>12110</Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>13100 </Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>15110 </Text>
            <Text style={[styles.headerCell, { flex: 1.1 }]}>15130 </Text>


          </View>

          {/* ROWS */}
{pageData.map((e, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2.58 }]}>{e.nom_ar} {e.prenom_ar} </Text>
              <Text style={[styles.cell1, { flex: 0.62 }]}>{e.indicebase}</Text>

     <Text style={[styles.cell1, { flex: 0.57 }]}>   
               {e?.personell_civilite ==1?"متزوج":e?.personell_civilite ==0?"أعزب/عزباء":e?.personell_civilite ==2?"مطلق":"أرمل" || ""}
                   
                  
                </Text>

              <Text style={[styles.cell1, { flex: 2.25 }]}>
                {
                (e.typepaiement=='banque') ?
                e.comptebanque
               :
                     e.compteccp
              }
                
                
                
                </Text>

   

              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salnet}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.retcnas}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.retirg}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.retabs}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.retmituel}</Text>

              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.retretraite}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salbrut}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salprinc}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salprimes}</Text>


              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salposte}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salaf}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{e.salunique}</Text>


            </View>
          ))}
        </View>   

    <View style={styles.tableRow}>
                <Text style={[styles.cell2, { flex: 6.33 }]}>مجموع الصفحة</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalNetPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalCnasPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalIrgPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalAbsPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalMitPerPage[pageIndex].toFixed(2)}</Text>

              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalRetPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalBrutPerPage[pageIndex].toFixed(2)}</Text>

              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalPrincPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalPrimPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalIndPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalAfPerPage[pageIndex].toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalUniPerPage[pageIndex].toFixed(2)}</Text>



  </View>
   
 
  {/* TOTAL document appears ONLY on last page */}
  {pageIndex === pages.length - 1 && (
    <>
 <View style={styles.tableRow}>
              <Text style={[styles.cell2, { flex: 6.33 }]}>المجموع</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalNetDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalCnasDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalIrgDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalAbsDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalMitDocument.toFixed(2)}</Text>

              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalRetDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalBrutDocument.toFixed(2)}</Text>

              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalPrincDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalPrimDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalIndDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalAfDocument.toFixed(2)}</Text>
              <Text style={[styles.cell2, { flex: 1.24 }]}>{totalUniDocument.toFixed(2)}</Text>



  </View>
   
    
   
   
    </>
  )}

  <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>توقف مجموع هذا الجدول على مبلغ : {''} {ArabicWords(totalBrutDocument.toFixed(2))}</Text>
      </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            مسؤول النشاط 
          </Text>

        
        </View>

 </Page>
))} 
 </>
  
    </Document>
      </PDFViewer >
              </PdfErrorBoundary>
    
  );
}
