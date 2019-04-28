const Controller = require('../Controller')
const OTPAuth = require('otpauth');
const jwt = require('jsonwebtoken')
const path = require('path')

module.exports = new class AdminController extends Controller {
    get(req, res) {
        res.render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: false})
      }
    post= (req, res) => {

        if(req.body.username==null || req.body.password==null || req.body.username=="" || req.body.password==""){
            res.status(422).render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error:"نام کاربری و رمز عبور نمیتواند خالی باشند"})
          } 
          else if(!(req.body.username=="hackahealth" && req.body.password=="2019hh")){
            res.status(403).render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error:"عدم دسترسی"})
          }
           else {
            this.model.User.find({}, (err, users) => {
              if(err) {
                res.render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error: err.errmsg})
                process.exit(1);
              }
              res.render(path.join(__dirname,'../../view/index.pug'), {authen: true, message: false, message2: false, Items})
            })
          }
        
        
    }
}