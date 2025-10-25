import React, { useEffect, useState } from "react";
import axios from "axios";

const EditTheme = ({ themeIdToEdit, onBack }) => {
  const [formData, setFormData] = useState({
    title: "",
    concept: "",
    year: "",
    pandel: "",
    youtubeLink: "",
    artists: [{ artist: "", roles: ["Artist"], description: "" }],
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]); // Can be File or URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/theme/all`);
        const theme = res.data.find((t) => t._id === themeIdToEdit);
        if (!theme) {
          alert("Theme not found");
          return;
        }

        setFormData({
          title: theme.title,
          concept: theme.concept,
          year: theme.year,
          pandel: theme.pandel?._id || "",
          youtubeLink: theme.youtubeLink || "",
          artists: theme.artists.length
            ? theme.artists
            : [{ artist: "", roles: ["Artist"], description: "" }],
        });

        setGalleryFiles(theme.gallery || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching theme:", err);
        alert("Failed to fetch theme data");
        setLoading(false);
      }
    };

    if (themeIdToEdit) fetchTheme();
  }, [themeIdToEdit]);

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (name === "artist" || name === "roles" || name === "description") {
      const updatedArtists = [...formData.artists];
      if (field === "roles") updatedArtists[index][field] = [value];
      else updatedArtists[index][name] = value;
      setFormData({ ...formData, artists: updatedArtists });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addArtist = () => {
    setFormData({
      ...formData,
      artists: [...formData.artists, { artist: "", roles: ["Artist"], description: "" }],
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
      payload.append(
        "existingGallery",
        JSON.stringify(galleryFiles.filter((f) => typeof f === "string"))
      );

      if (mainImageFile) payload.append("mainImageFile", mainImageFile);

      galleryFiles
        .filter((f) => f instanceof File)
        .forEach((file) => payload.append("galleryFiles", file));

      await axios.put(`http://localhost:5000/api/theme/${themeIdToEdit}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Theme updated successfully!");
      onBack();
    } catch (err) {
      console.error("Error updating theme:", err);
      alert(err.response?.data?.message || "Failed to update theme");
    }
  };

  if (loading) return <p className="text-gray-300 text-center mt-10">Loading...</p>;

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-500">Edit Theme</h2> 

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

        {/* Artists */}
        <div>
          <h3 className="text-lg font-medium text-emerald-500 mb-2">Artists</h3>
          {formData.artists.map((artistObj, index) => (
            <div key={index} className="mb-4 border p-2 rounded-lg space-y-2 dark:bg-neutral-900">

              {/* Show artist name for info, edit ID in input */}
              <input
                type="text"
                name="artist"
                placeholder="Artist ObjectId"
                value={artistObj.artist?._id || ""}
                onChange={(e) => {
                  const updatedArtists = [...formData.artists];
                  updatedArtists[index].artist = { _id: e.target.value }; // preserve as object
                  setFormData({ ...formData, artists: updatedArtists });
                }}
                className="p-2 border rounded-lg dark:bg-neutral-800 w-full"
              />
              <p className="text-sm text-gray-400">
                {artistObj.artist?.name || "Unknown Name"} ({artistObj.artist?._id || "ID"})
              </p>

              <select
                name="roles"
                value={artistObj.roles[0]}
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
                value={artistObj.description}
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
          <button type="button" onClick={addArtist} className="text-emerald-500 hover:underline">
            + Add Another Artist
          </button>
        </div>


        {/* YouTube Link */}
        <input
          type="text"
          name="youtubeLink"
          placeholder="YouTube Link"
          value={formData.youtubeLink}
          onChange={handleChange}
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        {/* Main Image */}
        <div className="mt-4">
          <label className="block mb-1">Main Image</label>
          {formData.mainImage && !mainImageFile && (
            <img
              src={formData.mainImage}
              alt="Current Main"
              className="w-40 h-40 object-cover rounded-lg mb-2 border border-gray-600"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full cursor-pointer"
          />
        </div>
        {/* Gallery */}
        <div>
          <label className="block mb-2 text-emerald-500">Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setGalleryFiles((prev) => [...prev, ...Array.from(e.target.files)])
            }
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full cursor-pointer mb-2"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {galleryFiles.map((file, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden bg-gray-700">
                <img
                  src={file instanceof File ? URL.createObjectURL(file) : file}
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
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 flex-1 cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 flex-1 cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTheme;
