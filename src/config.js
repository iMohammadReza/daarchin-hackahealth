const path = require('path');

module.exports = {
    port : process.env.PORT || "3000",
    secret : process.env.SECRET || "testSecretH$%Eb",
    path : {
        admin : {
            transform : path.resolve('./src/transforms/adminApi'),
            controller : path.resolve('./src/controllers/adminApi'),
        },
        app : {
            transform : path.resolve('./src/transforms/appApi'),
            controller : path.resolve('./src/controllers/appApi'),
        },
        model : path.resolve('./src/models')
    }
}
