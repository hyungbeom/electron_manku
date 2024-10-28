import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Webpack 실험 설정 추가
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
};

// withTM을 사용하여 필요한 모듈을 추가
export default withTM([
  'antd',
  'rc-util',         // rc-util을 포함하여 트랜스파일
  'xlsx'
])(nextConfig);