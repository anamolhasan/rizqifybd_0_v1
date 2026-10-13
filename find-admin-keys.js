const fs = require('fs');
const path = require('path');

function loadAdminKeys(locale) {
  const admin = {};
  const adminDir = path.join('messages', locale, 'admin');
  const files = fs.readdirSync(adminDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const ns = file.replace('.json', '');
      admin[ns] = JSON.parse(fs.readFileSync(path.join(adminDir, file), 'utf8'));
    }
  }
  return admin;
}

const bnAdmin = loadAdminKeys('bn');

for (const [ns, data] of Object.entries(bnAdmin)) {
  if (['offers', 'categories', 'operators', 'referralApplications', 'settings'].includes(ns)) {
    console.log(ns, ': ', JSON.stringify(Object.keys(data)));
  }
}