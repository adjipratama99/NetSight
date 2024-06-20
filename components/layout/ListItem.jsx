import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ListItem({
    title,
    href,
    className,
    ...props
}) {
    return (
        <Link className={
            cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none",
                "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
            )
        } href={href} {...props}>
            <div className="text-sm font-medium leading-none">{ title }</div>
        </Link>
    )
}