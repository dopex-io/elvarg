const shell = require('shelljs');

shell.cd('../farm-contracts');

shell.exec('node ./scripts/runFrontendMigration.js');

shell.cd('../token-sale');

shell.exec('node ./scripts/runFrontendMigration.js');
