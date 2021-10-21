const fs = require('fs');

fs.writeFileSync('./build/_redirects', '/* /index.html 200');
