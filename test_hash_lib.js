try {
    const argon2 = require('argon2');
    console.log('Argon2 available');
    argon2.hash("Mudar123!").then(hash => {
        console.log("HASH_ARGON2:" + hash);
    });
} catch (e) {
    console.log('Argon2 NOT available: ' + e.message);
    try {
        const bcrypt = require('bcrypt');
        console.log('Bcrypt available');
        const hash = bcrypt.hashSync("Mudar123!", 10);
        console.log("HASH_BCRYPT:" + hash);
    } catch (e2) {
        console.log('Bcrypt NOT available');
    }
}
