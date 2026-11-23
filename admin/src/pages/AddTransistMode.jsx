import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

const MODE_OPTIONS = [
    { value: "metro", label: "Metro" },
    { value: "train", label: "Train" },
];

const initialForm = {
    name: "",
    key: "metro",
    icon: "",
    color: "#2563EB",
    order: "0", // kept as a string while typing, converted on submit
};

const inputClass =
    "w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition";

const labelClass =
    "block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2";

const hintClass = "text-xs text-neutral-500 dark:text-neutral-400 mt-2";

const AddTransitMode = () => {
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [existingKeys, setExistingKeys] = useState([]);
    const [loadingModes, setLoadingModes] = useState(true);

    const availableOptions = MODE_OPTIONS.filter(
        (opt) => !existingKeys.includes(opt.value)
    );
    const allModesTaken = !loadingModes && availableOptions.length === 0;

    // Fetch existing modes so we can disable types that already exist
    const fetchExistingKeys = async () => {
        try {
            const { data } = await axios.get(`${API}/api/transit/modes/all`);
            const keys = (data.transitModes || []).map((m) => m.key);
            setExistingKeys(keys);

            // If the currently selected key is taken, switch to the first free one
            setFormData((prev) => {
                if (!keys.includes(prev.key)) return prev;
                const firstFree = MODE_OPTIONS.find((o) => !keys.includes(o.value));
                return firstFree ? { ...prev, key: firstFree.value } : prev;
            });
        } catch (error) {
            console.error("Fetch Transit Modes Error:", error);
        } finally {
            setLoadingModes(false);
        }
    };

    useEffect(() => {
        fetchExistingKeys();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Auto-prefix "#" so users can type "2563EB" or "#2563EB"
    const handleColorChange = (e) => {
        let value = e.target.value.trim();
        if (value && !value.startsWith("#")) value = `#${value}`;
        setFormData((prev) => ({ ...prev, color: value.slice(0, 7) }));
    };

    const handleReset = () => {
        const firstFree = MODE_OPTIONS.find((o) => !existingKeys.includes(o.value));
        setFormData({ ...initialForm, key: firstFree ? firstFree.value : initialForm.key });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const icon = formData.icon.trim();
        const order = Number(formData.order);

        if (!name) {
            return showError("Please enter transit mode name");
        }

        if (!formData.key) {
            return showError("Please select a transit mode type");
        }

        if (existingKeys.includes(formData.key)) {
            return showError("This transit mode type already exists");
        }

        if (!icon) {
            return showError("Please enter an icon");
        }

        if (!/^#([0-9A-Fa-f]{6})$/.test(formData.color)) {
            return showError("Please enter a valid HEX color");
        }

        if (formData.order === "" || !Number.isInteger(order) || order < 0) {
            return showError("Order must be a non-negative integer");
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${API}/api/transit/modes/create`,
                {
                    name,
                    key: formData.key,
                    icon,
                    color: formData.color.toUpperCase(),
                    order,
                }
            );

            showSuccess(data.message || "Transit mode added successfully!");

            // Mark this key as taken and reset the form to the next free type
            const updatedKeys = [...existingKeys, formData.key];
            setExistingKeys(updatedKeys);
            const firstFree = MODE_OPTIONS.find((o) => !updatedKeys.includes(o.value));
            setFormData({ ...initialForm, key: firstFree ? firstFree.value : initialForm.key });
        } catch (error) {
            console.error("Add Transit Mode Error:", error);

            showError(
                error.response?.data?.message ||
                "Something went wrong while adding transit mode"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg mx-auto transition-colors duration-300">

            <h2 className="text-2xl font-semibold mb-2 text-emerald-500 text-center">
                Add New Transit Mode
            </h2>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
                Create a new transportation mode for your transit guide.
            </p>

            {allModesTaken && (
                <div
                    role="status"
                    className="mb-6 p-4 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-sm text-amber-800 dark:text-amber-200"
                >
                    Every transit mode type already exists. Edit or delete an existing mode to make changes.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Mode Name */}
                <div>
                    <label htmlFor="transit-name" className={labelClass}>
                        Transit Mode Name
                    </label>

                    <input
                        id="transit-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Kolkata Metro"
                        className={inputClass}
                        required
                    />
                </div>

                {/* Mode Type */}
                <div>
                    <label htmlFor="transit-key" className={labelClass}>
                        Transit Mode Type
                    </label>

                    <select
                        id="transit-key"
                        name="key"
                        value={formData.key}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        {MODE_OPTIONS.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={existingKeys.includes(opt.value)}
                            >
                                {opt.label}
                                {existingKeys.includes(opt.value) ? " (already added)" : ""}
                            </option>
                        ))}
                    </select>

                    <p className={hintClass}>
                        Each type can only be added once.
                    </p>
                </div>

                {/* Icon */}
                <div>
                    <label htmlFor="transit-icon" className={labelClass}>
                        Icon
                    </label>

                    <input
                        id="transit-icon"
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="e.g. /icons/metro.svg or train"
                        className={inputClass}
                        required
                    />

                    <p className={hintClass}>
                        Enter the icon path or icon identifier used by your frontend.
                    </p>
                </div>

                {/* Color */}
                <div>
                    <label htmlFor="transit-color-text" className={labelClass}>
                        Theme Color
                    </label>

                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            aria-label="Pick theme color"
                            value={/^#([0-9A-Fa-f]{6})$/.test(formData.color) ? formData.color : "#000000"}
                            onChange={handleColorChange}
                            className="w-14 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 cursor-pointer bg-transparent"
                        />

                        <input
                            id="transit-color-text"
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleColorChange}
                            placeholder="#2563EB"
                            maxLength={7}
                            className={`flex-1 ${inputClass}`}
                        />
                    </div>

                    <p className={hintClass}>
                        Select a color or enter a HEX value, for example #2563EB.
                    </p>
                </div>

                {/* Display Order */}
                <div>
                    <label htmlFor="transit-order" className={labelClass}>
                        Display Order
                    </label>

                    <input
                        id="transit-order"
                        type="number"
                        name="order"
                        min="0"
                        step="1"
                        value={formData.order}
                        onChange={handleChange}
                        className={inputClass}
                    />

                    <p className={hintClass}>
                        Lower numbers appear first.
                    </p>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-3">
                        Preview
                    </p>

                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: formData.color }}
                        >
                            {formData.key === "metro" ? "M" : "T"}
                        </div>

                        <div>
                            <h3 className="font-semibold text-neutral-800 dark:text-white">
                                {formData.name || "Transit Mode Name"}
                            </h3>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                                {formData.key} • Order {formData.order === "" ? 0 : formData.order}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading || loadingModes || allModesTaken}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                        {loading ? "Adding Transit Mode..." : "Add Transit Mode"}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                    >
                        Reset
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddTransitMode;