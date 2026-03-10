const express = require("express");
const router = express.Router();
const AIRequest = require("../models/AIRequest");

// Feature 1: Global Price Arbitrage
router.post("/arbitrage", async (req, res) => {
    const { commodity, market, volume } = req.body;
    console.log(`[Owner Server] Received Arbitrage Request for ${commodity}`);

    try {
        const newRequest = new AIRequest({
            agentName: "FinanceAI",
            requestType: "Lock Arbitrage Window",
            details: `Buy ${volume || 500}kg ${commodity || 'Turkish Cotton'} from ${market || 'Bursa'}. Expected Saving: ₹7,100.`,
            status: "Pending"
        });
        await newRequest.save();

        res.json({
            status: "success",
            message: `Arbitrage locked! Buying ${volume || 500}kg ${commodity || 'Turkish Cotton'} from ${market || 'Bursa'} at discounted rate. Expected saving: ₹7,100.`,
            data: {
                commodity: commodity || "cotton",
                market: market || "Bursa",
                volume: volume || 500,
                pricePerKg: 218,
                marketPricePerKg: 232.2,
                totalSavings: 7100,
                lockedAt: new Date().toISOString(),
                windowExpiresIn: "3 hours"
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Feature 2: AI Cash-Crunch Predictor
router.post("/cash-crunch", async (req, res) => {
    const { totalUnpaid, deficitDays } = req.body;
    console.log(`[Owner Server] Received Cash-Crunch Request`);
    const factoringFee = Math.round((totalUnpaid || 1200000) * 0.02);
    const netAmount = (totalUnpaid || 1200000) - factoringFee;

    try {
        const newRequest = new AIRequest({
            agentName: "FinanceAI",
            requestType: "Auto-Factor Invoices",
            details: `Factor ₹${(totalUnpaid / 100000).toFixed(2)} Lakh in unpaid invoices. Expected Credit: ₹${(netAmount / 100000).toFixed(2)} Lakh.`,
            status: "Pending"
        });
        await newRequest.save();

        res.json({
            status: "success",
            message: `Invoice Factoring approved! ₹${(netAmount / 100000).toFixed(2)} Lakh will be credited within 24 hours (2% factoring fee: ₹${factoringFee.toLocaleString()}).`,
            data: {
                totalUnpaidInvoices: totalUnpaid || 1200000,
                deficitPredictedIn: `${deficitDays || 14} days`,
                factoringFeePercent: 2,
                factoringFeeAmount: factoringFee,
                netAmountCredited: netAmount,
                expectedCreditTime: "24 hours",
                bankPartner: "SIDBI MSME Factoring",
                processedAt: new Date().toISOString()
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Feature 3: AI Bahi-Khata Scanner
router.post("/ledger-scan", async (req, res) => {
    const { ledgerType, language } = req.body;
    console.log(`[Owner Server] Received Ledger-Scan Request`);

    try {
        const newRequest = new AIRequest({
            agentName: "FinanceAI",
            requestType: "Scan Traditional Ledger",
            details: `Digitize and sync ${language || 'Marwari/Hindi'} entries from ${ledgerType || 'Bahi-Khata'}.`,
            status: "Pending"
        });
        await newRequest.save();

        res.json({
            status: "success",
            message: `Scanner complete! 42 handwritten ${language || 'Marwari/Hindi'} ledger entries from ${ledgerType || 'Bahi-Khata'} successfully digitized and synced with cloud ERP.`,
            data: {
                ledgerType: ledgerType || "Bahi-Khata",
                language: language || "Marwari/Hindi",
                entriesScanned: 42,
                entriesConverted: 42,
                failedEntries: 0,
                accuracy: "97.8%",
                syncedTo: "Cloud ERP (Tally Prime Sync)",
                totalValueProcessed: "₹18,42,500",
                processedAt: new Date().toISOString()
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Feature 4: AI Mahajan Trust-Score
router.post("/trust-score", async (req, res) => {
    const { score, trustIndex, suppliers } = req.body;
    console.log(`[Owner Server] Received Trust-Score Sharing Request`);

    try {
        const newRequest = new AIRequest({
            agentName: "FinanceAI",
            requestType: "Share Trust-Score",
            details: `Share Trust-Score ${score || 'A+'} (Index: ${trustIndex || 94}) with ${suppliers || 15} regional suppliers.`,
            status: "Pending"
        });
        await newRequest.save();

        res.json({
            status: "success",
            message: `Trust-Score ${score || 'A+'} (Index: ${trustIndex || 94}) shared with ${suppliers || 15} suppliers in Bhilwara. Credit period extended by 7 days.`,
            data: {
                trustScore: score || "A+",
                trustIndex: trustIndex || 94,
                suppliersNotified: suppliers || 15,
                creditExtensionDays: 7,
                paymentPunctuality: "98.2%",
                qualityConsistency: "96.5%",
                clusterRank: "Top 5% in Bhilwara",
                sharedAt: new Date().toISOString()
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
