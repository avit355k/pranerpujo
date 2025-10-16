import React, { useState } from "react";
import PujaCard from "../../component/Pujacard/PujaCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const NorthKolkataParikrama = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // number of cards per page
  const totalCards = 40; // total number of pujas
  const totalPages = Math.ceil(totalCards / itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll to top
  };

  // Sample data for demo purposes
  const paginatedCards = Array.from({ length: totalCards })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="px-3 sm:px-6 lg:px-10 py-6 bg-white dark:bg-black min-h-screen transition-colors duration-300">
      
      {/* Header Section */}
      <div className="px-4 py-3 bg-red-600 rounded-lg shadow-md mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-serif font-semibold text-center lg:text-left">
          North Kolkata Durga Puja Committees
        </h1>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
        {paginatedCards.map((_, i) => (
          <PujaCard key={i} />
        ))}
      </div>

      {/* Pagination Section */}
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
                color: "#e11d48", // Tailwind red-600
              },
              "& .Mui-selected": {
                backgroundColor: "#e11d48 !important",
                color: "#fff !important",
              },
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default NorthKolkataParikrama;
