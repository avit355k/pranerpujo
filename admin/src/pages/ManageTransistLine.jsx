
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

import { IoSearch, IoRefresh, IoPencil, IoTrash, IoClose, IoAdd, IoFilter } from "react-icons/io5";

import { IoTrainSharp } from "react-icons/io5";
import { RiTrainFill } from "react-icons/ri";

const initialForm = {
  name: "",
  slug: "",
  mode: "",
  color: "#2563EB",
  iconOverride: "",
  order: 0,
};

const ManageTransistLine = () => {
  const [lines, setLines] = useState([]);
  const [modes, setModes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  // Get mode ID whether populated or not
  const getModeId = (mode) => {
    if (!mode) return "";
    return typeof mode === "object" ? mode._id : mode;
  };

  // Get mode name
  const getModeName = (mode) => {
    if (!mode) return "Unknown";
    return typeof mode === "object" ? mode.name : "Transit Mode";
  };

  // Fetch transit modes
  const fetchModes = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/transit/modes/all`
      );

      if (data.success) {
        setModes(data.transitModes || data.data || []);
      } else {
        showError(data.message || "Unable to fetch transit modes");
      }
    } catch (error) {
      console.error("Fetch Modes Error:", error);
      showError(
        error.response?.data?.message ||
        "Failed to load transit modes"
      );
    }
  }, []);

  // Fetch transit lines
  const fetchLines = useCallback(async () => {
    try {
      setLoading(true);

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
      console.error("Fetch Transit Lines Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to load transit lines"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModes();
    fetchLines();
  }, [fetchModes, fetchLines]);

  // Generate slug
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Open add modal
  const handleAdd = () => {
    setEditingId(null);

    setFormData({
      ...initialForm,
      mode: modes[0]?._id || "",
    });

    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (line) => {
    setEditingId(line._id);

    setFormData({
      name: line.name || "",
      slug: line.slug || "",
      mode: getModeId(line.mode),
      color: line.color || "#2563EB",
      iconOverride: line.iconOverride || "",
      order: line.order ?? 0,
    });

    setIsModalOpen(true);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: prev.slug === "" || prev.slug === generateSlug(prev.name)
          ? generateSlug(value)
          : prev.slug,
      }));

      return;
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

  // Create / Update line
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
      setSaving(true);

      const response = editingId
        ? await axios.put(
          `${API}/api/transit/lines/update/${editingId}`,
          payload
        )
        : await axios.post(
          `${API}/api/transit/lines/create`,
          payload
        );

      showSuccess(
        response.data.message ||
        (editingId
          ? "Transit line updated successfully"
          : "Transit line created successfully")
      );

      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchLines();

    } catch (error) {
      console.error("Save Transit Line Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to save transit line"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete line
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transit line?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const { data } = await axios.delete(
        `${API}/api/transit/lines/delete/${id}`
      );

      showSuccess(
        data.message || "Transit line deleted successfully"
      );

      setLines((prev) =>
        prev.filter((line) => line._id !== id)
      );

    } catch (error) {
      console.error("Delete Transit Line Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to delete transit line. It may have associated stations."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  // Search and filter
  const filteredLines = lines
    .filter((line) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        line.name?.toLowerCase().includes(searchText) ||
        line.slug?.toLowerCase().includes(searchText);

      const matchesMode =
        modeFilter === "all" ||
        getModeId(line.mode) === modeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && line.isActive) ||
        (statusFilter === "inactive" && !line.isActive);

      return matchesSearch && matchesMode && matchesStatus;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Selected mode for modal preview
  const selectedMode = modes.find(
    (mode) => mode._id === formData.mode
  );

  return (
    <div className="bg-white dark:bg-neutral-800 p-5 sm:p-6 rounded-xl shadow-lg mx-auto transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-500">
            Manage Transit Lines
          </h2>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            View, update and manage your metro and railway lines.
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={modes.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition disabled:opacity-50"
        >
          <IoAdd size={20} />
          Add Transit Line
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">

        <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Total Lines
          </p>

          <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mt-1">
            {lines.length}
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Metro Lines
          </p>

          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mt-1">
            {lines.filter(
              (line) => line.mode?.key === "metro"
            ).length}
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
          <p className="text-sm text-purple-600 dark:text-purple-300">
            Train Lines
          </p>

          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-200 mt-1">
            {lines.filter(
              (line) => line.mode?.key === "train"
            ).length}
          </h3>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">

        <div className="relative flex-1">
          <IoSearch
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by line name or slug..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Transit Modes</option>

          {modes.map((mode) => (
            <option key={mode._id} value={mode._id}>
              {mode.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={fetchLines}
          disabled={loading}
          title="Refresh"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-50"
        >
          <IoRefresh
            size={19}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* Lines Table */}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">

        <table className="w-full min-w-[850px] text-left">

          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr className="text-sm text-neutral-600 dark:text-neutral-300">
              <th className="px-5 py-4">Transit Line</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Mode</th>
              <th className="px-5 py-4">Color</th>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-neutral-500"
                >
                  Loading transit lines...
                </td>
              </tr>
            ) : filteredLines.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No transit lines found.
                  </p>
                </td>
              </tr>
            ) : (
              filteredLines.map((line) => (
                <tr
                  key={line._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition"
                >

                  {/* Line Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{
                          backgroundColor: line.color || "#64748B",
                        }}
                      >
                        {line.mode?.key === "train" ? (
                          <IoTrainSharp size={21} />
                        ) : (
                          <RiTrainFill size={21} />
                        )}
                      </div>

                      <span className="font-medium text-neutral-800 dark:text-white">
                        {line.name}
                      </span>

                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-300">
                    {line.slug}
                  </td>

                  {/* Mode */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-neutral-700 dark:text-neutral-200">
                      {getModeName(line.mode)}
                    </span>
                  </td>

                  {/* Color */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">

                      <span
                        className="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-600 shrink-0"
                        style={{
                          backgroundColor: line.color || "#64748B",
                        }}
                      />

                      <span className="text-sm text-neutral-700 dark:text-neutral-200 font-mono">
                        {line.color || "—"}
                      </span>

                    </div>
                  </td>

                  {/* Order */}
                  <td className="px-5 py-4 text-neutral-700 dark:text-neutral-200">
                    {line.order ?? 0}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleEdit(line)}
                        title="Edit"
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                      >
                        <IoPencil size={19} />
                      </button>

                      <button
                        onClick={() => handleDelete(line._id)}
                        disabled={deletingId === line._id}
                        title="Delete"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                      >
                        {deletingId === line._id ? (
                          <IoRefresh
                            size={19}
                            className="animate-spin"
                          />
                        ) : (
                          <IoTrash size={19} />
                        )}
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
        Showing {filteredLines.length} of {lines.length} transit lines.
      </p>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-700">

              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                {editingId
                  ? "Update Transit Line"
                  : "Add Transit Line"}
              </h3>

              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500"
              >
                <IoClose size={22} />
              </button>

            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Line Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Blue Line"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Line Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. blue-line"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Transit Mode
                </label>

                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select transit mode</option>

                  {modes.map((mode) => (
                    <option key={mode._id} value={mode._id}>
                      {mode.name} ({mode.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Line Color
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="color"
                    name="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(formData.color)
                      ? formData.color
                      : "#2563EB"}
                    onChange={handleChange}
                    className="w-14 h-12 rounded-lg cursor-pointer bg-transparent"
                  />

                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    maxLength={7}
                    placeholder="#2563EB"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                </div>
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
                  placeholder="e.g. /icons/metro.svg"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Order */}
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
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">

                <div>
                  <p className="font-medium text-neutral-800 dark:text-white">
                    Active Status
                  </p>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Show this line on the website.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/30 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-neutral-600 peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>

              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">

                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-3">
                  Preview
                </p>

                <div className="flex items-center gap-3">

                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-white"
                    style={{
                      backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(formData.color)
                        ? formData.color
                        : "#64748B",
                    }}
                  >
                    {selectedMode?.key === "train" ? (
                      <RiTrainFill size={22} />
                    ) : (
                      <IoTrainSharp size={22} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      {formData.name || "Transit Line"}
                    </p>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedMode?.name || "Transit Mode"} • {formData.color}
                    </p>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || modes.length === 0}
                  className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Line"
                      : "Create Line"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTransistLine;
