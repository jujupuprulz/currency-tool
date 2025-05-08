document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const usdAmountInput = document.getElementById('usd-amount');
    const currentRateInput = document.getElementById('current-rate');
    const potentialRateInput = document.getElementById('potential-rate');
    const calculateBtn = document.getElementById('calculate-btn');

    const currentValueElement = document.getElementById('current-value');
    const potentialValueElement = document.getElementById('potential-value');
    const differenceElement = document.getElementById('difference');
    const percentageElement = document.getElementById('percentage');

    // Get reference to the rate updated time element
    const rateUpdatedTimeElement = document.getElementById('rate-updated-time');

    // Function to format large numbers with K, M, B notation (for USD)
    function formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    // Function to format large numbers with traditional Chinese units (for TWD)
    function formatChineseNumber(num) {
        if (num >= 100000000) { // 億
            const billions = num / 100000000;
            // Format with 1 decimal place and add commas
            return billions.toLocaleString('zh-TW', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }).replace(/\.0$/, '') + '億';
        }
        if (num >= 10000) { // 萬
            const tenThousands = num / 10000;
            // Format with 1 decimal place and add commas
            return tenThousands.toLocaleString('zh-TW', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }).replace(/\.0$/, '') + '萬';
        }
        return num.toLocaleString('zh-TW');
    }

    // Security function to sanitize inputs and prevent XSS attacks
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        // Only allow numbers and decimal points
        return input.replace(/[^0-9.]/g, '');
    }

    // Set default values initially with two decimal places
    currentRateInput.value = "33.00";
    potentialRateInput.value = "29.00";

    // Add input sanitization to prevent XSS attacks
    usdAmountInput.addEventListener('input', function() {
        this.value = sanitizeInput(this.value);
    });

    potentialRateInput.addEventListener('input', function() {
        this.value = sanitizeInput(this.value);
    });

    // Fetch real-time exchange rate
    fetchExchangeRate();

    // Add event listener to the calculate button
    calculateBtn.addEventListener('click', calculateExchange);

    // Add event listener to the refresh rate button
    const refreshRateBtn = document.getElementById('refresh-rate-btn');
    if (refreshRateBtn) {
        refreshRateBtn.addEventListener('click', function() {
            document.getElementById('rate-status').textContent = '更新中...';
            fetchExchangeRate();
        });
    }

    // Also calculate when pressing Enter in any input field
    usdAmountInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') calculateExchange();
    });

    currentRateInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') calculateExchange();
    });

    potentialRateInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') calculateExchange();
    });

    // Function to calculate exchange values
    function calculateExchange() {
        // Get input values
        const usdAmount = parseFloat(usdAmountInput.value);
        const currentRate = parseFloat(currentRateInput.value);
        const potentialRate = parseFloat(potentialRateInput.value);

        // Validate inputs
        if (isNaN(usdAmount) || usdAmount <= 0) {
            alert('請輸入有效的美元金額');
            usdAmountInput.focus();
            return;
        }

        if (isNaN(currentRate) || currentRate <= 0) {
            alert('請輸入有效的目前匯率');
            currentRateInput.focus();
            return;
        }

        if (isNaN(potentialRate) || potentialRate <= 0) {
            alert('請輸入有效的潛在匯率');
            potentialRateInput.focus();
            return;
        }

        // Calculate values (using parseFloat to ensure we're working with numbers)
        const currentValueTWD = usdAmount * parseFloat(currentRate);
        const potentialValueTWD = usdAmount * parseFloat(potentialRate);
        const differenceTWD = potentialValueTWD - currentValueTWD;
        const percentageChange = (differenceTWD / currentValueTWD) * 100;

        // Update the DOM with calculated values
        // For USD: use K/M/B format for large numbers
        const formattedUsdAmount = usdAmount >= 10000 ? formatNumber(Math.round(usdAmount)) : Math.round(usdAmount).toLocaleString();

        // For TWD: use traditional Chinese units (萬, 億)
        const formattedCurrentTWD = formatChineseNumber(Math.round(currentValueTWD));
        const formattedPotentialTWD = formatChineseNumber(Math.round(potentialValueTWD));
        const formattedDifference = formatChineseNumber(Math.round(Math.abs(differenceTWD)));

        // Display the values in the result cards
        currentValueElement.textContent = `${formattedUsdAmount} USD = ${formattedCurrentTWD} TWD`;
        potentialValueElement.textContent = `${formattedUsdAmount} USD = ${formattedPotentialTWD} TWD`;

        if (differenceTWD > 0) {
            differenceElement.textContent = `+${formattedDifference} TWD`;
            differenceElement.style.color = '#0d652d'; // Darker green
        } else {
            differenceElement.textContent = `-${formattedDifference} TWD`;
            differenceElement.style.color = '#d93025'; // Darker red
        }

        // Set color and sign for percentage based on whether it's positive or negative
        if (percentageChange > 0) {
            percentageElement.textContent = `+${percentageChange.toFixed(1)}%`;
            percentageElement.style.color = '#0d652d'; // Darker green
        } else {
            percentageElement.textContent = `${percentageChange.toFixed(1)}%`;
            percentageElement.style.color = '#d93025'; // Darker red
        }

        // Highlight the results section
        document.getElementById('results').style.display = 'grid';
    }

    // Initialize the app
    function init() {
        // Set focus to the USD amount input
        usdAmountInput.focus();
    }

    // Call init function
    init();

    // Default exchange rate data as fallback
    const defaultExchangeRateData = {
        result: "success",
        provider: "https://www.exchangerate-api.com",
        time_last_update_unix: Math.floor(Date.now() / 1000),
        time_last_update_utc: new Date().toUTCString(),
        base_code: "USD",
        rates: {
            USD: 1,
            TWD: 30.0 // Default TWD rate
        }
    };

    // Function to fetch real-time exchange rate from ExchangeRate-API
    function fetchExchangeRate() {
        // Show loading indicator
        currentRateInput.placeholder = "載入中...";
        const rateStatus = document.getElementById('rate-status');
        if (rateStatus) {
            rateStatus.textContent = '正在獲取匯率...';
            rateStatus.style.color = '#f39c12'; // Orange color for loading
        }

        // Try to get cached data first
        const cachedData = localStorage.getItem('exchangeRateData');
        let cachedExchangeRateData = null;

        if (cachedData) {
            try {
                cachedExchangeRateData = JSON.parse(cachedData);
                console.log('Using cached exchange rate data');
            } catch (e) {
                console.error('Error parsing cached exchange rate data:', e);
            }
        }

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 5000);
        });

        // Fetch the exchange rate from the API with enhanced security
        Promise.race([
            fetch('https://open.er-api.com/v6/latest/USD', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Referrer-Policy': 'no-referrer',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Sec-Fetch-Site': 'cross-site',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty'
                },
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit' // Don't send cookies for cross-origin requests
            }),
            timeoutPromise
        ])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Validate the API response structure before processing
                if (!data || typeof data !== 'object' || !data.result || data.result !== 'success') {
                    throw new Error('Invalid API response format');
                }

                // Validate that the required data exists
                if (!data.rates || typeof data.rates !== 'object' || !data.rates.TWD) {
                    throw new Error('Missing TWD rate in API response');
                }

                console.log('Successfully fetched exchange rate data');
                processExchangeRateData(data);
            })

            .catch(error => {
                console.error('Error fetching exchange rate:', error);

                // Try to use cached data if available
                if (cachedExchangeRateData) {
                    console.log('Using cached data due to fetch error');
                    processExchangeRateData(cachedExchangeRateData);

                    if (rateStatus) {
                        rateStatus.textContent = '使用緩存的匯率數據';
                        rateStatus.style.color = '#f39c12'; // Orange color for warning

                        // Update the last updated time for the cached data
                        const cachedTime = new Date(cachedExchangeRateData.time_last_update_unix * 1000);
                        rateUpdatedTimeElement.textContent = `${cachedTime.toLocaleString()}`;
                    }
                }
                // Otherwise use default values
                else {
                    console.log('Using default exchange rate data');
                    processExchangeRateData(defaultExchangeRateData);

                    if (rateStatus) {
                        rateStatus.textContent = '使用預設匯率';
                        rateStatus.style.color = '#f39c12'; // Orange color for warning



                        // Update the last updated time for the default data
                        const now = new Date();
                        rateUpdatedTimeElement.textContent = `${now.toLocaleString()}`;
                    }
                }
            });
    }

    // Function to process exchange rate data
    function processExchangeRateData(data) {
        if (data.result === "success" && data.rates && data.rates.TWD) {
            // Cache the data for future use with security measures
            try {
                // Sanitize the data before storing
                const safeData = JSON.parse(JSON.stringify(data)); // Deep clone to avoid reference issues
                localStorage.setItem('exchangeRateData', JSON.stringify(safeData));
            } catch (e) {
                console.error('Error storing exchange rate data:', e);
            }

            // Update the current rate input with the real-time rate (with 2 decimal places)
            const realTimeRate = data.rates.TWD;
            currentRateInput.value = realTimeRate.toFixed(2); // Show 2 decimal places

            // Ensure the current rate field remains readonly
            currentRateInput.setAttribute('readonly', 'readonly');
            currentRateInput.classList.add('locked-field');

            // Calculate a potential lower rate (e.g., 12% lower)
            const potentialLowerRate = realTimeRate * 0.88;
            potentialRateInput.value = potentialLowerRate.toFixed(2); // Show 2 decimal places

            // Add last updated info
            const lastUpdated = new Date(data.time_last_update_unix * 1000);
            const lastUpdatedStr = lastUpdated.toLocaleString();

            // Store the current timestamp in localStorage
            const now = new Date();
            const nowStr = now.toLocaleString();

            // Get the last time we fetched data
            let lastFetchTime = localStorage.getItem('lastFetchTime');
            let lastFetchDate = lastFetchTime ? new Date(lastFetchTime) : null;

            // Store current fetch time
            localStorage.setItem('lastFetchTime', now.toString());
            localStorage.setItem('lastRate', data.rates.TWD);

            // Check if the rate has changed since our last fetch
            const previousRate = localStorage.getItem('previousRate');
            const currentRate = data.rates.TWD;
            const rateHasChanged = previousRate && previousRate !== currentRate.toString();

            // Store current rate as previous for next check
            localStorage.setItem('previousRate', currentRate);

            // Determine if data is fresh based on our local timestamps and rate changes
            let isDataFresh = true;
            let dataFreshMessage = '';

            // If we have a previous fetch time and it's been more than 24 hours
            if (lastFetchDate) {
                const hoursSinceLastFetch = (now - lastFetchDate) / (1000 * 60 * 60);

                if (hoursSinceLastFetch > 48 && !rateHasChanged) {
                    isDataFresh = false;
                    dataFreshMessage = `匯率可能未更新 (${hoursSinceLastFetch.toFixed(0)} 小時)`;
                }
            }

            // Log information for debugging
            console.log('API timestamp:', lastUpdatedStr);
            console.log('Current time:', nowStr);
            console.log('Last fetch time:', lastFetchTime);
            console.log('Rate changed:', rateHasChanged);
            console.log('Current TWD rate:', currentRate);

            // Update status
            const rateStatus = document.getElementById('rate-status');
            if (rateStatus) {
                if (isDataFresh) {
                    // If the rate has changed since last fetch, show that it's been updated
                    if (rateHasChanged) {
                        rateStatus.textContent = `匯率已更新!`;
                        rateStatus.style.color = '#0d652d'; // Green color for success
                        // Add animation to the current rate input to highlight the change
                        currentRateInput.classList.add('highlight-change');
                        setTimeout(() => {
                            currentRateInput.classList.remove('highlight-change');
                        }, 1500);
                    } else {
                        rateStatus.textContent = `最新匯率`;
                        rateStatus.style.color = '#0d652d'; // Green color for success
                    }

                    // Update the last updated time
                    rateUpdatedTimeElement.textContent = `${nowStr}`;
                } else {
                    rateStatus.textContent = dataFreshMessage;
                    rateStatus.style.color = '#f39c12'; // Orange color for warning
                    console.warn('Exchange rate data may be outdated. API reports:', lastUpdatedStr);
                }
            }

            // Clear any previous attribution
            const infoSection = document.querySelector('.info-section p');
            if (infoSection) {
                // Reset to original content
                infoSection.innerHTML = '此計算器幫助您了解美元/台幣匯率變化可能如何影響您的貨幣價值。輸入您的美元金額，並比較目前匯率與潛在未來匯率，以查看差異。';

                // Add attribution as required by the API terms
                infoSection.innerHTML +=
                    `<br><br><small>匯率資料來源: <a href="https://www.exchangerate-api.com" target="_blank">Exchange Rate API</a></small>`;
            }
        }
    }
});
