import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MdWarning, MdFileDownload } from "react-icons/md"; // Example icons

const Solution = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchNGOData = async () => {
      setLoading(true);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const ngoDocRef = doc(db, "ngoDetails", user.uid);
            const ngoDocSnap = await getDoc(ngoDocRef);

            if (ngoDocSnap.exists()) {
              const ngoData = ngoDocSnap.data();
              setSpecialization(ngoData.specialization);

              const problemsRef = collection(db, "problems");
              const q = query(
                problemsRef,
                where("type", "==", ngoData.specialization)
              );
              const querySnapshot = await getDocs(q);

              const problemsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setProblems(problemsList);

              const userDetailsMap = {};
              const userIds = [...new Set(problemsList.map((p) => p.uid))];
              if (userIds.length > 0) {
                const usersQuery = query(
                  collection(db, "userDetails"),
                  where("__name__", "in", userIds)
                );
                const usersSnapshot = await getDocs(usersQuery);
                usersSnapshot.forEach((userDoc) => {
                  userDetailsMap[userDoc.id] = userDoc.data();
                });
              }
              setUserDetails(userDetailsMap);
            }
          } catch (error) {
            console.error("Error fetching data: ", error);
          } finally {
            setLoading(false);
          }
        } else {
          console.log("No user is signed in.");
          setLoading(false);
        }
      });

      return () => unsubscribe();
    };

    fetchNGOData();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-lg text-gray-700">Loading issues... <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full align-middle ml-2"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-400 via-purple-300 to-white p-6">
      <div className="container mx-auto py-12">
        <h1 className="font-bold font-serif text-4xl text-violet-900 text-center mb-8">
          NGO: Problems List
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-xl">
          {specialization && (
            <h2 className="font-bold text-2xl text-center text-gray-700 mb-6">
              Specialization: <span className="text-indigo-600">{specialization}</span>
            </h2>
          )}

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            <MdWarning className="inline-block mr-2 text-yellow-500" /> Issues Matching Your Specialization:
          </h3>

          {problems.length > 0 ? (
            <ul className="mt-4 space-y-8">
              {problems.map((problem) => (
                <li key={problem.id} className="bg-gray-50 rounded-md shadow-sm p-6 border-l-4 border-indigo-500">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Category: <span className="text-purple-600">{problem.type}</span>
                  </h4>
                  <p className="text-gray-700 mb-3">
                    <strong>Description:</strong> {problem.description || "No description provided"}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Details:</strong> {typeof problem.details === 'object' ? (
                      <ul>
                        {Object.entries(problem.details).map(([key, value]) => (
                          <li key={key} className="ml-4 list-disc text-sm">
                            {key.replace(/_/g, " ")}: <span className="font-medium">{value ? 'Yes' : 'No'}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      problem.details || "No specific details"
                    )}
                  </p>

                  {/* Display the uploaded image if file_url exists */}
                  {problem.file_url && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Uploaded Image:</h5>
                      <img
                        src={problem.file_url}
                        alt="Uploaded by user"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300 shadow-sm"
                      />
                    </div>
                  )}

                  {userDetails[problem.uid] && (
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Reported by:</h5>
                      <p className="text-gray-600 text-sm">
                        <strong>Name:</strong> {userDetails[problem.uid].name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>District:</strong> {userDetails[problem.uid].district}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Phone:</strong> {userDetails[problem.uid].phone}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Address:</strong> {userDetails[problem.uid].address}
                      </p>
                    </div>
                  )}

                  {problem.file_url && (
                    <p className="mt-3">
                      <a
                        href={problem.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <MdFileDownload className="mr-1" /> View Uploaded Document
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-6 italic">
              No issues found for your specialization.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solution;