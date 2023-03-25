export const validateUsernameLength = (username: string) => {
    if (username.length < 3) {
        return "Username must be at least 3 characters long!"
    }
}

export const validateEmail = (email: string) => {
    const validEmailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (!validEmailRegex.test(email)) {
        return "Invalid email!"
    }
}

export const validatePasswordLength = (password: string) => {
    if (password.length < 6) {
        return "Password must be at least 6 characters long!"
    }
}