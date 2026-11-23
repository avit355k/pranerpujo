
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

import { IoTrainSharp } from "react-icons/io5";
import { RiTrainFill } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

const initialForm = {
    name: "",
    code: "",
    line: "",
    latitude: "",
    longitude: "",
    sequence: "1",
    transitTip: "",
    colorOverride: "",
    iconOverride: ""
};

const inputClass =
    "w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition";

const labelClass =
    "block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2";

const AddStation = () => {
    const [formData, setFormData] = useState(initialForm);

    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingLines, setFetchingLines] = useState(false);

    // Fetch available transit lines
    const fetchLines = async () => {
        try {
            setFetchingLines(true);

            const { data } = await axios.get(
                `${API}/api/transit/lines/all`
            );

            const lineList =
                data.transitLines ||
                data.lines ||
                data.data ||
                [];

            setLines(lineList);

        } catch (error) {
            console.error("Error fetching transit lines:", error);

            showError(
                error.response?.data?.message ||
                "Failed to fetch transit lines"
            );
        } finally {
            setFetchingLines(false);
        }
    };

    useEffect(() => {
        fetchLines();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData(initialForm);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
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
            return showError("Please enter a valid latitude (-90 to 90)");
        }

        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            return showError("Please enter a valid longitude (-180 to 180)");
        }

        if (
            !Number.isInteger(sequence) ||
            sequence < 0
        ) {
            return showError("Sequence must be a non-negative integer");
        }

        // Validate optional HEX color
        if (
            formData.colorOverride &&
            !/^#([0-9A-Fa-f]{6})$/.test(formData.colorOverride)
        ) {
            return showError(
                "Invalid HEX color. Example: #2563EB"
            );
        }

        const payload = {
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            line: formData.line,
            location: {
                latitude,
                longitude
            },
            sequence,
            transitTip: formData.transitTip.trim(),
            colorOverride: formData.colorOverride.trim(),
            iconOverride: formData.iconOverride.trim()
        };

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${API}/api/transit/stations/create`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            showSuccess(
                data.message || "Transit Station added successfully!"
            );

            resetForm();

        } catch (error) {
            console.error("Error adding station:", error);

            showError(
                error.response?.data?.message ||
                "Failed to add transit station"
            );
        } finally {
            setLoading(false);
        }
    };

    // Selected line details
    const selectedLine = lines.find(
        (item) => item._id === formData.line
    );

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto transition-colors duration-300">

            <h2 className="text-2xl font-semibold mb-2 text-emerald-500 text-center">
                Add New Station
            </h2>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
                Create a new transportation station for your transit guide.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Station Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Station Name */}
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            Station Name *
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="e.g. Dum Dum"
                            value={formData.name}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Station Code */}
                    <div>
                        <label htmlFor="code" className={labelClass}>
                            Station Code
                        </label>

                        <input
                            id="code"
                            type="text"
                            name="code"
                            placeholder="e.g. KDUM"
                            value={formData.code}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                </div>

                {/* Transit Line */}
                <div>
                    <label htmlFor="line" className={labelClass}>
                        Transit Line *
                    </label>

                    <select
                        id="line"
                        name="line"
                        value={formData.line}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    >
                        <option value="">
                            {fetchingLines
                                ? "Loading transit lines..."
                                : "Select Transit Line"}
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

                    {!fetchingLines && lines.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">
                            No transit lines found. Please create a transit line first.
                        </p>
                    )}

                    {selectedLine && (
                        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">

                            <span
                                className="w-5 h-5 rounded-full shrink-0"
                                style={{
                                    backgroundColor:
                                        selectedLine.color || "#64748b"
                                }}
                            />

                            <div>
                                <p className="text-sm font-medium text-neutral-800 dark:text-white">
                                    {selectedLine.name}
                                </p>

                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {selectedLine.mode?.name || "Transit"} Line
                                    {" • "}
                                    {selectedLine.color || "No line color"}
                                </p>
                            </div>

                        </div>
                    )}
                </div>

                {/* Station Coordinates */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <MdLocationOn className="text-xl text-emerald-500" />

                        <h3 className="font-semibold text-neutral-800 dark:text-white">
                            Station Location
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Latitude */}
                        <div>
                            <label
                                htmlFor="latitude"
                                className={labelClass}
                            >
                                Latitude *
                            </label>

                            <input
                                id="latitude"
                                type="number"
                                name="latitude"
                                placeholder="e.g. 22.6447"
                                value={formData.latitude}
                                onChange={handleChange}
                                step="any"
                                min="-90"
                                max="90"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Longitude */}
                        <div>
                            <label
                                htmlFor="longitude"
                                className={labelClass}
                            >
                                Longitude *
                            </label>

                            <input
                                id="longitude"
                                type="number"
                                name="longitude"
                                placeholder="e.g. 88.4278"
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

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        Enter the geographical coordinates of the station.
                    </p>
                </div>

                {/* Station Sequence */}
                <div>
                    <label htmlFor="sequence" className={labelClass}>
                        Station Sequence *
                    </label>

                    <input
                        id="sequence"
                        type="number"
                        name="sequence"
                        placeholder="e.g. 1"
                        value={formData.sequence}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className={inputClass}
                        required
                    />

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        Determines the station's order within its transit line.
                    </p>
                </div>

                {/* Transit Tip */}
                <div>
                    <label htmlFor="transitTip" className={labelClass}>
                        Transit Tip
                    </label>

                    <textarea
                        id="transitTip"
                        name="transitTip"
                        rows="3"
                        placeholder="e.g. Use Gate No. 2 for easy access..."
                        value={formData.transitTip}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Customization */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">

                    <h3 className="font-semibold text-neutral-800 dark:text-white mb-4">
                        Station Customization
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* HEX Color */}
                        <div>
                            <label
                                htmlFor="colorOverride"
                                className={labelClass}
                            >
                                Station Color Override
                            </label>

                            <div className="flex items-center gap-3">

                                <input
                                    type="color"
                                    value={
                                        /^#([0-9A-Fa-f]{6})$/.test(
                                            formData.colorOverride
                                        )
                                            ? formData.colorOverride
                                            : "#64748b"
                                    }
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            colorOverride: e.target.value
                                        }))
                                    }
                                    className="w-14 h-12 rounded-lg cursor-pointer border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-1"
                                    title="Choose station color"
                                />

                                <input
                                    id="colorOverride"
                                    type="text"
                                    name="colorOverride"
                                    placeholder="#2563EB"
                                    value={formData.colorOverride}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                Leave empty to inherit the transit line color.
                            </p>
                        </div>

                        {/* Icon Override */}
                        <div>
                            <label
                                htmlFor="iconOverride"
                                className={labelClass}
                            >
                                Station Icon Override
                            </label>

                            <input
                                id="iconOverride"
                                type="text"
                                name="iconOverride"
                                placeholder="Enter icon URL or icon value"
                                value={formData.iconOverride}
                                onChange={handleChange}
                                className={inputClass}
                            />

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                Leave empty to inherit the line or mode icon.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Selected Line Preview */}
                {selectedLine && (
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">

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
                                        "#64748b"
                                }}
                            >
                                {selectedLine.mode?.key === "train" ? (
                                    <RiTrainFill size={22} />
                                ) : (
                                    <IoTrainSharp size={22} />
                                )}
                            </div>

                            <div>
                                <p className="font-semibold text-neutral-800 dark:text-white">
                                    {formData.name || "Station Name"}
                                </p>

                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {selectedLine.name}
                                    {formData.code
                                        ? ` • ${formData.code.toUpperCase()}`
                                        : ""}
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={loading || fetchingLines || lines.length === 0}
                        className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Station...
                            </>
                        ) : (
                            <>
                                <FaMapMarkerAlt />
                                Add Station
                            </>
                        )}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AddStation;
