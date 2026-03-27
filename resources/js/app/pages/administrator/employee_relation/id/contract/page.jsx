import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// 1. Define styles for the contract
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  subtitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  indentText: {
    marginBottom: 10,
    textAlign: 'justify',
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '45%',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%',
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  center: {
    textAlign: 'center',
  }
});

// 2. Create the Document structure
const ContractDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER */}
      <Text style={styles.title}>EMPLOYMENT CONTRACT</Text>
      
      <Text style={styles.text}>
        THIS EMPLOYMENT CONTRACT, is made and entered into on ___ day of ___________, _____, by and between:
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>EmpireOne BPO Solutions Inc.</Text> a corporation organized and existing under the laws of the Republic of the Philippines, with principal office address at EmpireOne Bldg., S. Carmona St., Brgy. VI, San Carlos City, Negros Occidental, represented herein by its Human Resource Lead, Apple Loraine Mag-usara, (hereinafter referred to as the "Employer")
      </Text>
      
      <Text style={[styles.text, styles.center]}>-- and –</Text>
      
      <Text style={styles.text}>
        ____________________________, of legal age, Filipino, and a resident of _______________________________________________ in the Province of __________________, (hereinafter referred to as the "Employee")
      </Text>

      <Text style={[styles.text, styles.bold]}>WITNESSETH:</Text>
      
      <Text style={styles.text}>WHEREAS, EmpireOne BPO Solutions Inc., (the "Company") is engaged in the business of Business Process Outsourcing;</Text>
      <Text style={styles.text}>WHEREAS, the EMPLOYEE has expressed interest in accepting the position and is willing to fulfill the duties and responsibilities associated with the role;</Text>
      <Text style={styles.text}>WHEREAS, the parties agree that the EMPLOYEE shall undergo a probationary period of six (6) months, during which performance and suitability for regular employment will be evaluated;</Text>
      <Text style={styles.text}>WHEREAS, the EMPLOYEE acknowledges the conditions of employment, including the terms and benefits applicable during the probationary period as outlined in this Agreement;</Text>
      
      <Text style={styles.text}>NOW, THEREFORE, for and in consideration of the foregoing premises, the Parties hereby agree as follows:</Text>

      {/* SECTIONS */}
      <Text style={styles.subtitle}>1. Position and Duties</Text>
      <Text style={styles.text}>The Employee shall be employed as a (POSITION) , reporting to Immediate Supervisor. The Employee agrees to faithfully and diligently perform the duties described in Annex A, and any related tasks assigned by the Employer, subject to lawful changes or reassignments based on operational needs.</Text>

      <Text style={styles.subtitle}>2. Term of Employment</Text>
      <Text style={styles.text}>The Employee shall undergo a probationary period of six (6) months, beginning on (Start of Employment) and ending on (179 days after commencement of employment) (the "probationary period"). During this period, the Employee shall be evaluated based on standards made known at the time of engagement, including but not limited to attendance, performance, behavior, suitability for regular employment, communication skills, productivity, and adherence to company and client standards.</Text>
      <Text style={styles.text}>If the Employee meets the company's performance standards and no written notice of termination is issued before the end of the probationary period, the Employee shall be deemed regularized and shall continue in employment under the same terms, subject to company policy and applicable law.</Text>
      <Text style={styles.text}>The Employee is required to comply with the all existing rules, regulations and policies of the Employer as well as those which may hereafter be issued, including but not limited to those governing order and discipline, honesty, safety and security, work assignments and standard operating procedures, use of Company properties and access to matters of confidentiality, and such other rules deemed necessary in the conduct of business.</Text>

      <Text style={styles.subtitle}>3. Compensation and Benefit</Text>
      <Text style={styles.text}>The Employee, during the term of his employment, shall be paid a gross monthly salary of SALARY, PHP 12,000.00 payable in equal semi-monthly installments, subject to applicable statutory deductions. Upon regularization, the Employee will receive the same monthly salary or any adjustment as may be agreed upon. Additionally, the EMPLOYEE will be entitled to full company benefits, including but not limited to the 13th Month Pay, leave credits, and other benefits as may be provided under company policy and applicable laws.</Text>

      {/* ... Add remaining text sections (4 through 14) following the same pattern ... */}
      <Text style={styles.subtitle}>4. Pre-Employment Requirements</Text>
      <Text style={styles.text}>The Employee must submit the medical examination results prior to the start of employment, as a priority, while all other required pre-employment documents shall be submitted within one (1) month from the commencement of employment. Failure to comply with this requirement within the stipulated period shall constitute grounds for non-regularization.</Text>

      <Text style={styles.subtitle}>5. Training Cost Reimbursement</Text>
      <Text style={styles.text}>In consideration of the Employer's investment in the onboarding, training, and development of the Employee, the Employee agrees that if they resign without just cause during the probationary period, the Employer shall have the right to recover actual and reasonable costs in the amount which shall not exceed Ten Thousand Pesos (PHP 10,000), supported by documentation.</Text>

      {/* SIGNATURE BLOCK */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.text}>IN WITNESS WHEREOF the parties hereto have caused this agreement to be executed as of the ___ day of __________ 2026.</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.signatureBlock}>
          <Text style={[styles.text, styles.bold]}>EMPLOYEE</Text>
          <View style={[styles.line, { marginTop: 30 }]}></View>
          <Text style={styles.text}>EMPLOYEE NAME</Text>
        </View>

        <View style={styles.signatureBlock}>
          <Text style={[styles.text, styles.bold]}>EMPLOYER</Text>
          <View style={[styles.line, { marginTop: 30 }]}></View>
          <Text style={[styles.text, styles.bold]}>APPLE LORAINE MAG-USARA</Text>
          <Text style={styles.text}>HR LEAD</Text>
        </View>
      </View>

    </Page>
    
    {/* PAGE 2 - ACKNOWLEDGEMENT */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>ACKNOWLEDGEMENT</Text>
      
      <Text style={styles.text}>REPUBLIC OF THE PHILIPPINES)</Text>
      <Text style={styles.text}>San Carlos City ) S.S.</Text>
      
      <Text style={{ marginTop: 20, marginBottom: 20 }}>BEFORE ME, a Notary Public for San Carlos City, on this ___ day of _________ 202__ personally appeared:</Text>

      <View style={{ flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, paddingBottom: 5 }}>
        <Text style={{ width: '33%', fontFamily: 'Helvetica-Bold' }}>NAME</Text>
        <Text style={{ width: '33%', fontFamily: 'Helvetica-Bold' }}>ID NO.</Text>
        <Text style={{ width: '33%', fontFamily: 'Helvetica-Bold' }}>DATE AND PLACE ISSUED/EXPIRY</Text>
      </View>
      
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Text style={{ width: '33%' }}>____________________</Text>
        <Text style={{ width: '33%' }}>____________________</Text>
        <Text style={{ width: '33%' }}>____________________</Text>
      </View>

      <Text style={styles.text}>known to me to be the persons who executed the foregoing document and acknowledged to me that the same is their free and voluntary act and deed.</Text>
      
      <Text style={styles.text}>This instrument, which refers to an Employment Contract, consisting of seven (7) pages, including the page whereon this Acknowledgement is written, is signed by the parties and their instrumental witnesses on each and every page thereof.</Text>

      <Text style={{ marginTop: 20 }}>WITNESS MY HAND AND SEAL this _____________________ at ____________________, Philippines.</Text>

      <Text style={{ marginTop: 40 }}>Doc.No. ____;</Text>
      <Text>Page No. ____;</Text>
      <Text>Book No. ____;</Text>
      <Text>Series of 2026</Text>
    </Page>
  </Document>
);

// 3. Render the Document to the DOM
export default function PageComponent() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
        <ContractDocument />
      </PDFViewer>
    </div>
  );
}