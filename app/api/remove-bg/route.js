// app/api/removeBackground.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Log the start of the request
    console.log("Received request to remove background");

    // FormData se image ko extract karna
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      console.error("No image found in the request.");
      return new NextResponse("No image provided", { status: 400 });
    }

    console.log("Image received: ", image.name);

    // Converting image to ArrayBuffer and then to Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("Image converted to buffer");

    // Making API request to remove.bg service
    const fetchRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
      },
      body: (() => {
        const fd = new FormData();
        fd.append('image_file', new Blob([buffer]), image.name);
        fd.append('size', 'auto');
        return fd;
      })(),
    });

    if (!fetchRes.ok) {
      console.error("Error in remove.bg API:", fetchRes.status, fetchRes.statusText);
      return new NextResponse("Error in background removal", { status: fetchRes.status });
    }

    console.log("Background removed successfully");

    // Handling the blob received from remove.bg API
    const blob = await fetchRes.blob();
    console.log("Received image blob from remove.bg");

    // Returning the processed image
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error("Error in processing the request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
