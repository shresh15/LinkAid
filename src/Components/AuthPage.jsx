import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa"; // Import Google Icon
import { MdEmail, MdLock, MdPerson } from "react-icons/md"; // Import Email, Lock, Person Icons

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, "userDetails", result.user.uid));
      const ngoDoc = await getDoc(doc(db, "ngoDetails", result.user.uid));
      if (userDoc.exists()) {
        navigate("/issues");
      } else if (ngoDoc.exists()) {
        navigate("/solution");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async () => {
    setError("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign Up Successful!");
        navigate("/details");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userDoc = await getDoc(
          doc(db, "userDetails", userCredential.user.uid)
        );
        const ngoDoc = await getDoc(
          doc(db, "ngoDetails", userCredential.user.uid)
        );
        if (userDoc.exists()) {
          navigate("/issues");
        } else if (ngoDoc.exists()) {
          navigate("/solution");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 via-purple-300 to-white">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold text-violet-900 mb-6">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-500">
            <MdEmail />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full border-2 border-violet-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-500">
            <MdLock />
          </div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border-2 border-violet-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {isSignUp && (
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-500">
              <MdPerson />
            </div>
            <select
              className="w-full border-2 border-violet-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="ngo">NGO</option>
            </select>
          </div>
        )}

        <button
          className="w-full bg-violet-600 text-white py-3 rounded-full mb-4 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
          onClick={handleEmailAuth}
        >
          {isSignUp ? "Sign Up" : "Sign In"} with Email
        </button>

        <button
          className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 flex items-center justify-center"
          onClick={handleGoogleSignIn}
        >
          <FaGoogle className="mr-2" /> Sign In with Google
        </button>

        <p className="mt-6 text-violet-700">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            className="font-bold cursor-pointer text-violet-900 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;