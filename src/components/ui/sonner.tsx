import { Toaster as Sonner, type ToasterProps } from "sonner"

/** Toast inverted, come i menu del preset. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      mobileOffset={{ top: "max(12px, env(safe-area-inset-top))", left: 12, right: 12 }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !bg-inverted !text-inverted-foreground !border-0 !shadow-xl !font-sans !gap-3 !px-4 !py-3",
          description: "!text-inverted-muted",
          actionButton: "!bg-highlight !text-highlight-foreground !rounded-xl !font-medium",
          icon: "!text-highlight",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
