const sizeVal = document.getElementById("sizeVal");
const inverterVal = document.getElementById("inverterVal");
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
const batteryVal = document.getElementById("batteryVal");

const ids = ["size","inverter","cost","import","fit","self","grant","vat","deg","usage","daily","orient","tilt","shade","battery"];
ids.forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});
document.querySelectorAll('input[name="coupling"]').forEach(r => r.addEventListener('change', update));

function update() {
  const s = x => parseFloat(document.getElementById(x).value);
  const size = s("size"),
        inverter = s("inverter"),
        cost = s("cost"),
        importP = s("import"),
        fitP = s("fit"),
        self = s("self")/100,
        grant = s("grant"),
        vat = s("vat")/100,
        deg = s("deg")/100,
        usage = s("usage"),
        daily = s("daily"),
        orient = s("orient"),
        tilt = s("tilt"),
        shade = s("shade")/100,
        battery = s("battery");

  const coupling = document.querySelector('input[name="coupling"]:checked').value;

  sizeVal.textContent = size.toFixed(2);
  inverterVal.textContent = inverter.toFixed(1);
  costVal.textContent = cost.toFixed(0);
  importVal.textContent = importP.toFixed(3);
  fitVal.textContent = fitP.toFixed(3);
  selfVal.textContent = (self*100).toFixed(0);
  grantVal.textContent = grant.toFixed(0);
  vatVal.textContent = (vat*100).toFixed(1);
  degVal.textContent = (deg*100).toFixed(1);
  usageVal.textContent = usage.toFixed(0);
  dailyVal.textContent = daily.toFixed(2);
  orientVal.textContent = orient.toFixed(0);
  tiltVal.textContent = tilt.toFixed(0);
  shadeVal.textContent = (shade*100).toFixed(0);
  batteryVal.textContent = battery.toFixed(1);

  // ↓↓ AC/DC clipping logic
  const yieldPerKw = 900;
  const tiltF = Math.cos((tilt-30)*Math.PI/180)*0.1 + 0.95;
  const orientF = Math.cos((orient-180)*Math.PI/180)*0.1 + 0.95;

  let clippedSize;
  if (coupling === "ac") {
    clippedSize = Math.min(size, inverter);
  } else {
    const clipLoss = Math.max(0, size - inverter);
    clippedSize = inverter + clipLoss * 0.5; // partial DC benefit
    clippedSize = Math.min(clippedSize, size);
  }

  const annualGenRaw = clippedSize * yieldPerKw * tiltF * orientF * shade;
  const annualGen = annualGenRaw * (1 - deg);

  let selfBoost = 0;
  if (coupling === "ac") {
    selfBoost = battery * 0.05;
  } else {
    selfBoost = battery * 0.07;
  }
  const effectiveSelf = Math.min(self + selfBoost, 1);
  const selfUse = Math.min(annualGen * effectiveSelf, usage);
  const exportKWh = annualGen - selfUse;

  const annualValueGross = selfUse*importP + exportKWh*fitP;
  const annualStanding = daily * 365;
  const annualValue = annualValueGross - annualStanding;

  const netCost = cost - grant + cost*vat;
  const payback = netCost / annualValue;

  const co2 = annualGen * 0.4 / 1000;
  const trees = co2 / 0.25;
  const covered = selfUse / usage * 100;
  const roi = (annualValue / netCost) * 100;

  document.getElementById("result").innerHTML = `
    <p><strong>Estimated Annual Savings (after standing charge):</strong> €${annualValue.toFixed(0)}</p>
    <p><strong>Estimated Payback:</strong> ${payback.toFixed(1)} years</p>
    <p><strong>CO₂ avoided per year:</strong> ${co2.toFixed(1)} tonnes (~${trees.toFixed(1)} trees)</p>
    <p><strong>Approx. ${covered.toFixed(1)}% of your annual bill covered</strong></p>
    <p><strong>Approx. return on investment:</strong> ${roi.toFixed(1)}% p.a.</p>
  `;
}

update();
