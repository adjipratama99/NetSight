import {
    Select as SelectUI,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  export function Select ({
    options = [],
    placeholder,
    className,
    fullWidth,
    ...props
  }) {
    return (
      <SelectUI {...props}>
        <SelectTrigger className={fullWidth ? "w-full" : 'w-auto'}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(v => (
            <SelectItem key={v.value} value={v.value}>
              {v.text}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectUI>
    )
  }