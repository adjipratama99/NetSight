import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function Draggable({ 
    activationContstrain,
    id,
    axis,
    handle,
    label = "Sample Draggable",
    modifiers
 }) {
    const {
        attributes, listeners, setNodeRef, transform
    } = useDraggable({
        id
    })

    const style = {
        transform: CSS.Translate.toString(transform)
    }

    return (
        <Button
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            { children }
        </Button>
    )
}