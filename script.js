
// Span declarations
const sizeVal = document.getElementById("sizeVal");
const costVal = document.getElementById("costVal");
const importVal = document.getElementById("importVal");
const fitVal = document.getElementById("fitVal");
const selfVal = document.getElementById("selfVal");
const grantVal = document.getElementById("grantVal");
const vatVal = document.getElementById("vatVal");
const degVal = document.getElementById("degVal");
const usageVal = document.getElementById("usageVal");

// Inputs
const sizeInput = document.getElementById("size");
const costInput = document.getElementById("cost");
const importInput = document.getElementById("import");
const fitInput = document.getElementById("fit");
const selfInput = document.getElementById("self");
const grantInput = document.getElementById("grant");
const vatInput = document.getElementById("vat");
const degInput = document.getElementById("deg");
const usageInput = document.getElementById("usage");

const ids = ["size", "cost", "import", "fit", "self", "grant", "vat", "deg", "usage"];
ids.forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});

function update() {
  const size = parseFloat(sizeInput.value);
  const cost = parseFloat(costInput.value);
  const importP = parseFloat(importInput.value);
  const fitP = parseFloat(fitInput.value);
  const self = parseFloat(selfInput.value) / 100;
  const grant = parseFloat(grantInput.value);
  const vat = parseFloat(vatInput.value) / 100;
  const deg = parseFloat(degInput.value) / 100;
  const usage = parseFloat(usageInput.value);

  sizeVal.textContent = size.toFixed(2);
  costVal.textContent = cost.toFixed(0);
  importVal.textContent = importP.toFixed(3);
  fitVal.textContent = fitP.toFixed(3);
  selfVal.textContent = (self * 100).toFixed(0);
  grantVal.textContent = grant.toFixed(0);
  vatVal.textContent = (vat * 100).toFixed(1);
  degVal.textContent = (deg * 100).toFixed(1);
  usageVal.textContent = usage.toFixed(0);

  const yieldPerKw = 900;
  const annualGen = size * yieldPerKw;
  const selfUseKWh = annualGen * self;
  const exportKWh = annualGen * (1 - self);

  const annualValue = (selfUseKWh * importP) + (exportKWh * fitP);
  const netCost = cost - grant + (cost * vat);
  const payback = netCost / annualValue;

  const co2 = annualGen * 0.4 / 1000;
  const trees = co2 / 0.25;
  const covered = (selfUseKWh / usage) * 100;

  console.log("Annual Savings:", annualValue.toFixed(0)); // Debug check

  document.getElementById("result").innerHTML = `
    <h3>Estimated Annual Savings: €${annualValue.toFixed(0)}</h3>
    <p>Estimated Payback: ${payback.toFixed(1)} years</p>
    <p>CO₂ avoided per year: ${co2.toFixed(1)} tonnes (~${trees.toFixed(1)} trees)</p>
    <p>Approx. ${covered.toFixed(1)}% of your annual bill covered</p>
  `;
}

update();
