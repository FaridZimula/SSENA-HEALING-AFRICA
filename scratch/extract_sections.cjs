const fs = require('fs');

async function run() {
  const res = await fetch('https://pay.laptertech.store/assets/index-DN3Fh4m-.js');
  const js = await res.text();

  // Find occurrences of topics
  const topics = [
    'POST /api/v1/payments/initialize',
    'Supported payment_method Values',
    'Webhooks & Callbacks',
    'check-status',
    'GET /api/v1/payments',
    'webhook_secret'
  ];

  let result = {};
  for (const t of topics) {
    let idx = js.indexOf(t);
    if (idx !== -1) {
      result[t] = js.substring(Math.max(0, idx - 150), Math.min(js.length, idx + 1800));
    }
  }

  fs.writeFileSync('scratch/topics.json', JSON.stringify(result, null, 2));
  console.log('Saved topics!');
}

run();

