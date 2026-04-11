const API_URL = "https://api.fastlipa.com/api";
const AUTH_TOKEN = "FastLipa_OTDz3TpLvxo7IRJbAKor9";

export const fastlipa = {
    async createTransaction(number, amount) {
        try {
            const response = await fetch(`${API_URL}/create-transaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number, // format: 0695123456
                    amount: amount,
                    name: "Connection Client"
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("FastLipa Create Error:", error);
            throw error;
        }
    },

    async checkStatus(tranID) {
        try {
            const response = await fetch(`${API_URL}/status-transaction?tranid=${tranID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("FastLipa Status Error:", error);
            throw error;
        }
    }
};
