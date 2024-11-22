const fs = require('fs');
const csv = require('csv-parser');


// csv
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
            desc: pharmacy.OPR_TIME_INFO || '정보 없음',
          }));
          
          //console.log(leafletData);  // 여기까지 잘뜸
          
          resolve(leafletData); // 데이터 반환
        })
        .on('error', (err) => {
          reject(err); 
        });
    });
  };


  // Haversine 공식으로 두 지점 간의 거리 계산
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }
  

const view = async (req, res) => {
    try {
        
        const leafletData = await loadPharmacyData();

         // 현재 위치 임시
        const currentLat = 37.5491;
        const currentLng = 126.7234;

        // 거리 계산 후, 가까운 순으로 정렬
        const sortedPharmacies = leafletData.map(pharmacy => ({
            ...pharmacy,
            distance: haversine(currentLat, currentLng, pharmacy.lat, pharmacy.lng),
        })).sort((a, b) => a.distance - b.distance);

        // 가까운 5개 약국만 뽑기
        const nearestPharmacies = sortedPharmacies.slice(0, 5);

        console.log('테스트: ', nearestPharmacies);
        //console.log('csv_view_테스트: ', leafletData[0]);
        //console.log('넘겨주기전 테스트: ', JSON.stringify(nearestPharmacies));
        //res.render('pharmacy/view', JSON.stringify(nearestPharmacies) );
        /////res.render('pharmacy/view', { nearestPharmacies });
        res.render('pharmacy/view', {nearestPharmacies: JSON.stringify(nearestPharmacies) });

    } catch (error) {
        res.status(500).send('500 Error: ' + error);
    }
};

module.exports = {
    view
};