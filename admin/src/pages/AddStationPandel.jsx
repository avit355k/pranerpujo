import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiMapPin, FiNavigation, FiClock, FiPlus, FiRefreshCw, FiInfo, FiArrowRight, FiMap, } from "react-icons/fi";
import { MdTrain } from "react-icons/md";

import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

const STATION_PANDAL_API = `${API}/api/transit/station-pandels`;

const ACCESS_MODES = [
  { value: "walk", label: "Walking" },
  { value: "rickshaw", label: "Rickshaw" },
  { value: "auto", label: "Auto" },
  { value: "bus", label: "Bus" },
];

const initialForm = {
  station: "",
  pandal: "",
  sequence: "",
  distanceFromStationM: "",
  accessMode: "walk",
  accessMinutes: "",
  tips: "",
};

// Extract array from different possible API response structures
const getArray = (response, keys = []) => {
  if (Array.isArray(response)) return response;
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
};

const AddStationPandel = () => {
  const [stations, setStations] = useState([]);
  const [pandels, setPandels] = useState([]);

  // Existing connections of the currently selected station
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(initialForm);

  // Fetch stations and pandels
  const fetchData = async () => {
    try {
      setLoading(true);

      const [stationResponse, pandelResponse] = await Promise.all([
        axios.get(`${API}/api/transit/stations/all`),
        axios.get(`${API}/api/pandel/`),
      ]);

      setStations(
        getArray(stationResponse.data, ["stations", "data", "transitStations"])
      );
      setPandels(
        getArray(pandelResponse.data, ["pandels", "pandel", "data", "allPandels"])
      );
    } catch (error) {
      console.error("Fetch Station/Pandel Error:", error);
      showError(
        error.response?.data?.message || "Failed to load stations and pandels."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // GET /station/:stationId -> { success, station, count, data: [...] }
  const fetchConnections = useCallback(async (stationId, { autofill = true } = {}) => {
    if (!stationId) {
      setConnections([]);
      return;
    }

    try {
      setConnectionsLoading(true);

      const { data } = await axios.get(
        `${STATION_PANDAL_API}/station/${stationId}`
      );

      const list = Array.isArray(data?.data) ? data.data : [];
      setConnections(list);

      if (autofill) {
        const maxSequence = list.reduce(
          (max, item) => Math.max(max, Number(item.sequence) || 0),
          0
        );

        setFormData((prev) =>
          prev.station === stationId && prev.sequence === ""
            ? { ...prev, sequence: String(maxSequence + 1) }
            : prev
        );
      }
    } catch (error) {
      console.error("Fetch Station Connections Error:", error);
      setConnections([]);
      showError(
        error.response?.data?.message ||
        "Failed to load existing connections for this station."
      );
    } finally {
      setConnectionsLoading(false);
    }
  }, []);

  // Reload existing connections whenever the station changes
  useEffect(() => {
    fetchConnections(formData.station);
  }, [formData.station, fetchConnections]);

  // Pandels already connected to the selected station (API returns 409 for duplicates)
  const connectedPandalIds = useMemo(
    () =>
      new Set(
        connections.map((item) => String(item.pandal?._id ?? item.pandal))
      ),
    [connections]
  );

  // Sequence numbers already used for the selected station (API returns 409 for duplicates)
  const usedSequences = useMemo(
    () => new Set(connections.map((item) => Number(item.sequence))),
    [connections]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Changing station resets pandal and sequence (they depend on the station)
      if (name === "station") {
        return { ...prev, station: value, pandal: "", sequence: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleReset = () => {
    setFormData(initialForm);
    setConnections([]);
  };

  const sequenceInUse =
    formData.sequence !== "" && usedSequences.has(Number(formData.sequence));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.station || !formData.pandal) {
      showError("Please select both a station and a pandel.");
      return;
    }

    if (connectedPandalIds.has(formData.pandal)) {
      showError("This pandal is already connected to this station.");
      return;
    }

    const sequence = Number(formData.sequence);

    if (
      formData.sequence === "" ||
      !Number.isInteger(sequence) ||
      sequence < 0
    ) {
      showError("Sequence must be a non-negative integer.");
      return;
    }

    if (usedSequences.has(sequence)) {
      showError("This sequence is already used for this station.");
      return;
    }

    // Distance is optional in the API, but must be valid if provided
    if (
      formData.distanceFromStationM !== "" &&
      (!Number.isFinite(Number(formData.distanceFromStationM)) ||
        Number(formData.distanceFromStationM) < 0)
    ) {
      showError("Distance must be a non-negative number.");
      return;
    }

    if (
      formData.accessMinutes !== "" &&
      (!Number.isInteger(Number(formData.accessMinutes)) ||
        Number(formData.accessMinutes) < 0)
    ) {
      showError("Access minutes must be a non-negative integer.");
      return;
    }

    const tips = formData.tips.trim();

    const payload = {
      station: formData.station,
      pandal: formData.pandal,
      sequence,
      ...(formData.distanceFromStationM !== "" && {
        distanceFromStationM: Number(formData.distanceFromStationM),
      }),
      access: {
        mode: formData.accessMode,
        ...(formData.accessMinutes !== "" && {
          minutes: Number(formData.accessMinutes),
        }),
      },
      ...(tips && { tips }),
    };

    try {
      setSubmitting(true);

      const { data } = await axios.post(`${STATION_PANDAL_API}/create`, payload);

      showSuccess(
        data.message || "Station-pandel connection created successfully!"
      );

      // Keep the station selected so several pandels can be added quickly
      const stationId = formData.station;
      setFormData({ ...initialForm, station: stationId });
      fetchConnections(stationId);

    } catch (error) {
      console.error("Create Station Pandel Error:", error);

      showError(
        error.response?.data?.message ||
        "Something went wrong while creating the connection."
      );

      // On 409 the data may be stale, so refresh it
      if (error.response?.status === 409) {
        fetchConnections(formData.station, { autofill: false });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStation = stations.find((s) => s._id === formData.station);
  const selectedPandel = pandels.find((p) => p._id === formData.pandal);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

  return (
    <div className="mx-auto min-h-screen w-full bg-gray-50 p-4 transition-colors duration-300 dark:bg-neutral-900 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <FiMap className="text-lg" />
              Transit Management
              <FiArrowRight />
              Station Pandel
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Add Station Pandel
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Connect a nearby Durga Puja pandel with a metro or railway station.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <FiRefreshCw className="mb-3 animate-spin text-3xl text-emerald-500" />
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Loading stations and pandels...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              {/* Station and Pandel */}
              <div className="border-b border-gray-200 p-5 dark:border-neutral-700 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <FiNavigation className="text-xl" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Station & Pandel Details
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Select the station and the pandel to connect.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Station */}
                  <div>
                    <label className={labelClass}>
                      Select Station <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="station"
                      value={formData.station}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Choose a station</option>
                      {stations.map((station) => (
                        <option key={station._id} value={station._id}>
                          {station.name}
                          {station.code ? ` (${station.code})` : ""}
                          {station.line?.name ? ` - ${station.line.name}` : ""}
                        </option>
                      ))}
                    </select>

                    <p className="mt-1.5 text-xs text-gray-400">
                      {stations.length} stations available
                    </p>
                  </div>

                  {/* Pandel */}
                  <div>
                    <label className={labelClass}>
                      Select Pandel <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="pandal"
                      value={formData.pandal}
                      onChange={handleChange}
                      className={inputClass}
                      disabled={!formData.station || connectionsLoading}
                      required
                    >
                      <option value="">
                        {formData.station
                          ? "Choose a pandel"
                          : "Select a station first"}
                      </option>

                      {pandels.map((pandel) => {
                        const alreadyConnected = connectedPandalIds.has(
                          pandel._id
                        );

                        return (
                          <option
                            key={pandel._id}
                            value={pandel._id}
                            disabled={alreadyConnected}
                          >
                            {pandel.name}
                            {pandel.zone ? ` - ${pandel.zone}` : ""}
                            {alreadyConnected ? " (already connected)" : ""}
                          </option>
                        );
                      })}
                    </select>

                    <p className="mt-1.5 text-xs text-gray-400">
                      {pandels.length} pandels available
                      {formData.station &&
                        ` · ${connections.length} already connected to this station`}
                    </p>
                  </div>
                </div>

                {/* Connection Preview */}
                {(selectedStation || selectedPandel) && (
                  <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Connection Preview
                    </p>

                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div className="flex w-full items-center gap-3 sm:w-5/12">
                        <div className="rounded-lg bg-white p-2.5 text-emerald-600 shadow-sm dark:bg-neutral-800">
                          <MdTrain className="text-xl" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 dark:text-neutral-400">
                            Station
                          </p>
                          <p className="truncate font-semibold text-gray-900 dark:text-white">
                            {selectedStation?.name || "Not selected"}
                          </p>
                        </div>
                      </div>

                      <FiArrowRight className="hidden text-emerald-600 sm:block" />

                      <div className="flex w-full items-center gap-3 sm:w-5/12">
                        <div className="rounded-lg bg-white p-2.5 text-emerald-600 shadow-sm dark:bg-neutral-800">
                          <FiMapPin className="text-xl" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 dark:text-neutral-400">
                            Pandel
                          </p>
                          <p className="truncate font-semibold text-gray-900 dark:text-white">
                            {selectedPandel?.name || "Not selected"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(stations.length === 0 || pandels.length === 0) && (
                  <div className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                    <FiInfo className="mt-0.5 shrink-0" />
                    <p className="text-xs">
                      {stations.length === 0 && "No stations found. "}
                      {pandels.length === 0 && "No pandels found. "}
                      Please add the missing records before creating a connection.
                    </p>
                  </div>
                )}
              </div>

              {/* Distance and Sequence */}
              <div className="border-b border-gray-200 p-5 dark:border-neutral-700 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    <FiMapPin className="text-xl" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Distance & Sequence
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Configure the pandel's position relative to the station.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Sequence Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="sequence"
                      min="0"
                      step="1"
                      value={formData.sequence}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                      className={`${inputClass} ${sequenceInUse
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                        }`}
                      required
                    />

                    <p
                      className={`mt-1.5 text-xs ${sequenceInUse ? "text-red-500" : "text-gray-400"
                        }`}
                    >
                      {sequenceInUse
                        ? "This sequence is already used for this station."
                        : "Must be unique for this station. Next free number is suggested automatically."}
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Distance from Station (meters)
                    </label>

                    <input
                      type="number"
                      name="distanceFromStationM"
                      min="0"
                      step="any"
                      value={formData.distanceFromStationM}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className={inputClass}
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      Optional approximate distance between the station and pandel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Access Information */}
              <div className="border-b border-gray-200 p-5 dark:border-neutral-700 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Access Information
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      How can visitors reach the pandel from this station?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Access Mode</label>

                    <select
                      name="accessMode"
                      value={formData.accessMode}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {ACCESS_MODES.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Estimated Time (Minutes)</label>

                    <input
                      type="number"
                      name="accessMinutes"
                      min="0"
                      step="1"
                      value={formData.accessMinutes}
                      onChange={handleChange}
                      placeholder="e.g. 10"
                      className={inputClass}
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      Optional estimated travel time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visitor Tips */}
              <div className="p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <FiInfo className="text-xl" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Visitor Tips
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Add helpful information for visitors.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Tips / Instructions</label>

                  <textarea
                    name="tips"
                    rows="4"
                    value={formData.tips}
                    onChange={handleChange}
                    placeholder="e.g. Take the main station exit and walk towards the market..."
                    className={`${inputClass} resize-y`}
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Optional instructions about exits, routes, or nearby landmarks.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/50 sm:flex-row md:px-6">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
                >
                  <FiRefreshCw />
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    connectionsLoading ||
                    sequenceInUse ||
                    stations.length === 0 ||
                    pandels.length === 0
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Creating Connection...
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      Create Connection
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStationPandel;