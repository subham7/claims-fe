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
        commandText: "Distribute token to members"
    },
    {
        commandId: 1,
        command: "mintGTToAddress",
        commandText: "Mint club token"
    },
    // {
    //     commandId: 2,
    //     command: "assignExecutorRole",
    //     commandText: "Assign executor role"
    // },
    {
        commandId: 2,
        command: "updateGovernanceSettings",
        commandText: "Update Governance Settings"
    },
    {
        commandId: 3,
        command: "updateRaiseAmount",
        commandText: "Change total raise amount"
    },
    {
        commandId: 4,
        command: "sendCustomToken",
        commandText: "Send custom token"
    },
    // {
    //     commandId: 7,
    //     command: "sendEth",
    //     commandText: "Send ETH"
    // },
]