const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise( (resolve, reject) => {
        const payload = {uid}

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '10h'
        }, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

module.exports = {
    generateJWT,
}