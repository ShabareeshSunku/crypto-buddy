const httpMessages = {
    onValidationError: {
        success: false,
        message: 'Please enter email and password.'
    },
    wrongCredentials: {
        success: false,
        message: 'Email and password didn\'t match'
    },
    onUserSaveSuccess: {
        success: true,
        message: 'Successfully created new user.'
    },
    duplicateEmail: {
        success: false,
        message: 'EmailId is already used'
    }
}

module.exports = httpMessages