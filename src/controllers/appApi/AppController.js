const Controller = require('../Controller')
const OTPAuth = require('otpauth');
const jwt = require('jsonwebtoken')
require('es6-promise').polyfill();
var request = require('request');

module.exports = new class AppController extends Controller {
  phone = (req, res) => {
    req.checkBody('phone' , 'وارد کردن شماره همراه الزامیست').notEmpty();
    this.escapeAndTrim(req , 'phone');
    if(this.showValidationErrors(req, res))
          return;

    /*



    HERE WE SHOULD PREVENT BRUTEFORCING



    */

    let totp = new OTPAuth.TOTP({
      issuer: '',
      label: '',
      algorithm: 'SHA1',
      digits: 4,
      period: 300,
      secret: OTPAuth.Secret.fromRaw(req.body.phone)
    });
    
    let token = totp.generate();
    request("https://api.sabanovin.com/v1/"+process.env.SMS_API+"/sms/send.json?gateway=100069183656&to="+req.body.phone+"&text="+"Hackathon verification code: " + token, function (error, response, body) {
      if(error)
        res.json({success: false})
      else
        res.json({success: true})
    });
  }

  verify = (req, res) => {
    req.checkBody('phone' , 'وارد کردن شماره همراه الزامیست').notEmpty();
    req.checkBody('token' , 'وارد کردن توکن الزامیست').notEmpty();
    this.escapeAndTrim(req , 'phone token');
    if(this.showValidationErrors(req, res))
          return;

    let totp = new OTPAuth.TOTP({
      issuer: '',
      label: '',
      algorithm: 'SHA1',
      digits: 4,
      period: 300,
      secret: OTPAuth.Secret.fromRaw(req.body.phone)
    });
    
    let delta = totp.validate({
      token: req.body.token,
      window: 10
    });

    if(delta==0){

      this.model.User.findOne({ phone : req.body.phone } , async (err , user) => {
        if(err) throw err;

        let user_id
        if(user == null) {
          let newUser = new this.model.User({ phone: req.body.phone });

          await newUser.save(err => {
            if(err)
              return res.json({error: err, success: false});
          });
          console.log(newUser)
          user_id = newUser._id
        } else {
          user_id = user._id
        }
          
        let token = jwt.sign({ user_id } , config.secret , {expiresIn :  '360d'});
        res.json({success: true, token})
      })
    }
    else
      res.json({success: false, error: "کد فعال سازی معتبر نیست."})
  }

  profile = (req, res) => {
    req.checkBody('name', '').notEmpty();
    req.checkBody('phone2', '').notEmpty();
    req.checkBody('sex', '').notEmpty();
    req.checkBody('age', '').notEmpty();
    req.checkBody('periodDay', '').notEmpty();

    this.escapeAndTrim(req , 'name phone2 sex age periodDay');

    if(this.showValidationErrors(req, res))
        return;

    let {name, phone2, sex, age, periodDay} = req.body;

    this.model.User.findOneAndUpdate({_id: req.user_id}, {name, phone2, sex, age, periodDay} , async (err , user) => {
      if(err) throw err;

      console.log(user, req.user_id)

      if(user == null) {
        return res.json({data: "user not found!", success: false});
      }
        
      res.json({
        data : {
          id: 1,
          title : 'Do you have cancer?',
          options : [{ text: 'First Option', qid: 1 },
                     { text: 'Second Option', qid: 2 }],
          fvalue : 0
        },
        success : true})
    })
  }

  ask = (req, res) => {
      req.checkBody('id' , '').notEmpty();
      req.checkBody('value' , '').notEmpty();
      req.checkBody('fvalue' , '').notEmpty();

      this.escapeAndTrim(req , 'id value fvalue');

      if(this.showValidationErrors(req, res))
          return;
      let {id, value, fvalue} = req.body
      id= parseInt(id)
      value= parseInt(value)
      fvalue= parseInt(fvalue)
      switch (id) {
        case 1:
          switch (value) {
            case 1:
              fvalue+=10
              res.json({
                data : {
                  id: 2,
                  title : 'Q3',
                  options : [{ text: 'First Option', qid: 1 },
                             { text: 'Second Option', qid: 2 }],
                  fvalue
                },
                success : true})
              break;
            case 2:
              fvalue-=20
              res.json({
                data : {
                  id:3,
                  title : 'Q2?',
                  options : [{ text: 'First Option', qid: 1 },
                             { text: 'Second Option', qid: 2 }],
                  fvalue
                },
                success : true})
              break;
            default:
              break;
          }
          break;
        case 2:
          
          break;
        case 3:
          
          break;
        case 4:
          
          break;
        case 5:
          
          break;
        case 6:
          
          break;
    
        default:
          res.json({success: false, error: "out of range"})
          break;
      }

  }

  home = async (req, res) => {
    this.model.User.findById(req.user_id, (err, user) => {
      if (err)
        res.json({success: false, error: err})
      console.log(user)
      this.model.Tip.find({tag: {$lte: user.tag}, sex: user.sex}, (erro, tips) => {
        if (erro)
          res.json({success: false, p:2, error: erro})
  
        this.model.Action.find({tag: {$lte: user.tag}, sex: user.sex}, (error, actions) => {
          if (error)
            res.json({success: false, p:3, error: error})
          //res+="how do you fill"
          res.json({success: true, user: {name: user.name, tag: user.tag, sex: user.sex, cancer: user.cancer}, tips, actions})
        })

      })
    })
  }

  commit = (req, res) => {
    req.checkBody('data' , '').notEmpty();
    this.escapeAndTrim(req , 'data');
    if(this.showValidationErrors(req, res))
        return;
        
    this.model.Contestant.insertMany(commits)
    .then(() => res.json({success: true}))
    .catch((err) => res.json({success : false, error: err}));

    // let newCommit = new this.model.Commit();
    // newCommit[req.body.type]=req.body.commit_id
    // newCommit.user=req.user_id
    // newCommit.value = req.body.value
    // newCommit.save(err => {
    //   if(err)
    //     res.json({success: false, err: error})
    //   res.json({success: true})
    // })
    
  }
}