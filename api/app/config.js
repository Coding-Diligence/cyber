module.exports = {
  development: {
    type: 'development',
    port: process.env.PORT || 3000,
    mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb-secure'
  },
  production: {
    type: 'production',
    port: process.env.PORT || 3000,
    mongodb: process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb-secure'
  }
}