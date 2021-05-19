var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var data = "";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    let response = JSON.parse(this.responseText)
    let centers = response.centers;
    let centerFor18 = []
    for(let i = 0; i < centers.length; i++){
        if(centers[i].sessions[0].min_age_limit == 18 && centers[i].sessions[0].available_capacity_dose1 > 0 ){
            centerFor18.push(centers[i])
            console.log(centerFor18.name)
        }
    }
  } 
});

xhr.open("GET", "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=247&date=19-05-2021");

xhr.send(data);