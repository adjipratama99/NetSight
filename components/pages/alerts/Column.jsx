import { Button } from "@/components/ui/button";
import { randNumber } from "@/lib/Helper";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";

export const alertColumns = (delFn) => {
  const random = randNumber(10000)
  return [
      {
        id: "dateCreate-"+ random,
        accessorKey: "dateCreate",
        header: "Date Create",
        cell: props => format(props.getValue(), 'yyyy-MM-dd HH:mm:ss')
      },
      {
          id: "username-"+ random,
          accessorKey: "username",
          header: "Username"
      },
      {
        id: "action-"+ random,
        accessorKey: "username",
        header: "Action",
        cell: props => {
          return <Button 
          variant="danger" 
          onClick={() => delFn(props.getValue())} 
          className="flex items-center gap-1 cursor-pointer"
          size="xs"
          ><FaTimes />Delete</Button>
        }
      }
  ]
}