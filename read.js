const fs = require('fs');
const os = require('os');

fs.readFile('./admin.htpasswd','utf8', (err, data) => {
    if (err) throw err;
    console.log(data.substring(6, data.length));
});

console.log(os.userInfo().username);
