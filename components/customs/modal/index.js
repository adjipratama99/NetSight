"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export function Modal ({
  trigger,
  title,
  subTitle,
  content,
  footer,
  className,
  closeButton,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className ? className : "sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>{title || '?'}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>{ footer }</DialogFooter>
        {closeButton ? (
          <DialogClose>{closeButton}</DialogClose>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}