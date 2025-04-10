"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOutput(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setOutput(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Section */}
        <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Created BY Farid
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Automatically remove backgrounds from your images. Simple, fast & free.
          </p>

          <button
            onClick={() => fileRef.current?.click()}
            className="bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            📁 Select Image
          </button>

          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {preview && (
            <div className="mt-6 border border-dashed border-gray-300 p-4 rounded-xl bg-white">
              <img
                src={preview}
                alt="preview"
                className="rounded-md max-h-60 object-contain mx-auto"
              />
            </div>
          )}

          {preview && (
            <button
              onClick={handleUpload}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              🚀 Remove Background
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="p-8 flex flex-col items-center justify-center bg-white">
          {output ? (
            <>
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                ✅ Result Image
              </h2>
              <img
                src={output}
                alt="Result"
                className="rounded-xl border border-gray-200 shadow max-h-72 object-contain"
              />
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = output;
                  link.download = "background_removed.png";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full transition"
              >
                ⬇️ Download
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-xl font-semibold mb-2">No Output Yet</p>
              <p className="text-sm">Choose an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
