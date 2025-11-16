import React, { useState, useEffect } from "react";
import axios from "axios";
import PujaCard from "../../component/Pujacard/PujaCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const BehalaParikrama = () => {
  const [pandels, setPandels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Fetch pandels by zone
  useEffect(() => {
    const fetchPandels = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/pandel/zone/Behala");
        setPandels(res.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setPandels([]); // no pandels found
        } else {
          console.error("Error fetching pandels:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPandels();
  }, []);

  const totalPages = Math.ceil(pandels.length / itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Paginate pandels
  const paginatedPandels = pandels.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="px-3 sm:px-6 lg:px-10 py-6 bg-white dark:bg-black min-h-screen transition-colors duration-300">

      {/* Header Section */}
      <div className="px-4 py-3 bg-red-600 rounded-lg shadow-md mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-serif font-semibold text-center lg:text-left">
          Behala Durga Puja Committees
        </h1>
      </div>

      {/* Grid Section */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400 py-10">
          Loading pandels...
        </p>
      ) : pandels.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 py-10 italic">
          No pandels found in Behala.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {paginatedPandels.map((pandel) => (
            <PujaCard key={pandel._id} pandel={pandel} />
          ))}
        </div>
      )}


      {/* Pagination Section */}
          {pandels.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#e11d48",
                },
                "& .Mui-selected": {
                  backgroundColor: "#e11d48 !important",
                  color: "#fff !important",
                },
              }}
            />
          </Stack>
        </div>
      )}
    </div>
  )
}

export default BehalaParikrama