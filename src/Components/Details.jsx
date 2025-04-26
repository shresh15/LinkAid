import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { MdPerson, MdHome, MdPhone, MdMap, MdWork } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import img2 from "./Context/New.png";

const Details = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [specialization, setSpecialization] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); // To hold the popup message
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkValidity = () => {
      if (!name || !address || !phone || !district || !accountType) {
        setIsFormValid(false);
        return;
      }
      if (accountType === "ngo" && !specialization) {
        setIsFormValid(false);
        return;
      }
      // Check for 10-digit number in phone
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        setIsFormValid(false);
        return;
      }

      setIsFormValid(true);
    };
    checkValidity();
  }, [name, address, phone, district, accountType, specialization]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      setPopupMessage("Please fill in all the details correctly.");
      setShowPopup(true);
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const data = {
        uid: user.uid,
        name,
        address,
        phone,
        district,
        accountType,
      };

      if (accountType === "ngo") {
        data.specialization = specialization;
        await setDoc(doc(db, "ngoDetails", user.uid), data);
        setPopupMessage("Details Submitted! Thank you for providing your information.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/solution");
        }, 2000);
      } else {
        await setDoc(doc(db, "userDetails", user.uid), data);
        setPopupMessage("Details Submitted! Thank you for providing your information.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/issues");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tell Us More About You
            </h2>
            <p className="text-gray-600">
              Please provide the following details to continue.
            </p>
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <MdPerson />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <MdHome />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <MdPhone />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <MdMap />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FaHandshake />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="user">I am a User</option>
              <option value="ngo">I am an NGO</option>
            </select>
          </div>

          {accountType === "ngo" && (
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <MdWork />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Select Specialization</option>
                <option value="water management">Water Management</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="education">Education</option>
                <option value="management issues">Management Issues</option>
                {/* Add more specializations as needed */}
              </select>
            </div>
          )}

          <button
            className={`w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit Details
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block relative">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={img2}
            alt="Details Illustration"
          />
          <div className="absolute inset-0 bg-indigo-500 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Connecting for Impact</h3>
            <p className="text-lg opacity-80">Your information helps us tailor your experience.</p>
          </div>
        </div>
      </div>

      {/* Beautiful Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <svg
              className="mx-auto mb-4 w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{popupMessage}</h2>
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              onClick={() => setShowPopup(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;