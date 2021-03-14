const { isEmail } = require("validator");
module.exports.validateRegisterInput = ({
    username,
    password,
    confirmPassword,
    email,
}) => {
    const errors = {};
    if (username.trim() === "") {
        errors.username = "Username is empty";
    }
    if (email.trim() === "") {
        errors.email = "email is empty";
    } else {
        //check if the email is valid or not
        if (isEmail(email) == false) {
            errors.email = "email is not valid";
        }
    }
    if (password === "") {
        errors.password = "Password must not be empty";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Password must match";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
module.exports.validateLoginInput = (username, password) => {
    const errors= {};
    if (username.trim() === "") {
        errors.username = "username must not be empty";
    }
    if (password.trim() === "") {
        errors.password = "password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};
