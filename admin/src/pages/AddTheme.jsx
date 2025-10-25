import React, { useState } from "react";
import axios from "axios";

const initialFormData = {
  title: "",
  concept: "",
  year: "",
  pandel: "",
  youtubeLink: "",
  artists: [{ artist: "", roles: ["Artist"], description: "" }],
};

const AddTheme = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (name === "artist" || name === "roles" || name === "description") {
      const updatedArtists = [...formData.artists];
      if (field === "roles") {
        updatedArtists[index][field] = [value];
      } else {
        updatedArtists[index][name] = value;
      }
      setFormData({ ...formData, artists: updatedArtists });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addArtist = () => {
    setFormData({
      ...formData,
      artists: [
        ...formData.artists,
        { artist: "", roles: ["Artist"], description: "" },
      ],
    });
  };

  const removeArtist = (index) => {
    const updatedArtists = [...formData.artists];
    updatedArtists.splice(index, 1);
    setFormData({ ...formData, artists: updatedArtists });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("concept", formData.concept);
      payload.append("year", formData.year);
      payload.append("pandel", formData.pandel);
      payload.append("youtubeLink", formData.youtubeLink);
      payload.append("artists", JSON.stringify(formData.artists));

      if (mainImageFile) payload.append("mainImageFile", mainImageFile);
      galleryFiles.forEach((file) => payload.append("galleryFiles", file));

      const res = await axios.post(
        "http://localhost:5000/api/theme/create",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Theme created successfully!");
      setFormData(initialFormData);
      setMainImageFile(null);
      setGalleryFiles([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating theme");
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-500">
        Add New Theme
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Theme Name"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        <textarea 
          type="text"
          name="concept"
          placeholder="Theme Concept"
          value={formData.concept}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        <input
          type="text"
          name="pandel"
          placeholder="Pandel ObjectId"
          value={formData.pandel}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        {/* Artists Section */}
        <div>
          <h3 className="text-lg font-medium text-emerald-500 mb-2">Artists</h3>
          {formData.artists.map((artist, index) => (
            <div key={index} className="mb-4 border p-2 rounded-lg space-y-2">
              <input
                type="text"
                name="artist"
                placeholder="Artist ObjectId"
                value={artist.artist}
                onChange={(e) => handleChange(e, index)}
                className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
              />
              <select
                name="roles"
                value={artist.roles[0]}
                onChange={(e) => handleChange(e, index, "roles")}
                className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
              >
                <option value="Artist">Artist</option>
                <option value="Idol Artist">Idol Artist</option>
              </select>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={artist.description}
                onChange={(e) => handleChange(e, index)}
                className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
              />
              {formData.artists.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArtist(index)}
                  className="text-red-500 mt-1"
                >
                  Remove Artist
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addArtist}
            className="text-emerald-500 hover:underline"
          >
            + Add Another Artist
          </button>
        </div>

        <input
          type="text"
          name="youtubeLink"
          placeholder="YouTube Link"
          value={formData.youtubeLink}
          onChange={handleChange}
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        {/* Main Image */}
        <div>
          <label className="block mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full cursor-pointer"
          />
        </div>

        {/* Gallery Upload (with Drag & Drop) */}
        <div>
          <label className="block mb-2 text-emerald-500">Gallery Images</label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-50", "dark:bg-neutral-700");

              const droppedFiles = Array.from(e.dataTransfer.files).filter(
                (file) => file.type.startsWith("image/")
              );

              if (droppedFiles.length > 0) {
                setGalleryFiles((prev) => [...prev, ...droppedFiles]);
              }
            }}
            className="cursor-pointer p-8 flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600 transition-colors"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              name="galleryFiles"
              id="galleryUpload"
              onChange={(e) =>
                setGalleryFiles((prev) => [
                  ...prev,
                  ...Array.from(e.target.files),
                ])
              }
              className="hidden"
            />

            <label htmlFor="galleryUpload" className="text-center cursor-pointer">
              <svg
                className="w-16 h-auto mx-auto text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-gray-600 dark:text-neutral-300">
                Drop images here or{" "}
                <span className="text-emerald-500 font-semibold underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                You can upload multiple images (max 2MB each).
              </p>
            </label>
          </div>

          {/* File Previews */}
          {galleryFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
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
          type="submit"
          className="bg-emerald-500 text-white p-2 rounded-lg mt-4 hover:bg-emerald-600 w-full cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTheme;
