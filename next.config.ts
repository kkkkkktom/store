import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 这个配置文件中设置了 images 属性，用于定义允许加载的远程图片的域名。
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
