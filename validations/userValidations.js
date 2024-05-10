// userValidation.js

// Check if a value is empty
exports.isEmpty = (value) => {
    return value.trim() === '';
};

// Validate email format
exports.validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number format (10 digits, numeric)
exports.validatePhoneFormat = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

// Validate name format (only alphabets and spaces allowed)
exports.validateNameFormat = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
};

// Validate user input
exports.validateUserInput = (name, email, phone) => {
    const errors = {};

    if (this.isEmpty(name)) {
        errors.name = 'Name cannot be empty';
    } else if(!this.validateNameFormat(name)){
        errors.name = 'Invalid name format, can contain only alphabets and spaces';
    }

    if (this.isEmpty(email)) {
        errors.email = 'Email cannot be empty';
    } else if (!this.validateEmailFormat(email)) {
        errors.email = 'Invalid email format';
    }

    if (this.isEmpty(phone)) {
        errors.phone = 'Phone number cannot be empty';
    } else if (!this.validatePhoneFormat(phone)) {
        errors.phone = 'Invalid phone number format, should only be 10 numeric characters';
    }

    return errors;
};
