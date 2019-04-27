const Controller = require('../Controller')
const OTPAuth = require('otpauth');
var Kavenegar = require('kavenegar');
const jwt = require('jsonwebtoken')

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
    var api = Kavenegar.KavenegarApi({
        apikey: process.env.KAVENEGAR_API
    });

    api.Send({
      message: "کد تایید شما" + token,
      sender: "10004346",
      receptor: req.body.phone
    }, function(response, status) {
        console.log(response, status)
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
      res.json({success: false})
  }

  profile = () => {
    
  }

  ask = (req, res) => {
      req.checkBody('id' , '').notEmpty();
      req.checkBody('value' , '').notEmpty();
      req.checkBody('fvalue' , '').notEmpty();

      this.escapeAndTrim(req , 'id value fvalue');

      if(this.showValidationErrors(req, res))
          return;

  }

  home = async (req, res) => {
    req.checkBody('token' , '').notEmpty();

    


    this.model.User.findById(req.user_id, (err, user) => {
      if (err)

      this.model.tips.find({tag: {$lte: user.tag}, sex: user.sex}, (err, tips) => {
        if (err)
  
        this.model.Action.find({tag: {$lte: user.tag}, sex: user.sex}, (err, actions) => {
          if (err)
          //res+="how do you fill"
          res.json({success: true, user: {name: user.name, tag: user.tag, sex: user.sex, cancer: user.cancer}, tips, actions})
        })

      })


    })

    

    


    this.escapeAndTrim(req , 'token');

    if(this.showValidationErrors(req, res))
        return;
  }

  commit = (req, res) => {
  }
}