
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 60,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica Neue',
    fontSize: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  headerLogo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150, // Adjust as needed
    height: 'auto',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  },
  italic: {
    fontStyle: 'italic',
  },
  indented1: {
    marginLeft: 20,
    marginBottom: 4,
  },
  indented2: {
    marginLeft: 40,
    marginBottom: 4,
  },
  indented3: {
    marginLeft: 60,
    marginBottom: 4,
  },
  indented4: {
    marginLeft: 80,
    marginBottom: 4,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    width: '100%',
  },
  listPrefix: {
    width: 30, // Prefix width
    textAlign: 'right',
    paddingRight: 5,
    fontSize: 10,
  },
  listBody: {
    flex: 1,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  horizontalRule: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginVertical: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  disclaimerText: {
    fontSize: 8,
    textAlign: 'left',
    lineHeight: 1.3,
    paddingRight: 40, // Space for the rule line
  },
  disclaimerLabel: {
    fontWeight: 'bold',
    fontSize: 8,
    marginBottom: 2,
  },
  signatureContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  signatureItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signatureLabel: {
    width: 150,
  },
  signatureLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginLeft: 10,
    paddingBottom: 2,
  },
});

// A wrapper to place the disclaimer on every page
const DisclaimerFooter = () => (
  <View style={styles.footerContainer}>
    <View style={styles.disclaimerText}>
      <Text style={styles.disclaimerLabel}>Disclaimer:</Text>
      <Text style={styles.italic}>
        This document and its contents are the property of EmpireOne BPO Solutions Inc. and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.
      </Text>
    </View>
  </View>
);

const ConfidentialityAndNonCompetitionAgreementSection = () => (
  <Document>
    {/* Page 1 (image_3.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        {/* Placeholder for actual logo - you would replace this with an Image component */}
        {/* <Image style={styles.logo} src="/path/to/logo.png" /> */}
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <Text style={styles.mainTitle}>CONFIDENTIALITY AND NON-COMPETITION AGREEMENT</Text>

      <Text style={styles.paragraph}>
        This agreement (the <Text style={styles.bold}>"Agreement"</Text>) is made and entered into by and between <Text style={styles.bold}>EmpireOne BPO Solutions Inc.</Text> on behalf of itself, its affiliates, and subsidiaries (collectively, the "Company"), with headquarters at 250 Consumers Rd., Suite 810, Toronto Ontario M2J 46V; and S. Carmona St., Brgy. VI, San Carlos City, Negros Occidental, 6127 and <Text style={styles.underline}>{'\u00A0'.repeat(40)}</Text> (the "Employee").
      </Text>

      <View style={styles.indented1}>
        <Text style={styles.paragraph}>
          WHEREAS, the Company desires to employ the Employee, to assist in the successful operation of the Company’s business; and
        </Text>
        <Text style={styles.paragraph}>
          WHEREAS, the Employee desires to be employed by the Company and will abide by all terms and conditions of this Agreement as a condition of such employment.
        </Text>
      </View>

      <Text style={styles.paragraph}>
        Terms and Conditions
      </Text>

      {/* Numbered List Section 1 */}
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>1.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Protection of Confidential Information and Trade Secrets:</Text>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>a.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Definition of “Confidential Information.” Confidential Information means all nonpublic information (in whatever form) relating to or arising from EmpireOne BPO Solutions Inc., EmpireOne BPO Solutions Inc. in connection with its business, together with any analyses, records or data generated from such information and material’ information concerning the manner and details of EmpireOne BPO Solutions Inc.’s operation, organization and management; financial information and/or documents and nonpublic policies, procedures and other printed, written or electronic material generated or used in connection with EmpireOne BPO Solutions Inc.’s business; EmpireOne BPO Solutions Inc.’s business plans and strategies; and identities of EmpireOne BPO Solutions Inc.’s customers and the specific individual customer representatives that whom EmpireOne BPO Solutions Inc.’s works; the detail of EmpireOne BPO Solutions Inc.’s relationship with such customers and customer representatives; the identities of distributors, contractors, and vendors utilized in ‘s business; the details of EmpireOne BPO Solutions Inc.’s relationships with such distributors, contractors, and vendors; the nature of fees and charges made to EmpireOne BPO Solutions Inc.’s customers, nonpublic forms, contracts and other documents used in EmpireOne BPO Solutions Inc.’s business; and information concerning ‘s employees, agents and contractors, including without limitation such persons; compensation, benefits, skills, abilities, experience, knowledge and forthcomings, if any; the nature and content of computer software used in EmpireOne BPO Solutions Inc.’s business, whether proprietary to EmpireOne BPO Solutions Inc. or used by EmpireOne BPO Solutions Inc.’s concepts, prospects, customers, employees, agents, contractors, earnings, products, services, equipment, systems, and/or prospective and executed contracts and other business arrangements.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.horizontalRule} />

      <View style={styles.indented2}>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>b.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Employee’s Use of Confidential Information. Except in connection with and in furtherance of the Employee’s work on EmpireOne BPO Solutions Inc.’s behalf. Employees shall not, without EmpireOne BPO Solutions Inc.’s prior written consent, during the course of and subsequent to Employee’s employment with EmpireOne BPO Solutions Inc, directly or indirectly: (i) use any Confidential Information for any purpose; or (ii) disclosure or otherwise communicate any Confidential Information to any person or entity, including future employers or those owners engaging Employee in an independent contractor relationship; or (iii) accept or participate in any employment, consulting engagement or another business opportunity that may or inevitably will result
            </Text>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 2 (image_4.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <Text style={styles.paragraph}>
          in the disclosure or use of any confidential Information.
        </Text>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>c.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Acknowledgements. Employee acknowledges that (i) during Employee’s employment with EmpireOne BPO Solutions Inc., Employee will have access to Confidential Information, all of which shall be made accessible to Employee only in strict confidence; (ii) unauthorized disclosure of Confidential Information will damage EmpireOne BPO Solutions Inc.’s business; (iii) Confidential Information would be susceptible to immediate competitive application by competitor of EmpireOne BPO Solutions Inc'; (iv) EmpireOne BPO Solutions Inc.’s business is substantially dependent on access and the continuing secrecy of Confidential Information; (v) Confidential Information is novel/unique to Confidential Information and known only to Employee, EmpireOne BPO Solutions Inc and certain key employees and contractors of EmpireOne BPO Solutions Inc.; (vi) EmpireOne BPO Solutions Inc shall at all times retain ownership and control of a Confidential Information; and (vii) the restrictions contained in this Agreement are reasonable and necessary for the protection of EmpireOne BPO Solutions Inc.’s legitimate business interests.
            </Text>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 3 (image_5.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>d.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Records Containing Confidential Information. “Confidential Record” means all documents and other records, whether in paper, electronic or other form, that contain or reflect any confidential information. All confidential Information Records prepared by and provided to Employees are and shall remain EmpireOne BPO Solutions Inc.’s property. Expect with EmpireOne BPO Solutions Inc.’s prior written consent, Employee shall not, at any time, directly or indirectly: (i) copy or use any Confidential Record for any purpose not relating directly to Employee’s work on EmpireOne BPO Solutions Inc.’s behalf; or (ii) show, give, sell, disclose or otherwise communicate any Confidential Record the contents of any Confidential Record to any person or entity other than EmpireOne BPO Solutions Inc. or person or entity authorized by EmpireOne BPO Solutions Inc. to have access to the Confidential Record in question. Upon termination of the employee's employment with EmpireOne BPO Solutions Inc., or otherwise, upon EmpireOne BPO Solutions Inc.’s request, Employee shall immediately deliver to EmpireOne BPO Solutions Inc. or its designee (and shall not keep in Employee's possession or deliver to any other person or entity) Confidential Records and all other EmpireOne BPO Solutions Inc. property in Employee's possession or control. Employee understands and agrees that compliance with this paragraph may require that data be removed from Employee's personal computer equipment. Consequently, upon reasonable prior notice, Employee agrees to permit the qualified personnel of EmpireOne BPO Solutions Inc. and/or its contractor’s access to such computer equipment to remove such information or confirm removal thereof.
            </Text>
            <Text style={styles.indented3}>
              <Text style={styles.paragraph}>
                This agreement shall not prohibit Employee from complying with any subpoena or court order, provided that Employee shall at the earliest practicable date provide a copy of the subpoena or court order to EmpireOne BPO Solutions Inc.’s General Counsel, it being the parties’ intention to give EmpireOne BPO Solutions Inc. a fair opportunity to take appropriate steps to prevent the necessary and/or Confidential Records, determined by EmpireOne BPO Solutions Inc. in its sole discretion.
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>e.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Third Parties’ Confidential Information. Employee acknowledges that EmpireOne BPO Solutions Inc. has received and in the future will receive from third party’ s confidential proprietary information, and that EmpireOne BPO Solutions Inc. must maintain the confidentiality of such information and use it only for authorized purposes. Employees shall not use or disclose such third parties’ confidential or proprietary
            </Text>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 4 (image_6.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <Text style={styles.paragraph}>
          information except as authorized by EmpireOne BPO Solutions Inc.
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>2.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Unfair Competition</Text>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>a.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Covenant against Disclosure of Confidential Information. During Employee’s employment with EmpireOne BPO Solutions Inc. and for a period of 12 months following termination of Employee’s employment (the “Noncompetition Period), Employee shall not, directly or indirectly, as an officer, director, employee, consultant, owner, shareholder, adviser, joint venture, or otherwise, compete with EmpireOne BPO Solutions Inc. anywhere in the world (the “Protected Region”) in: (i) EmpireOne BPO Solutions Inc.’s core business. Which consists of providing customer care and support services, on an outsourcing basis or under facilities management agreement, which services include, without limitation, technical help desk support, pre and post-sale education and support, sales and order taking, order provisioning and/or tracking, activating product or services upgrades, and responding to customer requests for information; or (ii) any other line of business in which EmpireOne BPO Solutions Inc. was engaged at any time during Employee’s employment with EmpireOne BPO Solutions Inc.; or (iii) any other line of business into which EmpireOne BPO Solutions Inc., during Employee’s employment with EmpireOne BPO Solutions Inc., formed an intention to enter during the Noncompetition Period, and which EmpireOne BPO Solutions Inc. has disclosed to Employee in writing within ten (10) days following the termination of Employee’s employment with EmpireOne BPO Solutions Inc.
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>b.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Acknowledgements. Employee acknowledges that the foregoing geographic restriction in competition is fair and reasonable, given the nature and geographic scope of EmpireOne BPO Solutions Inc.’s business operations, the investment of capital and resources by EmpireOne BPO Solutions Inc. to develop its business operations, - and the nature of Employee's position will be access to substantial and unique trade information that would be valuable or useful. EmpireOne BPO Solutions Inc.’s competitors and that Employee will also have access to EmpireOne BPO Solutions Inc.’s valuable customer relationships, and therefore acknowledges the foregoing restrictions of Employee's future employment and business activities are fair and reasonable. Employee acknowledges and is prepared for the possibility that Employee’s standard of living may be reduced during the Noncompetition Period, assumes and accepts any risk associated with that possibility, and further acknowledges that any such drop in Employee’s standard of living does not constitute under hardship.
              </Text>
              <Text style={styles.paragraph}>
                The employee voluntarily accepts the terms of this Agreement and acknowledges that the Agreement is a contract for the protection of trade and secrets and is intended to protect confidential Information and Confidential Records.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>3.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Non-Solicitation.</Text>
          <Text style={styles.paragraph}>
            During Employee’s employment with EmpireOne BPO Solutions Inc. and for the period of twelve (12) months following termination of Employee’s full-time active employment (the “Non-Solicitation Period”), Employee shall not without EmpireOne BPO Solutions Inc.’s prior written consent directly or indirectly:
          </Text>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 5 (image_7.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>a.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Cause or attempt to cause employee, agent, or contractor of EmpireOne BPO Solutions Inc. affiliate to terminate his or her employment, agency or contractual relationship with EmpireOne BPO Solutions Inc. affiliate; or interfere or attempt to interfere with the relationship between EmpireOne BPO Solutions Inc. and any employee, agent or contractor; or hire any employee, agent or contractor of EmpireOne BPO Solutions Inc. affiliate; or conduct the business of any kind with any EmpireOne BPO Solutions Inc. employee, agent or contractor; or
            </Text>
          </View>
        </View>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>b.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Solicit business form or conduct business with any customer or client served by EmpireOne BPO Solutions Inc. at any point during Employee’s employment with EmpireOne BPO Solutions Inc.; or solicit business from or conduct any business with any person or entity that was, during Employee’s employment with EmpireOne BPO Solutions Inc., solicited or identified as a business prospect by Employee or any other EmpireOne BPO Solutions Inc. employee; agent or consultant; or interfere or attempt to interfere with a transaction, agreement, prospective agreement, business opportunity or business relationship in which EmpireOne BPO Solutions Inc. or any affiliate was involved at any point during Employee’s employment with EmpireOne BPO Solutions Inc..
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>4.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Inventions.</Text>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>a.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Definition of EmpireOne BPO Solutions Inc. Inventions. “EmpireOne BPO Solutions Inc. Inventions” means ideas, processes, trademarks and service marks, inventions, discoveries, and improvement to any of the foregoing, that Employee learns of, conceives, develops or creates alone or with others during Employee’s employment with EmpireOne BPO Solutions Inc. (whether or not conceived, developed or created during regular working hours) that directly or indirectly arise from or relate to: (i) EmpireOne BPO Solutions Inc.’s business, products or services; or (ii) worked or performed for EmpireOne BPO Solutions Inc. by Employee or any other EmpireOne BPO Solutions Inc. employee, agent or contractor; or (iii) the use of EmpireOne BPO Solutions Inc.’s property, time; or (iv) access to EmpireOne BPO Solutions Inc.’s Confidential Information and/or Confidential Records.
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>b.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Disclosure of EmpireOne BPO Solutions Inc. Inventions. Upon EmpireOne BPO Solutions Inc.’s request, employees shall promptly disclose to EmpireOne BPO Solutions Inc. or its designee, in a manner specified by EmpireOne BPO Solutions Inc. in its sole discretion, all EmpireOne BPO Solutions Inc. Inventions of which Employee has the knowledge, irrespective of whether that knowledge is complete or incomplete, and irrespective of whether any such EmpireOne BPO Solutions Inc. Invention or any aspect thereof has been described in or committed to writing, in whole or part, by any other person.
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>c.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Assignment. Employee hereby assigns to EmpireOne BPO Solutions Inc. the Employee’s entire right to all EmpireOne BPO Solutions Inc. Inventions, which shall be the sole and exclusive property of EmpireOne BPO Solutions Inc., whether or not the same is subject to patent, copyright, trademark or trade secrets protection. Employee also acknowledges that copyright and/or patent to all original works of authorship or inventorship, that are made by Employee (solely or jointly with others) in the course of Employee’s employment with EmpireOne BPO Solutions Inc. and resulting from the Employee's performance of his regularly-assigned duties, belongs to EmpireOne BPO Solutions Inc.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 6 (image_8.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <Text style={styles.paragraph}>
          To the extent that copyright and/or patent to all original works of authorship or inventorship, that are made by Employee (solely or jointly with others) in the course of Employee’s employment with EmpireOne BPO Solutions Inc., cannot, by operation of law be deemed “works made for ire” and the copyright and the patent of which belongs to Employee, Employee hereby irrevocably assigns all of is right, title, and interest in and to such works and to any related intellectual property rights thereto to EmpireOne BPO Solutions Inc.
        </Text>
        <View style={styles.listItemContainer}>
          <Text style={styles.listPrefix}>d.</Text>
          <View style={styles.listBody}>
            <Text style={styles.paragraph}>
              Additional Instruments. Employees shall promptly execute and acknowledge and deliver to EmpireOne BPO Solutions Inc. all additional instruments or documents deemed at any time by EmpireOne BPO Solutions Inc. in its sole discretion to be necessary to carry out the intentions of Section of this Agreement. If EmpireOne BPO Solutions Inc. is unable, after reasonable effort, to secure an Employee signature on any document needed to apply for or prosecute any patent, copyright, or other right or protection relating to EmpireOne BPO Solutions Inc. Invention, Employee hereby designates and appoints EmpireOne BPO Solutions Inc. and its duly authorized officers and agents as Employee’s agent and attorney-in-fact, to act for on Employee's behalf to execute, verify and file any such applications and to do all other lawfully permitted acts to further the prosecution and issuance of patents, copyrights and other rights and protection thereon with the same legal force and effect as if executed by him. Such appointment shall be irrevocable and coupled with an interest.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>5.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Intellectual Property Rights.</Text>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>a.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Any Developments made, conceived, discovered or reduced to practice by Employee, (whether alone or jointly with others), during the Employment Term shall immediately be assigned to, and shall become the sole and absolute property of, EmpireOne BPO Solutions Inc. and its assignees. For purposes of this Agreement, a <Text style={styles.italic}>"Development"</Text> shall mean any invention, modification, discovery design, development, improvement, process, software program, work of authorship, documentation, formula, data, technique, know-how, trade secret or intellectual property right whatsoever and any and all interest therein and benefits thereof (whether or not patentable or registerable under copyright or similar statutes or subject to analogous protections) that (i) relate to the business of the EmpireOne BPO Solutions Inc. or any of the products or services being developed, manufactured or sold by EmpireOne BPO Solutions Inc. or which may be used in relation therewith, (ii) results from tasks which Employee is responsible for performing during the course of employment with EmpireOne BPO Solutions Inc. or which may be used in relation therewith, or (iii) results from the use of premises or personal property (whether tangible or intangible) owned, leased or contracted for by EmpireOne BPO Solutions Inc.
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>b.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Employees shall promptly disclose to EmpireOne BPO Solutions Inc. (or any persons designated by it) any Development that Employee makes, conceives, discovers or reduces to practice (whether alone or jointly with others) during the Employment Term. EmpireOne BPO Solutions Inc. shall keep all such disclosures in confidence.
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer}>
            <Text style={styles.listPrefix}>c.</Text>
            <View style={styles.listBody}>
              <Text style={styles.paragraph}>
                Employee hereby assigns to EmpireOne BPO Solutions Inc., its successors, and assigns, without further compensation, any and all rights to Developments made, conceived, discovered, or reduced to practice by Employee, (whether alone or
              </Text>
            </View>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 7 (image_9.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented2}>
        <Text style={styles.paragraph}>
          jointly with others), during the Employment Term including, without limitation, any such rights arising during or related to my employment by EmpireOne BPO Solutions Inc.’s predecessors. Employee agrees to communicate to EmpireOne BPO Solutions Inc., without cost or delay, and without publishing the same, all available information relating to any such Development.
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>6.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Survival.</Text>
          <View style={styles.indented2}>
            <Text style={styles.paragraph}>
              Employee obligations under this Agreement shall survive the termination of Employee’s employment with EmpireOne BPO Solutions Inc. and shall thereafter be enforceable whether or not such termination is claimed or found to be illegal under the Labor Code of the Philippines.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>7.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Remedies.</Text>
          <View style={styles.indented2}>
            <Text style={styles.paragraph}>
              Employee acknowledges that if Employee breaches any obligation under this Agreement, EmpireOne BPO Solutions Inc. will suffer immediate and irreparable harm and damage for which money alone cannot fully compensate EmpireOne BPO Solutions Inc… Employee, therefore, agrees that upon such breach or threatened breach of any obligation under this Agreement, EmpireOne BPO Solutions Inc. shall be entitled to a temporary restraining order, preliminary injunction, permanent injunction or other injunctive relief issued by a court of competent jurisdiction, without posting any bond or other security, barring Employee from further violating such provision. This paragraph shall not be construed as an election of any remedy, or a waiver of any right to seek damages from the employee for a breach of any provision of this
            </Text>
            <Text style={styles.paragraph}>
              The agreement, nor shall this paragraph be construed to limit the rights or remedies available under applicable law for any violation of any provision of the Agreement.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>8.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Other agreements.</Text>
          <View style={styles.indented2}>
            <Text style={styles.paragraph}>
              In the event of any direct conflict between any terms of this{'\u00A0'.repeat(10)}Agreement and any term of any agreement executed by the Employee, the terms of this Agreement shall control. If an Employee signs or signs any other agreement(s) relating to arising from Employee’s employment with EmpireOne BPO Solutions Inc., all provisions of such Agreement shall not be affected, modified or superseded by this Agreement, but rather shall remain fully enforceable according to their terms.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>9.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Miscellaneous.</Text>
          <View style={styles.indented2}>
            <Text style={styles.paragraph}>
              (a) Heirs and Assigns. This Agreement shall be binding up Employee’s heirs, executors, administrators, or other legal representatives, shall inure to the benefit of EmpireOne BPO Solutions Inc., its successors or assigns, and shall be freely assignable by EmpireOne BPO Solutions Inc. its sole discretion, at any time; (b) Governing Law. This Agreement and all other disputes, and issues arising from or relating in any way to EmpireOne BPO Solutions Inc.’s relationship with the Employee, shall be governed by the laws of the Philippines, irrespective of the choice of law rules of a jurisdiction. (c) Severability. If any court of competent jurisdiction declares any provision of this Agreement invalid or enforceable, the remainder of the Agreement shall remain fully enforceable. To the extent that any court concludes that any provision of this Agreement is void or voidable, the court
            </Text>
          </View>
        </View>
      </View>
      <DisclaimerFooter />
    </Page>

    {/* Page 8 (image_10.png) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.headerLogo}>
        <Text style={{ ...styles.logo, fontSize: 30, fontWeight: 'bold' }}>EMPIREONE</Text>
      </View>
      <View style={styles.indented3}>
        <Text style={styles.paragraph}>
          shall reform such provision(s) to render provision(s) enforceable, but only to the extent absolutely necessary to render the provision(s) enforceable and only in view of the parties’ express desire that EmpireOne BPO Solutions Inc. be protected to the greatest extent allowed by law from unfair competition and/or the misuse or disclosure of Confidential Records, Confidential Information and/or EmpireOne BPO Solutions Inc. Inventions. (d) Disputes. Any action arising from or relating in any way to this Agreement shall be tried only in the courts situated in the Philippines. The parties consent to jurisdiction and venue in those courts to the greatest extent allowed by law. The party that substantially prevails in an action to enforce any provision of this Agreement shall recover all costs and attorneys’ fees incurred in connection with the action.
        </Text>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>10.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Governing Law.</Text>
          <View style={styles.indented2}>
            <Text style={styles.paragraph}>
              This Agreement shall be governed by and construed in accordance with the laws of the Republic of the Philippines. In the event of any court action to enforce any provision of this Agreement EmpireOne BPO Solutions Inc. and Employee consent to the jurisdiction of the Philippines Supreme Court and all other applicable jurisdictional courts of where EmpireOne BPO Solutions Inc. is located. Accordingly, with respect to any such court action, EmpireOne BPO Solutions Inc. and Employee
            </Text>
          </View>
          <Text style={styles.paragraph}>
            (a) submit to the personal jurisdiction of such courts; (b) consent to service of process; and (c) waive any other requirement (whether imposed by statute, rule of court, or otherwise) with respect to venue, personal jurisdiction, or service of process.
          </Text>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>11.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Severability.</Text>
          <Text style={styles.paragraph}>
            Each paragraph and provision of this Agreement is severable from the contract and if one provision thereof is declared invalid, the remaining provisions shall nevertheless remain in full force and effect. Further, the invalid provision or part shall remain enforceable to the extent permitted by law. For the avoidance of doubt, if one or more of the provisions contained in this Agreement shall for any reason be held to be excessively broad as to scope, activity or subject so as to be unenforceable at law, such provision or provisions shall be construed by the appropriate judicial body by limiting and reducing it or them, so as to be enforceable to the maximum extent compatible with the applicable law as it shall then appear.
          </Text>
        </View>
      </View>
      <View style={styles.listItemContainer}>
        <Text style={{ ...styles.listPrefix, ...styles.bold }}>12.</Text>
        <View style={styles.listBody}>
          <Text style={{ ...styles.paragraph, ...styles.bold }}>Waiver.</Text>
          <Text style={styles.paragraph}>
            Any waiver by EmpireOne BPO Solutions Inc. of a breach of any provision of this Agreement shall not operate or be construed as a waiver of any subsequent breach of such provision or any other provision hereof.
          </Text>
        </View>
      </View>
      
      {/* Signature Section */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureItem}>
          <Text style={styles.signatureLine}>{'\u00A0'.repeat(80)}</Text>
        </View>
        <View style={styles.signatureItem}>
          <Text style={{ ...styles.signatureLabel, ...styles.bold }}>Complete Name & Signature</Text>
        </View>
        <View style={styles.signatureItem}>
          <Text style={{ ...styles.signatureLabel, ...styles.bold }}>Date:</Text>
        </View>
      </View>
      
      <DisclaimerFooter />
    </Page>
  </Document>
);

export default ConfidentialityAndNonCompetitionAgreementSection;