import { useEffect, useState } from "react";
import "./App.css";
import { storage } from "./firebase";
// import { uuidv4 } from '@firebase/util'
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
// import Footer from "./Footer";
// import logo from "../src/assets/clg.png"

function App() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileRef = ref(storage, "files/");

  const uploadFile = () => {
    if (file === null) return;

    const fileRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        setProgress(0);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFileList((prev) => [
            ...prev,
            { url: url, ref: uploadTask.snapshot.ref },
          ]);
        });
        alert("File uploaded successfully!");
      }
    );

    setFile(null);
  };

  const deleteFile = (ref, url) => {
    deleteObject(ref)
      .then(() => {
        setFileList(fileList.filter((file) => file.url !== url));
        alert("File deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listResult = await listAll(fileRef);
        const urls = await Promise.all(
          listResult.items.map(async (item) => {
            return await getDownloadURL(item);
          })
        );
        setFileList(
          urls.map((url, index) => ({ url: url, ref: listResult.items[index] }))
        );
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
<nav className="navbar navbar-light bg-light" >
        <div className="container d-flex justify-content-center align-items-center">
          <h1 className="m-0">Hardware Controller</h1>
        </div>
      </nav>

      <div className="App container mt-1">
        <p className="d-flex column mt-3 mb-0">Choose Your File.</p>
        <div className="d-flex column ">
          <input
            type="file"
            className="form-control"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <button className="btn btn-success mx-3" onClick={uploadFile}>
            Upload
          </button>
        </div>

        {progress !== 0 && (
          <div className="progress my-2">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, color: "white" }}
            ></div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {fileList.map((fileObj) => (
            <div className="card my-3 w-25" key={fileObj.url}>
              <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                {fileObj.url}
              </a>
              <button
                className="btn btn-danger deletebtn"
                onClick={() => deleteFile(fileObj.ref, fileObj.url)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="container mt-1" style={{ minHeight: "calc(200vh - 200px)", overflowY: "auto" }}>
        {/* Your existing content */}
        <div className="mt-4 mb-5"> {/* Add margin top and bottom */}
          <h3 style={{ color: "red" }}>Disclaimer - Read Before Use</h3>
          <ul
            className="mt-3"
            style={{
              listStyle: "none",
              padding: 0,
              textAlign: "left",
              marginLeft: "20px",
            }}
          >
            <li className="custom-bullet">
              Your file name should be <strong>Blink2.ino</strong>.
            </li>
            <li className="custom-bullet">
              First check, If there is any file already uploaded, you must <strong>Delete</strong> that file before uploading a new one.
            </li>
            <li className="custom-bullet">
              After clicking the upload button, you will have to wait until the file is uploaded and then <strong>Delete</strong> your uploaded file before concluding your session.
            </li>
            <li className="custom-bullet">
              Users are advised not to upload any sensitive or private documents. This application holds no responsibility for any consequences arising from such actions. <strong>It is intended for educational or practical purposes only </strong>.
            </li>
          </ul>
        </div>
      </div>

      {/* footer */}
      <footer
        style={{
        position:"fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: "0px 0",
          textAlign: "center",
        }}
      >
        <div className="footer">
          <div className="footer-description">
            <p>
              Our company takes pride in providing user-friendly software
              solutions such as this. We greatly appreciate your interest and
              trust in our products.{" "}
            </p>
            <p>Stay connected with us: नमस्ते 🙏</p>
          </div>
          <ul
            className="footer-links"
            style={{ listStyle: "none", padding: 0 }}
          >
            <li style={{ display: "inline-block", margin: "0 10px" }}>
              <a href="#">About Us</a>
            </li>
            <li style={{ display: "inline-block", margin: "0 10px" }}>
              <a href="#">Contact Us</a>
            </li>
            <li style={{ display: "inline-block", margin: "0 10px" }}>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
          <div className="footer-info">
            <p style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} Hardware-Controller. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
