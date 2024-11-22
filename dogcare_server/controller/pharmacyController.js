const fs = require('fs');
const csv = require('csv-parser');


/*
const results = [];

fs.createReadStream('animal_pharmacy.csv')  // 파일 경로를 적어주세요.
  .pipe(csv({ headers: ['FRNM_NM', 'RN_ADDR', 'OPR_TIME_INFO', 'RPRS_TELNO', 'HMPG_URL', 'LA_VLUE', 'LO_VLUE'] }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    //console.log(results);  // 읽은 데이터를 콘솔에 출력
    // 데이터 접근하기
    results.forEach(item => {
        console.log(item['FRNM_NM']);   // 'FRNM_NM' 컬럼의 값 출력
      console.log(item.LA_VLUE);   // 'RN_ADDR' 컬럼의 값 출력
      //console.log(item.OPR_TIME_INFO);   // 'OPR_TIME_INFO' 컬럼의 값 출력
    });
  });

*/


const loadPharmacyData = () => {
    return new Promise((resolve, reject) => {
      const pharmacyData = [];
  
      fs.createReadStream('animal_pharmacy.csv')
        .pipe(csv({ headers: ['FRNM_NM', 'RN_ADDR', 'OPR_TIME_INFO', 'RPRS_TELNO', 'HMPG_URL', 'LA_VLUE', 'LO_VLUE'], skipLines: 1 }))
        .on('data', (row) => {
          if (row.FRNM_NM === 'FRNM_NM') return; // 헤더를 건너뜀
          pharmacyData.push(row);

          //console.log(row.FRNM_NM);
        })
        .on('end', () => {
          const leafletData = pharmacyData.map(pharmacy => ({
            name: pharmacy.FRNM_NM,
            lat: parseFloat(pharmacy.LA_VLUE),
            lng: parseFloat(pharmacy.LO_VLUE),
          }));
          
          //console.log(leafletData);  // 여기까지 잘뜸
          
          resolve(leafletData); // 데이터 반환
        })
        .on('error', (err) => {
          reject(err); 
        });
    });
  };
  

const view = async (req, res) => {
    try {
        
        const leafletData = await loadPharmacyData();
        console.log('테스트: ', leafletData);

        console.log('csv_view_테스트: ', leafletData[0]);
        res.render('pharmacy/view', { pharmacies: leafletData });

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
};

module.exports = {
    view
};