let citiesData = {};
let allCityButtons = [];

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

document.getElementById('searchInput').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  allCityButtons.forEach(btn => {
    const cityName = btn.getAttribute('data-city');
    btn.style.display = cityName.includes(filter) ? 'inline-block' : 'none';
  });
});

function showCityData(cityKey) {
  const city = citiesData[cityKey];
  const info = city.basic_info;
  const emissions = city.emission_data;

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
  `;
  container.style.display = 'block';
  renderCharts(emissions);

}
function renderCharts(emissions) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'charts';
    chartContainer.innerHTML = '<h3>Visual Data</h3>';
  
    // Histogram: Carbon footprint per year
    const years = emissions.map(e => e.year);
    const totals = emissions.map(e => e.transportation + e.industry + e.residential + e.others);
  
    const histCanvas = document.createElement('canvas');
    chartContainer.appendChild(histCanvas);
  
    new Chart(histCanvas, {
      type: 'bar', // For histogram, keep 'bar' type
      data: {
        labels: years,
        datasets: [{
          label: 'Total Carbon Emission',
          data: totals,
          backgroundColor: '#4caf50',
          borderColor: '#388e3c', // Adds border color for a more distinct look
          borderWidth: 1,
          barPercentage: 0.7, // Adjust the bar thickness
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Carbon Emission Trajectory (Histogram)'
          }
        }
      }
    });
  
    // Donut charts: Year-wise distribution
    emissions.forEach(entry => {
      const donutTitle = document.createElement('h4');
      donutTitle.innerText = `${entry.year}`;
      chartContainer.appendChild(donutTitle);
  
      const donutCanvas = document.createElement('canvas');
      chartContainer.appendChild(donutCanvas);
  
      new Chart(donutCanvas, {
        type: 'doughnut', // Changed from 'pie' to 'doughnut' for donut chart
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
              text: `Carbon Sources - ${entry.year}`
            }
          }
        }
      });
    });
  
    document.getElementById('cityData').appendChild(chartContainer);
}
