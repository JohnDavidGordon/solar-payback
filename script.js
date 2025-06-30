
const sizeVal = document.getElementById("sizeVal");
const costVal = document.getElementById("costVal");
const importVal = document.getElementById("importVal");
const fitVal = document.getElementById("fitVal");
const selfVal = document.getElementById("selfVal");
const grantVal = document.getElementById("grantVal");
const vatVal = document.getElementById("vatVal");
const degVal = document.getElementById("degVal");
const usageVal = document.getElementById("usageVal");
const dailyVal = document.getElementById("dailyVal");
const orientVal = document.getElementById("orientVal");
const tiltVal = document.getElementById("tiltVal");
const shadeVal = document.getElementById("shadeVal");

const ids = ["size","cost","import","fit","self","grant","vat","deg","usage","daily","orient","tilt","shade"];
ids.forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});

function update() {
  const s = x => parseFloat(document.getElementById(x).value);
  const size = s("size"), cost = s("cost"), importP = s("import"), fitP = s("fit");
  const self = s("self")/100, grant = s("grant"), vat = s("vat")/100, deg = s("deg")/100;
  const usage = s("usage"), daily = s("daily"), orient = s("orient"), tilt = s("tilt"), shade = s("shade")/100;

  sizeVal.textContent = size.toFixed(2); costVal.textContent = cost.toFixed(0);
  importVal.textContent = importP.toFixed(3); fitVal.textContent = fitP.toFixed(3);
  selfVal.textContent = (self*100).toFixed(0); grantVal.textContent = grant.toFixed(0);
  vatVal.textContent = (vat*100).toFixed(1); degVal.textContent = (deg*100).toFixed(1);
  usageVal.textContent = usage.toFixed(0); dailyVal.textContent = daily.toFixed(2);
  orientVal.textContent = orient.toFixed(0); tiltVal.textContent = tilt.toFixed(0);
  shadeVal.textContent = (shade*100).toFixed(0);

  const yieldPerKw = 900, tiltF = Math.cos((tilt-30)*Math.PI/180)*0.1 + 0.95, orientF = Math.cos((orient-180)*Math.PI/180)*0.1 + 0.95;
  const annualGen = size * yieldPerKw * tiltF * orientF * shade;
  const selfUse = Math.min(annualGen * self, usage);
  const exportKWh = annualGen - selfUse;
  const annualValue = selfUse*importP + exportKWh*fitP;
  const annualStandingCharge = daily * 365;
  const netAnnualSavings = annualValue - annualStandingCharge;

  const netCost = cost - grant + cost*vat;
  const payback = netCost / netAnnualSavings;
  const roi = (netAnnualSavings / netCost) * 100;
  const co2 = annualGen*0.4/1000, trees = co2/0.25, covered = selfUse/usage*100;

  document.getElementById("result").innerHTML = `<p><strong>Estimated Annual Savings (after standing charge):</strong> €${netAnnualSavings.toFixed(0)}</p><p><strong>Estimated Payback:</strong> ${payback.toFixed(1)} years</p><p><strong>CO₂ avoided per year:</strong> ${co2.toFixed(1)} tonnes (~${trees.toFixed(1)} trees)</p><p><strong>Approx. ${covered.toFixed(1)}% of your annual bill covered</strong></p><p><strong>Approx. return on investment:</strong> ${roi.toFixed(1)}% p.a.</p>`;
}
update();
