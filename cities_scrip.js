let citiesData = {};
let allCityButtons = [];
let currentCity = null;

// Fetch city data from JSON file
fetch('cities_data.json')
  .then(res => res.json())
  .then(data => {
    citiesData = data;
    const cityList = document.getElementById('cityList');
    Object.keys(data).forEach(city => {
      const btn = document.createElement('button');
      btn.innerText = city.charAt(0).toUpperCase() + city.slice(1);
      btn.className = 'city-btn';
      btn.setAttribute('data-city', city);
      btn.onclick = () => showCityData(city);
      cityList.appendChild(btn);
      allCityButtons.push(btn);
    });
  });

// Search functionality for city buttons
document.getElementById('searchInput').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  allCityButtons.forEach(btn => {
    const cityName = btn.getAttribute('data-city');
    btn.style.display = cityName.includes(filter) ? 'inline-block' : 'none';
  });
});

// Display city data and charts
function showCityData(cityKey) {
  const city = citiesData[cityKey];
  const info = city.basic_info;
  const emissions = city.emission_data;
  currentCity = { cityKey, emissions };

  const container = document.getElementById('cityData');
  container.innerHTML = `
    <h2>${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}</h2>
    <p><strong>Population:</strong> ${info.population}</p>
    <p><strong>Region:</strong> ${info.region}</p>
    <p><strong>Area:</strong> ${info.area}</p>

    <h3>Carbon Emission Data</h3>
    <table>
      <tr>
        <th>Year</th>
        <th>Transportation</th>
        <th>Industry</th>
        <th>Residential</th>
        <th>Others</th>
      </tr>
      ${emissions.map(row => `
        <tr>
          <td>${row.year}</td>
          <td>${row.transportation}</td>
          <td>${row.industry}</td>
          <td>${row.residential}</td>
          <td>${row.others}</td>
        </tr>`).join('')}
    </table>
    <button id="downloadBtn">Download Data</button>
  `;
  container.style.display = 'block';
  renderCharts(emissions);

  document.getElementById('downloadBtn').onclick = () => downloadPDF(cityKey, emissions);
}

// Render charts using Chart.js
function renderCharts(emissions) {
  const chartContainer = document.createElement('div');
  chartContainer.className = 'charts';
  chartContainer.innerHTML = '<h3 style="color:#00ffcc;text-shadow:0 0 6px #00ffcc;">Visual Data</h3>';

  const years = emissions.map(e => e.year);
  const totals = emissions.map(e => e.transportation + e.industry + e.residential + e.others);
  const histCanvas = document.createElement('canvas');
  chartContainer.appendChild(histCanvas);

  new Chart(histCanvas, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Total Carbon Emission',
        data: totals,
        backgroundColor: '#00ffcc',
        borderColor: '#00c4a7',
        borderWidth: 1,
        barPercentage: 0.7
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        title: {
          display: true,
          text: 'Carbon Emission Trajectory (Histogram)',
          color: '#fff'
        },
        legend: { labels: { color: '#fff' } }
      }
    }
  });

  emissions.forEach(entry => {
    const donutTitle = document.createElement('h4');
    donutTitle.innerText = `${entry.year}`;
    chartContainer.appendChild(donutTitle);

    const donutCanvas = document.createElement('canvas');
    chartContainer.appendChild(donutCanvas);

    new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Transportation', 'Industry', 'Residential', 'Others'],
        datasets: [{
          data: [entry.transportation, entry.industry, entry.residential, entry.others],
          backgroundColor: ['#ff9800', '#2196f3', '#8bc34a', '#9c27b0']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Carbon Sources - ${entry.year}`,
            color: '#fff'
          },
          legend: {
            labels: { color: '#fff' }
          }
        }
      }
    });
  });

  document.getElementById('cityData').appendChild(chartContainer);
}

// Download data as PDF using jsPDF and AutoTable
function downloadPDF(cityKey, emissions) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const city = citiesData[cityKey];
  const info = city.basic_info;

  doc.setFontSize(18);
  doc.text(`${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)} - Carbon Emission Report`, 14, 22);

  doc.setFontSize(12);
  doc.text(`Population: ${info.population}`, 14, 32);
  doc.text(`Region: ${info.region}`, 14, 40);
  doc.text(`Area: ${info.area}`, 14, 48);

  const tableColumn = ["Year", "Transportation", "Industry", "Residential", "Others"];
  const tableRows = emissions.map(row => [
    row.year,
    row.transportation,
    row.industry,
    row.residential,
    row.others
  ]);

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 255, 204] },
    styles: { fontSize: 10 }
  });

  doc.save(`${cityKey}_carbon_emission_report.pdf`);
}
