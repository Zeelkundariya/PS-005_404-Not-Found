export default function ExecutiveSummary({ summary }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <h3>Executive Summary</h3>
      <p>PEI: {summary.productionEfficiency}</p>
      <p>Avg Machine Health: {summary.machineHealth}</p>
      <p>Delay Status: {summary.delayStatus}</p>
      <p>Inventory Risk: {summary.inventoryRisk}</p>
    </div>
  );
}