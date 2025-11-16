import React, { useState, useRef } from "react";
import axios from "axios";

const EditGallery = ({ gallery, onClose, refreshGalleries }) => {
  const [formData, setFormData] = useState({
    year: gallery.year || "",
    video: gallery.video || "",
  });

  const [photos, setPhotos] = useState(gallery.photos || []);
  const [newPhotos, setNewPhotos] = useState([]);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dropRef = useRef(null);

  // ✅ Handle text input (year, video)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle new file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos((prev) => [...prev, ...files]);
  };

  // ✅ Handle drag-over and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setNewPhotos((prev) => [...prev, ...imageFiles]);
    } else {
      alert("Only image files are allowed.");
    }
  };

  // ✅ Remove photo from existing list
  const toggleRemovePhoto = (url) => {
    setRemovePhotos((prev) =>
      prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url]
    );
  };

  // ✅ Remove new photo before upload
  const removeNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit update to backend
  const handleUpdate = async () => {
    if (!formData.year) {
      alert("Year is required!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("year", formData.year);
    formDataToSend.append("video", formData.video);
    formDataToSend.append("pandel", gallery.pandel?._id || gallery.pandel);
    removePhotos.forEach((url) => formDataToSend.append("removePhotos", url));
    newPhotos.forEach((file) => formDataToSend.append("newPhotos", file));

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/gallery/update/${gallery._id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Gallery updated successfully!");
      refreshGalleries();
      onClose();
    } catch (err) {
      console.error("Error updating gallery:", err);
      alert("Failed to update gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-[600px] shadow-lg">
        <h3 className="text-xl font-semibold text-emerald-500 mb-4">
          Edit Gallery
        </h3>

        {/* Year */}
        <label className="block mb-2 text-sm font-medium">Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
        />

        {/* Video link */}
        <label className="block mb-2 text-sm font-medium">Video Link</label>
        <input
          type="text"
          name="video"
          value={formData.video}
          onChange={handleChange}
          placeholder="Enter YouTube or video URL"
          className="w-full p-2 mb-6 rounded border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
        />

        {/* Existing Photos */}
        <div>
          <h4 className="text-sm font-medium mb-2">Existing Photos</h4>
          {photos.length === 0 ? (
            <p className="text-gray-500 text-sm">No existing photos.</p>
          ) : (
            <div className="flex flex-wrap gap-3 mb-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={photo}
                    alt="gallery"
                    className={`w-20 h-20 object-cover rounded border ${
                      removePhotos.includes(photo)
                        ? "opacity-50 border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    onClick={() => toggleRemovePhoto(photo)}
                    className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
                      removePhotos.includes(photo)
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {removePhotos.includes(photo) ? "Undo" : "X"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload new photos */}
        <div>
          <h4 className="text-sm font-medium mb-2">Add New Photos</h4>
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center mb-3 transition-colors duration-200 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-300 dark:border-neutral-700"
            }`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag & drop images here, or{" "}
              <label className="text-emerald-500 cursor-pointer hover:underline">
                click to browse
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </p>
          </div>

          {newPhotos.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {newPhotos.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={() => removeNewPhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-neutral-700 rounded hover:bg-gray-400 dark:hover:bg-neutral-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
