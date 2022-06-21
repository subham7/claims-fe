export const proposalType = [
    {
        type: "Survey",
        name: "Survey"
    },
    {
        type: "Action",
        name: "Action"
    }
]

const today = new Date()
export const votingDuration = [
    {
        text: "1 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    },
    {
        text: "2 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)
    },
    {
        text: "3 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
    },
    {
        text: "4 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)
    },
    {
        text: "5 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
    },
    {
        text: "6 days",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)
    }
]

export const commandTypeList = [
    {
        commandId: 0,
        command: "airdropCustomToken",
        commandText: "Air drop custom token"
    },
    {
        commandId: 1,
        command: "mintGTToAddress",
        commandText: "Mint GTTo Address"
    },
    {
        commandId: 2,
        command: "assignExecutorRole",
        commandText: "Assign executor role"
    },
    {
        commandId: 3,
        command: "updateGovernanceSettings",
        commandText: "Update Governance Settings"
    },
    {
        commandId: 4,
        command: "startDeposit",
        commandText: "Start deposit"
    },
    {
        commandId: 5,
        command: "closeDeposit",
        commandText: "Close deposit"
    },
    {
        commandId: 6,
        command: "updateRaiseAmount",
        commandText: "Update raise amount"
    },
    {
        commandId: 7,
        command: "sendCustomToken",
        commandText: "Send custom token"
    },
    {
        commandId: 8,
        command: "sendEth",
        commandText: "Send ETH"
    },
]