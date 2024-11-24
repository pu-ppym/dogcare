const mysql = require('mysql2');
require('dotenv').config();


const db = {
    host : process.env.HOST,  
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
};

// db연결 확인
console.log("DB Configuration:", {
    host: db.host,
    user: db.user,
    database: db.database,
});


const pool = mysql.createPool(db);
const dbPool = pool.promise();

const runSql = (async(sql, params = null) => {
    let dbCon;
    let result;

    try {
        dbCon = await dbPool.getConnection();
        if(params == null) {
            result = await dbCon.query(sql);
        } else {
            result = await dbCon.query(sql, params);
        }

        return result[0];
    } catch(error) {
        throw new Error(error);
    } finally {
        if (dbCon) dbCon.release();
    }
});

module.exports = {
    runSql,
    db
}