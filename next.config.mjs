/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All site imagery is first-party vector art (SVG) — there is nothing to
    // rasterise, so we skip the image optimiser entirely. This also means no
    // serverless image function is needed on Vercel.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
