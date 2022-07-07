import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
    name: 'create',
    initialState: {
        value: null,
        clubName: null,
        clubsymbol: null,
        displayImage: null,
        daoAddress: null,
        clubID: null,
        clubRoute: null,
        proposalId: null,
        tresuryAddress: null,
        tokenAddress: null,
        clubImageUrl: null,
    },
    reducers: {
        addWallet: (state, action) => {
            state.value = action.payload
        },
        removeWallet: (state, action) => {
            state.value = null
        },
        addClubName: (state, action) => {
            state.clubName = action.payload
        },
        addClubsymbol: (state, action) => {
            state.clubsymbol = action.payload
        },
        addDisplayImage: (state, action) => {
            state.displayImage = action.payload
        },
        addDaoAddress: (state, action) => {
            state.daoAddress = action.payload
        },
        removeDaoAddress: (state, action) => {
            state.daoAddress = null
        },
        addClubID: (state, action) => {
            state.clubID = action.payload
        },
        addClubRoute: (state, action) => {
            state.clubRoute = action.payload
        },
        addProposalId: (state, action) => {
            state.proposalId = action.payload
        },
        addTresuryAddress: (state, action) => {
            state.tresuryAddress = action.payload
        },
        addTokenAddress: (state, action) => {
            state.tokenAddress = action.payload
        },
        addClubImageUrl: (state, action) => {
            state.clubImageUrl = action.payload
        }
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export const { 
    addWallet, 
    removeWallet,
    addClubName,
    addClubsymbol,
    addDisplayImage,
    addDaoAddress,
    removeDaoAddress,
    addClubID,
    addClubRoute,
    addProposalId,
    addTresuryAddress,
    addTokenAddress,
    addClubImageUrl,
    } = slice.actions
    

export default slice.reducer