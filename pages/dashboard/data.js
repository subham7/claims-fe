export const proposalType = [
    {
        type: "survey",
        name: "Survey"
    },
    {
        type: "action",
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