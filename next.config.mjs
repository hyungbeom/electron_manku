// next.config.js
import withTM from 'next-transpile-modules';
import {config} from 'dotenv';

config();


/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_MICRO_REDIRECT_URI: process.env.NEXT_PUBLIC_MICRO_REDIRECT_URI,
    },
    reactStrictMode: false,
    experimental: {
        reactRefresh: false,
    },
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.experiments = {asyncWebAssembly: true, layers: true};
        return config;
    },
};


// withTM을 사용하여 필요한 모듈을 추가한 nextConfig를 내보냄
export default withTM([
    'antd',
    'rc-util',         // rc-util을 포함하여 트랜스파일
    'xlsx',
    'flexlayout-react'

])(nextConfig);