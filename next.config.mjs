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

        // updateReadReplyStatus 2(e) 가 아닌것만
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
    'rc-util',         // rc-util을 포함하여 트랜스파일
    'xlsx',
    'exceljs',
    'flexlayout-react',
    'react-splitter-layout',
    '@handsontable/react-wrapper',
    '@react-pdf/renderer'
])(nextConfig);