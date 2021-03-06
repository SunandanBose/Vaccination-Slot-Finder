var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cron = require('node-cron');
const nodemailer = require('nodemailer')

function getDate(){
    var today = new Date();
    return today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
}

function getCenters(){
    var data = "";
    var today = getDate();
    console.log("Today's date : " + today);
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
            }
        }
        if(centerFor18.length > 0){
            var vaccinationCenterTemplate = "";
            console.log("Available centers", centerFor18.length)
            for(let i = 0; i < centerFor18.length; i++){
                console.log(centerFor18[i].name + " : " + centerFor18[i].sessions[0].available_capacity_dose1);
                vaccinationCenterTemplate += "Center : " + centerFor18[i].name + " and Slots Available for 1st Dose : " +
                                                centerFor18[i].sessions[0].available_capacity_dose1 + "\n";
            }
            notify(vaccinationCenterTemplate)
        } else {
            console.log("No Available centers")
        }
        
    } 
    });

    xhr.open("GET", "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=247&date="+today);

    xhr.send(data);
}

function notify(body){
    //Allow less secure app access in gmail and disable 2FA
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'to@gmail.com',
        subject: 'Vaccination Slot Availability',
        text: body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

cron.schedule("* * * * *", function(){
    getCenters()
    console.log("Running cron job every minute");
})

