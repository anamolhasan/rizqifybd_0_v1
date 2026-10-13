const fs = require('fs');

const ROOT_NAMESPACES = [
  'common', 'nav', 'pagination', 'theme', 'footer', 'toast', 'enums',
  'auth', 'validation', 'metadata', 'dashboard', 'dashboardNav',
  'profile', 'agent', 'referral', 'adminNav'
];

const ADMIN_NAMESPACES = [
  'dashboard', 'placeholders', 'users', 'offers', 'categories', 'operators',
  'referralApplications', 'settings', 'offerForm', 'categoryForm', 'operatorForm', 'offerProfit'
];

function getType(obj, indent = 0) {
  const prefix = '  '.repeat(indent);
  if (typeof obj !== 'object' || obj === null) {
    return 'string';
  }
  if (Array.isArray(obj)) {
    return 'string[]';
  }
  const keys = Object.keys(obj);
  if (keys.length === 0) return 'Record<string, string>';
  
  let result = '{\n';
  for (const k of keys.sort()) {
    result += prefix + '  ' + k + ': ' + getType(obj[k], indent + 1) + ';\n';
  }
  result += prefix + '}';
  return result;
}

const en = {};
for (const ns of ROOT_NAMESPACES) {
  en[ns] = JSON.parse(fs.readFileSync('messages/en/' + ns + '.json', 'utf8'));
}
const admin = {};
for (const ns of ADMIN_NAMESPACES) {
  admin[ns] = JSON.parse(fs.readFileSync('messages/en/admin/' + ns + '.json', 'utf8'));
}
en.admin = admin;

let typesContent = '// Auto-generated translation types\n';
typesContent += '// Generated from split message files\n\n';
typesContent += 'import "next-intl";\n\n';
typesContent += 'declare module "next-intl" {\n';
typesContent += '  interface Messages {\n';

for (const ns of ROOT_NAMESPACES) {
  typesContent += '    ' + ns + ': ' + getType(en[ns]) + ';\n';
}

typesContent += '    admin: {\n';
for (const ns of ADMIN_NAMESPACES) {
  typesContent += '      ' + ns + ': ' + getType(en.admin[ns]) + ';\n';
}
typesContent += '    };\n';

typesContent += '  }\n';
typesContent += '}\n';

fs.writeFileSync('i18n/types.d.ts', typesContent);
console.log('Generated i18n/types.d.ts successfully');