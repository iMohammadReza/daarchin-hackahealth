const Controller = require('../Controller')
const OTPAuth = require('otpauth');
const jwt = require('jsonwebtoken')
const Transform = require('../../transforms/appApi/Transform')
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
          title : 'آیا به تشخیص پزشک مبتلا به سرطان سینه هستید؟',
          options : [{ text: 'بله', qid: 1 },
                     { text: 'خیر', qid: 2 }],
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
        //cancer?
        case 1:
          switch (value) {
            //finish: 4
            case 1:
              this.finishAsking(req, res, 4, fvalue, true)
              break;
            //to: sbe
            case 2:
              fvalue+=0
              res.json({
                data : {
                  id:2,
                  title : 'آیا در معاینه sbe (معاینه سینه با دست) خود را مشاهده کردید؟',
                  options : [{ text: 'بله', qid: 1 },
                             { text: 'خیر', qid: 2 }],
                  fvalue
                },
                success : true})
              break;
            default:
              break;
          }
          break;
        //sbe
        case 2:
          switch (value) {
            //to: age
            //finish: 3 - other survey
            case 1:
              fvalue+=30
              res.json({
                data : {
                  id:3,
                  title : 'سن شما چقدر است؟',
                  options : [{ text: 'بالای ۴۰', qid: 1 },
                            { text: 'پایین ۴', qid: 2 }],
                  fvalue
                },
                success : true})
              break;
            //to: age
            case 2:
              fvalue+=0
              res.json({
                data : {
                  id:3,
                  title : 'سن شما چقدر است؟',
                  options : [{ text: 'بالای ۴۰', qid: 1 },
                            { text: 'پایین ۴۰', qid: 2 }],
                  fvalue
                },
                success : true})
              break;
          }
          break;
        //age
        case 3:
          switch (value) {
            //to: mamography
            case 1:
              fvalue+=0
              res.json({
                data : {
                  id:6,
                  title : 'در یک سال اخیر ماموگرافی انجام داده اید؟',
                  options : [{ text: 'خیر', qid: 1 },
                            { text: 'بله و طبیعی بود', qid: 2 },
                            { text: 'بله و طبیعی نبود', qid: 3 }],
                  fvalue
                },
                success : true})
              break;
            //to: which one 1
            case 2:
              fvalue+=0
              res.json({
                data : {
                  id:4,
                  title : ' در کدامیک از دسته های زیر قرار می‌گیرید؟',
                  options : [{ text: ' سابقه خانوادگی سرطان ( مخصوصا تخمدان یا پستان )', qid: 1 },
                            { text: 'سابقه فردی سرطان پستان یا تخمدان', qid: 2 },
                            { text: 'سابقه بیوپسی پستان', qid: 3 },
                            { text: 'سابقه رادیوتراپی قفسه سینه', qid: 4 },
                            { text: 'هیچ کدام', qid: 5 }],
                  fvalue
                },
                success : true})
              break;
          }
          break;
        //which one 1
        case 4:
          switch (value) {
            //finish: 1
            case 5:
              this.finishAsking(req, res, 1, fvalue, false)
              break;
            //to: which one 2
            default:
              fvalue+=0
              res.json({
                data : {
                  id:5,
                  title : ' در کدامیک از دسته های زیر قرار می‌گیرید؟ شایع‌ترین مورد را انتخاب کنید.',
                  options : [{ text: 'در سن کمتر از 11 سال اولین قاعدگی را داشتم', qid: 1 },
                            { text: 'در سن بالای 54 سالگی یایسگی دارم', qid: 2 },
                            { text: 'نمایه توده بدنی ( BMI )  بالای 30 دارم', qid: 3 },
                            { text: 'مصرف روزانه دخانیات یا مشروبات الکلی دارم', qid: 4 },
                            { text: 'اولین بارداری ام در سن بالای 30 بوده است', qid: 5 },
                            { text: 'قرص های ضد بارداری مصرف کرده ام', qid: 6 },
                            { text: 'غذای چرب زیاد مصرف میکنم', qid: 7 },
                            { text: 'تحرک بدنی کمتر از 150 دقیقه در هفته دارم', qid: 8 },
                            { text: 'هیج کدام', qid: 9 }],
                  fvalue
                },
                success : true})
              break;
          }
          break;
        //which one 2
        case 5:
          switch (value) {
            //finish: 1
            case 9:
              this.finishAsking(req, res, 1, fvalue, false)
              break;
            //finish: 2
            default:
              this.finishAsking(req, res, 2, fvalue, false)
          } 
          break;
        //mamography
        case 6:
          switch (value) {
            //fninish: 2
            case 1:
              this.finishAsking(req, res, 2, fvalue, false)
              break;
            //fninish: 2
            case 2:
              this.finishAsking(req, res, 2, fvalue, false)
              break;
            //fninish: 3
            case 3:
              this.finishAsking(req, res, 3, fvalue, false)
              break;
          }
          break;
        default:
          res.json({success: false, error: "out of range"})
          break;
      }

  }

  finishAsking = (req, res, tag, fvalue, cancer)=> {
    this.model.User.findOneAndUpdate({_id:req.user_id},{tag:fvalue>29?3:tag, cancer} ,(err, user) => {
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
          res.json({success: true,
            user,
            tips: new Transform().randomize(tips, 1),
            actions: new Transform().randomize(actions, 3)
          })
        })

      })
    })
  }

  home = async (req, res) => {
    this.model.User.findById(req.user_id, (err, user) => {
      if (err)
        res.json({success: false, error: err})
      console.log(user)
      this.model.Tip.find({tag: {$lte: user.tag}}, (erro, tips) => {
        if (erro)
          res.json({success: false, error: erro})
  
        this.model.Action.find({tag: {$lte: user.tag}}, (error, actions) => {
          if (error)
            res.json({success: false, error: error})
          //res+="how do you fill"
          res.json({success: true,
            user,
            tips: new Transform().randomize(tips, 1),
            actions: new Transform().randomize(actions, 3)
          })
        })

      })
    })
  }

  commit = (req, res) => {
    req.checkBody('type' , '').notEmpty();
    req.checkBody('commit_id' , '').notEmpty();
    req.checkBody('value' , '').notEmpty();

    this.escapeAndTrim(req , 'type commit_id value');

    if(this.showValidationErrors(req, res))
        return;

    let newCommit = new this.model.Commit();
    newCommit[req.body.type]=req.body.commit_id
    newCommit.user=req.user_id
    newCommit.value = req.body.value
    newCommit.save(err => {
      if(err)
        res.json({success: false, error: err})
      res.json({success: true, newCommit  })
    })
    
  }
  
  game = (req, res) => {
    req.checkBody('value' , '').notEmpty();
    req.checkBody('point' , '').notEmpty();
    this.escapeAndTrim(req , 'value point');

    if(this.showValidationErrors(req, res))
        return;

    this.model.User.findOneAndUpdate({_id:req.user_id},{game: req.body.value, score: req.body.point} ,(err, user) => {
      if (err)
        res.json({success: false, error: err})
      res.json({success: true, user})
    })

  }
}