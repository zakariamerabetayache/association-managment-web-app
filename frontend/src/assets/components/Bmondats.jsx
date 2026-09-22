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
  lineHeight: 1.2,    // reduce line height

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
        lineHeight: 0.6,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1 solid #000",
    lineHeight: 0.6,
  },
  cell: {
    flex: 1,
    padding: 1,
    fontSize: 9,
    borderLeft: "1 solid #000",
    textAlign: "center",
  },
totcell: {
    flex: 1,
    padding: 1,
    fontSize: 12,
    borderLeft: "1 solid #000",
    textAlign: "center",
    fontWeight: "bold",

  },


  colcell: {
    flex: 1,
    padding: 1,
         fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#d8d5d5ff",
    textAlign: "center",
    borderLeft: "1 solid #000",
    textAlign: "center",
  },


  title1: {
    padding: 1,
    marginTop: 5, 
    fontSize: 13,     
    lineHeight: 0.9,
    fontWeight: "bold",
    backgroundColor: "#d8d5d5ff",
    textAlign: "center",
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
    marginLeft: 30,
    padding:2,
    textAlign: "left",
   // flexDirection: "row-reverse",
    //justifyContent: "space-between",
  },
  footerLeft: {
    fontSize: 14,
    fontWeight: "bold",

  },
  footerRight: {
   fontSize: 14,
   marginTop: 30,
    fontWeight: "bold",
    textAlign: "right",
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
    borderBottom: "1 solid #000",
    lineHeight: 0.5,

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

export default function Bmondats({
  entreprise = {},
  bydata = [],
  alldata = [],

  mois='',
  annee='',
  agence='',
  corp='',
  numm='',
  datem='',

  user = {},
}) {

const ROWS_PER_PAGE = 18; // adjust this number to fit rows per page in landscape
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


  // SUMS

// Total document (all pages)

  return (
                <PdfErrorBoundary>
          <PDFViewer width="100%" height="100%">
    
  <Document>

  {/* EMPTY STATE */}
   <Page
    size="A4"
    orientation="landscape"
    style={styles.page}
  >

        {/* REPUBLIC HEADER */}
        <Text style={styles.republic}>الجمهورية الجزائرية الديمقراطية الشعبية</Text>
        <Text style={styles.republic}>République Algérienne Démocratique et Populaire</Text>

        <Text style={styles.title1}>حوالة الدفع للعنوان الأول</Text>
        <Text style={styles.republic}>نفقات مقيدة في الميزانية العامة للدولة</Text>

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
            <Text style={{ fontSize: 10 }}> {entreprise?.ribt}  : RIB/RIP </Text>


          </View>

          {/* RIGHT TEXT */}
          <View style={styles.rightSection}>
            <Text style={styles.rightText}>رمز الآمر بالصرف:   {' '} {entreprise?.nordonne}</Text>
            <Text style={styles.rightText}>السنة المالية:   {'          '} {entreprise?.anneegest}</Text>
            <Text style={styles.rightText}>رقم الحوالة:   {'           '} {numm}</Text>
            <Text style={styles.rightText}>تاريخ الحوالة:   {'        '} {datem}</Text>
    
            <Text style={styles.rightText}>سلك مناصب الشغل:   {' '} {corp}</Text>
        <Text style={styles.rightText}> موضوع النفقة : {'        '}{getArabicMonthName(mois)} {annee}</Text>

            <Text style={styles.rightText}>طريقة الدفع:   {'          '} {agence}</Text>
            <Text style={styles.rightText}>عدد وضعيات الدفع:   {'  '} {bydata.length}</Text>



          </View>   

        </View>

        {/* TABLE */}
/






<View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>

<View style={[ { width: "42%" }]}>

        </View>   


  <View style={[styles.table, { width: "58%" }]}>

 <View style={styles.tableHeader}>
   <Text style={[styles.colcell, { flex: 5.1 }]}>تعيين البنك /الحساب البريدي الجاري</Text>
   <Text style={[styles.colcell, { flex: 6.1 , borderRight: "1 solid #000" }]}>مبلغ الإجمالي للدفع الإجمالي الخام-مجموع الإقتطاعات</Text>
 </View>
 
 
 
  
          {/* ROWS */}
{bydata.map((e, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 5.1 }]}>{e.agencedesign}</Text>
              <Text style={[styles.cell, { flex: 6.1 }]}>{e.total_salnet}</Text>

            </View>
          ))}

  <View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{''}</Text>
    <Text style={[styles.totcell, { flex: 6.1, borderRight: "1 solid #000" }]}>{alldata?.salnet}</Text>
  </View>

  

        </View>   
        </View>   


<View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
   <View style={[styles.table, { width: "58%" }]}>
<View style={styles.tableHeader}>
   <Text style={[styles.colcell, { flex: 4 }]}>تعيين المستفيدين أو المؤسسات</Text>
   <Text style={[styles.colcell, { flex: 4 }]}>حساب المستفيد</Text>
   <Text style={[styles.colcell, { flex: 2.5 , borderRight: "1 solid #000" }]}>المبلغ</Text>
   <Text style={[styles.colcell, { flex: 3 }]}>الملاحظات</Text>

 </View>
 <View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'الضمان الإجتماعي'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.comptecnas}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retcnas}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'الضريبة على الدخل'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.compteirg}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retirg}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.nommit1}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.comptemit1}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retmituel0}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.nommit2}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.comptemit2}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retmituel1}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>

<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'صندوق التقاعد الخاص'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.compteretrait}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retretraite}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'الإقتطاعات الغيابات'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.compteabs}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retabs}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'الإقتطاعات للخدمات الإجتماعية'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.comptesoc}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retsoc}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 4 }]}>{'قرض إقتناء السيارة'}</Text>
    <Text style={[styles.cell, { flex: 4 }]}>{entreprise?.comptevoit}</Text>
    <Text style={[styles.cell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.retvoit}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.totcell, { flex: 4 }]}>{'مجموع الإقتطاعات'}</Text>
    <Text style={[styles.totcell, { flex: 4 }]}>{''}</Text>
    <Text style={[styles.totcell, { flex: 2.5, borderRight: "1 solid #000" }]}>{alldata?.totret}</Text>

    <Text style={[styles.cell, { flex: 3 }]}>{''}</Text>



 </View>
  </View>
 
  {/* -------- LEFT TABLE -------- */}
  <View style={[styles.table, { width: "38%" }]}>
 <View style={styles.tableHeader}>
   <Text style={[styles.colcell, { flex: 5.1 }]}>التقييم الميزانياتي</Text>
   <Text style={[styles.colcell, { flex: 2 , borderRight: "1 solid #000" }]}>المبلغ</Text>
 </View>
 <View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'الصنف/الصنف الفرعي:11110'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salprinc}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'الصنف/الصنف الفرعي:12110'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salprimes}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'الصنف/الصنف الفرعي:13100'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salposte}</Text>
  </View>

<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'الصنف/الصنف الفرعي:15100/15000'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.saltotaf}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'15110'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salaf}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'15130'}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salunique}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'    '}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{'     '}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 5.1 }]}>{'    '}</Text>
    <Text style={[styles.cell, { flex: 2, borderRight: "1 solid #000" }]}>{'     '}</Text>
  </View>
   
<View key={30} style={styles.tableRow}>
    <Text style={[styles.totcell, { flex: 5.1 }]}>{'المجموع الخام'}</Text>
    <Text style={[styles.totcell, { flex: 2, borderRight: "1 solid #000" }]}>{alldata?.salbrut}</Text>
  </View>
  </View>

  {/* -------- RIGHT TABLE -------- */}

</View>






  <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>توقف مجموع هذا الجدول على مبلغ : {''} {ArabicWords(alldata?.salbrut)}</Text>
      </View>

        {/* FOOTER */}

<View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
  
  {/* -------- LEFT TABLE -------- */}
  <View style={[styles.table, { width: "45%" }]}>
 <View style={styles.tableHeader}>
   <Text style={[styles.colcell, { flex: 6.6 }]}>إطار مخصص للمحاسب العمومي</Text>
 </View>   
 <View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 3.3 }]}>{'المبلغ الخام'}</Text>
    <Text style={[styles.cell, { flex: 3.3, borderRight: "1 solid #000" }]}>{''}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 3.3 }]}>{'إقتطاع المحاسب العمومي'}</Text>
    <Text style={[styles.cell, { flex: 3.3, borderRight: "1 solid #000" }]}>{''}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 3.3 }]}>{'النفقات المقبولة'}</Text>
    <Text style={[styles.cell, { flex: 3.3, borderRight: "1 solid #000" }]}>{''}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 3.3 }]}>{'مجموع إقتطاعات المحاسب'}</Text>
    <Text style={[styles.cell, { flex: 3.3, borderRight: "1 solid #000" }]}>{''}</Text>
  </View>
<View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 3.3 }]}>{'المبلغ الخام'}</Text>
    <Text style={[styles.cell, { flex: 3.3, borderRight: "1 solid #000" }]}>{''}</Text>
  </View>

   </View>

  {/* -------- RIGHT TABLE -------- */}
  <View style={[{ width: "54%" }]}>
          <Text style={styles.footerRight}>
            مسؤول النشاط 
          </Text>
  </View>

</View>    


        <View style={styles.footer}>
          <Text >
            الآمر بالصرف 
          </Text>
  </View>


 </Page>

    </Document>
      </PDFViewer >
              </PdfErrorBoundary>
    
  );
}
