export const contractList = [
    {
        contractHeading: "Investments",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/investments_illustration.svg",
        star: false
    },
    {
        contractHeading: "Grants",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/grants_illustration.svg",
        star: false
    },
    {
        contractHeading: "NFT Treasury",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/treasury_illustration.svg",
        star: false
    },
    {
        contractHeading: "NFT Collectors",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/collectors_illustration.svg",
        star: false
    },
    {
        contractHeading: "Charity",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/charity_illustration.svg",
        star: false
    },
    {
        contractHeading: "Party DAO",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/party_illustration.svg",
        star: false
    },
    {
        contractHeading: "Create custom",
        contractSubHeading: "Lorem ipsum dolor sit amet, consetetur assay sadipscing elitr, sed diam",
        image: "/assets/images/custom_illustration.svg",
        star: true
    },
]

export const tokenType = [
    "ERC-20 non-transferable",
    "ERC-20 transferable",
]

const today = new Date()
export const dateTill = [
    {
        text: "1 Week starting from today",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    },
    {
        text: "2 Week starting from today",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14)
    },
    {
        text: "1 month starting from today",
        date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    }
]

export const exitDates = [
    {
        text: "After 1 week",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) 
    },
    {
        text: "After 1 month",
        date: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()) 
    },
    {
        text: "After 3 month",
        date: new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()) 
    },
    {
        text: "After 6 month",
        date: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()) 
    },
    {
        text: "After 1 year",
        date: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()) 
    },
]