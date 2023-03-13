import React, { useState } from "react";
import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Layout1 from '../../src/components/layouts/layout1'
import html2canvas from "html2canvas";
import MyDocument from "../pdfGenerator";
import dynamic from "next/dynamic";
import { makeStyles } from "@mui/styles";
const DocumentPDF = dynamic(() => import("../pdfGenerator"), {
  ssr: false,
});

const useStyles = makeStyles({
    btn: {
        width: '150px',
      fontFamily: 'sans-serif',
      fontSize: '18px',
      border: 'none',
      padding: '12px 20px',
      color: 'white',
      background: '#3B7AFD',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    title: {
        fontSize: '28px'
    },
    container: {
        height: "90vh",
        width:'100vw', 
        display:'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent:'center', 
        marginTop: '60px'
    },
    signDiv: {
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems:'center', 
        width:'65%'
    }
})

const htmltoImage = () => {
  // const domElement1 = document.getElementById("result1");
  // console.log(domElement1);
  const domElement = document.getElementsByClassName("comments-result");
  const arr = [...domElement];
  const generateImage = (domElement) => {
    return html2canvas(domElement, {
      onclone: (document) => {
        document.getElementById("innerDiv").style.display = "block";
      },
      windowWidth: 1600,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      return imgData;
    });
  };

  return Promise.all(arr.map((element) => generateImage(element)));
};

const SignDoc = () => {
    const classes = useStyles()
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });

  // const checkForEmptyFields = () => {
  //   for (const key of Object.keys(formData)) {
  //     if (formData[key] === "") return false;
  //   }
  //   return true;
  // };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const updateFormData = (event) =>
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });

//   const { firstName, lastName, email, password } = formData;

  return (
    <div>
        <Layout1>
            <div className={classes.container}>
                <div className={classes.signDiv}> 
                    <h2 className={classes.title}>Review and Confirm</h2>
                    <button className={classes.btn}>Sign PDF</button>
                </div>

                <DocumentPDF />


        {/* <PDFViewer
        //   showToolbar={false}
          style={{ height: "100%", width: "90vw" }}
        >
          <MyDocument title="Personal Doc" data={formData} />
        </PDFViewer> */}
      </div>
      {/* <button>
        <PDFDownloadLink
          document={<MyDocument title="personal doc" data={formData || {}} />}
          fileName="formDataabc.pdf"
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a",
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
        Download
      </button> */}
      {/* <button
        onClick={() => {
          htmltoImage().then((imgSrcArr) => {
            import("./PdfGenerator")
              .then(async (module) => {
                const PdfFile = module.default;
                const doc = (
                  <PdfFile
                    title="Personal Doc"
                    data={formData}
                    srcArr={imgSrcArr}
                  />
                );
                const blob = await pdf(doc).toBlob();
                saveAs(blob, "pdfdoc.pdf");
              })
              .catch((error) => console.log("error====>", error));
          });
        }}
      >
        Download PDF
      </button> */}
      {/* {checkForEmptyFields() && (
        <PDFDownloadLink
          document={<PdfFile data={formData} />}
          fileName="formDataabc.pdf"
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#4a4a4a",
            backgroundColor: "#f2f2f2",
            border: "1px solid #4a4a4a"
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download Pdf"
          }
        </PDFDownloadLink>
      )} */}
      {/* <LineGraph /> */}
      </Layout1>    
    </div>
  );
};

export default SignDoc;