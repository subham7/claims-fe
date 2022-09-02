import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: "gnosis",
    initialState: {
        safeAddress: null,
        safeSdk: null,
        safeTransaction: null,
        owner1Signature: null,
        owner2Signature: null,
        owner3Signature: null,
        transaction: null,
        transactionHash: null,
        transactionReceipt: null,
        transactionError: null,
        transactionConfirmed: false,
        transactionConfirmedError: null,
        transactionConfirmedHash: null,
        transactionConfirmedReceipt: null,
    },
    reducers: {
        safeConnected: (state, action) => {
            state.safeAddress = action.payload.safeAddress;
            state.safeSdk = action.payload.safeSdk;
        },
        addSafeAddress: (state, action) => {
            state.safeAddress = action.payload;
        },
        safeDisconnected: (state, action) => {
            state.safeAddress = null;
            state.safeSdk = null;
        },
        transactionCreated: (state, action) => {
            state.safeTransaction = action.payload.safeTransaction;
        },
        owner1SignatureCreated: (state, action) => {
            state.owner1Signature = action.payload.owner1Signature;
        },
        owner2SignatureCreated: (state, action) => {
            state.owner2Signature = action.payload.owner2Signature;
        },
        owner3SignatureCreated: (state, action) => {
            state.owner3Signature = action.payload.owner3Signature;
        },
        transactionSigned: (state, action) => {
            state.transaction = action.payload.transaction;
        },
        transactionHashCreated: (state, action) => {
            state.transactionHash = action.payload.transactionHash;
        },
        transactionReceiptCreated: (state, action) => {
            state.transactionReceipt = action.payload.transactionReceipt;
        },
        transactionErrorCreated: (state, action) => {
            state.transactionError = action.payload.transactionError;
        },
        transactionConfirmed: (state, action) => {
            state.transactionConfirmed = true;
        },
        transactionConfirmedErrorCreated: (state, action) => {
            state.transactionConfirmedError = action.payload.transactionConfirmedError;
        },
        transactionConfirmedHashCreated: (state, action) => {
            state.transactionConfirmedHash = action.payload.transactionConfirmedHash;
        },
        transactionConfirmedReceiptCreated: (state, action) => {
            state.transactionConfirmedReceipt = action.payload.transactionConfirmedReceipt;
        },
    }
});

export const { 
    safeConnected, 
    safeDisconnected, 
    transactionCreated, 
    owner1SignatureCreated, 
    owner2SignatureCreated, 
    owner3SignatureCreated, 
    transactionSigned, 
    transactionHashCreated, 
    transactionReceiptCreated, 
    transactionErrorCreated, 
    transactionConfirmed, 
    transactionConfirmedErrorCreated, 
    transactionConfirmedHashCreated, 
    transactionConfirmedReceiptCreated,
    addSafeAddress,
} = slice.actions

export default slice.reducer