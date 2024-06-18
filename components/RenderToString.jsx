import { renderToString } from "react-dom/server"

export default function RenderHtml(comp) {
    return renderToString(comp)
}