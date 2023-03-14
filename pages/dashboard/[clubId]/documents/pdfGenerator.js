import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
  <h1>Heading 1</h1>
  <div class="alt-graph">
        <div class="parent">
          <div class="child">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="rectangle"></div>
          </div>
          <div class="child">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="rectangle"></div>
          </div>
          <div class="child">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="rectangle"></div>
          </div>
          <div class="child">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="rectangle"></div>
          </div>
          <div class="child">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="rectangle"></div>
          </div>
        </div>
      </div>
  <h2 style="background-color: pink">Heading 2</h2>
  <h3>Heading 3</h3>
  <h4 class="my-heading4">Heading 4</h4>
  <p>
  Paragraph with image and
  <a href="http://google.com">link</a>
  </p>
  <ul>
  <li>Unordered item</li>
  <li>Unordered item</li>
  </ul>
  <ol>
  <li>Ordered item</li>
  <li>Ordered item</li>
  </ol>
  <br />
  <h4>Text outside of any tags</h4>
  <br />
  <table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Foo</td>
      <td>Bar</td>
      <td>Foobar</td>
    </tr>
    <tr>
      <td>Foo</td>
      <td>Bar</td>
      <td>Bar</td>
    </tr>
    <tr>
      <td>Some longer</td>
      <td>Even more</td>
      <td>Even more </td>
    </tr>
  </tbody>
  </table>`;

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
    textDecoration: "underline",
    display: "block",
    padding: "40px",
  },
});

const PdfFile = ({ data, title, srcArr, signedAcc, signedHash, admin_name, LLC_name, email, location, general_purpose }) => {
  return (
    <Document>
      <Page style={styles.page} wrap>
        <Html>{html}</Html>
        <View style={styles.section}>
          <Text>{title}</Text>
        </View>
        <View style={styles.parent}>
          <View style={styles.child}>
            <View style={styles.circle}></View>
            <View style={styles.line}></View>
            <View style={styles.rectangle}></View>
          </View>
          <View style={[styles.child, { marginLeft: 100 }]}>
            <View style={styles.circle}></View>
            <View style={styles.line}></View>
            <View style={styles.rectangle}></View>
          </View>
          <View style={[styles.child, { marginLeft: 150 }]}>
            <View style={styles.circle}></View>
            <View style={styles.line}></View>
            <View style={styles.rectangle}></View>
          </View>
          <View style={[styles.child, { marginLeft: 200 }]}>
            <View style={styles.circle}></View>
            <View style={styles.line}></View>
            <View style={styles.rectangle}></View>
          </View>
        </View>
        {/* {Object.keys(data).map((field, index) => {
            return (
              <View key={index}>
                <Text style={styles.text}>
                  {field}:{data[field]}
                </Text>
              </View>
            );
          })} */}
        <View>

          <View>
            <Text>LLC Name: {LLC_name}</Text>
            <Text>Admin Name: {admin_name}</Text>
            <Text>Email: {email}</Text>
            <Text>Location: {location}</Text>
            <Text>General Purpose: {general_purpose} </Text>
          </View>
          <Text>

            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is
            simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry&apos;s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry&apos;s standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to
            make a type specimen book. It has survived not only five centuries,
            but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </Text>
          <Text>
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry&apos;s
            standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Text>
          <Text break>
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry&apos;s
            standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Text>
        </View>

        {signedAcc && (
          <View style={styles.signedDiv}>
            <Text>
              Signed By:{" "}
              <Text style={styles.signedAcc}>
                {signedAcc.slice(0, 8)}...
                {signedAcc.slice(signedAcc.length - 6)}
              </Text>
            </Text>
            <Text>
              Signed Hash:{" "}
              <Text style={styles.signedAcc}>
                {signedHash.slice(0, 26)}....
                {signedHash.slice(signedHash.length - 12)}
              </Text>
            </Text>
          </View>
        )}

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

const PDFView = ({ signedAcc, signedHash, location, email, admin_name, LLC_name, general_purpose }) => {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) {
    return null;
  }
  return (
    <PDFViewer height="80%" width="65%">
      <PdfFile 
        signedAcc={signedAcc}  
        signedHash={signedHash} 
        location={location} 
        email={email} 
        LLC_name={LLC_name} 
        general_purpose={general_purpose} 
        admin_name={admin_name}
       />
    </PDFViewer>
  );
};
export default PDFView;
