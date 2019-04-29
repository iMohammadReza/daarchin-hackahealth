const Controller = require('../Controller')
const OTPAuth = require('otpauth');
const jwt = require('jsonwebtoken')
const path = require('path')

module.exports = new class AdminController extends Controller {
    get(req, res) {
        res.render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: false})
      }
    post= (req, res) => {
        if(req.body.type=="login"){
          if(req.body.username==null || req.body.password==null || req.body.username=="" || req.body.password==""){
            res.status(422).render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error:"نام کاربری و رمز عبور نمیتواند خالی باشند"})
          } 
          else if(!(req.body.username=="hh" && req.body.password=="2019")){
            res.status(403).render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error:"عدم دسترسی"})
          }
           else {
            this.model.Commit.find({}).populate('user').populate('action').populate('tip').exec((err, commits) => {
              if(err) {
                res.render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error: err.errmsg})
              }
              res.render(path.join(__dirname,'../../view/index.pug'), {authen: true, message: false, message2: false, commits})
            })
          }
        }
        else if(req.body.type=="search"){
          if(req.body.search==null||req.body.search==""){
              this.model.Commit.find({}).populate('user').populate('action').populate('tip').exec((err, commits) => {
                console.log(commits)
              res.render(path.join(__dirname,'../../view/index.pug'), {authen: true, message: false, message2: false, commits})
            })
          } else{
            this.model.Commit.find({}).populate('user').populate('action').populate('tip').exec((err, commits) => {
              if(err) {
                res.render(path.join(__dirname,'../../view/index.pug'), {authen: false, message: true, error: err.errmsg})
                
              }
              res.render(path.join(__dirname,'../../view/index.pug'),{authen: true, message: false, message2: false, commits: commits.filter((item)=>item.user.phone==req.body.search)})
            })
          }
        }
        
        
        
    }
}
