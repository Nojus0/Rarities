import "./Styles/index.css"
import ClickableList from "./Webcomponents/ClickableList";

customElements.define("clickable-list", ClickableList)

document.querySelector("clickable-list")!.addEventListener("rarityUpdate", e => {
    console.log(e)
})