const bcrypt = require('bcrypt');

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.log('Usage: node hashPassword.js YourPassword123!');
  process.exit(1);
}

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log('\nHashed password:\n');
  console.log(hash);
  console.log('\nCopy the line above into your SQL INSERT statement.\n');
});