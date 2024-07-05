const btnApp = document.getElementById('btnApp');
const myChart = document.getElementById('myChart').getContext('2d');
const selectElement = document.getElementById('currency-converter');
const resultElement = document.getElementById('result');
const inputApp = document.getElementById('inputApp');

let chart;

btnApp.addEventListener("click", async () => {
    const selectedValue = selectElement.value;
    const amount = Number(inputApp.value);
    const urlApi = `https://mindicador.cl/api/${selectedValue}`;

    const data = await fetchData(urlApi);
    if (data) {
        handleData(data, selectedValue, amount);
    } else {
        resultElement.innerHTML = "No se encontraron datos para la moneda seleccionada.";
    }
    inputApp.value = "";
});

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        resultElement.innerHTML = `Error al obtener los datos: ${error.message}`;
        console.error("Error al obtener los datos:", error);
        return null;
    }
}

function handleData(data, currency, amount) {
    const series = data.serie;
    if (series && series.length > 0) {
        const lastValue = series[0].valor;
        const convertedAmount = (amount / lastValue).toFixed(2);
        resultElement.innerHTML = `El monto convertido de ${amount} es: ${convertedAmount} ${currency.toUpperCase()}`;

        const historicalData = getHistoricalData(series);
        updateChart(historicalData, currency);
    } else {
        resultElement.innerHTML = "No se encontraron datos para la moneda seleccionada.";
    }
}

function getHistoricalData(series) {
    return series.slice(0, 10).reverse();
}

function updateChart(historicalData, currency) {
    const labels = [];
    const values = [];

    historicalData.forEach(day => {
        labels.push(day.fecha.slice(0, 10));
        values.push(day.valor);
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(myChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor histórico del ${currency.toUpperCase()}`,
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
