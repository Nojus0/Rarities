const icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxNCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjI4NDkxIDcuNzIxMDFMMTIuMTA3MiAwLjc5NDk5MUMxMi4zNzY0IDAuNTIxNzY3IDEyLjgxMjcgMC41MjE3NjcgMTMuMDgxOSAwLjc5NDk5MUMxMy4zNTEgMS4wNjgyMSAxMy4zNTEgMS41MTEyIDEzLjA4MTkgMS43ODQ0Mkw1Ljc3MjIyIDkuMjA1MTZDNS41MDMwOCA5LjQ3ODM4IDUuMDY2NzMgOS40NzgzOCA0Ljc5NzYgOS4yMDUxNkwwLjg5OTExNiA1LjI0NzQzQzAuNjI5OTgyIDQuOTc0MjEgMC42Mjk5ODIgNC41MzEyMiAwLjg5OTExNiA0LjI1OEMxLjE2ODI1IDMuOTg0NzggMS42MDQ2IDMuOTg0NzggMS44NzM3NCA0LjI1OEw1LjI4NDkxIDcuNzIxMDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
const apiUrl = "http://reshade.io:1234/"

interface IRarity {
    name: string
    color: string
}

export default class ClickableList extends HTMLElement {
    public rarities: string[]
    public selectedRarities: string[]

    constructor() {
        super();
        this.attachShadow({mode: "open"})
        this.rarities = []
        this.selectedRarities = []
        this.sendEvent()
        this.render()
    }

    async fetchRarities() {
        const resp = await fetch(apiUrl)
        const rarities = <[string, string][]>(await resp.json())
        this.rarities = rarities.map((e) => e[0])
        this.render()
    }

    connectedCallback() {
        this.render()
        this.fetchRarities()
        this.sendEvent()
    }

    styles() {
        const stylesElement = document.createElement("style")
        stylesElement.textContent = `
            .listContainer {
                display: flex;
                flex-direction: column;
            }
            
            .listEntryIconSelected {
                width: 2rem;
                height: 2rem;
                border-radius: .35rem;
                outline: none;
                cursor: pointer;
                padding: .3rem;
                outline: none;
                background: linear-gradient(rgb(62, 174, 255) -4.13%, rgb(60, 244, 200) 97.72%);
            }
            
            .listEntryIconUnselected {
                border: .15rem solid grey;
                padding: .3rem;
                width: 1.7rem;
                height: 1.7rem;
                border-radius: .35rem;
            }
            
            .listEntry {
                margin: 1rem 0;
                display: flex;
                cursor: pointer;
                align-items: center;
            }
            
            .listEntry[aria-selected = 'true'] .listEntryIcon {
                background: linear-gradient(rgb(62, 174, 255) -4.13%, rgb(60, 244, 200) 97.72%);
            }
            
            .listEntryText {
                margin: 0 1.35rem;
                color: #e9e9e9;
                user-select: none;
                font-weight: 600;
                font-size: 1.2rem;
            }
        `
        return stylesElement
    }

    render() {
        this.shadowRoot!.innerHTML = ""

        const container = document.createElement("div")
        container.classList.add("listContainer")


        for (const entry of this.rarities) {
            container.append(this.createListEntry(entry))
        }

        this.shadowRoot!.appendChild(this.styles())
        this.shadowRoot!.appendChild(container)
    }


    sendEvent() {
        this.dispatchEvent(
            new CustomEvent("rarityUpdate", {
                bubbles: true,
                composed: true,
                detail: {selectedRarities: this.selectedRarities},
            })
        );
    }

    handleListEntryClick(e: MouseEvent, rarityName: string) {
        const isSelectedAlready = this.selectedRarities.find(where => where == rarityName) != null
        if (isSelectedAlready) {
            this.selectedRarities = this.selectedRarities.filter(where => where != rarityName)
            this.sendEvent()
        } else {
            this.selectedRarities.push(rarityName)
            this.sendEvent()
        }
        this.render()
    }

    getListEntryIcon(rarityName: string) {
        const isSelected = this.selectedRarities.find(where => where == rarityName) != null

        if (isSelected) {
            const imgElement = document.createElement("img")
            imgElement.classList.add("listEntryIconSelected")
            imgElement.src = icon
            return imgElement
        } else {
            const divElement = document.createElement("div")
            divElement.classList.add("listEntryIconUnselected")
            return divElement
        }
    }

    createListEntry(rarityName: string) {
        const listEntryContainer = document.createElement("div")
        listEntryContainer.classList.add("listEntry")
        listEntryContainer.dataset.rarityName = rarityName
        listEntryContainer.onclick = (e) => this.handleListEntryClick(e, rarityName)


        const nameElement = document.createElement("p")
        nameElement.textContent = rarityName
        nameElement.classList.add("listEntryText")

        listEntryContainer.append(this.getListEntryIcon(rarityName), nameElement)


        return listEntryContainer
    }

}
