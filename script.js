const services = [
  {
    name: "Advanced Data Integration",
    description: "Provides ability to design and execute tasks on big data engines (e.g. Spark) with advanced mapping designer and create reusable parameterized mappings/templates",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [{ min: 0, max: Infinity, ipu: 0.19 }]
  },
  // ... (include all other services here)
];

let values = {};
let ipuConsumptions = {};
let totalIPU = 0;

function calculateIPU(service, value) {
  let totalIPU = 0;
  let remainingValue = value;

  for (const level of service.levels) {
    if (remainingValue <= 0) break;

    const levelRange = level.max - level.min;
    const valueInLevel = Math.min(remainingValue, levelRange);
    
    totalIPU += valueInLevel * level.ipu;
    remainingValue -= valueInLevel;

    if (level.max === Infinity) break;
  }

  return totalIPU;
}

function updateIPUConsumptions() {
  let total = 0;
  const newIpuConsumptions = {};

  services.forEach((service, index) => {
    const value = values[index] || 0;
    const ipu = calculateIPU(service, value);

    newIpuConsumptions[index] = ipu;
    total += ipu;
  });

  ipuConsumptions = newIpuConsumptions;
  totalIPU = total;
  document.getElementById('totalIPU').textContent = totalIPU.toFixed(2);
}

function handleInputChange(index, value) {
  values[index] = parseFloat(value) || 0;
  updateIPUConsumptions();
  renderServices();
}

function renderServices() {
  const servicesList = document.getElementById('servicesList');
  servicesList.innerHTML = '';

  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const sortBy = document.getElementById('sortSelect').value;

  const filteredAndSortedServices = services
    .filter(service => service.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "ipu") {
        const aIPU = a.levels[0].ipu;
        const bIPU = b.levels[0].ipu;
        return bIPU - aIPU;
      }
      return 0;
    });

  filteredAndSortedServices.forEach((service, index) => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    serviceCard.innerHTML = `
      <h3 class="service-title">
        ${service.name}
        <span class="tooltip">
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span class="tooltip-content">
            <p><strong>${service.name}</strong></p>
            <p>${service.description}</p>
            <p><strong>Unit:</strong> ${service.unit}</p>
            <p><strong>Metric:</strong> ${service.metric}</p>
            <p><strong>IPU Levels:</strong></p>
            <ul>
              ${service.levels.map(level => `<li>${level.min} - ${level.max === Infinity ? '∞' : level.max}: ${level.ipu} IPU</li>`).join('')}
            </ul>
          </span>
        </span>
      </h3>
      <div>
        <label for="service-${index}" class="text-sm text-muted-foreground">
          Enter ${service.unit} (${service.metric}):
        </label>
        <div class="flex items-center space-x-2">
          <input
            type="number"
            id="service-${index}"
            min="0"
            step="0.01"
            value="${values[index] || ''}"
            onchange="handleInputChange(${index}, this.value)"
            class="input flex-grow"
          />
          <span class="text-sm font-medium bg-muted px-2 py-1 rounded">
            IPU: ${ipuConsumptions[index]?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>
    `;
    servicesList.appendChild(serviceCard);
  });
}

document.getElementById('searchInput').addEventListener('input', renderServices);
document.getElementById('sortSelect').addEventListener('change', renderServices);

renderServices();