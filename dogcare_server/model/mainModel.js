const db = require('../common/db');

const getData = async(pkid) => {
    try {
        const sql = "select o.user_id, o.user_pw, d.dog_name, d.dog_age, d.dog_gender, d.dog_breed, d.dog_image from dogs as d inner join owners as o on d.fkowners = o.pkid where o.pkid = ?";
        const param = [pkid];

        const result = await db.runSql(sql, param);

        console.log(result);

        return result[0];
    } catch (error) {
        console.log(error);
        throw "SQL Query Error on getData";
    }
}

module.exports = {
    getData
}