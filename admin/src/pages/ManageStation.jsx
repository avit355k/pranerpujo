
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

import { IoSearch, IoRefresh, IoPencil, IoTrash, IoClose, IoLocationSharp, IoTrainSharp, IoFilter, IoChevronDown } from "react-icons/io5";

import { RiTrainFill } from "react-icons/ri";
import { FaMapMarkerAlt } from "react-icons/fa";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition";

const labelClass =
  "block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2";

const initialForm = {
  name: "",
  code: "",
  line: "",
  latitude: "",
  longitude: "",
  sequence: "1",
  transitTip: "",
  colorOverride: "",
  iconOverride: "",
};

const ManageStation = () => {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingLines, setFetchingLines] = useState(false);

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [lineFilter, setLineFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [updating, setUpdating] = useState(false);

  // Fetch all stations
  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/transit/stations/all`
      );

      setStations(data.stations || data.data || []);
    } catch (error) {
      console.error("Fetch Stations Error:", error);

      showError(
        error.response?.data?.message ||
        "Failed to fetch stations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all transit lines
  const fetchLines = useCallback(async () => {
    try {
      setFetchingLines(true);

      const { data } = await axios.get(
        `${API}/api/transit/lines/all`
      );

      setLines(
        data.transitLines ||
        data.lines ||
        data.data ||
        []
      );
    } catch (error) {
      console.error("Fetch Lines Error:", error);

      showError(
        error.response?.data?.message ||
        "Failed to fetch transit lines"
      );
    } finally {
      setFetchingLines(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
    fetchLines();
  }, [fetchStations, fetchLines]);

  // Search and filter stations
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        station.name?.toLowerCase().includes(searchValue) ||
        station.code?.toLowerCase().includes(searchValue) ||
        station.line?.name?.toLowerCase().includes(searchValue);

      const modeKey = station.line?.mode?.key;

      const matchesMode =
        modeFilter === "all" ||
        modeKey === modeFilter;

      const lineId =
        station.line?._id?.toString() ||
        station.line?.toString();

      const matchesLine =
        lineFilter === "all" ||
        lineId === lineFilter;

      return matchesSearch && matchesMode && matchesLine;
    });
  }, [stations, search, modeFilter, lineFilter]);

  // Statistics
  const metroCount = stations.filter(
    (station) => station.line?.mode?.key === "metro"
  ).length;

  const trainCount = stations.filter(
    (station) => station.line?.mode?.key === "train"
  ).length;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open edit modal
  const handleEdit = (station) => {
    if (!station.location) {
      showError("Station location information is unavailable");
      return;
    }

    setEditingId(station._id);

    setFormData({
      name: station.name || "",
      code: station.code || "",
      line: station.line?._id || station.line || "",
      latitude: station.location.latitude ?? "",
      longitude: station.location.longitude ?? "",
      sequence: String(station.sequence ?? 0),
      transitTip: station.transitTip || "",
      colorOverride: station.colorOverride || "",
      iconOverride: station.iconOverride || "",
    });

    setShowModal(true);
  };

  // Close edit modal
  const closeModal = () => {
    if (updating) return;

    setShowModal(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  // Update station
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return showError("Please enter station name");
    }

    if (!formData.line) {
      return showError("Please select a transit line");
    }

    if (
      formData.latitude === "" ||
      formData.longitude === ""
    ) {
      return showError("Please enter station coordinates");
    }

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);
    const sequence = Number(formData.sequence);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      return showError("Invalid latitude. Use -90 to 90");
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return showError("Invalid longitude. Use -180 to 180");
    }

    if (!Number.isInteger(sequence) || sequence < 0) {
      return showError("Sequence must be a non-negative integer");
    }

    if (
      formData.colorOverride &&
      !/^#([0-9A-Fa-f]{6})$/.test(formData.colorOverride)
    ) {
      return showError("Invalid HEX color. Example: #2563EB");
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      line: formData.line,
      location: {
        latitude,
        longitude,
      },
      sequence,
      transitTip: formData.transitTip.trim(),
      colorOverride: formData.colorOverride.trim(),
      iconOverride: formData.iconOverride.trim(),
    };

    try {
      setUpdating(true);

      const { data } = await axios.put(
        `${API}/api/transit/stations/update/${editingId}`,
        payload
      );

      showSuccess(
        data.message || "Station updated successfully!"
      );

      closeModal();
      await fetchStations();
    } catch (error) {
      console.error("Update Station Error:", error);

      showError(
        error.response?.data?.message ||
        "Failed to update station"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Delete station
  const handleDelete = async (station) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${station.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { data } = await axios.delete(
        `${API}/api/transit/stations/delete/${station._id}`
      );

      showSuccess(
        data.message || "Station deleted successfully!"
      );

      await fetchStations();
    } catch (error) {
      console.error("Delete Station Error:", error);

      showError(
        error.response?.data?.message ||
        "Failed to delete station"
      );
    }
  };

  // Selected line preview
  const selectedLine = lines.find(
    (line) => line._id === formData.line
  );

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

        <div>
          <h2 className="text-2xl font-semibold text-emerald-500">
            Manage Stations
          </h2>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            View, edit and manage your transportation stations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchStations();
            fetchLines();
          }}
          disabled={loading || fetchingLines}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition disabled:opacity-50"
        >
          <IoRefresh
            className={loading ? "animate-spin" : ""}
            size={18}
          />
          Refresh
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Total Stations
            </p>
            <IoLocationSharp className="text-2xl text-emerald-500" />
          </div>

          <p className="text-2xl font-bold text-neutral-800 dark:text-white mt-2">
            {stations.length}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Metro Stations
            </p>
            <RiTrainFill className="text-2xl text-blue-500" />
          </div>

          <p className="text-2xl font-bold text-neutral-800 dark:text-white mt-2">
            {metroCount}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Train Stations
            </p>
            <IoTrainSharp className="text-2xl text-orange-500" />
          </div>

          <p className="text-2xl font-bold text-neutral-800 dark:text-white mt-2">
            {trainCount}
          </p>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl" />

          <input
            type="text"
            placeholder="Search station, code or line..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>

        {/* Mode Filter */}
        <div className="relative">
          <IoFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none" />

          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setLineFilter("all");
            }}
            className={`${inputClass} pl-10 appearance-none`}
          >
            <option value="all">All Transit Modes</option>
            <option value="metro">Metro</option>
            <option value="train">Train</option>
          </select>

          <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        {/* Line Filter */}
        <div className="relative">
          <select
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="all">All Transit Lines</option>

            {lines
              .filter((line) =>
                modeFilter === "all" ||
                line.mode?.key === modeFilter
              )
              .map((line) => (
                <option key={line._id} value={line._id}>
                  {line.name}
                </option>
              ))}
          </select>

          <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Showing{" "}
          <span className="font-semibold text-neutral-800 dark:text-white">
            {filteredStations.length}
          </span>{" "}
          of {stations.length} stations
        </p>
      </div>

      {/* Station Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">

        <table className="w-full min-w-[850px] text-left">

          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr className="text-sm text-neutral-600 dark:text-neutral-300">
              <th className="px-5 py-4">Station</th>
              <th className="px-5 py-4">Transit Line</th>
              <th className="px-5 py-4">Mode</th>
              <th className="px-5 py-4">Sequence</th>
              <th className="px-5 py-4">Color</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">

            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex justify-center">
                    <span className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                    Loading stations...
                  </p>
                </td>
              </tr>
            ) : filteredStations.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-12 text-neutral-500 dark:text-neutral-400"
                >
                  <IoLocationSharp className="text-4xl mx-auto mb-2 opacity-50" />

                  <p className="font-medium">
                    No stations found
                  </p>

                  <p className="text-sm mt-1">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredStations.map((station) => {
                const line = station.line || {};
                const mode = line.mode || {};

                const stationColor =
                  station.colorOverride ||
                  line.color ||
                  "#64748b";

                return (
                  <tr
                    key={station._id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition"
                  >

                    {/* Station */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                          style={{
                            backgroundColor: stationColor,
                          }}
                        >
                          {mode.key === "train" ? (
                            <IoTrainSharp size={20} />
                          ) : (
                            <RiTrainFill size={20} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-neutral-800 dark:text-white">
                            {station.name}
                          </p>

                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {station.code || "No station code"}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Transit Line */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: line.color || "#64748b",
                          }}
                        />

                        <span className="text-sm text-neutral-700 dark:text-neutral-200">
                          {line.name || "Unknown Line"}
                        </span>
                      </div>
                    </td>

                    {/* Mode */}
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                        {mode.name || "Unknown"}
                      </span>
                    </td>

                    {/* Sequence */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white text-sm font-semibold">
                        {station.sequence}
                      </span>
                    </td>

                    {/* Color */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-600"
                          style={{
                            backgroundColor: stationColor,
                          }}
                        />

                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {stationColor}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(station)}
                          title="Edit Station"
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition"
                        >
                          <IoPencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(station)}
                          title="Delete Station"
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                        >
                          <IoTrash size={18} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>
      </div>

      {/* Edit Station Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">

              <div>
                <h3 className="text-xl font-semibold text-emerald-500">
                  Edit Station
                </h3>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Update station information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={updating}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition"
              >
                <IoClose size={24} />
              </button>

            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-5 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}
                <div>
                  <label className={labelClass}>
                    Station Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Dum Dum"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Code */}
                <div>
                  <label className={labelClass}>
                    Station Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. KDUM"
                    className={inputClass}
                  />
                </div>

              </div>

              {/* Line */}
              <div>
                <label className={labelClass}>
                  Transit Line *
                </label>

                <select
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">
                    Select Transit Line
                  </option>

                  {lines.map((line) => (
                    <option key={line._id} value={line._id}>
                      {line.name}
                      {line.mode?.name
                        ? ` (${line.mode.name})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-semibold text-neutral-800 dark:text-white mb-3 flex items-center gap-2">
                  <IoLocationSharp className="text-emerald-500" />
                  Station Location
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      Latitude *
                    </label>

                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      step="any"
                      min="-90"
                      max="90"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Longitude *
                    </label>

                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      step="any"
                      min="-180"
                      max="180"
                      className={inputClass}
                      required
                    />
                  </div>

                </div>
              </div>

              {/* Sequence */}
              <div>
                <label className={labelClass}>
                  Station Sequence *
                </label>

                <input
                  type="number"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={inputClass}
                  required
                />

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Determines the station's order within its transit line.
                </p>
              </div>

              {/* Transit Tip */}
              <div>
                <label className={labelClass}>
                  Transit Tip
                </label>

                <textarea
                  name="transitTip"
                  value={formData.transitTip}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter helpful transit information..."
                  className={inputClass}
                />
              </div>

              {/* Customization */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-5">

                <h4 className="font-semibold text-neutral-800 dark:text-white mb-4">
                  Station Customization
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Color */}
                  <div>
                    <label className={labelClass}>
                      Color Override
                    </label>

                    <div className="flex items-center gap-3">

                      <input
                        type="color"
                        value={
                          /^#([0-9A-Fa-f]{6})$/.test(formData.colorOverride)
                            ? formData.colorOverride
                            : "#64748b"
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            colorOverride: e.target.value,
                          }))
                        }
                        className="w-12 h-11 rounded-lg cursor-pointer border border-neutral-300 dark:border-neutral-600 p-1 bg-white dark:bg-neutral-900"
                      />

                      <input
                        type="text"
                        name="colorOverride"
                        value={formData.colorOverride}
                        onChange={handleChange}
                        placeholder="#2563EB"
                        className={inputClass}
                      />

                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Empty means inherit line color.
                    </p>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className={labelClass}>
                      Icon Override
                    </label>

                    <input
                      type="text"
                      name="iconOverride"
                      value={formData.iconOverride}
                      onChange={handleChange}
                      placeholder="Enter icon value or URL"
                      className={inputClass}
                    />

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Empty means inherit line or mode icon.
                    </p>
                  </div>

                </div>
              </div>

              {/* Preview */}
              {selectedLine && (
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">

                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3">
                    Station Preview
                  </p>

                  <div className="flex items-center gap-3">

                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor:
                          formData.colorOverride ||
                          selectedLine.color ||
                          "#64748b",
                      }}
                    >
                      {selectedLine.mode?.key === "train" ? (
                        <IoTrainSharp size={22} />
                      ) : (
                        <RiTrainFill size={22} />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-white">
                        {formData.name || "Station Name"}
                      </p>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {selectedLine.name}
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <IoPencil />
                      Update Station
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageStation;
