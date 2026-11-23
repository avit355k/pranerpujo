
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../services/api";
import { showError, showSuccess } from "../utils/toast";

import {
  IoSearch,
  IoRefresh,
  IoPencil,
  IoTrash,
  IoClose,
  IoAdd,
} from "react-icons/io5";

import { IoTrainSharp } from "react-icons/io5";
import { RiTrainFill } from "react-icons/ri";

const initialForm = {
  name: "",
  key: "metro",
  icon: "",
  color: "#2563EB",
  order: 0,
};

const ManageTransistMode = () => {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  // Fetch all transit modes
  const fetchModes = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/transit/modes/all`
      );
      setModes(data.transitModes || data.data || []);
    } catch (error) {
      console.error("Fetch Transit Modes Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to load transit modes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModes();
  }, [fetchModes]);

  // Open Add Modal
  const handleAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (mode) => {
    setEditingId(mode._id);

    setFormData({
      name: mode.name || "",
      key: mode.key || "metro",
      icon: mode.icon || "",
      color: mode.color || "#2563EB",
      order: mode.order ?? 0,
    });

    setIsModalOpen(true);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  // Create / Update Transit Mode
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return showError("Please enter transit mode name");
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
      key: formData.key,
      icon: formData.icon.trim(),
      color: formData.color.toUpperCase(),
      order: formData.order,
    };

    try {
      setSaving(true);

      const response = editingId
        ? await axios.put(
          `${API}/api/transit/modes/update/${editingId}`,
          payload
        )
        : await axios.post(
          `${API}/api/transit/modes/create`,
          payload
        );

      showSuccess(
        response.data.message ||
        (editingId
          ? "Transit mode updated successfully"
          : "Transit mode added successfully")
      );

      setIsModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);

      await fetchModes();

    } catch (error) {
      console.error("Save Transit Mode Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to save transit mode"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Transit Mode
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transit mode?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const { data } = await axios.delete(
        `${API}/api/transit/modes/delete/${id}`
      );
      showSuccess(
        data.message || "Transit mode deleted successfully"
      );

      setModes((prev) =>
        prev.filter((mode) => mode._id !== id)
      );

    } catch (error) {
      console.error("Delete Transit Mode Error:", error);

      showError(
        error.response?.data?.message ||
        "Unable to delete transit mode. It may be linked to existing lines."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Close Modal
  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  // Search and Filter
  const filteredModes = modes
    .filter((mode) => {
      const matchesSearch =
        mode.name?.toLowerCase().includes(search.toLowerCase()) ||
        mode.key?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || mode.key === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="bg-white dark:bg-neutral-800 p-5 sm:p-6 rounded-xl shadow-lg mx-auto transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-500">
            Manage Transit Modes
          </h2>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Add, update and manage your transportation modes.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition"
        >
          <IoAdd size={20} />
          Add Transit Mode
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">

        <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Total Modes
          </p>

          <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mt-1">
            {modes.length}
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Metro Modes
          </p>

          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mt-1">
            {modes.filter((mode) => mode.key === "metro").length}
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 col-span-2 sm:col-span-1">
          <p className="text-sm text-emerald-600 dark:text-emerald-300">
            Train Modes
          </p>

          <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mt-1">
            {modes.filter((mode) => mode.key === "train").length}
          </h3>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        <div className="relative flex-1">
          <IoSearch
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transit modes..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Modes</option>
          <option value="metro">Metro</option>
          <option value="train">Train</option>
        </select>

        <button
          onClick={fetchModes}
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

      {/* Modes Table */}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">

        <table className="w-full min-w-[700px] text-left">

          <thead className="bg-neutral-100 dark:bg-neutral-900">
            <tr className="text-sm text-neutral-600 dark:text-neutral-300">
              <th className="px-5 py-4">Mode</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Icon</th>
              <th className="px-5 py-4">Color</th>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">

            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-12 text-neutral-500"
                >
                  Loading transit modes...
                </td>
              </tr>
            ) : filteredModes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No transit modes found.
                  </p>
                </td>
              </tr>
            ) : (
              filteredModes.map((mode) => (
                <tr
                  key={mode._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition"
                >

                  {/* Mode Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{
                          backgroundColor: mode.color || "#64748B",
                        }}
                      >
                        {mode.key === "metro" ? (
                          <IoTrainSharp size={21} />
                        ) : (
                          <RiTrainFill size={21} />
                        )}
                      </div>

                      <span className="font-medium text-neutral-800 dark:text-white">
                        {mode.name}
                      </span>

                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${mode.key === "metro"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}
                    >
                      {mode.key}
                    </span>
                  </td>

                  {/* Icon */}
                  <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {mode.icon || "—"}
                  </td>

                  {/* Color */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">

                      <span
                        className="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-600"
                        style={{
                          backgroundColor: mode.color || "#64748B",
                        }}
                      />

                      <span className="text-sm text-neutral-700 dark:text-neutral-200 font-mono">
                        {mode.color || "—"}
                      </span>

                    </div>
                  </td>

                  {/* Order */}
                  <td className="px-5 py-4 text-neutral-700 dark:text-neutral-200">
                    {mode.order ?? 0}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => handleEdit(mode)}
                        title="Edit"
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                      >
                        <IoPencil size={19} />
                      </button>

                      <button
                        onClick={() => handleDelete(mode._id)}
                        disabled={deletingId === mode._id}
                        title="Delete"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                      >
                        {deletingId === mode._id ? (
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
        Showing {filteredModes.length} of {modes.length} transit modes.
      </p>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-700">

              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                {editingId
                  ? "Update Transit Mode"
                  : "Add Transit Mode"}
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
                  Mode Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata Metro"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Mode Type
                </label>

                <select
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="metro">Metro</option>
                  <option value="train">Train</option>
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Icon
                </label>

                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. /icons/metro.svg"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Enter the icon path or identifier used by your frontend.
                </p>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
                  Theme Color
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
                    className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                </div>
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

              {/* Preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-900">

                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{
                    backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(formData.color)
                      ? formData.color
                      : "#64748B",
                  }}
                >
                  {formData.key === "metro" ? (
                    <IoTrainSharp size={21} />
                  ) : (
                    <RiTrainFill size={21} />
                  )}
                </div>

                <div>
                  <p className="font-medium text-neutral-800 dark:text-white">
                    {formData.name || "Transit Mode Preview"}
                  </p>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formData.color}
                  </p>
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
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Mode"
                      : "Create Mode"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTransistMode;
