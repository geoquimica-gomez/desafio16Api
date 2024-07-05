// Inicialización de variables
const btnApp = document.getElementById('btnApp');
const myChart = document.getElementById('myChart');
const selectElement = document.getElementById('currency-converter');
const resultElement = document.getElementById('result');
const inputApp = document.getElementById('inputApp');

btnApp.addEventListener("click", async () => {
    const selectedValue = selectElement.value;
    const amount = inputApp.value;
    const urlApi = `https://mindicador.cl/api/${selectedValue}`;

    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        const series = data.serie;
        if (series && series.length > 0) {
            const lastValue = series[0].valor;
            const convertedAmount = (amount / lastValue).toFixed(2);
            resultElement.innerHTML = `El monto convertido es: ${convertedAmount} ${selectedValue}`;
        } else {
            resultElement.inert = "No se encontraron datos para la moneda seleccionada.";
        }
    } catch (error) {
        resultElement.innerHTML = `Error al obtener los datos: ${error.message}`;
        console.error("Error al obtener los datos:", error);
    }
    inputApp.value = "";
})
