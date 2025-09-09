const mysql = require('mysql');
const { ncrypt } = require("ncrypt-js");
const jwt = require('jsonwebtoken');
const {config,configUnitData} = require('./dbConfig');

//const moment = require('moment');

const connection = mysql.createConnection(config);
const connectionUnitData = mysql.createConnection(configUnitData);


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

async function getUsers() {
    try {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM Users", (error, results) => {
                if (error) {
                    console.error("Error fetching User:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }

}
async function createUsers(data) {
    const secretKey = "aurobindo";
    try {
        return new Promise((resolve, reject) => {
            var { encrypt } = new ncrypt(secretKey);
            const { username, email, password_hash } = data;
            const query = "INSERT INTO Users (username, email, password_hash,active) VALUES (?, ?, ?,?)";
            const values = [username, email, encrypt(password_hash), "1"];
            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error("Error creating user:", error);
                    return reject(error);
                }
                console.log("User created successfully:", results);
                resolve(results);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

async function getUserProfile(token) {
    const secretKey = "aurobindo";
    try {
        return new Promise((resolve, reject) => {           
            const decoded = jwt.verify(token.token, secretKey); 

            const userId = decoded.id;
            const query = "SELECT * FROM profiles WHERE id = ?";

            connection.query(query, [userId], (error, results) => {
                if (error) {
                    console.error("Error fetching user profile:", error);
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    } catch (error) {
        console.log(error);
    }

}
async function usersLogin(data) {
    const secretKey = "aurobindo";
    try {
        return new Promise((resolve, reject) => {
           
            const { encrypt, decrypt } = new ncrypt(secretKey);
            const { username, password_hash } = data;
            const query = `SELECT * FROM users WHERE username=?`;
            const values = [username];
            
            console.log("Query:", query, "Values:", values);

            connection.query(query,values,  (error, results) => {
                if (error) {
                    reject(error);
                }
                console.log("User status:", results);
                if (results[0].active === 0) {
                    resolve({ message: 'User is inactive' });
                }
                if (decrypt(results[0].password_hash) === password_hash) {
                    // const token = jwt.sign({ id: results[0].id, username: results[0].username }, secretKey, { expiresIn: 60 * 60 }); // Token valid for 1 hour
                    const token = jwt.sign({ id: results[0].id, username: results[0].username }, secretKey, { expiresIn: '1h' }); // Token valid for 1 hour
                     
                    const response = {
                        id: results[0].id,
                        username: results[0].username, 
                        token: token,
                        email: results[0].email,
                    }

                    resolve(response);
                }
                resolve({ message: 'Invalid password' });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

async function getUserAuthStatus(token){
    const secretKey = "aurobindo";
    const {id,username,exp} = jwt.decode(token,secretKey);
    let now = new Date();    
    if(exp < now.getTime()/1000){
        return {status:false};
    }
    return {id,username,status:true};
}

async function saveUnitdata(data){
    const unitData = data;
    console.log("Received unit data:", unitData);
    const dateAndTime = unitData.timestamp;
    unitData.lat = unitData.geocode.split(",")[0];
    unitData.lng = unitData.geocode.split(",")[1];
    unitData.dataAndTime = dateAndTime;
    const insertQuery = `INSERT INTO unitdata(tripId, driverId, deviceId, appVersion, geocode, timestamp, platform, speed, userId, lat, lng, dataAndTime) VALUES ('${unitData.tripId}','${unitData.driverId}','${unitData.deviceId}','${unitData.appVersion}','${unitData.geocode}','${unitData.timestamp}','${unitData.platform}','${unitData.speed}','${unitData.userId}','${unitData.lat}','${unitData.lng}','${unitData.dataAndTime}')`;
    console.log("Insert Query:", insertQuery);
    connectionUnitData.query(insertQuery, (error, results) => {
        if (error) {
            console.error("Error inserting unit data:", error);
            return ("Error on inserttion:");
        }else{
            console.log("Unit data inserted successfully:", results);
            return { message: 'created successfully' };
        }
    });
}
module.exports = {
    getProducts: getProducts,
    getUsers: getUsers,
    createUsers: createUsers,
    usersLogin: usersLogin,
    getUserProfile: getUserProfile,
    getUserAuthStatus: getUserAuthStatus,
    saveUnitdata:saveUnitdata
};
