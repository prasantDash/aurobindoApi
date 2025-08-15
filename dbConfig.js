const config = {
    user: 'root',
    password: '',
    server: '127.0.0.1', // e.g., 'localhost', 'SERVER_IP_ADDRESS'
    port: 3306,
    database: 'prasant_test',
    connectionLimit: 10, // Optional: Set the maximum number of connections in the pool
    options: {
        encrypt: false, // Use true if you're connecting to Azure SQL Database
        trustServerCertificate: true // Use true if you want to trust the server certificate
    }
};

module.exports = config;