let sessionId = '';
let customerId = '';
let lastBettingTime = 0;

const tokens = ["demo", "demo", "demo"];
let tokenIndex = 0;

function getAuthorizationToken() {
    const token = tokens[tokenIndex];
    tokenIndex = (tokenIndex + 1) % tokens.length;
    return `Bearer ${token}`;
}

function getRan(min, max) {
    return Math.random() * (max - min) + min;
}

async function getSessionAndCustomerId() {
    const jsonData = {
        isDemo: true,
        isMobile: false,
        secretKey: 'eHpDWktnZ1RlbXh6dlBiUW8zL3lWNVVvanZoSWJNQ2xNSUdzUHpSN0N6K2RFNDNJb25COGdNRUw4a0FhMUdCUXk3Y0FacmtrdWxiN2VZQzRPVW5oRnd4VDY4UVovelcrQy9NZVRTdmZ0WUxmaUQ4TDMzem5NQUQxdFQ5UGRzSnF4V2FDeS9IS25pblpPeVFVV1FheDVPOHhCcU41ZTdvS2drWlVQSjBqLzl0bmpXOEtaOGVQOENiUEtoeGgyditmMjI2S0prT1dvOVMzN3Ewb0ZhUUxabWNUdjRGZFI1ODZTNUpGMmI1c3ZBS01venBlTWM2bmY0TVQwUFowZ2JWUjVYZ1pqVnQ3Mm10UmdFeHNJb0h5MkRvUXErS2lTWlliRktoL3l5WDRIeU94NHNld1ZldTQ0dlE4MWpOa2VPU0w2b3FONVFmYy9BdGJ0SW4vWXU5SjdFbjNzVEtzWmNEZTdFenc0SmVieGY3ZEx1TEluL2Q1UVJEN1p3eUQ3OEdBNll6T2lTLy96clVSVXNvdHV0Sm9xOHZac0VpU2VkWXdhRmdPU2l5RElMRU82eFZBNXh0WDhDeVZLTGNzb1lBRXlTYURJVW8raW1zUG5CREI0aFVQSWszOUVmU0N0R1ExUDV4aVJMVm1ObkhaOWRjWVVqNEwvaU9JZUFXeXEyYmRDOHlJbGFZbU5JdVVRT3VDTk9pYkhyRzhVaUR1SVVQYjhwSCtiWGVEdTRVbWwwSkpMZ3hpQUN4TXFhR0s3SW1tQVpLT01PUGhsMHB1bklWbWo5MzZGR296TUM1UitSblpwMmpsbGNVaFJOKzR4d2dmL05qcStjRXVnWnp6bnBoalk1bEpJWldJVHE0R21kblhKZ0tMRTFTTkV3djloZ2NySXRyUVVWSXgva0dYUTg0NElIMXNaZzFuNUZPQzRkVWNGRkRndUFlaTYybnNJS0h6akduc1ZjejJXR005K1pUZUVBcVFzQXA2VWMrakQ0MFpNcmZqUWNQRWtsWkJBNWlZZVlOSzY3Z1BXNlkyNDlwbEZBcE9DUEw5UURXelcyejhmV0hTZmlOcWx5RzNFNHhWNmlYcy9Rc3hzdEp1Q1RXTWN1TENHd21HRjJKK0tNelVsWDF0UE4wS3lqSU5ncytzOTQ0T2FVYVZpMXlpMnpPSzVjbk5ScmpValBITWExVUlidjlxeXdOQWR5akhBRDI0c1ByTkVQdWZXR0hBY1lJZ0h5VFYxbzdObkZoay8rN3ZnVXZHV2wyODExV0NHN0oyaUZIS3FHUDBaUjlBUkZHVFhwZ2NvNisvcWVkSDdWc0NhMjJlS2VFNldWQ3NLb0NuNy9oSVcyVFhXSWlSTTRkUGo3YmZLMzErRllHRzMrQzIwZE1tNFVWMkZrUmxEOHcvOEM5MWE4K3BoUS8wdG0vNEI1UE9ocXFHUnVTNVh3YTZGZkd5SVRsbzVHeklQd0UzUmh5VjZXZE5UR0p1YXBPcmUrcWZpRHRVanNIbTZTMVJxS0h6Z1JxcmNWK2c4OXUzcnJPMW85V2M3MWZvT00rc3Q3T2JKclViM3Rmd3pjbnBHNHZ5T2xUZ0NSNEsxcStyZGZDZ2lQR1RJVFlyaHhJZA==',
        gameId: '01949209-5a32-77ae-b418-aa74b5980e8b',
    };

    try {
        const launchResponse = await fetch('https://gateway.orchstr.tech/games/v1/launch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });

        const launchData = await launchResponse.json();
        const gameUrl = launchData.gameUrl;
        const match = gameUrl.match(/[?&]b=([^&]+)/);

        if (!match) throw new Error('Token "b" not found in gameUrl');
        const token = match[1];

        const authResponse = await fetch('https://crash-gateway-grm-cr.100hp.app/user/auth', {
            method: 'POST',
            headers: {
                'auth-token': token
            }
        });

        const authData = await authResponse.json();
        sessionId = authData.sessionId;
        customerId = authData.customerId;

        console.log('✅ Auth Success:', { sessionId, customerId });

    } catch (error) {
        console.error('❌ Auth Error:', error);
    }
}

async function checkSignal() {
    const url = 'https://crash-gateway-grm-cr.100hp.app/state';

    try {
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json',
                'session-id': sessionId,
                'customer-id': customerId
            }
        });

        if (!response.ok) {
            console.error('❌ Error fetching state:', response.statusText);
            return;
        }

        const data = await response.json();

        // ---- Обробка коефіцієнтів ----
        const kef = parseFloat(data.currentСoefficients);
        const coefficientsDiv = document.getElementById('coefficients');
        if (coefficientsDiv) {
            if (kef && kef !== 1) {
                coefficientsDiv.innerText = `x${kef.toFixed(2)}`;
                coefficientsDiv.className = 'text coefficient-value kif';
            } else {
                coefficientsDiv.innerText = "";
                coefficientsDiv.className = 'text coefficient-value smallt';
            }
        } else {
            console.error('Element with ID coefficients not found.');
        }

        // ---- Обробка сигналу ----
        const state = data.currentState;
        const responseTextEl = document.getElementById('responseText');
        if (!responseTextEl) {
            console.error('Element with ID responseText not found.');
            return;
        }

        if (state === "betting" && Date.now() - lastBettingTime > 5000) {
            let randomNumber1 = getRan(1.1, 5.0).toFixed(2);
            responseTextEl.textContent = `${randomNumber1}x`;
            responseTextEl.className = 'text prediction-value betting';
            lastBettingTime = Date.now();
        } else if (state === "ending") {
            responseTextEl.textContent = "Waiting..";
            responseTextEl.className = 'text prediction-value fly';
        } else if (state !== "betting") {
            if (responseTextEl.textContent !== "Waiting.." && !responseTextEl.classList.contains('betting')) {
                // Можна щось зробити, або нічого
            }
        }

    } catch (error) {
        console.error('❌ Exception in checkSignal:', error);
    }
}



function updateCoefficients(coefficients) {
    const coefficientsDiv = document.getElementById('coefficients');
    if (!coefficientsDiv) {
        console.error('Element with ID coefficients not found.');
        return;
    }

    if (coefficients && coefficients !== 1) {
        coefficientsDiv.innerText = `x${coefficients.toFixed(2)}`;
        coefficientsDiv.className = 'text coefficient-value kif';
    } else {
        coefficientsDiv.innerText = "";
        coefficientsDiv.className = 'text coefficient-value smallt';
    }
}

(async () => {
    await getSessionAndCustomerId();
    setInterval(checkSignal, 1000);
})();
