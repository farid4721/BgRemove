'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    const res = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setOutput(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Image Background Remover</h1>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0])} />
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Upload & Remove BG
      </button>

      {output && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <img src={output} alt="Result" className="max-w-md" />
        </div>
      )}
    </div>
  );
}
