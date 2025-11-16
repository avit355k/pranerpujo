import React, { useState } from "react";
import axios from "axios";
import { API } from "../../services/api";

const UploadGallery = () => {
  const [pandelId, setPandelId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [video, setVideo] = useState(""); // single video
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (imageFiles.length > 0) setGalleryFiles(prev => [...prev, ...imageFiles]);
  };

  const handleUpload = async () => {
    if (!pandelId || !year) return alert("Pandel ID and year are required");
    if (galleryFiles.length === 0) return alert("Please add at least one image");

    const formData = new FormData();
    formData.append("pandel", pandelId);
    formData.append("year", year);
    formData.append("video", video);
    galleryFiles.forEach(file => formData.append("photos", file));

    try {
      setUploading(true);
      await axios.post(`${API}/api/gallery/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Gallery uploaded successfully!");
      setGalleryFiles([]);
      setVideo("");
      setPandelId("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-500">
        Upload Album of a Pandel
      </h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Pandel ID</label>
        <input
          type="text"
          value={pandelId}
          onChange={(e) => setPandelId(e.target.value)}
          placeholder="Enter Pandel ID"
          className="w-full p-2 rounded border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Video Link</label>
        <input
          type="text"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          placeholder="Enter YouTube or video link"
          className="w-full p-2 rounded border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-emerald-500">Gallery Images</label>

        <div
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700"); }}
          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700"); }}
          onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700"); handleFiles(e.dataTransfer.files); }}
          className="cursor-pointer p-8 flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600 transition-colors"
        >
          <input
            type="file"
            id="galleryUpload"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <label htmlFor="galleryUpload" className="text-center cursor-pointer">
            <p className="mt-2 text-gray-600 dark:text-neutral-300">
              Drop images here or{" "}
              <span className="text-emerald-500 font-semibold underline">browse</span>
            </p>
          </label>
        </div>

        {galleryFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryFiles.map((file, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-2 mt-4 rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 cursor-pointer"
      >
        {uploading ? "Uploading..." : "Upload Gallery"}
      </button>
    </div>
  );
};

export default UploadGallery;
