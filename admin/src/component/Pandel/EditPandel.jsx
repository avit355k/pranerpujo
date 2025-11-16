import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPandel = ({ pandelIdToEdit, fetchPandels, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    latitude: "",
    longitude: "",
    address: "",
    founded: "",
    type: "",
    zone: "",
    heritageStatus: "false",
    metro: "",
    railway: "",
    bus: "",
    contactNumbers: [""],
    email: "",
    facebook: "",
    website: "",
  });
  const [logo, setLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing pandel data for editing
  useEffect(() => {
    if (!pandelIdToEdit) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pandel/${pandelIdToEdit}`);
        const p = res.data;

        setFormData({
          name: p.name || "",
          city: p.location?.city || "",
          latitude: p.location?.latitude || "",
          longitude: p.location?.longitude || "",
          address: p.address || "",
          founded: p.founded || "",
          type: p.type || "",
          zone: p.zone || "",
          heritageStatus: p.heritageStatus ? "true" : "false",
          metro: p.nearestLocation?.metro || "",
          railway: p.nearestLocation?.railway || "",
          bus: p.nearestLocation?.bus || "",
          contactNumbers: p.contactNumbers?.length ? p.contactNumbers : [""],
          email: p.email || "",
          facebook: p.socialLinks?.facebook || "",
          website: p.socialLinks?.website || "",
        });

        setExistingLogo(p.logo || null);
      } catch (err) {
        console.error("Error fetching pandel:", err);
      }
    };
    fetchData();
  }, [pandelIdToEdit]);

  // 🔹 Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Handle contact number changes
  const handleContactChange = (e, index) => {
    const updated = [...formData.contactNumbers];
    updated[index] = e.target.value;
    setFormData({ ...formData, contactNumbers: updated });
  };

  const addContactField = () =>
    setFormData({ ...formData, contactNumbers: [...formData.contactNumbers, ""] });

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pandelIdToEdit) return alert("No pandel selected to edit!");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("founded", formData.founded);
      data.append("type", formData.type);
      data.append("zone", formData.zone);
      data.append("heritageStatus", formData.heritageStatus === "true");

      data.append(
        "location",
        JSON.stringify({
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
        })
      );

      data.append(
        "nearestLocation",
        JSON.stringify({
          metro: formData.metro,
          railway: formData.railway,
          bus: formData.bus,
        })
      );

      data.append("contactNumbers", JSON.stringify(formData.contactNumbers.filter((n) => n)));
      data.append("email", formData.email);
      data.append(
        "socialLinks",
        JSON.stringify({
          facebook: formData.facebook,
          website: formData.website,
        })
      );

      if (logo) data.append("logo", logo);

      await axios.put(
        `http://localhost:5000/api/pandel/update/${pandelIdToEdit}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Pandel updated successfully!");
      fetchPandels();
      if (onBack) onBack();
    } catch (error) {
      console.error("Error updating pandel:", error);
      alert("❌ Error updating pandel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-emerald-500">
        Edit Pandel Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Pandel Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          />
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded-lg dark:bg-neutral-900"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded-lg dark:bg-neutral-900"
            />
          </div>
        </div>

     {/* Type, Zone & Heritage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          >
            <option value="">Select Type</option>
            <option value="Barowari">Barowari</option>
            <option value="Bonedi Bari">Bonedi Bari</option>
          </select>

          <select
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          >
            <option value="">Select Zone</option>
            <option value="North Kolkata">North Kolkata</option>
            <option value="South Kolkata">South Kolkata</option>
            <option value="North & East City">North & East City</option>
            <option value="Behala">Behala</option>
            <option value="Haridevpur & Others">Haridevpur & Others</option>
            <option value="Bonedi Bari">Bonedi Bari</option>
          </select>

           {/* Heritage dropdown */}
          <select
            name="heritageStatus"
            value={formData.heritageStatus}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          >
            <option value="false">Non-Heritage</option>
            <option value="true">Heritage</option>
          </select>
        </div>

        <input
          type="number"
          name="founded"
          placeholder="Founded Year"
          value={formData.founded}
          onChange={handleChange}
          className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
        />

        {/* Nearest Locations */}
        <h3 className="text-lg font-medium text-emerald-500 mt-6">
          Nearest Locations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="metro"
            placeholder="Nearest Metro"
            value={formData.metro}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900"
          />
          <input
            type="text"
            name="railway"
            placeholder="Nearest Railway"
            value={formData.railway}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900"
          />
          <input
            type="text"
            name="bus"
            placeholder="Nearest Bus Stop"
            value={formData.bus}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900"
          />
        </div>

        {/* Contact Info */}
        <h3 className="text-lg font-medium text-emerald-500 mt-6">
          Contact Information
        </h3>
        <div className="space-y-3">
          {formData.contactNumbers.map((number, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Contact Number ${index + 1}`}
              value={number}
              onChange={(e) => handleContactChange(e, index)}
              className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
            />
          ))}
          <button
            type="button"
            onClick={addContactField}
            className="text-sm text-emerald-500 hover:underline"
          >
            + Add Another Number
          </button>

          <input
            type="email"
            name="email"
            placeholder="Contact Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full"
          />
        </div>

        {/* Social Links */}
        <h3 className="text-lg font-medium text-emerald-500 mt-6">
          Social Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="facebook"
            placeholder="Facebook Page Link"
            value={formData.facebook}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900"
          />
          <input
            type="text"
            name="website"
            placeholder="Website URL"
            value={formData.website}
            onChange={handleChange}
            className="p-2 border rounded-lg dark:bg-neutral-900"
          />
        </div>

        {/* Logo Upload */}
        <div className="mt-4">
          <label className="block mb-2 text-sm text-gray-600">
            {existingLogo ? "Update Logo" : "Upload Logo"}
          </label>
          {existingLogo && (
            <img
              src={existingLogo}
              alt="Existing Logo"
              className="w-20 h-20 rounded object-cover border mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="p-2 border rounded-lg dark:bg-neutral-900 w-full cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600  w-full font-semibold cursor-pointer"
        >
          {loading ? "Updating..." : "Update Pandel"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 w-full font-semibold cursor-pointer"
        >
          Cancel Edit
        </button>
      </form>
    </div>
  );
};

export default EditPandel;
