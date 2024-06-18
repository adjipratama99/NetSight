import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ id, children }) {
    const { isOver, setNodeRef } = useDroppable({
        id
    })

    const style = {
        opacity: isOver ? 1 : 0.5
    }

    return (
        <div 
        ref={setNodeRef} 
        style={style}
        className={cn(
            'h-[400px] w-full'
        )}
        >
            {children}
        </div>
    )
}