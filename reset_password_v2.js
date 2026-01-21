const { open } = require('lmdb');
const db = open({ path: '/etc/easypanel/data', compression: true });

const key = 'users:cmkhr41od000007tpblay2l4c';
let entryRaw = db.get(key);

console.log('Raw type:', typeof entryRaw);

let entryObj;
let isString = false;

if (typeof entryRaw === 'string') {
    isString = true;
    entryObj = JSON.parse(entryRaw);
} else if (Buffer.isBuffer(entryRaw)) {
    isString = true; // Assume buffer of string
    entryObj = JSON.parse(entryRaw.toString());
} else {
    entryObj = entryRaw;
}

if (entryObj && entryObj.json) {
    console.log('Found user:', entryObj.json.email);

    // Nova senha: "Mudar123!"
    entryObj.json.password = '$argon2id$v=19$m=65536,t=3,p=4$FpdUY1AukkuNOvG1bbCNxg$WTnwSsWJAnByFARMcQnPba12gL/t5qfwR+9Gpphm1oM';

    const valToSave = isString ? JSON.stringify(entryObj) : entryObj;

    db.put(key, valToSave);
    console.log('Password updated.');
} else {
    console.error('Invalid entry struct:', entryObj);
}
