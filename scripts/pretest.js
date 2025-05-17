const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/search.json');

const dummyData = {
  correspondences: [],
  recipients: [],
  letters: [],
};

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(dummyData, null, 2));
  console.log('✅ Dummy search.json created for tests.');
} else {
  console.log('ℹ️ search.json already exists.');
}
