import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await axios.get(`${API}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!admin) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6  mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Admin Profile</h2>

      {/* Avatar */}
      <div className="w-24 h-24 flex items-center justify-center bg-emerald-500 dark:bg-neutral-700 text-white text-2xl font-bold rounded-full mb-4">
        {admin.name.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <p className="text-gray-700 dark:text-gray-200 mb-2">
        <span className="font-semibold">Name:</span> {admin.name}
      </p>

      {/* Email */}
      <p className="text-gray-700 dark:text-gray-200 mb-2">
        <span className="font-semibold">Email:</span> {admin.email}
      </p>

      {/* Optional: other info */}
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Account created at: {new Date(admin.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Profile;
