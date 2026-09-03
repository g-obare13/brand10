import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { ChevronDown, ChevronUp } from "@boxicons/react"
import { cn } from "@/lib/utils"

function Accordion({ className, children, ...props }: any) {
  const { dangerouslySetInnerHTML, ...cleanProps } = props || {}
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border",
        className
      )}
      {...cleanProps}
    >
      {children}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  className,
  children,
  ...props
}: AccordionPrimitive.Item.Props) {
  const { dangerouslySetInnerHTML, ...cleanProps } = props as any
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b data-open:bg-card", className)}
      {...cleanProps}
    >
      {children}
    </AccordionPrimitive.Item>
  )
}

interface AccordionTriggerProps extends AccordionPrimitive.Trigger.Props {
  icon?: React.ReactNode
}

function AccordionTrigger({
  className,
  children,
  icon,
  ...props
}: AccordionTriggerProps) {
  const { dangerouslySetInnerHTML, ...cleanProps } = props as any
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-4 text-left text-sm font-medium transition-all outline-none hover:cursor-pointer hover:text-primary aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...cleanProps}
      >
        {children}
        {icon !== undefined ? (
          icon
        ) : (
          <>
            <ChevronDown
              strokeWidth={2}
              data-slot="accordion-trigger-icon"
              className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
            />
            <ChevronUp
              strokeWidth={2}
              data-slot="accordion-trigger-icon"
              className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
            />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  const { dangerouslySetInnerHTML, ...cleanProps } = props as any
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden px-4 text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
        className
      )}
      {...cleanProps}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
