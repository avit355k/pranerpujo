
import React, { useEffect, useState } from "react";
import { IoTrainSharp } from "react-icons/io5";
import { RiTrainFill } from "react-icons/ri";
import { HiMiniInformationCircle } from "react-icons/hi2";
import axios from "axios";

import { API } from "../../services/api";

const RouteGuide = () => {
    const [transport, setTransport] = useState("metro");

    const [modes, setModes] = useState([]);
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [connections, setConnections] = useState([]);

    const [selectedLine, setSelectedLine] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isMetro = transport === "metro";

    // Remove trailing slash from API URL.
    const API_BASE = API?.replace(/\/+$/, "");

    // API Response Helpers
    const getModes = (response) =>
        response?.data?.transitModes || [];

    const getLines = (response) =>
        response?.data?.transitLines || [];

    const getStations = (response) =>
        response?.data?.stations || [];

    const getConnections = (response) =>
        response?.data?.data || [];

    // Get hexadecimal colors from backend
    const getLineColor = (line) => {
        return (
            line?.color ||
            line?.mode?.color ||
            "#64748b"
        );
    };

    // Convert HEX color into RGBA
    const getLightColor = (hex, opacity = 0.12) => {
        if (!hex || typeof hex !== "string") {
            return `rgba(100, 116, 139, ${opacity})`;
        }

        const color = hex.replace("#", "");

        if (!/^[0-9a-fA-F]{6}$/.test(color)) {
            return `rgba(100, 116, 139, ${opacity})`;
        }

        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    // Dynamic React Icon Mapping
    const transitIcons = {
        RiTrainFill,
        IoTrainSharp,
    };

    const getTransitIcon = (iconName) => {
        return transitIcons[iconName] || IoTrainSharp;
    };

    // GET /api/transit/modes/all
    useEffect(() => {
        let isMounted = true;

        const fetchModes = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_BASE}/api/transit/modes/all`
                );

                const fetchedModes = getModes(response);

                if (!isMounted) return;

                setModes(fetchedModes);

                const defaultMode =
                    fetchedModes.find(
                        (mode) => mode.key === "metro"
                    ) || fetchedModes[0];

                if (defaultMode) {
                    setTransport(defaultMode.key);
                }
            } catch (err) {
                console.error("Fetch Transit Modes Error:", err);

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load transport modes."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchModes();

        return () => {
            isMounted = false;
        };
    }, []);

    // GET /api/transit/lines/all
    useEffect(() => {
        let isMounted = true;

        const fetchLines = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_BASE}/api/transit/lines/all`
                );

                const allLines = getLines(response);

                if (!isMounted) return;

                // Match lines with selected transport mode.
                const filteredLines = allLines.filter((line) => {
                    const modeKey =
                        typeof line.mode === "object"
                            ? line.mode?.key
                            : modes.find(
                                (mode) => mode._id === line.mode
                            )?.key;

                    return (
                        modeKey === transport &&
                        line.isActive !== false
                    );
                });

                setLines(filteredLines);

                // Automatically select first available line.
                setSelectedLine(filteredLines[0] || null);

                setSelectedStation(null);
                setStations([]);
                setConnections([]);
            } catch (err) {
                console.error("Fetch Transit Lines Error:", err);

                if (isMounted) {
                    setLines([]);
                    setSelectedLine(null);

                    setError(
                        err.response?.data?.message ||
                        "Unable to load transit lines."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (modes.length > 0) {
            fetchLines();
        }

        return () => {
            isMounted = false;
        };
    }, [transport, modes]);

    // GET: Stations by Line
    // GET /api/transit/stations/line/:lineId
    useEffect(() => {
        let isMounted = true;

        const fetchStations = async () => {
            if (!selectedLine?._id) {
                setStations([]);
                setSelectedStation(null);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_BASE}/api/transit/stations/line/${selectedLine._id}`
                );

                // Response: { success, line, count, stations }
                const fetchedStations = getStations(response);

                if (!isMounted) return;

                setStations(fetchedStations);

                // Automatically select first station.
                setSelectedStation(
                    fetchedStations[0] || null
                );

                setConnections([]);
            } catch (err) {
                console.error("Fetch Stations Error:", err);

                if (isMounted) {
                    setStations([]);
                    setSelectedStation(null);
                    setConnections([]);

                    setError(
                        err.response?.data?.message ||
                        "Unable to load stations."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStations();

        return () => {
            isMounted = false;
        };
    }, [selectedLine?._id]);

    // GET /api/transit/station-pandels/station/:stationId
    useEffect(() => {
        let isMounted = true;

        const fetchConnections = async () => {
            if (!selectedStation?._id) {
                setConnections([]);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_BASE}/api/transit/station-pandels/station/${selectedStation._id}`
                );

                // Response: { success, station, count, data }
                const fetchedConnections =
                    getConnections(response);

                if (!isMounted) return;

                setConnections(fetchedConnections);
            } catch (err) {
                console.error(
                    "Fetch Station Pandels Error:",
                    err
                );

                if (isMounted) {
                    setConnections([]);

                    setError(
                        err.response?.data?.message ||
                        "Unable to load pandels for this station."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchConnections();

        return () => {
            isMounted = false;
        };
    }, [selectedStation?._id]);


    // Handle Line Selection
    const handleLineChange = (line) => {
        setSelectedLine(line);
        setSelectedStation(null);
        setStations([]);
        setConnections([]);
        setError("");
    };

    // Handle Transport Selection
    const handleTransportChange = (type) => {
        if (transport === type) return;

        setTransport(type);
        setSelectedLine(null);
        setSelectedStation(null);
        setStations([]);
        setConnections([]);
        setError("");
    };

    // Selected Line Color
    const lineColor = getLineColor(selectedLine);

    const selectedStationColor =
        selectedStation?.colorOverride || lineColor;

    return (
        <section className="mx-auto px-4 py-20 bg-neutral-100 dark:bg-neutral-800 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border border-gray-400 rounded-2xl p-4 sm:p-5">

                <div className="rounded-full p-2 border border-gray-100 bg-blue-100 shrink-0">
                    <RiTrainFill
                        className="h-6 w-6 sm:h-8 sm:w-8"
                        style={{ color: "#45B1E8" }}
                    />
                </div>

                <div className="min-w-0">
                    <h1 className="font-display font-bold text-base sm:text-lg dark:text-white">
                        Start at the station
                    </h1>

                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-synonym font-medium leading-relaxed">
                        Choose where you arrive, then get a route built around distance and the time you have.
                    </p>
                </div>

            </div>

            {/* Transport Tabs */}

            <div className="mt-6 bg-neutral-200 dark:bg-neutral-700 transition-colors rounded-2xl p-2 flex items-center justify-evenly">

                <button
                    onClick={() => handleTransportChange("metro")}
                    className={`flex items-center justify-center gap-2 w-1/2 rounded-lg p-3 font-display font-bold transition-colors ${isMetro
                        ? "bg-red-500 text-white"
                        : "text-neutral-600 dark:text-white"
                        }`}
                >

                    <RiTrainFill className="h-5 w-5" />

                    Metro

                </button>

                <button
                    onClick={() => handleTransportChange("train")}
                    className={`flex items-center justify-center gap-2 w-1/2 rounded-lg p-3 font-display font-bold transition-colors ${!isMetro
                        ? "bg-red-500 text-white"
                        : "text-neutral-600 dark:text-white"
                        }`}
                >

                    <IoTrainSharp className="h-5 w-5" />

                    Train

                </button>

            </div>

            {/* Loading */}

            {loading && (
                <div className="mt-4 text-center text-neutral-500 dark:text-neutral-300">
                    Loading transit information...
                </div>
            )}

            {/* Error */}

            {error && (
                <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Transport Selection */}

            <div className="mt-4">

                <h1 className="font-display font-bold dark:text-white mb-2">
                    Select a {isMetro ? "metro" : "railway"} station
                </h1>

                {/* Transit Lines */}

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

                    {lines.map((line) => {

                        const color = getLineColor(line);

                        const isSelected =
                            selectedLine?._id === line._id;

                        return (
                            <button
                                key={line._id}
                                onClick={() => handleLineChange(line)}
                                className="shrink-0 p-3 border border-gray-100 rounded-xl font-bold font-synonym transition-colors"
                                style={{
                                    backgroundColor: isSelected
                                        ? color
                                        : getLightColor(color),

                                    color: isSelected
                                        ? "#ffffff"
                                        : color,

                                    borderColor: color,
                                }}
                            >
                                {line.name}
                            </button>
                        );
                    })}

                </div>

                {!loading && lines.length === 0 && !error && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                        No {isMetro ? "metro" : "railway"} lines available.
                    </p>
                )}

                {/* Stations */}

                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">

                    {stations.map((station) => {

                        const stationColor =
                            station.colorOverride || lineColor;

                        const isSelected =
                            selectedStation?._id === station._id;

                        // Get icon from station, line or mode.
                        const stationIconName =
                            station.iconOverride ||
                            selectedLine?.iconOverride ||
                            selectedLine?.mode?.icon;

                        const StationIcon =
                            getTransitIcon(stationIconName);

                        return (
                            <button
                                key={station._id}
                                onClick={() =>
                                    setSelectedStation(station)
                                }
                                className="bg-neutral-200 dark:bg-neutral-700 shrink-0 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl transition-colors"
                                style={{
                                    backgroundColor: isSelected
                                        ? getLightColor(stationColor, 0.12)
                                        : undefined,

                                    borderColor: isSelected
                                        ? stationColor
                                        : "",
                                }}
                            >

                                <div className="flex items-center justify-center gap-2">

                                    <StationIcon
                                        className="h-5 w-5"
                                        style={{
                                            color: isSelected
                                                ? stationColor
                                                : undefined,
                                        }}
                                    />

                                    <div className="text-left">

                                        <h3
                                            className={`font-bold ${!isSelected
                                                ? "text-black dark:text-white"
                                                : ""
                                                }`}
                                            style={{
                                                color: isSelected
                                                    ? stationColor
                                                    : undefined,
                                            }}
                                        >
                                            {station.name}
                                        </h3>

                                        <span className="font-bold text-neutral-500 dark:text-neutral-400">
                                            {station.code || "—"}
                                        </span>

                                    </div>

                                </div>

                            </button>
                        );
                    })}

                </div>

                {!loading &&
                    selectedLine &&
                    stations.length === 0 &&
                    !error && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                            No stations available for this line.
                        </p>
                    )}

                {/* Selected Station Pandels */}

                {selectedStation && (

                    <div className="mt-4 bg-white dark:bg-black p-4 rounded-2xl flex flex-col">

                        <div className="flex items-center justify-between">

                            <h1 className="text-black dark:text-white text-lg font-bold font-display">
                                {selectedStation.name}
                            </h1>

                            <span
                                className="px-3 py-2 rounded-md"
                                style={{
                                    backgroundColor: getLightColor(
                                        selectedStationColor
                                    ),
                                }}
                            >

                                <p
                                    className="text-sm font-bold"
                                    style={{
                                        color: selectedStationColor,
                                    }}
                                >
                                    {connections.length} Pandels
                                </p>

                            </span>

                        </div>

                        <div className="border-b border-neutral-200 dark:border-neutral-700 my-3" />

                        {connections.length > 0 ? (

                            <ul className="ml-5 list-disc space-y-3">

                                {connections.map((connection) => {

                                    const pandal = connection.pandal;

                                    if (!pandal) return null;

                                    return (
                                        <li
                                            key={connection._id}
                                            className="text-black dark:text-white font-medium font-display"
                                        >

                                            {pandal.name}

                                            <span className="block text-md text-neutral-500 font-normal font-synonym">

                                                {connection.distanceFromStationM != null
                                                    ? `${connection.distanceFromStationM} metres away`
                                                    : "Distance not available"}

                                                {connection.access?.mode &&
                                                    ` • ${connection.access.mode}`}

                                                {connection.access?.minutes != null &&
                                                    ` • ${connection.access.minutes} min`}

                                            </span>

                                            {connection.tips && (
                                                <div className="bg-orange-100 rounded-sm p-2 mt-1">
                                                    <span className="flex items-center gap-1 text-sm text-orange-500 font-bold ">
                                                        <HiMiniInformationCircle className="shrink-0" />
                                                        {connection.tips.charAt(0).toUpperCase() + connection.tips.slice(1).toLowerCase()}
                                                    </span>
                                                </div>
                                            )}

                                        </li>
                                    );
                                })}

                            </ul>

                        ) : (

                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {loading
                                    ? "Loading connected pandels..."
                                    : "No pandels connected to this station yet."}
                            </p>

                        )}

                    </div>

                )}

            </div>

        </section>
    );
};

export default RouteGuide;
