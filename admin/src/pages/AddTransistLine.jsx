
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

import { IoTrainSharp, IoRefresh, IoAdd } from "react-icons/io5";
import { RiTrainFill } from "react-icons/ri";

const initialForm = {
    name: "",
    slug: "",
    mode: "",
    color: "#2563EB",
    iconOverride: "",
    order: 0,
};

const AddTransistLine = () => {
    const [formData, setFormData] = useState(initialForm);
    const [modes, setModes] = useState([]);
    const [loadingModes, setLoadingModes] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    // Generate slug from line name
    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Fetch available transit modes
    const fetchModes = async () => {
        try {
            setLoadingModes(true);

            const { data } = await axios.get(
                `${API}/api/transit/modes/all`
            );

            if (data.success) {
                const modeList = data.transitModes || data.data || [];
                setModes(modeList);

                if (modeList.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        mode: prev.mode || modeList[0]._id,
                    }));
                }
            } else {
                showError(data.message || "Unable to fetch transit modes");
            }
        } catch (error) {
            console.error("Fetch Transit Modes Error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to load transit modes"
            );
        } finally {
            setLoadingModes(false);
        }
    };

    useEffect(() => {
        fetchModes();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "name") {
            setFormData((prev) => ({
                ...prev,
                name: value,
                slug: slugManuallyEdited
                    ? prev.slug
                    : generateSlug(value),
            }));
            return;
        }

        if (name === "slug") {
            setSlugManuallyEdited(true);
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "order"
                        ? Number(value)
                        : value,
        }));
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            ...initialForm,
            mode: modes[0]?._id || "",
        });
        setSlugManuallyEdited(false);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            return showError("Please enter a transit line name");
        }

        if (!formData.slug.trim()) {
            return showError("Please enter a line slug");
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
            return showError(
                "Slug can contain lowercase letters, numbers and hyphens only"
            );
        }

        if (!formData.mode) {
            return showError("Please select a transit mode");
        }

        if (!/^#([0-9A-Fa-f]{6})$/.test(formData.color)) {
            return showError("Please enter a valid HEX color");
        }

        if (
            !Number.isInteger(formData.order) ||
            formData.order < 0
        ) {
            return showError("Order must be a non-negative integer");
        }

        const payload = {
            name: formData.name.trim(),
            slug: formData.slug.trim().toLowerCase(),
            mode: formData.mode,
            color: formData.color.toUpperCase(),
            iconOverride: formData.iconOverride.trim(),
            order: formData.order,
        };

        try {
            setSubmitting(true);

            const { data } = await axios.post(
                `${API}/api/transit/lines/create`,
                payload
            );

            showSuccess(
                data.message || "Transit line created successfully!"
            );
            handleReset();
        } catch (error) {
            console.error("Create Transit Line Error:", error);

            showError(
                error.response?.data?.message ||
                "Something went wrong while creating the transit line"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Selected mode for preview
    const selectedMode = modes.find(
        (mode) => mode._id === formData.mode
    );

    return (
        <div className="bg-white dark:bg-neutral-800 p-5 sm:p-7 rounded-xl shadow-lg mx-auto transition-colors duration-300">

            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold text-emerald-500">
                    Add New Transit Line
                </h2>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    Create a new metro or railway line for your transit guide.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Line Name and Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                            Line Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Blue Line"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                            Line Slug <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="e.g. blue-line"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            Automatically generated from the line name. You can edit it.
                        </p>
                    </div>

                </div>

                {/* Transit Mode */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                        Transit Mode <span className="text-red-500">*</span>
                    </label>

                    <div className="flex gap-2">
                        <select
                            name="mode"
                            value={formData.mode}
                            onChange={handleChange}
                            disabled={loadingModes || modes.length === 0}
                            required
                            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition disabled:opacity-60"
                        >
                            <option value="">
                                {loadingModes
                                    ? "Loading transit modes..."
                                    : "Select transit mode"}
                            </option>

                            {modes.map((mode) => (
                                <option key={mode._id} value={mode._id}>
                                    {mode.name} ({mode.key})
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={fetchModes}
                            disabled={loadingModes}
                            title="Refresh transit modes"
                            className="px-4 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                        >
                            <IoRefresh
                                size={20}
                                className={loadingModes ? "animate-spin" : ""}
                            />
                        </button>
                    </div>

                    {!loadingModes && modes.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">
                            No transit modes available. Please create a transit mode first.
                        </p>
                    )}
                </div>

                {/* Color and Icon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* HEX Color */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                            Line Color <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                name="color"
                                value={/^#[0-9A-Fa-f]{6}$/.test(formData.color)
                                    ? formData.color
                                    : "#2563EB"}
                                onChange={handleChange}
                                className="w-14 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 cursor-pointer bg-transparent"
                            />

                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                maxLength={7}
                                placeholder="#2563EB"
                                required
                                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500 transition"
                            />
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            Enter a valid six-digit HEX color.
                        </p>
                    </div>

                    {/* Icon Override */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                            Icon Override
                        </label>

                        <input
                            type="text"
                            name="iconOverride"
                            value={formData.iconOverride}
                            onChange={handleChange}
                            placeholder="e.g. react icons"
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            Optional. Leave empty to use the transit mode icon.
                        </p>
                    </div>

                </div>

                {/* Display Order and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                            Display Order
                        </label>

                        <input
                            type="number"
                            name="order"
                            min="0"
                            step="1"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            Lower numbers appear first.
                        </p>
                    </div>

                </div>

                {/* Preview */}
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">

                    <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-4">
                        Transit Line Preview
                    </h3>

                    <div className="flex items-center gap-4">

                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm"
                            style={{
                                backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(formData.color)
                                    ? formData.color
                                    : "#64748B",
                            }}
                        >
                            {selectedMode?.key === "train" ? (
                                <IoTrainSharp size={27} />
                            ) : (
                                <RiTrainFill size={27} />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-800 dark:text-white">
                                {formData.name || "Transit Line Name"}
                            </h4>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {selectedMode?.name || "Select a transit mode"}
                            </p>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                                {formData.slug || "line-slug"}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                                {formData.color}
                            </p>
                        </div>

                    </div>

                    <div
                        className="h-1.5 rounded-full mt-5"
                        style={{
                            backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(formData.color)
                                ? formData.color
                                : "#64748B",
                        }}
                    />

                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                    <button
                        type="submit"
                        disabled={submitting || loadingModes || modes.length === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                        {submitting ? (
                            <>
                                <IoRefresh size={19} className="animate-spin" />
                                Creating Transit Line...
                            </>
                        ) : (
                            <>
                                <IoAdd size={20} />
                                Create Transit Line
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={submitting}
                        className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50"
                    >
                        Reset
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AddTransistLine;
