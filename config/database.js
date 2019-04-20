module.exports = {
    hrPool: {
        user: "SYSTEM",// process.env.HR_USER,
        password: "root",// process.env.HR_PASSWORD,
        connectString: process.env.HR_CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    }
};