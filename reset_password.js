const { open } = require('lmdb');
const db = open({ path: '/etc/easypanel/data', compression: true });

// ID capturado no passo anterior
const key = 'users:cmkhr41od000007tpblay2l4c';

console.log('Reading user...');
const entry = db.get(key);

if (entry) {
    console.log('User found:', entry.json ? entry.json.email : 'No email field');

    // Atualiza senha para 'Mudar123!'
    if (entry.json) {
        entry.json.password = '$argon2id$v=19$m=65536,t=3,p=4$FpdUY1AukkuNOvG1bbCNxg$WTnwSsWJAnByFARMcQnPba12gL/t5qfwR+9Gpphm1oM';

        try {
            db.put(key, entry);
            console.log('SUCCESS: Password updated to "Mudar123!"');
        } catch (e) {
            console.error('ERROR WRITING DB:', e);
        }
    }
} else {
    console.error('User key not found! Check the ID.');
}
