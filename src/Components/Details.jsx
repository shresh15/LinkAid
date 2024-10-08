import React, { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import img2 from "./Context/New.png";

const Details = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [specialization, setSpecialization] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const data = {
        uid: user.uid, //unique
        name,
        address,
        phone,
        district,
        accountType,
      };

      if (accountType === "ngo") {
        data.specialization = specialization;
        await setDoc(doc(db, "ngoDetails", user.uid), data);
        navigate("/solution");
      } else {
        await setDoc(doc(db, "userDetails", user.uid), data);
        navigate("/issues");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="border-none h-[100vh] border-black flex flex-row bg-gradient-to-r from-violet-500 via-purple-300 to-white">
      <div className="border-none sm:mt-24 sm:mb-24 sm:w-[60vw] w-full  sm:p-10 sm:pt-5 sm:pr-5 pt-5 pl-32 mr-10    ">
        <div className="flex flex-col justify-center items-center sm:mr-0 mr-[16vw]">
          <h1 className="text-black text-3xl font-semibold text-center">
            Details
          </h1>
          <div className="bg-black w-72 h-1 rounded mt-2 mb-8"></div>
        </div>
        <div>
          <div className="inline-block mt-5 w-72 pl-8 ml-0 sm:ml-7 mr-20 sm:mr-10 border-2 border-solid border-black rounded-full mb-10 text-black">
            <input
              className="w-64 bg-transparent py-3 border-none outline-none placeholder-black"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="inline-block sm:mt-5 mt-2 w-72 pl-5 mr-10 border-2 border-solid border-black rounded-full mb-10 text-black">
            <input
              className="w-64 bg-transparent py-3 border-none overflow-clip outline-none placeholder-black"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
        </div>
        <div>
          <div className="inline-block sm:mt-5 mt-2 w-72 pl-5 sm:ml-8 mr-10 border-2 border-solid border-black rounded-full mb-10 text-black">
            <input
              className="w-64 bg-transparent py-3 border-none overflow-clip outline-none placeholder-black"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone No"
            />
          </div>
          <div className="inline-block sm:mt-5 mt-2 w-72 pl-5 ml-0 mr-10 border-2 border-solid border-black rounded-full mb-10 text-black">
            <input
              className="w-64 bg-transparent py-3 border-none overflow-clip outline-none placeholder-black"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District"
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col justify-center items-center">
          <div className="border-2 border-black border-solid w-72 flex justify-center rounded-full sm:mb-5 mb-10 sm:ml-9 mt-2 mr-20 sm:mr-10">
            <select
              className="bg-transparent text-black w-72 py-3 border-none outline-none sm:pl-5 pl-5"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option className="bg-white text-black" value="user">
                User
              </option>
              <option className="bg-white text-black" value="ngo">
                NGO
              </option>
            </select>
          </div>
          {accountType === "ngo" && (
            <div className="border-2 border-black border-solid w-72 sm:ml-0 ml-32 sm:mr-24 sm:mb-2 mb-4 flex justify-center rounded-full">
              <select
                className="bg-transparent text-black w-72 py-3 border-none outline-none pl-6 pr-5"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option
                  className="bg-white text-black"
                  value="Select Specialization"
                >
                  Select Specialization
                </option>
                <option
                  className="bg-purple text-black"
                  value="water management"
                >
                  Water Management
                </option>
                <option className="bg-white text-black" value="infrastructure">
                  Infrastructure
                </option>
                <option className="bg-white text-black" value="education">
                  Education
                </option>
                <option
                  className="bg-white text-black"
                  value="management issues"
                >
                  Management Issues
                </option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-center sm:pr-0 w-full">
          <button
            className="border-2 border-black mr-14 sm:mr-2 mt-3 bg-black font-bold text-white border-solid py-3 sm:py-3 w-56 rounded-full text-xl hover:bg-violet-300 hover:text-black hover:border-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="sm:w-1/2 sm:mt-32 sm:ml-16 sm:block hidden">
        <img className="size-[30vw] m-auto" src={img2} alt="" />
      </div>
    </div>
  );
};

export default Details;
