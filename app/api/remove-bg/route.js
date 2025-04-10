import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const image = formData.get('image');

  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

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

  const blob = await fetchRes.blob();
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
