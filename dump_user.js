const { open } = require('lmdb');
// Tenta abrir o banco. Se falhar por lock, tentamos readonly ou sem lock.
// EasyPanel usa LMDB com compression.
const db = open({ path: '/etc/easypanel/data', compression: true, readOnly: true });

console.log("Searching for user...");

try {
    for (let { key, value } of db.getRange()) {
        if (value && JSON.stringify(value).includes('julio96449921@gmail.com')) {
            console.log('KEY:', key);
            console.log('VALUE:', JSON.stringify(value, null, 2));
        }
    }
} catch (e) {
    console.error(e);
}
