import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Impact Brief became the two-edition ImpactFools newsletter. Query strings
      // (e.g. ?token= on old manage links) are passed through automatically.
      { source: "/pulse/brief/manage", destination: "/newsletter/manage", permanent: true },
      { source: "/pulse/brief", destination: "/newsletter", permanent: true },
      { source: "/pulse/brief/:slug", destination: "/newsletter", permanent: true },
    ];
  },
};

export default nextConfig;
