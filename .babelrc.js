module.exports = {
    presets: ["next/babel"],  // ✅ Next.js의 기본 Babel 설정
    plugins: [
        ["import", {libraryName: "antd", style: true}, "antd"]  // ✅ Ant Design의 컴포넌트만 필요한 만큼 가져오기
    ]
}