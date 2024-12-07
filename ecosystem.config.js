module.exports = {
  apps: [
    {
      name: "fantasize-backend",
      script: "src/index.ts",
      instances: 3,
      exec_mode: "cluster",
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs"],
      interpreter: "node",
      interpreter_args: "--experimental-specifier-resolution=node --loader ts-node/esm",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
    },
  ],
};
