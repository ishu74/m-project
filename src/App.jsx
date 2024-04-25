// import { useEffect, useState } from 'react';
// import './App.css';
// import { storage } from "./firebase"
// import { uuidv4 } from '@firebase/util'
// import {
//   deleteObject,
//   getDownloadURL,
//   listAll,
//   ref, uploadBytesResumable,
// } from "firebase/storage"
// // import { upload } from '@testing-library/user-event/dist/upload';

// function App() {
//   const [image, setImage] = useState(null);
//   const [imglist, setImglist] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const imageListRef = ref(storage, "img/")

//   // Upload file
//   const uploadFile = () => {
//     if (image == null) return null;

//     const imageRef = ref(storage, `img/${image.name + uuidv4()}`)
//     const uploadFile = uploadBytesResumable(imageRef, image);

//     uploadFile.on('state_changed', (snapshot) => {
//       const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
//       setProgress(progress)
//     }, (err) => {

//     }, () => {
//       setProgress(0);
//       getDownloadURL(uploadFile.snapshot.ref).then((url) => {
//         setImglist((prev) => [...prev, { url: url, ref: uploadFile.snapshot.ref }])
//       })
//       alert("File uploaded Successfully :)👌")
//     });
//     setImage(null)
//   }

//   // Delete file
//   const deleteHandel = (ref, url) => {
//     deleteObject(ref).then((res) => {
//       setImglist(imglist.filter((img) => img.url !== url))
//       alert("Successfully deleted")
//     })
//   }

//   // Get data
//   useEffect(() => {
//     const getData = () => {
//       listAll(imageListRef).then((res) => {
//         res.items.map((item) => {
//           getDownloadURL(item).then((url) => {
//             setImglist((prev) => [...prev, { url: url, ref: item }])
//           })
//         })
//       })
//     }
//     getData()
//   }, [])

//   return (
//     <div className="App container mt-3">
//       <div className='d-flex coloum'>
//         <input type="file" className="form-control"
//           id="img-upload"
//           accept="image/*"
//           onChange={(event) => {
//             setImage(event.target.files[0])
//           }} />
//         <button className="btn btn-success mx-3" onClick={uploadFile}>Upload</button>
//       </div>

//       {
//         progress !== 0 ?(<div className="progress my-2">
//         <div
//           className="progress-bar"
//           role="progressbar"
//           style={{ width: `${progress}%`, color: "white" }}
//         ></div>
//       </div>): null
// }

//       <div style={{
//         display: "flex",
//         flexDirection: "column-reverse",
//       }}>

//         {imglist && imglist.map((fileobj) => (
//           <div className='card my-3 w-25'>
//             <img className="" src={fileobj.url} />
//             <button className="btn btn-danger deletebtn"
//               onClick={() => deleteHandel(fileobj.ref, fileobj.url)}
//             >
//               Delete
//             </button>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

// export default App;

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
    <div className="App container mt-1">
      <h1 className="heading text-center " style={{ color: "#7CB9E8" }}>
        Hardware Controller
      </h1>
      <div className="d-flex column mt-4">
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
      <div
        bgColor="light"
        className="text-center text-lg-start text-muted mt-3"
      >
        <div className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>
          <div>
          <a href='' className='me-4 text-reset'>
            <span color='secondary' fab icon='facebook-f' />
          </a>
          <a href='' className='me-4 text-reset'>
            <span color='secondary' fab icon='twitter' />
          </a>
        
          <a href='' className='me-4 text-reset'>
            <span color='secondary' fab icon='github' />
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
