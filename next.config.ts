import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions: {},
    serverComponentsExternalPackages:['mongoose'],
  },
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'img.clerk.com'
      },
      {
        protocol:'https',
        hostname:'uploadthing.com'                       
      },
      {
        protocol:'https',
        hostname:'placeholder.co'
      },
      {
        protocol:'https',
        hostname:'images.clerk.dev'
      },
    ]
  }
};

export default nextConfig;
