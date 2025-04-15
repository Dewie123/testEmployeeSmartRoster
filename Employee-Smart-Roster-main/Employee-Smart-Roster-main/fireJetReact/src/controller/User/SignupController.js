import { EMAIL_PATTERN } from '../Variables.js'

function validateEmail (email){
    // Email value validation
    if(!EMAIL_PATTERN.test(email))
        return "Invalid email format"
    else
        return ""
}


export default {
    validateEmail,
}