require('es6-promise').polyfill();
var request = require('request');

module.exports = new class utils {
    date_diff_indays = (date1, date2) => {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    is_the_date = (period, date) => {
        var d = new Date(date)
        return period==d.getDate()
    }

    sendSMS = (text, phone) => {
        request("https://api.sabanovin.com/v1/"+process.env.SMS_API+"/sms/send.json?gateway=100069183656&to="+phone+"&text="+text);
    }
}