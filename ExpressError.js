class ExpressError extends Error {
    constructor(status, message) {
        super(message); // Call the parent class constructor with the message
        this.status = status; // Set the HTTP status code
        this.message = message; // Set the error message
    }
}

module.exports = ExpressError; // Export the class for use in other files
