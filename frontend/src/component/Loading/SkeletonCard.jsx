import React from "react";
import Skeleton from "@mui/material/Skeleton";

// Neutral gray works on both light and dark backgrounds
const skeletonSx = {
  bgcolor: "rgba(150, 150, 150, 0.18)",
  "&::after": {
    background:
      "linear-gradient(90deg, transparent, rgba(150, 150, 150, 0.25), transparent)",
  },
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
    {/* Image placeholder */}
    <Skeleton
      variant="rectangular"
      animation="wave"
      sx={{ ...skeletonSx, width: "100%", height: 230 }}
    />

    <div className="p-4 space-y-3">
      {/* Pandel name */}
      <Skeleton variant="text" animation="wave" width="90%" height={32} sx={skeletonSx} />

      {/* Location */}
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" animation="wave" width={14} height={14} sx={skeletonSx} />
        <Skeleton variant="text" animation="wave" width="35%" height={22} sx={skeletonSx} />
      </div>

      {/* Zone */}
      <div className="flex items-center gap-2">
        <Skeleton variant="text" animation="wave" width={42} height={22} sx={skeletonSx} />
        <Skeleton variant="text" animation="wave" width="40%" height={22} sx={skeletonSx} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;