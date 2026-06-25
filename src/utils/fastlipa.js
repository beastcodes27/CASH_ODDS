import { API_ENDPOINTS } from './api';

const parseJsonSafely = async (response) => {
    const text = await response.text();
    if (!text || text.trim() === '') {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`Invalid payment server response (${response.status})`);
    }
};

const normalizePaymentError = (error) => {
    if (error instanceof Error && /fetch failed|network request failed|failed to fetch/i.test(error.message)) {
        return new Error('Payment service is unreachable at cashodds.devtz.com. Make sure the server is accessible.');
    }

    return error;
};

export const fastlipa = {
    /**
     * Create FastLipa transaction on backend
     */
    async createTransaction(number, amount) {
        try {
            const response = await fetch(API_ENDPOINTS.FASTLIPA_CREATE_TRANSACTION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    number,
                    amount: amount,
                    name: "Connection Client"
                })
            });

            const data = await parseJsonSafely(response);
            if (!response.ok) {
                throw new Error(data?.message || 'Failed to create transaction');
            }

            return data;
        } catch (error) {
            const normalizedError = normalizePaymentError(error);
            console.error("FastLipa Create Error:", normalizedError);
            throw normalizedError;
        }
    },

    /**
     * Check transaction status on backend
     */
    async checkStatus(tranID) {
        try {
            const response = await fetch(API_ENDPOINTS.FASTLIPA_STATUS(tranID), {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await parseJsonSafely(response);

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to check transaction status');
            }

            return data;
        } catch (error) {
            const normalizedError = normalizePaymentError(error);
            console.error("FastLipa Status Error:", normalizedError);
            throw normalizedError;
        }
    }
};
