
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiMapPin, FiNavigation, FiClock, FiSearch, FiRefreshCw, FiEdit2, FiTrash2, FiX, FiSave, FiInfo, FiShuffle } from "react-icons/fi";
import { MdTrain } from "react-icons/md";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

const initialFormData = {
  station: "",
  pandal: "",
  sequence: "",
  distanceFromStationM: "",
  accessMode: "walk",
  accessMinutes: "",
  tips: "",
};

const getArray = (response, keys = []) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getId = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id || value.id || "" : value;
};

const getName = (value, fallback = "Unknown") => {
  if (!value) return fallback;
  return typeof value === "object"
    ? value.name || value.title || fallback
    : fallback;
};

const ManageStationPandel = () => {
  const [connections, setConnections] = useState([]);
  const [stations, setStations] = useState([]);
  const [pandels, setPandels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchConnections = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const [connectionRes, stationRes, pandelRes] = await Promise.all([
        axios.get(`${API}/api/transit/station-pandels/all`),
        axios.get(`${API}/api/transit/stations/all`),
        axios.get(`${API}/api/pandel/`),
      ]);

      const connectionList = getArray(connectionRes, [
        "connections",
        "stationPandels",
        "data",
      ]);

      setConnections(connectionList);

      setStations(
        getArray(stationRes, ["stations", "transitStations", "data"])
      );

      setPandels(
        getArray(pandelRes, ["pandels", "pandel", "data", "allPandels"])
      );
    } catch (error) {
      console.error("Fetch station-pandel error:", error);
      showError(
        error.response?.data?.message ||
        "Failed to load station-pandel connections"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const filteredConnections = useMemo(() => {
    return connections.filter((item) => {
      const stationName = getName(item.station, "");
      const pandelName = getName(item.pandal, "");

      const searchMatch =
        stationName.toLowerCase().includes(search.toLowerCase()) ||
        pandelName.toLowerCase().includes(search.toLowerCase());

      const accessMatch =
        accessFilter === "all" || item.access?.mode === accessFilter;

      return searchMatch && accessMatch;
    });
  }, [connections, search, accessFilter]);

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      station: getId(item.station),
      pandal: getId(item.pandal),
      sequence: item.sequence ?? "",
      distanceFromStationM: item.distanceFromStationM ?? "",
      accessMode: item.access?.mode || "walk",
      accessMinutes: item.access?.minutes ?? "",
      tips: item.tips || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    if (!formData.station || !formData.pandal) {
      showError("Please select both station and pandel");
      return;
    }

    const sequence = Number(formData.sequence);
    const distance = Number(formData.distanceFromStationM);
    const minutes =
      formData.accessMinutes === ""
        ? undefined
        : Number(formData.accessMinutes);

    if (!Number.isInteger(sequence) || sequence < 0) {
      showError("Sequence must be a non-negative integer");
      return;
    }

    if (!Number.isFinite(distance) || distance < 0) {
      showError("Please enter a valid distance");
      return;
    }

    if (
      minutes !== undefined &&
      (!Number.isInteger(minutes) || minutes < 0)
    ) {
      showError("Access minutes must be a non-negative integer");
      return;
    }

    const payload = {
      station: formData.station,
      pandal: formData.pandal,
      sequence,
      distanceFromStationM: distance,
      access: {
        mode: formData.accessMode,
        ...(minutes !== undefined && { minutes }),
      },
      tips: formData.tips.trim(),
    };

    try {
      setSaving(true);

      const response = await axios.put(
        `${API}/api/transit/station-pandels/update/${editingId}`,
        payload
      );

      if (response.data?.success) {
        showSuccess(
          response.data.message || "Connection updated successfully"
        );

        handleCancelEdit();
        await fetchConnections(false);
      } else {
        showError(response.data?.message || "Failed to update connection");
      }
    } catch (error) {
      console.error("Update connection error:", error);
      showError(
        error.response?.data?.message || "Failed to update connection"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this station-pandel connection?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await axios.delete(
        `${API}/api/transit/station-pandels/delete/${id}`
      );

      if (response.data?.success) {
        showSuccess(
          response.data.message || "Connection deleted successfully"
        );

        setConnections((prev) => prev.filter((item) => item._id !== id));

        if (editingId === id) {
          handleCancelEdit();
        }
      } else {
        showError(response.data?.message || "Failed to delete connection");
      }
    } catch (error) {
      console.error("Delete connection error:", error);
      showError(
        error.response?.data?.message || "Failed to delete connection"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getAccessLabel = (mode) => {
    const labels = {
      walk: "Walking",
      rickshaw: "Rickshaw",
      auto: "Auto",
      bus: "Bus",
    };

    return labels[mode] || mode || "Not specified";
  };

  return (
    <div className="mx-auto w-full space-y-6 rounded-xl bg-white p-4 shadow-lg transition-colors duration-300 dark:bg-neutral-800 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
            <FiNavigation className="text-green-600" />
            Manage Station-Pandel
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage the connections between transit stations and pandels.
          </p>
        </div>

        <button
          onClick={() => fetchConnections(false)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Connections
            </p>
            <FiNavigation className="text-xl text-green-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {connections.length}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stations Connected
            </p>
            <MdTrain className="text-xl text-blue-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {new Set(connections.map((item) => getId(item.station))).size}
          </h3>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pandels Connected
            </p>
            <FiMapPin className="text-xl text-purple-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {new Set(connections.map((item) => getId(item.pandal))).size}
          </h3>
        </div>
      </div>

      {/* Edit Form */}
      {editingId && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-neutral-900">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Edit Connection
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update station-pandel connection details.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-red-600 dark:hover:bg-neutral-700"
              title="Close edit form"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Station */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transit Station *
                </label>

                <select
                  name="station"
                  value={formData.station}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Select Station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station._id}>
                      {station.name}
                      {station.code ? ` (${station.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pandel */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pandel *
                </label>

                <select
                  name="pandal"
                  value={formData.pandal}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Select Pandel</option>
                  {pandels.map((pandel) => (
                    <option key={pandel._id} value={pandel._id}>
                      {pandel.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sequence */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sequence *
                </label>

                <input
                  type="number"
                  name="sequence"
                  min="0"
                  step="1"
                  value={formData.sequence}
                  onChange={handleChange}
                  required
                  placeholder="Enter sequence"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Distance */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distance from Station (meters) *
                </label>

                <input
                  type="number"
                  name="distanceFromStationM"
                  min="0"
                  step="any"
                  value={formData.distanceFromStationM}
                  onChange={handleChange}
                  required
                  placeholder="Enter distance in meters"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              {/* Access Mode */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Mode *
                </label>

                <select
                  name="accessMode"
                  value={formData.accessMode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="walk">Walking</option>
                  <option value="rickshaw">Rickshaw</option>
                  <option value="auto">Auto</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              {/* Minutes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Time (minutes)
                </label>

                <input
                  type="number"
                  name="accessMinutes"
                  min="0"
                  step="1"
                  value={formData.accessMinutes}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {/* Tips */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Travel Tips
              </label>

              <textarea
                name="tips"
                value={formData.tips}
                onChange={handleChange}
                rows="3"
                placeholder="Enter useful directions or travel tips..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                <FiSave />
                {saving ? "Updating..." : "Update Connection"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                <FiX />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station or pandel..."
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 outline-none transition focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          />
        </div>

        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white sm:w-48"
        >
          <option value="all">All Access Modes</option>
          <option value="walk">Walking</option>
          <option value="rickshaw">Rickshaw</option>
          <option value="auto">Auto</option>
          <option value="bus">Bus</option>
        </select>
      </div>

      {/* Connection List */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
            <FiShuffle className="text-green-600" />
            Station-Pandel Connections
          </h3>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {filteredConnections.length} Results
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiRefreshCw className="mb-3 animate-spin text-3xl text-green-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading connections...
            </p>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-neutral-600">
            <FiInfo className="mx-auto mb-3 text-3xl text-gray-400" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">
              No Connections Found
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredConnections.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <MdTrain className="shrink-0 text-blue-600" />
                      <h4 className="truncate font-semibold text-gray-800 dark:text-white">
                        {getName(item.station)}
                      </h4>
                    </div>

                    <div className="my-3 ml-1 flex items-center gap-2 text-gray-400">
                      <div className="h-5 border-l border-dashed border-gray-400" />
                      <FiShuffle size={14} />
                    </div>

                    <div className="flex items-center gap-2">
                      <FiMapPin className="shrink-0 text-red-500" />
                      <h4 className="truncate font-semibold text-gray-800 dark:text-white">
                        {getName(item.pandal)}
                      </h4>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    #{item.sequence}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3 dark:bg-neutral-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <FiNavigation />
                      Distance
                    </div>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                      {item.distanceFromStationM ?? 0} m
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 dark:bg-neutral-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <FiClock />
                      Estimated Time
                    </div>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">
                      {item.access?.minutes != null
                        ? `${item.access.minutes} min`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Access Mode */}
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2.5 dark:bg-neutral-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Access Mode
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {getAccessLabel(item.access?.mode)}
                  </span>
                </div>

                {/* Tips */}
                {item.tips && (
                  <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-400">
                      Travel Tips
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {item.tips}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-3 border-t border-gray-200 pt-4 dark:border-neutral-700">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiTrash2 />
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStationPandel;
