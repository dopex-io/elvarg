const fs = require('fs');

fs.writeFileSync('./app/build/_redirects', '/* /index.html 200');
