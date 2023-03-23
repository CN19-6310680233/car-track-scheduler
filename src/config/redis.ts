export const getRawConnection = () => {
    return {
        prefix: "redis",
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        secure: parseInt(process.env.REDIS_SECURE || "0") == 1
    };
}
export const getConnection = () => {
    const options = getRawConnection();
  
    return {
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      tls: options.secure ? {
        rejectUnauthorized: false
      } : undefined
    }
}