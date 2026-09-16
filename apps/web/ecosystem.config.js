module.exports = {
  apps: [
    {
      name: 'nuxt',
      port: '3000', // 如需改端口号 只需要该这里即可
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
}
