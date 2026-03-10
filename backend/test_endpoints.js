const axios = require('axios');

const endpoints = [
    { method: 'get', url: '/machine/status' },
    { method: 'get', url: '/inventory/alerts' },
    { method: 'post', url: '/ai/delay' },
    { method: 'post', url: '/ai/efficiency' },
    { method: 'post', url: '/ai/maintenance' },
    { method: 'post', url: '/ai/quality' },
    { method: 'post', url: '/ai/safety' },
    { method: 'post', url: '/ai/maintenance-score' },
    { method: 'post', url: '/ai/anomaly' },
    { method: 'post', url: '/ai/reliability' },
    { method: 'post', url: '/ai/digital-maturity' },
    { method: 'post', url: '/ai/benchmark' },
    { method: 'post', url: '/ai/power' },
    { method: 'post', url: '/ai/workforce' },
    { method: 'post', url: '/ai/yarn-price' },
    { method: 'post', url: '/ai/subcontractor' },
    { method: 'post', url: '/ai/seasonal-demand' },
    { method: 'post', url: '/ai/export-score' },
    { method: 'post', url: '/ai/cluster' },
    { method: 'post', url: '/ai/esg' },
    { method: 'post', url: '/ai/water' },
    { method: 'post', url: '/ai/waste' },
    { method: 'post', url: '/ai/heatwave' },
    { method: 'post', url: '/ai/cost-optimization' },
    { method: 'post', url: '/ai/credit-risk' },
    { method: 'post', url: '/ai/profit' },
    { method: 'post', url: '/ai/buyer-risk' },
    { method: 'post', url: '/ai/gov-schemes' },
    { method: 'post', url: '/ai/textile-metrics' },
    { method: 'post', url: '/ai/textile-flow' },
    { method: 'post', url: '/ai/yarn-optimize' },
    { method: 'post', url: '/ai/labor-skill' },
    { method: 'post', url: '/ai/predict-downtime' },
    { method: 'post', url: '/ai/optimize-workflow' },
    { method: 'post', url: '/ai/executive-summary' },
    { method: 'post', url: '/ai/recommendations' },
    { method: 'post', url: '/../owner/arbitrage', body: { commodity: 'cotton', market: 'Bursa', volume: 500 } },
    { method: 'post', url: '/../owner/cash-crunch', body: { totalUnpaid: 1200000, deficitDays: 14 } },
    { method: 'post', url: '/../owner/ledger-scan', body: { ledgerType: 'Bahi-Khata', language: 'Marwari/Hindi' } },
    { method: 'post', url: '/../owner/trust-score', body: { score: 'A+', trustIndex: 94, suppliers: 15 } },
];

async function testAll() {
    const baseURL = 'http://localhost:3000/api';
    for (const ep of endpoints) {
        try {
            if (ep.method === 'get') {
                await axios.get(baseURL + ep.url);
            } else {
                await axios.post(baseURL + ep.url, ep.body || {});
            }
            console.log(`[OK] ${ep.url}`);
        } catch (err) {
            console.log(`[${err.response?.status || 'ERR'}] ${ep.url}`);
        }
    }
}

testAll();
