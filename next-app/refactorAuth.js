/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (file === 'route.ts') {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src/app/api'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("import jwt from 'jsonwebtoken';")) {
    content = content.replace("import jwt from 'jsonwebtoken';", "import { getCurrentUser } from '@/lib/authUtils';");
    
    // Replace auth check logic
    const oldAuthPattern = /const authHeader = req\.headers\.get\('authorization'\);\s*const token = authHeader\?\.split\(' '\)\[1\];\s*if \(!token\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\s*const decoded: any = jwt\.verify\(token, process\.env\.JWT_SECRET!\);/g;
    
    const newAuthPattern = `const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });`;
    
    content = content.replace(oldAuthPattern, newAuthPattern);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Refactored ${file}`);
  }
});
