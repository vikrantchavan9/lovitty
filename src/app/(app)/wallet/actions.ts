
'use server';

// This file has been updated to remove Firebase dependencies.
// The fetchPaymentDetails function now returns a default structure.

export type PaymentDetails = {
    upi: { id: string };
    bank: { name: string; accountNumber: string; ifsc: string };
    crypto: { address: string };
    paymentGatewayUrl: string;
};

export async function fetchPaymentDetails(): Promise<PaymentDetails> {
    console.warn("fetchPaymentDetails is disabled; Firebase has been removed.");
    // Return a default empty structure as Firebase is no longer used.
    return {
        upi: { id: "" },
        bank: { name: "", accountNumber: "", ifsc: "" },
        crypto: { address: "" },
        paymentGatewayUrl: "",
    };
}
