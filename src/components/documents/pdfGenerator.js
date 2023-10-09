import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";

import Html from "react-pdf-html";

const html = `<style>
  .alt-graph .parent {
    margin-top: 150px;
    padding: 0;
    width: 441px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .alt-graph .parent .child {
    margin-left: 50px;
    position: relative;
  }
  .circle {
    width: 10px;
    height: 10px;
    border: 1px solid grey;
    border-radius: 50%;
    background: white;
  }
  .line {
    height: 1px;
    width: 50px;
    background: grey;
    position: absolute;
    left: 100%;
    top: 50%;
  }
  .rectangle {
    height: 80px;
    background: blue;
    width: 10px;
    position: absolute;
    bottom: 20%;
    left: 10%;
    z-index: -1;
  }
  .my-heading4 {
    background: darkgreen;
    color: white;
  }
  .histogram-wrapper {
    width: 380px;
  } 
  </style>

  `;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
  },

  section: {
    // marginTop: 20,
    // marginBottom: 30,
    textAlign: "center",
  },
  text: {
    display: "inline",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 20,
    left: "20%",
    color: "grey",
  },
  parent: {
    marginTop: 150,
    padding: 0,
    height: 200,
    // display: "block",
    display: "flex",
  },

  child: {
    margin: 0,
    padding: 0,
    display: "block",
    marginLeft: 50,
    position: "relative",
  },
  circle: {
    width: 10,
    height: 10,
    border: "1 solid grey",
    borderRadius: "50%",
    backgroundColor: "white",
  },

  line: {
    height: 1,
    width: 50,
    backgroundColor: "grey",
    position: "absolute",
    left: 2,
    top: 2,
    zIndex: -1,
  },

  rectangle: {
    height: 80,
    backgroundColor: "blue",
    width: 10,
    position: "absolute",
    bottom: "20%",
    left: "0%",
    zIndex: "-1",
  },
  signedDiv: {
    marginTop: "50px",
    fontSize: "14px",
    color: "#1e1e1e60",
  },

  signedView: {
    border: "1px",
    background: "#1e1e1e",
    padding: "4px",
    borderRadius: "10px",
    height: "40px",
  },

  signedAcc: {
    color: "black",
    fontSize: "16px",
    border: "1 solid grey",
    textDecoration: "none",
    display: "block",
    padding: "40px",
    borderRadius: "20px",
    backgroundColor: "lightgray",
  },

  adminDetails: {
    marginTop: "50px",
  },

  eachLine: {
    marginTop: "10px",
    fontSize: "14px",
    letterSpacing: ".6px",
  },

  headerLine: {
    marginTop: "20px",
    marginBottom: "4px",
    fontSize: "14px",
  },

  simpleLine: {
    fontSize: "14px",
    letterSpacing: ".6px",
  },

  viewFlex: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: "10px",
    fontSize: "14px",
    letterSpacing: ".6px",
  },

  minWidth: {
    width: "150px",
  },
});

export const PdfFile = ({
  title,
  signedAcc,
  signedHash,
  admin_name,
  LLC_name,
  email,
  location,
  general_purpose,
  member_email,
  member_name,
  admin_sign,
  member_address,
  member_contactNo,
  member_nominationName,
  member_witnessName,
  admin_address,
}) => {
  return (
    <Document>
      <Page style={styles.page} wrap>
        <Html>{html}</Html>

        <View>
          <View
            style={{
              marginTop: "50px",
            }}>
            <Text
              style={{
                marginBottom: "4px",
                fontSize: "16px",
              }}>
              {LLC_name},{/* {LLC_name} */}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}>
              A DELAWARE LIMITED LIABILITY COMPANY
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION DOCUMENTS</Text>
            <Text style={styles.simpleLine}>
              [Note to User: You acknowledge and agree that the making available
              of this document to you by StationX.network (DAOVERSE LLC) shall
              not create any confidential or special relationship between you
              and StationX.network (DAOVERSE LLC) or its affiliates
              (collectively, “StationX”) and does not constitute the provision
              of legal advice or other professional advice by StationX or its
              legal counsel. You should seek advice from an attorney licensed in
              the relevant jurisdiction(s), as well as a tax professional,
              before relying on this template document.
            </Text>

            <Text style={styles.eachLine}>
              Additionally, the information provided in this document does not
              constitute tax advice. Any discussion of tax matters is not
              intended or written to be used, and cannot be used, for the
              purpose of avoiding penalties under the Internal Revenue Code (or
              equivalent in the relevant jurisdiction) or promoting, marketing
              or recommending to another party any transaction or matter.
            </Text>

            <Text style={styles.eachLine}>
              You further agree and acknowledge that this document has not been
              prepared with your specific circumstances in mind, may not be
              suitable for use in your business, and does not constitute legal
              or tax advice. Relying on this document, you assume all risk and
              liability that may result.
            </Text>
            <Text style={styles.eachLine}>
              Review all documents carefully for accuracy before using them.
              There may be BRACKETED TEXT requiring your attention.
            </Text>
            <Text style={styles.eachLine}>
              STATIONX PROVIDES THESE TERMS ON AN “AS IS” BASIS, AND
              SPECIFICALLY DISCLAIMS ALL WARRANTIES, TERMS, REPRESENTATIONS AND
              CONDITIONS WHETHER EXPRESS, IMPLIED, OR STATUTORY, AND INCLUDING
              ANY WARRANTIES, TERMS, REPRESENTATIONS AND CONDITIONS OF
              MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, OR NONINFRINGEMENT.]
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION INSTRUCTIONS</Text>
            <Text style={styles.simpleLine}>
              Prior to subscribing to {LLC_name} (the “Vehicle”), prospective
              members (“Subscribers”) should read: (i) the Limited Liability
              Company Agreement of {LLC_name} (as amended, restated,
              supplemented or otherwise modified from time to time, collectively
              the “Operating Agreement”); and (ii) these subscription documents
              (the “Subscription Documents”, which shall include the
              Subscription Agreement, exhibits, and any documents incorporated
              by reference). The Subscriber must also provide all of the
              applicable information and documents and execute the signature
              page outlined in the checklist below. Capitalized words that are
              used but not defined in this Agreement have the meaning given them
              in the Operating Agreement.{" "}
            </Text>
            <Text style={styles.headerLine}>
              SUBSCRIPTION DOCUMENTS CHECKLIST
            </Text>
            <Text style={styles.simpleLine}>
              - Complete and sign the Subscription Agreement (including
              additional representation page, if applicable).
            </Text>
            <Text style={styles.simpleLine}>
              - Review and sign the Operating Agreement Signature Page.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete Exhibit A (Subscriber Information), and provide any
              documentation requested therein.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete Exhibit B (Accredited Investor Status), and provide any
              documentation requested therein.
            </Text>
            <Text style={styles.simpleLine}>
              - Complete and sign the applicable IRS Form:
            </Text>
            <Text style={styles.simpleLine}>
              {"     "}- W-9 (for Subscribers who are U.S. persons)
            </Text>
            <Text style={styles.simpleLine}>
              {"     "}- W-8BEN (for Individual Subscribers who are not U.S.
              persons)
            </Text>
            <Text style={styles.simpleLine}>
              The Administrative Member may request additional documents it
              deems as necessary from any Subscriber.
            </Text>

            <Text style={styles.headerLine}>{LLC_name}</Text>
            <Text style={styles.simpleLine}>Email: {email}</Text>

            <Text
              style={{
                fontSize: "14px",
                marginTop: "10px",
                letterSpacing: ".6px",
              }}>
              After notification from the Administrative Member that the
              subscription has been accepted, the Subscriber must send his or
              her subscription amount by wire transfer or as digital assets.
              Digital asset wallets and wire transfer information will be
              provided separately by the Administrative Member.
            </Text>
            <Text
              style={{
                fontSize: "14px",
                marginTop: "10px",
                letterSpacing: ".6px",
              }}>
              Upon acceptance of the subscription, a copy of the executed
              Subscription Documents, signed as accepted on behalf of the
              Vehicle, will be returned to Subscriber.
            </Text>

            <Text style={styles.headerLine}>SUBSCRIPTION AGREEMENT</Text>
            <Text
              style={{
                fontSize: "14px",
                marginTop: "10px",
                letterSpacing: ".6px",
              }}>
              This Subscription Agreement (this “Agreement”) is entered into by
              and between {LLC_name} (the “Vehicle”), a Delaware Limited
              Liability Company / a Series of {LLC_name}, a Delaware Limited
              Liability Company (the &ldquo;Master LLC&ldquo;), and the
              undersigned party as Subscriber (the “Subscriber”), effective as
              of the date set forth on the Acceptance of Subscription page of
              this Agreement. Capitalized words that are used but not defined in
              this Agreement have the meaning given them in the Limited
              Liability Company Agreement of the [Vehicle / Master LLC, together
              with each applicable Series Addenda for the Vehicle] (as amended,
              restated, supplemented or otherwise modified from time to time,
              the “Operating Agreement”). In consideration of the mutual
              covenants set forth in this Agreement and for other good and
              valuable consideration, the receipt and sufficiency of which are
              hereby acknowledged, the Subscriber and the Vehicle hereby agree
              as follows:
            </Text>
            <Text style={styles.eachLine}>1. Subscription. </Text>
            <Text style={styles.eachLine}>
              (a) Subject to the terms and conditions of this Agreement, the
              Subscriber hereby irrevocably tenders this subscription (this
              “Subscription”) for an interest in the Vehicle (an “Interest”) in
              the amount set forth on the “Subscription Amount” line (the
              “Subscription Amount”) on the Subscriber’s applicable signature
              page hereto (the “Signature Page”).
            </Text>
            <Text style={styles.eachLine}>
              (b) This Subscription, when and if accepted by the Administrative
              Member of the Vehicle, will constitute a commitment to contribute
              to the Vehicle that portion of the Subscription Amount accepted by
              the Administrative Member. The Subscriber will be admitted as a
              Member in the Vehicle at the time this Subscription is accepted by
              the Administrative Member pursuant to the terms of Section1(c)
              below, and the Subscriber hereby irrevocably agrees to be bound by
              the Operating Agreement as a Member of the Vehicle and to perform
              all obligations contained in the Operating Agreement applicable to
              him or her, including making contributions to the Vehicle. This
              Agreement will become irrevocable with respect to the Subscriber
              at the time of its submission to the Vehicle and may not be
              withdrawn by the Subscriber unless the Administrative Member
              rejects this Subscription.
            </Text>
            <Text style={styles.eachLine}>
              (c) The Administrative Member, on behalf of the Vehicle, may
              accept or reject this Subscription, in whole or in part, in its
              sole discretion. This Subscription will be deemed to be accepted
              by the Administrative Member and this Agreement will be binding
              against the Administrative Member only upon execution and delivery
              to the Subscriber of the Acceptance of Subscription attached to
              this Agreement. At the Closing, the Administrative Member will
              execute the Acceptance of Subscription and deliver notice of the
              Closing to the Subscriber within a reasonable time after the
              Closing. Upon acceptance, the Subscriber will be issued the
              Interest for which it has subscribed. Failure to deliver
              fully-completed and executed Subscription Documents, of which this
              Agreement is a part, may result in the Vehicle rejecting this
              Subscription.
            </Text>
            <Text style={styles.eachLine}>
              (d) The Vehicle has the unrestricted right to condition its
              acceptance of the Subscriber’s Subscription, in whole or in part,
              upon the receipt by the Vehicle of any additional instruments
              (including any designations, representations, warranties, or
              covenants), documentation and information requested by the Vehicle
              in its sole discretion, including an opinion of counsel to the
              Subscriber, evidencing the legality of an investment in the
              Vehicle by the Subscriber and the authority of the person
              executing this Agreement on behalf of the Subscriber (collectively
              the “Additional Documents”), in addition to these Subscription
              Documents.
            </Text>
            <Text style={styles.eachLine}>
              (e) The Subscriber understands that the Vehicle has entered into
              or expects to enter into separate subscription agreements with
              other members which are or will be substantially similar in all
              material respects to this Agreement providing for the admission of
              such other members as Members in the Vehicle. This Agreement and
              other separate subscription agreements are separate agreements and
              the sale arrangements between the Vehicle and other members are
              separate sales. The Subscriber also acknowledges and agrees that
              the Administrative Member may enter into side letters with certain
              Members (which may include the Subscriber) which contain terms
              different from those in this Agreement or amend and supplement
              certain provisions of the Operating Agreement as it applies to
              such Members. In the event of any inconsistency between the terms
              of this Agreement and the terms of any side letter, the terms of
              the side letter shall control.
            </Text>

            <Text style={styles.simpleLine}>
              2. Representations and Warranties of the Subscriber.
            </Text>
            <Text style={styles.eachLine}>
              The Subscriber hereby represents and warrants to the Vehicle as of
              the date of this Agreement and as of the date of any Capital
              Contribution to the Vehicle (and the Subscriber agrees to notify
              the Vehicle in writing immediately if any changes in the
              information set forth in this Agreement occur):
            </Text>
            <Text style={styles.eachLine}>
              (a) The Subscriber has completed Exhibit B indicating if and how
              the Subscriber qualifies as an “Accredited Investor” within the
              meaning of Rule 501 of Regulation D under the Securities Act of
              1933, as amended (the “Securities Act”).
            </Text>
            <Text style={styles.eachLine}>
              (b) The Subscriber has not reproduced, duplicated, or delivered
              the Operating Agreement or this Agreement to any other person,
              except professional advisers to the Subscriber or as instructed by
              the Administrative Member. Notwithstanding the foregoing, the
              Subscriber (and each employee, representative or other agent of
              the Subscriber) may disclose to any and all persons, without
              limitation of any kind, the tax treatment and tax structure of (i)
              the Vehicle and (ii) any of its transactions, and all materials of
              any kind (including opinions or other tax analyses) that are
              provided to the Subscriber relating to such tax treatment and tax
              structure.
            </Text>
            <Text style={styles.eachLine}>
              (c) The Subscriber (either alone or with the Subscriber’s
              professional advisers who are unaffiliated with the Vehicle, the
              Administrative Member, or its affiliates) has such knowledge and
              experience in financial and business matters that the Subscriber
              is capable of evaluating the merits and risks of membership in the
              Vehicle.
            </Text>
            <Text style={styles.eachLine}>
              (d) All questions of the Subscriber related to the Subscriber’s
              membership in the Vehicle have been answered to the full
              satisfaction of the Subscriber and the Subscriber has received all
              the information the Subscriber considers necessary or appropriate
              for deciding whether to purchase the Interest. (b) The Subscriber
              has not reproduced, duplicated, or delivered the Operating
              Agreement or this Agreement to any other person, except
              professional advisers to the Subscriber or as instructed by the
              Administrative Member. Notwithstanding the foregoing, the
              Subscriber (and each employee, representative or other agent of
              the Subscriber) may disclose to any and all persons, without
              limitation of any kind, the tax treatment and tax structure of (i)
              the Vehicle and (ii) any of its transactions, and all materials of
              any kind (including opinions or other tax analyses) that are
              provided to the Subscriber relating to such tax treatment and tax
              structure.
            </Text>
            <Text style={styles.eachLine}>
              (e) Upon acceptance of the Subscription by the Vehicle, this
              Agreement and the Operating Agreement will each constitute a valid
              and legally binding obligation of the Subscriber, enforceable in
              accordance with its terms except to the extent limited by
              applicable bankruptcy, insolvency, reorganization or other laws
              affecting the enforcement of creditors’ rights generally and by
              principles of equity.
            </Text>
            <Text style={styles.eachLine}>
              (f) The Subscriber (i) is a natural person, (ii) has full legal
              capacity to execute and deliver this Agreement and to perform the
              Subscriber’s obligations in this Agreement and (iii) is a bona
              fide resident of the state of residence set forth on Exhibit A and
              has no present intention of becoming a resident of any other state
              or jurisdiction.
            </Text>
            <Text style={styles.eachLine}>
              (g) Other than as set forth in this Agreement or in the Operating
              Agreement (and any separate agreement in writing with the Vehicle
              executed in conjunction with the Subscriber’s Subscription), the
              Subscriber is not relying upon any information, representation or
              warranty by the Vehicle, the Administrative Member, or any of
              their respective agents or representatives in determining to
              subscribe to the Vehicle. The Subscriber has consulted, to the
              extent deemed appropriate by the Subscriber, with the Subscriber’s
              own advisers as to the financial, tax, legal and other matters
              concerning the Vehicle and on that basis and the basis of its own
              independent investigations, without the assistance of the Vehicle,
              the Administrative Member, or any of their respective agents or
              representatives, believes that an investment in the Vehicle is
              suitable and appropriate for the Subscriber. Subscriber hereby
              represents and warrants that it has had the opportunity to have
              its own independent legal counsel review and approve all of the
              legal documents executed in connection with its Subscription.
            </Text>
            <Text style={styles.eachLine}>
              (h) The Subscriber understands and acknowledges that (i) any
              description of the Vehicle’s business and prospects given to the
              Subscriber is not necessarily exhaustive, (ii) all estimates,
              projections and forward-looking statements were based assumptions,
              estimates or projections at the time they were made, there is no
              guarantee that such assumptions, estimates or projections were at
              the time or remain reasonable and whether or not the estimates,
              projections or forward-looking statements will materialize depends
              upon many factors that are out of the control of the Vehicle and
              (iii) there is no assurance that any projections, estimates or
              forward-looking statements will be attained. .
            </Text>
            <Text style={styles.eachLine}>
              (i) The Subscriber’s information provided in this Agreement
              (including the exhibits hereto) is complete and accurate and may
              be relied upon by the Vehicle and the Administrative Member.
              Additionally, by executing the Agreement, the Subscriber
              acknowledges and agrees that any identifying information or
              documentation regarding the Subscriber and/or its suitability to
              invest in the Vehicle that was furnished by the Subscriber to the
              Administrative Member, whether in connection with this
              Subscription or previously, may be made available to
              Administrative Member, remains true and correct in all respects
              and may, at the discretion of the Administrative Member, be
              incorporated by reference herein (collectively, “Supporting
              Documents”).
            </Text>
            <Text style={styles.eachLine}>
              (j) Neither this Subscription nor any of the Subscriber’s Capital
              Contributions do or will directly or indirectly contravene
              applicable laws and regulations, including anti-money-laundering
              laws and regulations. The Subscriber understands and agrees that
              the Vehicle may undertake any actions that the Vehicle deems
              necessary or appropriate to ensure compliance with applicable
              laws, rules and regulations regarding money laundering or
              terrorism. In furtherance of those efforts, the Subscriber hereby
              represents, covenants, and agrees that, to the best of the
              Subscriber’s knowledge based on reasonable investigation:
            </Text>
            <Text style={styles.eachLine}>
              (i) None of the Subscriber’s Capital Contributions to the Vehicle
              (whether payable in cash or otherwise) will be derived from money
              laundering or similar activities deemed illegal under federal laws
              and regulations.
            </Text>
            <Text style={styles.eachLine}>
              (ii) To the extent within the Subscriber’s control, none of the
              Subscriber’s Capital Contributions to the Vehicle will cause the
              Vehicle or any of its personnel to be in violation of federal
              anti-money laundering laws, including without limitation the Bank
              Secrecy Act (31 U.S.C. 5311 et seq.), the United States Money
              Laundering Control Act of 1986 or the International Money
              Laundering Abatement and Anti-Terrorist Financing Act of 2001, and
              any regulations promulgated thereunder.
            </Text>
            <Text style={styles.eachLine}>
              (iii) The Subscriber acknowledges that due to anti-money
              laundering requirements operating in the United States, as well as
              the Vehicle’s own internal anti-money laundering policies, the
              Vehicle and the Administrative Member may require further
              identification of the Subscriber and the source of its Capital
              Contribution before these Subscription Documents can be processed,
              Capital Contributions can be accepted, or distributions can be
              made. When requested by the Administrative Member, the Subscriber
              will provide any and all additional information, and the
              Subscriber understands and agrees that the Administrative Member
              may release confidential information about the Subscriber or
              persons related to Subscriber if the Administrative Member has
              determined that the release is necessary to ensure compliance with
              all applicable laws and regulations concerning money laundering
              and similar activities.
            </Text>
            <Text style={styles.eachLine}>
              (k) Except as otherwise disclosed in writing to the Administrative
              Member, the Subscriber represents and warrants that neither it nor
              any person or entity controlled by, controlling or under common
              control with the Subscriber nor any person having a beneficial or
              economic interest in the Subscriber or the Subscriber’s assets nor
              (without limiting the Subscriber’s representations in Section 9
              below) for whom the Subscriber is acting as agent or nominee in
              connection with this investment, is:
            </Text>
            <Text style={styles.eachLine}>(i) a Prohibited Investor;</Text>
            <Text style={styles.eachLine}>
              (ii) a Senior Foreign Political Figure, any member of a Senior
              Foreign Political Figure’s “immediate family,” which includes the
              figure’s parents, siblings, spouse, children and in-laws, or any
              Close Associate of a Senior Foreign Political Figure, or a person
              or entity resident in, or organized or chartered under, the laws
              of a Non-Cooperative Jurisdiction;
            </Text>
            <Text style={styles.eachLine}>
              (iii) a person or entity resident in, or organized or chartered
              under, the laws of a jurisdiction that has been designated by the
              U.S. Secretary of the Treasury under Section 311 or 312 of the USA
              PATRIOT Act as warranting special measures due to money laundering
              concerns; or
            </Text>
            <Text style={styles.eachLine}>
              (iv) a person or entity who gives the Subscriber reason to believe
              that its funds originate from, or will be or have been routed
              through, an account maintained at a Foreign Shell Bank, an
              “offshore bank,” or a bank organized or chartered under the laws
              of a Non-Cooperative Jurisdiction.
            </Text>
            <Text style={styles.eachLine}>
              (l) The Subscriber understands the rights, obligations and
              restrictions of Members, including that withdrawals of capital
              from the Vehicle and transfers of interests in the Vehicle by
              Members are limited by the terms of the Operating Agreement.
            </Text>
            <Text style={styles.eachLine}>
              (m) The Subscriber understands the meaning and legal consequences
              of the representations and warranties made by the Subscriber in
              these Subscription Documents and the Operating Agreement, and that
              the Administrative Member is relying on those representations and
              warranties in making its determination to accept or reject this
              Subscription. The Subscriber represents and warrants that the
              information contained in this Agreement and in the Subscription
              Documents is true and correct as of the date hereof and shall be
              deemed repeated and reaffirmed by the Subscriber as of each date
              that it makes a Capital Contribution to the Vehicle and agrees to
              notify immediately the Administrative Member of any changes in
              such information (or, if there have been any changes in the
              information provided to the Vehicle by the Subscriber in the
              Subscription Documents since the date the Subscription Documents
              were furnished, the Subscriber has advised the Vehicle in writing
              of such changes). The Subscriber hereby agrees to indemnify and
              hold harmless the Vehicle and each member thereof from and against
              any and all losses, damages, expenses, liabilities or reasonable
              attorneys’ fees (including attorneys’ fees and expenses incurred
              in a securities or other action in which no judgment in favor of
              the Subscriber is rendered) due to or arising out of a breach of
              any representation or warranty of the Subscriber, whether
              contained in the Operating Agreement, this Subscription Agreement
              or the Subscription Documents. Notwithstanding any of the
              representations, warranties, acknowledgments or agreements made in
              this Subscription Agreement and in the Subscription Documents by
              the Subscriber, the Subscriber does not thereby or in any other
              manner waive any rights granted to the Subscriber under federal or
              state securities law.
            </Text>
            <Text style={styles.eachLine}>
              (n) The Subscriber understands the risks involved with acquiring
              an interest in the Vehicle, understands the business of the
              Vehicle, has thoroughly read and understands all the provisions of
              the Operating Agreement and can withstand a total loss of its
              Capital Contributions to the Vehicle.
            </Text>
            <Text style={styles.eachLine}>
              (o) The Subscriber understands that the use of a limited liability
              company with protected or registered Series (a &ldquo;Series
              LLC&ldquo;) has not yet been widely adopted and is subject to
              various legal uncertainties, including, without limitation,
              uncertainties relating to:
            </Text>
            <Text style={styles.eachLine}>
              (i) the potential non-recognition of the separate and segregated
              assets and liabilities of a Series in jurisdictions that do not
              have statutes permitting the establishment of a Series LLC;
            </Text>
            <Text style={styles.eachLine}>
              (ii) the risk of non-compliance with statutory requirements that
              must be met in order to maintain the separate liability and assets
              of a Series in Delaware or any applicable state even if that state
              otherwise recognizes or permits the establishment of a Series LLC;
            </Text>
            <Text style={styles.eachLine}>
              (iii) the novelty and lack of established precedent regarding
              Series LLCs and the potential for liability zzzspill-overzzz risks
              between a Series and the Series LLC or another Series;
            </Text>
            <Text style={styles.eachLine}>
              (iv) the lack of legal and regulatory clarity regarding the
              taxation of a Series and a Series LLC at both the federal and
              state level; and
            </Text>
            <Text style={styles.eachLine}>
              (v) the lack of legal and regulatory clarity regarding the
              treatment of a Series and a Series LLC in bankruptcy proceedings
              under federal law.
            </Text>
            <Text style={styles.simpleLine}>
              3. Liability. The Subscriber agrees that neither the Vehicle, the
              Administrative Member, nor any of their respective affiliates, nor
              their respective managers, officers, directors, members, equity
              holders, employees or other applicable representatives
              (collectively, the “Covered Persons”), will incur any liability
              (a) in respect of any action taken upon any information provided
              to the Vehicle by the Subscriber (including any Supporting
              Documents or Additional Documents) or for relying on any notice,
              consent, request, instructions or other instrument believed, in
              good faith, to be genuine or to be signed by properly authorized
              persons on behalf of the Subscriber, including any document
              transmitted by email or other electronic delivery or (b) for
              adhering to applicable anti-money laundering obligations whether
              now or later comes into effect.
            </Text>
            <Text style={styles.eachLine}>
              4. Power of Attorney. The Subscriber hereby irrevocably makes,
              constitutes and appoints the Administrative Member its true and
              lawful agent and attorney-in-fact, with full power of substitution
              and full power and authority in the name, place, and stead of the
              Subscriber, to make, execute, sign, swear to, acknowledge and
              record and file in all necessary or appropriate places all
              documents relating to the Vehicle and its activities, including,
              but not limited to: (a) the Operating Agreement and any amendment
              to the Operating Agreement that has been adopted as provided in
              the Operating Agreement; (b) a Certificate of Formation of the
              Vehicle and all amendments required or permitted by law or the
              provisions of the Operating Agreement; (c) any applications,
              forms, certificates, reports, or other documents that may be
              requested or required by any federal, state, or local governmental
              agency, securities exchange, securities association,
              self-regulatory organization, or similar institution and that are
              deemed necessary or advisable by the Administrative Member; (d)
              any other instrument that may be required to be filed or recorded
              in any state or county or by any governmental agency, or that the
              Administrative Member deems advisable to file or record,
              including, without limitation, applications for foreign
              qualification and certificates of assumed name; (e) any documents
              that may be required to effect the continuation of the Vehicle,
              the admission of additional Members, the admission of substitute
              Members, or the dissolution or termination of the Vehicle,
              provided such continuation, admission, dissolution or termination
              are in accordance with the terms of the Operating Agreement; (f)
              to make certain elections contained in the Internal Revenue Code
              (the “Code”) or state law governing taxation of limited liability
              companies; and (g) to perform any and all other ministerial duties
              or functions necessary for the conduct of the business of the
              Vehicle. Notwithstanding the foregoing, the Administrative Member
              may not exercise this power of attorney with respect to matters as
              to which the Operating Agreement requires the consent of the
              Members until such consent has been received. The foregoing power
              of attorney is coupled with an interest, is irrevocable and will
              survive the subsequent death or disability of the Subscriber or
              any subsequent power of attorney executed by the Subscriber and is
              coupled with an interest, is irrevocable and will survive the
              subsequent death or disability of the Subscriber or any subsequent
              power of attorney executed by the Subscriber. The Subscriber must
              execute and deliver to the Administrative Member within 5 business
              days after receipt of the Administrative Member’s request, any
              further designations, powers-of-attorney and other instruments as
              the Administrative Member reasonably deems necessary to carry out
              the terms of this Agreement.
            </Text>
            <Text style={styles.eachLine}>5. Dispute Resolution.</Text>
            <Text style={styles.eachLine}>
              Notwithstanding anything to the contrary in this Agreement or the
              Operating Agreement, and except for any claim or action that
              Administrative Member or the Vehicle may elect to commence to
              enforce any of its rights or the Subscriber’s obligations under
              this Agreement or the Operating Agreement, the Subscriber agrees
              that all disputes arising out of (i) this Agreement, (ii) the
              Vehicle’s offering of the Interest, (iii) the Subscriber’s
              Subscription for the Interest and (iv) the Subscriber’s rights and
              obligations under the Operating Agreement will be settled by
              binding arbitration, before three arbitrators, administered by the
              American Arbitration Association under and in accordance with its
              Commercial Arbitration Rules. The decision of the arbitrators
              shall be non-appealable, binding and conclusive upon all parties
              thereto and judgment on the award rendered by the arbitrators may
              be entered in any court having jurisdiction. The location of the
              arbitration will be Singapore. Each of the parties will equally
              bear any arbitration fees and administrative costs associated with
              the arbitration. The prevailing party, as determined by the
              arbitrators, will be awarded its costs and reasonable attorneys’
              fees incurred in connection with the arbitration. Each party
              hereby irrevocably and unconditionally submits, for itself and its
              property, to the exclusive jurisdiction of any courts located in
              the Arbitration Location, for recognition or enforcement of any
              award determined pursuant to this Section 5.
            </Text>
            <Text style={styles.simpleLine}>
              NOTICE: By becoming a party to this Agreement and the Operating
              Agreement, each party is agreeing to have all disputes, claims or
              controversies arising out of or relating to this Agreement and the
              Operating Agreement decided by neutral binding arbitration, and is
              giving up any rights it might possess to have those matters
              litigated in a court or jury trial. By becoming a party to this
              Agreement and the Operating Agreement, each party is giving up its
              judicial rights to discovery and appeal except to the extent that
              they are specifically provided for under this Agreement and the
              Operating Agreement. If any party refuses to submit to arbitration
              after agreeing to this provision, that party may be compelled to
              arbitrate under federal or state law. By becoming a party to this
              Agreement and the Operating Agreement, each party confirms that
              its agreement to this arbitration provision is voluntary.
            </Text>
            <Text style={styles.simpleLine}>
              6. Waiver; Conflict of Interest. The Subscriber acknowledges and
              agrees that the Members (including the Administrative Member), and
              their affiliates will be subject to various conflicts of interest
              in carrying out responsibilities with respect to the Vehicle.
              Affiliates of Members may also be in competition with the Vehicle
              or its investments. Other vehicles may be formed in the future
              with objectives that are the same as or similar to the Vehicle’s
              objectives. Each Subscriber hereby waives any such conflicts by
              executing this Agreement.
            </Text>
            <Text style={styles.simpleLine}>
              7. Confidentiality. The Subscriber must keep confidential, and not
              make use of or disclose to any person (other than for purposes
              reasonably related to its Interest or as required by law), any
              information or matter received from or relating to the Vehicle;
              provided, that the Subscriber may disclose any such information to
              the extent that such information (i) is or becomes generally
              available to the public through no act or omission of the
              Subscriber, (ii) was already in the possession of the Subscriber
              at the time of such disclosure or (iii) is communicated to the
              Subscriber by a third party without violation of confidentiality
              obligations.
            </Text>
            <Text style={styles.simpleLine}>
              8. USA PATRIOT Act. To comply with applicable laws, rules and
              regulations designed to combat money laundering or terrorism, the
              Subscriber must provide the information on Exhibit C of this
              Agreement.
            </Text>
            <Text style={styles.simpleLine}>
              9. Beneficial Ownership. The Subscriber represents and warrants
              that it is subscribing for Interests for Subscriber’s own account
              and own risk. The Subscriber also represents that it does not have
              the intention or obligation to sell, distribute, or transfer its
              Interests or any portion of Interests, directly or indirectly, to
              any other person or entity or to any nominee account.
            </Text>
            <Text style={styles.eachLine}>
              The Subscriber represents and warrants that the Subscriber is not
              acting as trustee, custodian, agent, representative or nominee for
              (or with respect to) another person or entity (howsoever
              characterized and regardless of whether such person or entity is
              deemed to have a property interest, or the like, with respect to
              the Interests under local law). The Subscriber further represents
              and warrants that the Subscriber will comply, in all respects,
              with the requirements of applicable anti-money laundering laws and
              regulations.
            </Text>
            <Text style={styles.simpleLine}>
              10. Subscriber’s Sophistication. In view of the fact that
              Subscriber is sophisticated, has had access to information
              sufficient to make an investment decision and has conducted his or
              her own due diligence, and has made its investment decision
              without reliance on (a) the Administrative Member, (b) any
              material information the Administrative Member may have about the
              Portfolio Company Securities and Portfolio Company, or (c) any
              disclosures of non-public information that may have been made to
              the Administrative Member (or that the Administrative Member may
              have independently obtained), and further in view of all of the
              representations Subscriber has made in Section 2, Subscriber
              hereby irrevocably: (i) waives any right to any and all actions,
              suits, proceedings, investigations, claims or liabilities of any
              nature, including but not limited to actions under Rule 10b-5 of
              the Securities Exchange Act of 1934 or similar laws (collectively
              “Claims”) that may arise from or relate to the possession of or
              failure to disclose non-public information, (ii) releases any
              Claims against the Covered Persons, and (iii) agrees to refrain
              from pursuing against any Claims against those parties
            </Text>
            <Text style={styles.simpleLine}>
              11. Survival. The representations, warranties and agreements
              contained in this Agreement will survive the execution of this
              Agreement by the Subscriber and acceptance of the Subscription by
              the Vehicle.
            </Text>
            <Text style={styles.simpleLine}>
              12. Additional Information. The Subscriber agrees that, upon
              demand, it will promptly furnish any information, and execute and
              deliver such documents, as reasonably required by the
              Administrative Member and furnish any information relating to the
              Subscriber’s relationship with the Vehicle as required by
              governmental agencies having jurisdiction over the Vehicle and/or
              the Administrative Member.
            </Text>
            <Text style={styles.simpleLine}>
              13. Assignment and Successors. This Agreement may be assigned by
              the Subscriber only with the prior written consent of the Vehicle
              in accordance with Article VIII and Article 14.13 of the Operating
              Agreement. Subject to the foregoing, this Agreement (including the
              provisions of Section 5) will be binding on the respective
              successors, assigns, heirs and legal representatives of the
              parties to this Agreement.
            </Text>
            <Text style={styles.simpleLine}>
              14. No Third-Party Beneficiaries. This Agreement does not confer
              any rights or remedies upon any person, other than the Parties to
              the Operating Agreement and this Agreement.
            </Text>
            <Text style={styles.simpleLine}>
              15. Amendment; Waiver. This Agreement may not be amended other
              than by written consent of the Subscriber and the Vehicle. No
              provision in this Agreement may be waived other than in a writing
              signed by the waiving party. Unless expressly provided otherwise,
              no waiver will constitute an ongoing or future waiver of any
              provision of this Agreement.
            </Text>
            <Text style={styles.simpleLine}>
              16. Governing Law. This Agreement is governed by and will be
              construed in accordance with the laws of the State of Delaware,
              without regard to conflict of laws principles. For the purpose of
              any judicial proceeding to enforce an award or incidental to
              arbitration or to compel arbitration, the Subscriber and the
              Vehicle hereby submit to the non-exclusive jurisdiction of the
              courts located in Singapore, and agree that service of process in
              such arbitration or court proceedings will be satisfactorily made
              upon it if sent by registered mail addressed to it at the address
              set forth on the Subscriber Information page.
            </Text>
            <Text style={styles.simpleLine}>
              17. Entire Agreement. This Agreement, the Operating Agreement and
              any side letter entered into between the Administrative Member
              and/or the Vehicle and the Subscriber, and all of the exhibits and
              appendices attached to those agreements, constitutes the entire
              agreement and understanding between the parties with respect to
              the subject matter those agreements and supersedes any prior
              written or oral agreements or understandings of the Parties.
            </Text>
            <Text style={styles.simpleLine}>18. Notice.</Text>
            <Text style={styles.eachLine}>
              (a) Each Member hereby acknowledges that the Administrative Member
              will be entitled to transmit to that Member exclusively by email
              (or other means of electronic messaging) all notices,
              correspondence and reports, including, but not limited to, that
              Member’s Schedule K-1s.
            </Text>
            <Text style={styles.eachLine}>
              (b) Each notice or other communication to the Administrative
              Member or the Vehicle will for purposes of this Agreement be
              treated as effective or having been given upon the earlier of (i)
              receipt, (ii) the date transmitted by email, with evidence of
              transmission from the transmitting device, (iii) acknowledged
              receipt, (iv) when delivered in person, (v) when sent by
              electronic facsimile transfer or electronic mail at the number or
              address set forth below and receipt is acknowledged by the
              Administrative Member, (vi) one business day after having been
              dispatched by a nationally recognized overnight courier service if
              receipt is evidenced by a signature of a person regularly employed
              or residing at the address set forth below for that Party or (vii)
              three business days after being sent by registered or certified
              mail, return receipt requested, postage prepaid.
            </Text>
            <Text style={styles.simpleLine}>
              19. Severability. If any provision of this Agreement is held by
              applicable authority to be unlawful, void or unenforceable to any
              extent, such provision, to the extent necessary, will be severed
              from this Agreement and the remainder of this Agreement will not
              be affected by the removal of that provision and will continue in
              full force and effect.
            </Text>
            <Text style={styles.simpleLine}>
              20. Copies and Counterparts. Copies of signatures to this
              Agreement will be valid, binding and effective as original
              signatures for all purposes under this Agreement. This Agreement
              may be executed in any number of counterparts, each of which will
              be an original but all of which taken together will constitute one
              agreement.
            </Text>
            <Text style={styles.simpleLine}>
              21. Electronic Delivery of Disclosures and Schedule K-1. The
              Subscriber understands that the Vehicle and the Administrative
              Member expect to deliver tax return information, including
              Schedule K-1s (each, a “K-1”) to the Subscriber by either
              electronic mail, a posting to a Subscriber-accessible platform, or
              some other form of electronic delivery. Pursuant to IRS Rev. Proc.
              2012-17 (Feb. 13, 2012), the Subscriber hereby expressly
              understands, consents to, and acknowledges such electronic
              delivery of tax returns and related information. Federal law
              prohibits the Vehicle, the Administrative Member, or their
              affiliates and designees from disclosing, without consent,
              subscriber’s tax return information to third parties or use of
              that information for purposes other than the preparation of
              subscriber’s tax return. As part of subscription to this offering,
              the Vehicle, the Administrative Member, or their designees may
              disclose subscriber’s income tax return information to certain
              other affiliated entities or third-party service providers for tax
              return preparation and data aggregation purposes. The Vehicle and
              its designees covenant they will keep and maintain subscriber’s
              information in strict confidence, using such degree of care as is
              appropriate to avoid unauthorized access, use or disclosure, and
              will not use such information in violation of law. In executing
              this Agreement, subscriber authorizes the Vehicle or the
              Administrative Member to disclose tax return information to
              various service providers, their respective successors, affiliates
              and, or such other third-party service providers as subscriber may
              request or as may be required by the Vehicle or the Administrative
              Member for purposes of completing tax return preparation and K-1
              delivery pursuant to this agreement.
            </Text>
            <Text style={styles.eachLine}>
              (a) The Subscriber’s consent to electronic delivery will apply to
              all future K-1s unless such consent is withdrawn by the
              Subscriber.
            </Text>
            <Text style={styles.eachLine}>
              (b) If for any reason the Subscriber would like a paper copy of
              the K-1 after the Subscriber has consented to electronic delivery,
              the Subscriber may submit a request to the Administrative Member.
              Requesting a paper copy of the Subscriber’s K-1 will not be
              treated as a withdrawal of consent.
            </Text>
            <Text style={styles.eachLine}>
              (c) If the Subscriber in the future determines that it no longer
              consents to electronic delivery, the Subscriber will need to
              notify the Vehicle so that it can arrange for a paper K-1 to be
              delivered to the address that the Vehicle then currently has on
              file. The Subscriber may submit notice to the Administrative
              Member. The Subscriber’s consent is considered withdrawn on the
              date the Vehicle receives the written request to withdraw consent.
              The Vehicle will confirm the withdrawal and its effective date in
              writing. A withdrawal of consent does not apply to a K-1 that was
              emailed to the Subscriber before the effective date of the
              withdrawal of consent.
            </Text>
            <Text style={styles.eachLine}>
              (d) The Vehicle (or the Administrative Member) will cease
              providing statements to the Subscriber electronically if the
              Subscriber provides notice to withdraw consent, if the Subscriber
              ceases to be a Member of the Vehicle, or if regulations change to
              prohibit the form of delivery.
            </Text>
            <Text style={styles.eachLine}>
              (e) If the Subscriber needs to update the Subscriber’s contact
              information that is on file, please email the update to the
              Administrative Member. The Subscriber will be notified if there
              are any changes to the contact information of the Vehicle.
            </Text>
            <Text style={styles.eachLine}>
              (f) The Subscriber’s K-1 may be required to be printed and
              attached to a federal, state, or local income tax return.
            </Text>
            <Text style={styles.eachLine}>
              22. Elections and Audits. The Subscriber covenants and agrees to
              take any action reasonably requested by the Vehicle in connection
              with an election by the Vehicle under Section 6221(b) or 6226 of
              the Code or an audit or a final adjustment of the Vehicle by a
              taxing authority (including, without limitation, promptly filing
              amended tax returns and promptly paying any related taxes,
              including penalties and interest). Without limiting the generality
              of the foregoing, the Subscriber covenants and agrees, if
              applicable, to take into account and report to the IRS any
              adjustment to its items for any reviewed year as notified to them
              by the Vehicle in a statement, in the manner provided in Section
              6226(b), whether or not such Subscriber owns any Interests in the
              Vehicle in the year of the Vehicle’s statement. Any Subscriber
              that fails to report its share of such adjustments on its U.S. tax
              return for its taxable year including the date of the Vehicle’s
              statement as described immediately above shall indemnify and hold
              harmless the Vehicle, the Administrative Member, and each of their
              Affiliates from and against any and all liabilities related to
              taxes (including penalties and interest) imposed on the Vehicle as
              a result of the Subscriber’s inaction. In addition, each
              Subscriber covenant and agrees to indemnify and hold harmless the
              Vehicle, the Administrative Member, and each of their affiliates
              from and against any and all liabilities related to taxes
              (including penalties and interest) imposed on the Vehicle (i)
              pursuant to Section 6221 of the Code, which liabilities relate to
              adjustments that would have been made to the tax items allocated
              to such Subscriber had such adjustments been made for a tax year
              beginning prior to January 1, 2018 (and assuming that the Vehicle
              had not made an election to have Section 6221 of the Code as
              amended by P.L. 114-74 apply for such earlier tax years) and (ii)
              resulting from or attributable to such Subscriber’s failure to
              comply with certain of its covenants contained in the Operating
              Agreement.
            </Text>
            <Text style={styles.eachLine}>
              23. U.S. Foreign Account Tax Compliance Act. The Subscriber
              covenants that it (i) will provide any form, certification or
              other information reasonably requested by and acceptable to the
              Vehicle that is necessary for the Vehicle (A) to prevent
              withholding or qualify for a reduced rate of withholding or backup
              withholding in any jurisdiction from or through which the Vehicle
              receives payments or (B) to satisfy reporting or other obligations
              under the Code and the Treasury Regulations; (ii) will update or
              replace such form, certification or other information in
              accordance with its terms or subsequent amendments; and (iii) will
              otherwise comply with any reporting obligations imposed by the
              United States or any other jurisdiction, including reporting
              obligations that may be imposed by future legislation. The
              Subscriber understands and acknowledges that if Subscriber fails
              to provide any such form, certification or other information as
              requested, Subscriber would be subject to a withholding tax and
              the Administrative Member may take any action in relation to
              Subscriber’s Interest or withdrawal proceeds to ensure that such
              withholding is economically borne by Subscriber.
            </Text>
            <Text style={styles.simpleLine}>
              BY SIGNING THIS AGREEMENT, THE SUBSCRIBER:
            </Text>
            <Text style={styles.eachLine}>
              1. ACKNOWLEDGES THAT ANY MISSTATEMENT MAY RESULT IN A FORCED SALE
              OF SUBSCRIBER’S INTERESTS.
            </Text>
            <Text style={styles.eachLine}>
              2. AGREES THAT IF THE VEHICLE BELIEVES THAT SUBSCRIBER’S
              REPRESENTATION IN SECTION 2(K) IS NO LONGER CORRECT, THE VEHICLE
              MAY BE OBLIGATED TO FREEZE SUBSCRIBER’S INVESTMENT, DECLINE TO
              MAKE DISTRIBUTIONS OR SEGREGATE THE ASSETS CONSTITUTING
              SUBSCRIBER’S INVESTMENT WITH THE VEHICLE IN ACCORDANCE WITH
              APPLICABLE LAW.
            </Text>
            <Text style={styles.simpleLine}>(Signature Follow)</Text>
            <Text style={styles.simpleLine}>INDIVIDUALS</Text>
            <Text style={styles.simpleLine}>
              IN WITNESS WHEREOF, the Subscriber hereby executes this Agreement
              as of the date set forth below.
            </Text>
            <Text style={styles.eachLine}>
              {admin_name}, in its capacity as Administrative Member, and for
              and on behalf of {LLC_name}
            </Text>
            <Text style={styles.eachLine}>
              Wallet Address : {admin_address ?? signedAcc}
            </Text>
            <Text wrap style={styles.eachLine}>
              Signature : {admin_sign ?? signedHash}
            </Text>
            <Text style={styles.eachLine}>Name: {admin_name}</Text>
            <Text style={styles.eachLine}>Title: Administrative Member</Text>

            {member_name && (
              <View>
                <Text style={styles.headerLine} break>
                  Subscriber Info{" "}
                </Text>

                <View
                  wrap={true}
                  style={{
                    backgroundColor: "#DCDCDC",
                    padding: "20px",
                    border: "1px solid #000",
                  }}>
                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Name of subscriber: </Text>
                    <Text>{member_name}</Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Registered Address: </Text>
                    <Text wrap={true}>{member_address}</Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Email Address: </Text>
                    <Text>{member_email}</Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Contact No: </Text>
                    <Text>{member_contactNo ? member_contactNo : "N/A"}</Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Nomination Name: </Text>
                    <Text>
                      {member_nominationName ? member_nominationName : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Witness Name: </Text>
                    <Text>
                      {member_witnessName ? member_witnessName : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Wallet Address: </Text>
                    <Text style={{}}>{signedAcc}</Text>
                  </View>

                  <View style={styles.viewFlex}>
                    <Text style={styles.minWidth}>Signature: </Text>
                    <Text
                      wrap={true}
                      style={{
                        maxWidth: "200px",
                      }}>
                      {signedHash}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

const PDFView = ({
  signedAcc,
  signedHash,
  location,
  email,
  admin_name,
  LLC_name,
  general_purpose,
  member_name,
  member_email,
  amount,
  admin_sign,
  admin_address,
  member_address,
  member_contactNo,
  member_nominationName,
  member_witnessName,
}) => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) {
    return null;
  }

  return (
    <>
      <PDFViewer height="80%" width="65%">
        <PdfFile
          admin_sign={admin_sign}
          signedAcc={signedAcc}
          signedHash={signedHash}
          location={location}
          email={email}
          LLC_name={LLC_name}
          general_purpose={general_purpose}
          admin_name={admin_name}
          member_name={member_name}
          member_email={member_email}
          amount={amount}
          member_address={member_address}
          member_contactNo={member_contactNo}
          member_nominationName={member_nominationName}
          member_witnessName={member_witnessName}
          admin_address={admin_address}
        />
      </PDFViewer>
    </>
  );
};
export default PDFView;
