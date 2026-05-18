import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode indicator badge (the "N" logo in the bottom-left
  // during `next dev`). Useful when screen-recording Vouch flows for the
  // demo video or for clean live testing.
  devIndicators: false,
};

export default nextConfig;
