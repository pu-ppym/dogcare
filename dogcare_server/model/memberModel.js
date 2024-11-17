const db = require('../common/db');

const loginCheck = (async(user_id, user_pw) => {
    try {
        const sql = "select pkid, user_id, user_pw from owners where user_id = ? and user_pw = ?";
        const param = [user_id, user_pw];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        throw "SQL Query Error on loginCheck";
    }
});


const insertData = async(user_id, user_pw) => {
    try {
        const sql = "insert into owners(user_id, user_pw) values (?, ?);";
        const param = [user_id, user_pw];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        throw "SQL Query Error on insertData";
    }
}

const insertDogData = async(fkwoners, dog_name, dog_age, dog_gender, dog_breed) => {
    try {
        const sql = "insert into dogs (fkowners, dog_name, dog_age, dog_gender, dog_breed) values (?, ?, ?, ?, ?);";
        const param = [fkwoners, dog_name, dog_age, dog_gender, dog_breed];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        throw "SQL Query Error on insertDogData";
    }
}

const getUserIdCount = async (user_id) => {
    try {
        const sql = "select count(pkid) as cnt from owners where user_id = ?";
        const param = [user_id];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0].cnt;
    } catch (error) {
        throw "SQL Query Error on getUserIdCount";
    }
}

const getDogInfoCount = async (pkid) => {
    try {
        const sql = "select count(pkid) as cnt from dogs where fkowners = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0].cnt;
    } catch (error) {
        throw "SQL Query Error on getDogInfoCount";
    }
}

module.exports = {
    loginCheck,
    insertData,
    getUserIdCount,
    getDogInfoCount,
    insertDogData
}