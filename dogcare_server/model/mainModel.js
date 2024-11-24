const db = require('../common/db');

const normalizePath = (filePath) => {
    //return filePath ? filePath.replace(/\\/g, '/') : null;
    return filePath.replace(/\\/g, '/').replace(/\/+/g, '/'); // 중복 슬래시 제거
};

const getData = async(pkid) => {
    try {
        const sql = "select o.user_id, o.user_pw, d.dog_name, d.dog_age, d.dog_gender, d.dog_breed, d.dog_image, d.pkid from dogs as d inner join owners as o on d.fkowners = o.pkid where o.pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        // 경로 변환
        // if (result[0] && result[0].dog_image) {
        //     result[0].dog_image = normalizePath(result[0].dog_image);
        // }

        console.log('변환 전: ', result[0].dog_image);
        result[0].dog_image = normalizePath(result[0].dog_image);
        console.log('변환 후: ', result[0].dog_image);

        console.log(result);

        return result[0];
    } catch (error) {
        console.log(error);
        throw "SQL Query Error on getData";
    }
}

const insertData = async(fkdogs, heartRate, temperature, vibration) => {
    try {
        const sql = "insert into health_data (fkdogs, heart_rate, temperature, steps) values (?, ?, ?, ?);";
        const param = [fkdogs, heartRate, temperature, vibration];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result;
    } catch (error) {
        throw "SQL Query Error on insertData";
    }
}

module.exports = {
    getData,
    insertData
}