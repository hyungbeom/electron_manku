module.exports = {
    apps: [
        {
            name: "nextjs-app",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            env: {
                PORT: 3000,
                NODE_ENV: "production",
            },
        }
        // ,
        // {
        //     name: "nextjs-apps",
        //     script: "node_modules/next/dist/bin/next",
        //     args: "start",
        //     env: {
        //         PORT: 3001,
        //         NODE_ENV: "production",
        //     },
        // },
    ],
};