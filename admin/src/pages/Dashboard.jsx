import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({ pandals: 0, themes: 0, artists: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${API}/api/dashboard/counts`); 
        setCounts(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-neutral-500">Loading Dashboard...</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Total Pandals</h3>
          <p className="text-3xl font-bold">{counts.pandals}</p>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Themes</h3>
          <p className="text-3xl font-bold">{counts.themes}</p>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Artists</h3>
          <p className="text-3xl font-bold">{counts.artists}</p>
        </div>
      </div>
    </div>
  );
}
