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
import PdfErrorBoundary from "./PdfErrorBoundary";
import logo from "../components/img/culture.png";


// ✅ Arabic font registration
import arialFont from "../fonts/arial.ttf";

Font.register({
  family: "Arial",
  src: arialFont,
  fontWeight: "normal",
});
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Arial",
    fontSize: 14,
    direction: "rtl",
    lineHeight: 1.6,
  },
   headerSection: {
    flexDirection: "row-reverse", // because Arabic is RTL
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,

  },

  // Rightmost title
  headerRight: {
    textAlign: "right",
    flex: 1,
  },

  // Center: enterprise info
  headerCenter: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  outerBox: {
    border: "2 solid #000",
    borderRadius: 8,         // ✅ rounded corners (outer)
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  innerBox: {
    border: "1 solid #000",
    borderRadius: 8,          // ✅ rounded corners (inner)
    paddingVertical: 15,
    paddingHorizontal: 15,
    textAlign: "center",
  },

  title: {
    textAlign: "center",

    fontSize: 25,
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",

    fontSize: 20,
    fontWeight: "bold",
  },

  // Left: logo
  headerLeft: {
    textAlign: "left",
    flex: 1,
  },

  logo: {
    width: 70,
    height: 70,
    objectFit: "contain",
  },

  republic: {
    fontSize: 14,
    fontWeight: "bold",
        textAlign: "center",
    marginBottom: 0,

  },
  republic1: {
    fontSize: 14,
    fontWeight: "bold",
        textAlign: "center",
    marginBottom: 0,

  },

  companyname: {
    fontSize: 18,
    fontWeight: "bold",
  },

 
  section: {
    marginVertical: 0,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  label: {
    fontWeight: "bold",
  },
  line: {
    borderBottom: "1 solid #000",
    marginVertical: 0,
  },
table: {
    marginTop: 2,
    border: "1 solid #000", // full outer border
  },
  tableHeader: {
    flexDirection: "row-reverse",
    backgroundColor: "#eee",
    borderBottom: "1 solid #000",
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottom: "1 solid #000",
  },
  cell: {
    flex: 1,
        fontSize: 12,

    padding: 2,
    textAlign: "right",
    borderLeft: "1 solid #000",
  },

  salcell: {
    flex: 1,
        fontSize: 12,

    padding: 2,
    textAlign: "right",
    borderLeft: "1 solid #000",
        fontWeight: "bold",
    backgroundColor: "#d8d5d5ff",

  },


 salcolcell: {
    flex: 1,
    padding: 2,
        fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#d8d5d5ff",
    textAlign: "center",
    borderLeft: "1 solid #000",
  },

  colcell: {
    flex: 1,
    padding: 2,
        fontSize: 16,
    fontWeight: "bold",

    textAlign: "center",
    borderLeft: "1 solid #000",
  },
    summarySection: {
    marginTop: 5,
  },
  retenueSection: {
    marginTop: 5,
  },
  retenueRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  retenueItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "33.33%", // 3 items (text + value) per row → 6 columns total
  },
  retenueLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  retenueValue: {
    fontSize: 10,
  },

  summaryRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  bold: {
    fontWeight: "bold",
  },
  footer: {
    textAlign: "left",
    marginTop: 10,
    fontSize: 13,
  },
});


const Fiche = ({
  entreprise ={} ,
    employe = {},
    paie = {},
    lignes = [],
  mois = "",





}) => (

            <PdfErrorBoundary>
      <PDFViewer width="100%" height="100%">

    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== Header ===== */}
    <Text style={styles.republic}>
      الجمهورية الجزائرية الديمقراطية الشعبية
    </Text>
    <Text style={styles.republic1}>
    وزارة الثقافة والسياحة</Text>

<View style={styles.headerSection}>
  {/* Left: Logo */}
 
  {/* Center: Enterprise Info */}
  <View style={styles.headerRight}>
    <Text style={styles.companyname}>ولاية سكيكدة</Text>
    <Text style={styles.companyname}>{entreprise?.designation}</Text>
  </View>

  {/* Right: Title */}
<View style={styles.headerCenter}>
  <View style={styles.outerBox}>
    <View style={styles.innerBox}>
   {mois === '9999' ? (
  <Text style={styles.title}>كشف الراتب المرجعي</Text>
) : (
  <Text style={styles.title}>كشف الراتب لشهر {mois}</Text>
)}
    </View>
  </View>
</View> <View style={styles.headerLeft}>
    <Image src={logo} style={styles.logo} />
  </View>

</View>
        {/* ===== Employee Info ===== */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text>الاسم : {paie?.prenom_ar || ""}</Text>
            <Text>اللقب : {paie?.nom_ar || ""}</Text>
            <Text>ت. التوظيف : {employe?.date_origrecrut || ""}</Text>
            <Text>الجنس : {paie?.gender ==0?"ذكر":"انثى" || ""}</Text>

          </View>

          <View style={styles.row}>
            <Text>ح/ العائلية : {paie?.personell_civilite ==1?"متزوج":paie?.personell_civilite ==0?"أعزب/عزباء":paie?.personell_civilite ==2?"مطلق":"أرمل" || ""}</Text>
            <Text>ع/ الأولاد : {employe?.nbrchild_pay|| 0}       </Text>
            <Text>الوظيفة : {paie?.issup ==1 ? employe?.fonction?.postesup_id?.designation: paie?.gradedesign || " "}</Text>
           <Text>زيادة/ إ : {paie?.issup ==1 ? paie?.indiceposte: "لاشيء" || "لا شيء"}</Text>

          </View>


          <View style={styles.row}>
            <Text>الرتبة : {paie?.gradedesign || ""}</Text>
<Text>الصنف : {employe?.grade?.section || ""}</Text>
 <Text>ن/ الإستدلالية : {paie?.indicebase || ""}</Text>
 <Text>الدرجة : {paie?.degree || ""}</Text>



</View>

          <View style={styles.row}>
            <Text>رقم الحساب  : { employe?.typepaiement=='banque' ? paie?.agencedesign+' '+paie?.fullcompte  : paie?.compteccp || ""}</Text>

          </View>
        </View>


        {/* ===== Salary Details Table ===== */}
        <View style={styles.table}>
<View style={styles.tableHeader}>
  <Text style={[styles.colcell, { flex: 5.1 }]}>عناصر الراتب</Text>
  <Text style={[styles.colcell, { flex: 0.8 }]}>الأساس</Text>
  <Text style={[styles.colcell, { flex: 1.5 , borderRight: "1 solid #000" }]}>المبلغ</Text>
</View>

  <View key={30} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'الأجر الأساسي الشهري'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salbase).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={31} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'تعويض الخبرة المهنية'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.saliep).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>


{lignes?.map((ligne, i) => (
  <View key={i} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ligne.ref}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{ligne.designation}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{ligne.base}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(ligne?.montant).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
))}

  <View key={32} style={styles.tableRow}>
   
    <Text style={[styles.salcolcell, { flex: 5.9 }]}>{'الاجر الخاضع للإشتراك'}</Text>

    <Text style={[styles.salcell, { flex: 1.5, borderRight: "1 solid #000" }]}>{ 
    Number(paie?.salcnas).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
   }</Text>
  </View>
 <View key={33} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'إقتطاع الضمان الإجتماعي 9'} </Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retcnas).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={34} style={styles.tableRow}>
  
    <Text style={[styles.salcolcell, { flex: 5.9 }]}>{'الاجر الخاضع للضريبة'}</Text>

    <Text style={[styles.salcell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salimp).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
 <View key={35} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'إقتطاع الضريبة على الدخل الإجمالي'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retirg).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
 <View key={36} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'إقتطاع التعاضدية'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retmituel).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
{paie.retretraite && parseFloat(paie.retretraite) !== 0 && (

 <View key={37} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'إقتطاع التقاعد المسبق'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retretraite).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
)}


{paie.retsoc && parseFloat(paie.retsoc) !== 0 && (

  <View key={38} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'الخدمات الإجتماعية'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retsoc).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
)}

{paie.retvoit && parseFloat(paie.retvoit) !== 0 && (

 <View key={39} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'إقتطاع السيارة'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retvoit).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
)}

 
 {paie.retabs && parseFloat(paie.retabs) !== 0 && (
  <View key={40} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'الغيابات'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.retabs).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
)}


 
 <View key={41} style={styles.tableRow}>
 
    <Text style={[styles.salcolcell, { flex: 5.9 }]}>{'مجموع الإقتطاعات'}</Text>

    <Text style={[styles.salcell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.totret).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={42} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'منحة الأولاد'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salaf).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={43} style={styles.tableRow}>
    <Text style={[styles.cell, { flex: 2 }]}>{ ' '}</Text>
    <Text style={[styles.cell, { flex: 3 }]}>{'الأجر الوحيد'}</Text>
    <Text style={[styles.cell, { flex: 0.8 }]}>{''}</Text>
    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salunique).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={44} style={styles.tableRow}>

    <Text style={[styles.colcell, {  flex: 5.9 }]}>{'المنح العائلية'}</Text>

    <Text style={[styles.cell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.saltotaf).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>   
  </View>
  <View key={45} style={styles.tableRow}>
   
    <Text style={[styles.salcolcell, { flex: 5.9 }]}>{'الأجر الخام'}</Text>

    <Text style={[styles.salcell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salbrut).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
  <View key={46} style={styles.tableRow}>

    <Text style={[styles.salcolcell, { flex: 5.9 }]}>{'الأجر الصافي للدفع'}</Text>

    <Text style={[styles.salcell, { flex: 1.5, borderRight: "1 solid #000" }]}>{Number(paie?.salnet).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,  
      })
}</Text>
  </View>
 

        </View>

        {/* ===== Summary Section ===== */}

        <Text style={styles.footer}>
          حرر في سكيكدة يوم : {new Date().toLocaleDateString("ar-DZ")}
        </Text>
      </Page>
    </Document>
      </PDFViewer >
          </PdfErrorBoundary>


  );

export default Fiche;
