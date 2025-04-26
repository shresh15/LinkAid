import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import FileUpload from "./FileUpload";
import { MdReportProblem, MdArrowDropDown, MdAttachFile } from "react-icons/md";

const Issues = () => {
  const [uid, setUid] = useState(null);
  const [type, setType] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [filePopup, setFilePopup] = useState(false);
  const [issues, setIssues] = useState({});
  const [description, setDescription] = useState("");

  const categories = {
    education: "Education",
    water: "Water Management",
    management: "Management Issues",
    infrastructure: "Infrastructure",
  };

  const categoryIssues = {
    education: ["stationary", "teaching_materials"],
    water: ["drainage", "purification"],
    management: ["security", "staff_management"],
    infrastructure: ["furniture", "sanitation_facilities"],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log("User authenticated:", user.uid);
      } else {
        console.log("User not authenticated.");
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (e) => {
    setIssues({ ...issues, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uid) {
      setMessage("User not authenticated.");
      return;
    }
    if (!type || !description || Object.values(issues).every((v) => !v)) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "problems"), {
        uid: uid,
        created_at: Timestamp.now(),
        type: type,
        file_url: fileUrl,
        details: issues,
        description: description,
      });

      console.log("Issue submitted successfully! ID:", docRef.id);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // Reset form after submission
      setType("");
      setFileUrl(null);
      setIssues({});
      setDescription("");
      setMessage("");
    } catch (e) {
      console.error("Error adding problem report:", e);
      setMessage("Failed to submit the report.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md md:max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <MdReportProblem className="text-indigo-600 text-4xl mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Report an Issue</h1>
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
            Field of Issue:
          </label>
          <div className="relative">
            <select
              id="type"
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select a category</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <MdArrowDropDown />
            </div>
          </div>
        </div>

        {type && (
          <div className="mb-6 p-4 border rounded-md bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">{categories[type]}</h2>
            <div className="mb-3">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Describe the issue in detail:
              </label>
              <textarea
                id="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select specific issues:
              </label>
              {categoryIssues[type]?.map((key) => (
                <div key={key} className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={issues[key] || false}
                    onChange={handleCheckboxChange}
                    className="mr-2 leading-tight"
                  />
                  <label htmlFor={key} className="text-sm text-gray-600">
                    {key.replace(/_/g, " ")}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Attach File (optional):
              </label>
              <FileUpload setFileUrl={setFileUrl} setFilePopup={setFilePopup} />
              {fileUrl && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm italic">Uploaded file:</p>
                  <img
                    src={fileUrl}
                    alt="Uploaded"
                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
          disabled={!type || !description || Object.values(issues).every((v) => !v)}
        >
          Submit Report
        </button>

        {message && (
          <div className="text-red-600 mt-4 font-semibold">{message}</div>
        )}

        {showPopup && (
          <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md z-50">
            Report Submitted Successfully!
          </div>
        )}
        {filePopup && (
          <div className="fixed top-12 right-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md z-50">
            File Uploaded!
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;