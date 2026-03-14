const axios = require('axios');

const endpoints = [
    { url: '/ai/delay', data: {} },
    { url: '/ai/maintenance', data: {} },
    { url: '/ai/maintenance-score', data: {} },
    { url: '/ai/delay-root-cause', data: {} },
    { url: '/ai/efficiency', data: {} },
    { url: '/ai/executive-summary', data: {} },
    { url: '/ai/recommendations', data: {} },
    { url: '/ai/simulate', data: {} },
    { url: '/ai/esg', data: {} },
    { url: '/ai/textile-metrics', data: {} },
    { url: '/ai/cost-optimization', data: {} },
    { url: '/ai/workforce', data: {} },
    { url: '/ai/power', data: {} },
    { url: '/ai/reliability', data: {} },
    { url: '/ai/risk', data: {} },
    { url: '/ai/digital-maturity', data: {} },
    { url: '/ai/benchmark', data: {} },
    { url: '/ai/anomaly', data: {} },
    { url: '/ai/yarn-price', data: {} },
    { url: '/ai/water', data: {} },
    { url: '/ai/credit-risk', data: {} },
    { url: '/ai/subcontractor', data: {} },
    { url: '/ai/gov-schemes', data: {} },
    { url: '/ai/seasonal-demand', data: {} },
    { url: '/ai/labor-skill', data: {} },
    { url: '/ai/heatwave', data: {} },
    { url: '/ai/textile-flow', data: {} },
    { url: '/ai/quality', data: {} },
    { url: '/ai/yarn-optimize', data: {} },
    { url: '/ai/waste', data: {} },
    { url: '/ai/export-score', data: {} },
    { url: '/ai/cluster', data: {} },
    { url: '/ai/profit', data: {} },
    { url: '/ai/buyer-risk', data: {} },
    { url: '/ai/scheduler/optimize', data: { machines: [{id: 'M1', name: 'Test Machine'}] } }
];

async function verifyAll() {
    console.log('Starting AI Endpoint Verification on Port 3001...');
    let successCount = 0;
    for (const endpoint of endpoints) {
        try {
            const res = await axios.post(`http://localhost:3001/api${endpoint.url}`, endpoint.data);
            console.log(`✅ ${endpoint.url}: OK`);
            successCount++;
        } catch (err) {
            console.error(`❌ ${endpoint.url}: FAILED - ${err.message}`);
        }
    }
    console.log(`\nVerification Complete: ${successCount}/${endpoints.length} passed.`);
}

verifyAll();
