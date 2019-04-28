const Controller = require('../Controller')
const OTPAuth = require('otpauth');
const jwt = require('jsonwebtoken')

module.exports = new class InputController extends Controller {

  addTip = (req, res) => {
    req.checkBody('context' , 'وارد کردن متن خبر الزامیست ').notEmpty();
    req.checkBody('cancer','وارد کردن فیلد سرطان الزامیست').notEmpty();
    req.checkBody('sex','وارد کردن جنسیت الزامیست').notEmpty();
    req.checkBody('tag','وارد کردن تگ الزامیست').notEmpty();
    req.checkBody('point','وارد کردن پوینت الزامیست').notEmpty();

    this.escapeAndTrim(req , 'context cancer sex tag point');
    if(this.showValidationErrors(req, res))
          return;
    
    let {context, cancer, sex, tag, point} = req.body;
    let newTip = new this.model.Tip();
    newTip.context = context;
    newTip.cancer = cancer;
    newTip.sex = sex;
    newTip.tag = tag;
    newTip.point = point;

    newTip.save(err => {
      if(err)
        return res.json({ error: err, success: false });
      res.json({ data: newTip, success: true })
    });
  }

  addAction = (req, res) => {
    req.checkBody('text' , 'وارد کردن متن عمل الزامیست ').notEmpty();
    req.checkBody('type','وارد کردن نوع عمل الزامیست').notEmpty();
    req.checkBody('point','وارد کردن پوینت الزامیست').notEmpty();
    req.checkBody('qid','وارد کردن کیو آی دی الزامیست').notEmpty();
    req.checkBody('cancer','وارد کردن فیلد سرطان الزامیست').notEmpty();
    req.checkBody('sex','وارد کردن جنسیت الزامیست').notEmpty();
    req.checkBody('tag','وارد کردن تگ الزامیست').notEmpty();

    this.escapeAndTrim(req , 'text type point qid cancer sex tag');
    if(this.showValidationErrors(req, res))
          return;
    
    let {text, type, point, qid, cancer, sex, tag} = req.body;
    let newAction = new this.model.Action();
    newAction.text = text;
    newAction.type = type;
    newAction.point = point;
    newAction.qid = qid;
    newAction.cancer = cancer;
    newAction.sex = sex;
    newAction.tag = tag;

    newAction.save(err => {
      if(err)
        return res.json({ error: err, success: false });
      res.json({ data: newAction, success: true })
    });
  }

}