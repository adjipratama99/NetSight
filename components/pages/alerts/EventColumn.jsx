import { randNumber } from "@/lib/Helper";
import { format } from "date-fns";
const random = randNumber(10000)


export const eventColumn = [
    {
        id: "clock-"+ random,
        accessorKey: "clock",
        header: "Date Time",
        size: 200,
        cell: prop => format(parseInt(prop.getValue() * 1000), 'dd MMM yyyy HH:mm:ss')
    },
    {
        id: "name-"+ random,
        accessorKey: "name",
        size: 400,
        header: "Log"
    },
    {
        id: "hosts-"+ random,
        accessorKey: "hosts",
        header: "Host",
        cell: prop => {
            let data = prop.getValue()[0]

            return data?.host
        }
    }
]