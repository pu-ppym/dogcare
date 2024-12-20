const xss = require('xss');
const path = require('path');
const fs = require('fs'); 



const dateFormat = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}



const checkLogin = (req, res, isMust = true) => {
    let loginUserInfo = req.session.user;

    if(loginUserInfo == null) {  // 로그인 안함
        if(isMust) {
            alertAndGo(res, "로그인이 필요합니다.", "/member/login");
        }
        return null;
    }

    return loginUserInfo;
};

const alertAndGo = (res, msg, url) => {
    res.render('common/alert', {msg, url})
}

const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);    // 정규 표현식 
};

const reqeustFilter = (data, type, isHtml, defaultvalue = null) => {
    switch (type) {
        case 0:     // 숫자만
            if(data != null) {
                let checkVal = data.replaceAll(',', '');
                if(!isNumber(checkVal)) {
                    throw "parameter is not number Error";
                }
            }
            break;
        case -1:     // 길이 제한 없음
            if(!isHtml) {
                data = xss(data);
            }
            break; 
        default:     // 길이 제한 있음
            if(type < data.length) {   
                throw "input length is too long";
            }

            if(!isHtml) {
                data = xss(data);
            }

            break;
    }

    if(data == null || data == '') {
        if(defaultvalue != null) {
            data = defaultvalue;
        } else {
            throw "input parameter not allow null";
        }
    }

    return data;
}



const fileFilter = (req, file, callbackfuc) => {
    const filetype = /.jpg|.png|.gif/   // 정규식  /.zip/ 
    const extname = filetype.test(path.extname(file.originalname).toLowerCase());   // 원래 파일명의 확장자 가져오기, 소문자로 바꿈, true/false

    if(extname) {
        // 허용된 파일
        return callbackfuc(null, true);
    } else {
        // 허용 안된 파일
        return callbackfuc('Error: Image File Only');
    }

}

const getFileExtension = (filename) => {
    return '.' + filename.split('.').pop();

}

const moveFile = (sourceFile, targetFile) => {
    try {  // 파일관련 무적권 try, e.g 공간 부족할때 오류날수있음
        const sourcePath = path.join(__dirname, '..', sourceFile);  // sourceFile 절대 경로로
        const targetPath = path.join(__dirname, '..', targetFile);

        //console.log('sourcePath: ', sourcePath);  
        //console.log('targetPath: ', targetPath); 

    
        if(fs.existsSync(sourcePath)) {
            console.log('Source file exists.');
            fs.renameSync(sourcePath, targetPath)
            console.log('File moved successfully!');
        }

    } catch (error) {
        throw 'moveFile Error';
    }
}



module.exports = {
    checkLogin,
    alertAndGo,
    reqeustFilter,
    dateFormat,
    fileFilter,
    getFileExtension,
    moveFile
}