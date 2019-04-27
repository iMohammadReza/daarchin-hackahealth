const Appointment = require(`${config.path.model}/Appointment`)
const City = require(`${config.path.model}/City`)
const Portal = require(`${config.path.model}/Portal`)
const Rate = require(`${config.path.model}/Rate`)
const Tag = require(`${config.path.model}/Tag`)
const User = require(`${config.path.model}/User`)

module.exports = class Controller {
    constructor() {
        this.model = { Appointment, City, Portal, Rate, Tag, User }
    }

    showValidationErrors(req , res , callback) {
        let errors = req.validationErrors()
        if(errors) {
            res.status(422).json({
                message : errors.map(error => {
                    return {
                        'field' : error.param,
                        'message' : error.msg
                    }
                }),
                success : false
            });
            return true
        }
        return false
    }

    showValidationErrorsAsMessage(req , res , callback) {
        let errors = req.validationErrors()
        if(errors) {
            let str = ""
            errors.map(error => str = str + error.msg + "<br/>")
            return str
        }
        return false
    }

    escapeAndTrim(req , items) {
        items.split(' ').forEach(item => {
            req.sanitize(item).escape()
            req.sanitize(item).trim()            
        })
    }
}