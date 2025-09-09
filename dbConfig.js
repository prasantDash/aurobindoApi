const config = {
    user: 'root',
    password: '',
    server: 'localhost', // e.g., 'localhost', 'SERVER_IP_ADDRESS'
    port: 3306,
    database: 'prasant',
    connectionLimit: 10, // Optional: Set the maximum number of connections in the pool
    options: {
        encrypt: false, // Use true if you're connecting to Azure SQL Database
        trustServerCertificate: true // Use true if you want to trust the server certificate
    }
};

const configUnitData = {
    user: 'root',
    password: '',
    server: 'localhost', // e.g., 'localhost', 'SERVER_IP_ADDRESS'
    port: 3306,
    database: 'unitdata',
    connectionLimit: 10, // Optional: Set the maximum number of connections in the pool
    options: {
        encrypt: false, // Use true if you're connecting to Azure SQL Database
        trustServerCertificate: true // Use true if you want to trust the server certificate
    }
};

module.exports = {config,configUnitData};
