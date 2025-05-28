module.exports = {
    apps: [
        {
            name: "nextjs-app",
            script: "yarn",
            args: "start",
            env: {
                PORT: 3000,
                NODE_ENV: "production",
            },
        },
        {
            name: "nextjs-apps",
            script: "yarn",
            args: "start",
            env: {
                PORT: 3001,
                NODE_ENV: "production",
            },
        },
    ],
};