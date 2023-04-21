const bcrypt = require('bcrypt')

const plaintextPassword = 'mysecretpassword'

bcrypt.hash(plaintextPassword, 10, (err, hash) => {
    if (err) {
        console.error(err)
        return
    }

    console.log(hash)
})
