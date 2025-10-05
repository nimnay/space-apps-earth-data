"use client";

import { useState, useRef } from "react";

export default function InlineReportForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: {
        lat: parseFloat(formData.get("latitude") as string),
        lng: parseFloat(formData.get("longitude") as string)
      },
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit report");
      }
      
      setSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
        formRef.current?.reset();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold text-green-600 mb-2">Thank You!</h2>
        <p className="text-green-700">Your report has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-black mb-4">Report Wildfire</h2>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-black mb-1">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              defaultValue="34.5638"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-black mb-1">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              defaultValue="-82.7128"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 text-black placeholder-gray-500"
            placeholder="Brief description of what you see"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 text-black placeholder-gray-500"
            placeholder="Provide more details about the wildfire..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}