const mysql = require('mysql');
const config = require('./dbConfig');
const { json } = require('body-parser');

const connection = mysql.createConnection(config);

async function getProducts() {
    try {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM test", (error, results) => {
                if (error) {
                    console.error("Error fetching products:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProducts: getProducts
};