import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pre - Trader",
    short_name: "Pre - Trader",
    description: "Journal to build your edge",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1015",
    theme_color: "#0e1015",
    orientation: "portrait",
    icons: [
      {
        src: "/manico.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manico2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
