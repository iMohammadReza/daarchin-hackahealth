const Action = require(`${config.path.model}/Action`)
const Commit = require(`${config.path.model}/Commit`)
const Tip = require(`${config.path.model}/Tip`)
const User = require(`${config.path.model}/User`)

module.exports = class Controller {
    constructor() {
        this.model = { Commit, Action, Tip, User }
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