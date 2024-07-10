import { CgCheck } from "react-icons/cg";
import { BsChevronExpand } from "react-icons/bs";
import { cn } from "@/lib/utils";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

export default function ComboBox({
    opts,
    open,
    placeholder = "Select option",
    defaultSelected,
    onSelect,
    fullWidth,
    onOpenChange,
    ...props
}) {
    
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={((fullWidth) ? "w-full" : "w-[200px]") +" justify-between"}
                >
                {defaultSelected
                    ? defaultSelected?.label
                    : placeholder}
                <BsChevronExpand className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={((fullWidth) ? "popover-full-width" : "w-[200px]") +" p-0"} {...props}>
                <Command
                    filter={(value, search, keywords = []) => {
                        const extendValue = value + " " + keywords.join(" ");
                        if (extendValue.toLowerCase().includes(search.toLowerCase())) {
                          return 1;
                        }
                        return 0;
                    }}
                >
                    <CommandInput placeholder="Search ..." />
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                        {opts.map((data) => (
                        <CommandItem
                            key={data.value}
                            value={data.value}
                            onSelect={onSelect}
                            className="cursor-pointer"
                        >
                            <CgCheck
                            className={cn(
                                "mr-2 h-4 w-4",
                                defaultSelected?.value === data.value ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {data.label}
                        </CommandItem>
                        ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
            </Popover>
    )
}