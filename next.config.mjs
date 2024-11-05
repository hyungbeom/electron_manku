// next.config.js
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRefresh: false,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
};


// withTM을 사용하여 필요한 모듈을 추가한 nextConfig를 내보냄
export default withTM([
  'antd',
  'rc-util',         // rc-util을 포함하여 트랜스파일
  'xlsx'
])(nextConfig);