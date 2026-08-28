"use client"

import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import type { inputVariants } from "@/components/ui/input";
import { Input } from "@/components/ui/input"
import {
  COUNTRIES,
  
  flagEmoji,
  splitE164
} from "@/lib/country-codes"
import type {Country} from "@/lib/country-codes";
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends
    Omit<React.ComponentProps<"input">, "onChange" | "value" | "size">,
    VariantProps<typeof inputVariants> {
  /** Full E.164 number (e.g. "+254712345678") emitted on change. */
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const triggerSizeClasses: Record<
  NonNullable<VariantProps<typeof inputVariants>["size"]>,
  string
> = {
  xs: "h-6 px-2 text-xs",
  sm: "h-8 px-2.5 text-sm",
  default: "h-9 px-3 text-sm",
  lg: "h-10 px-3 text-sm",
  kuzafy: "h-12 px-3.5 text-base",
}

/**
 * Phone input with a searchable country code combobox.
 *
 * Users pick their country (dial code) from a searchable popup and type the
 * local number in the adjacent field. The component emits a single E.164
 * value like "+254712345678" — the number is never assumed to belong to a
 * fixed country. A leading "0" trunk prefix on the national number is
 * dropped automatically.
 */
export function PhoneInput({
  value,
  onChange,
  placeholder = "712 345 678",
  className,
  disabled,
  id,
  size = "default",
  ...props
}: PhoneInputProps) {
  // Split a pre-filled E.164 value once on mount; default to the configured
  // dial code when empty (e.g. Kenya +254 unless overridden).
  const [state, setState] = React.useState(() => {
    const init = splitE164(value || "")
    return { dialCode: init.dialCode, national: init.national }
  })
  const { dialCode, national } = state

  const emit = React.useCallback(
    (code: string, nat: string) => {
      const digits = nat.replace(/\D/g, "").replace(/^0+/, "")
      onChange(`+${code}${digits}`)
    },
    [onChange]
  )

  const selectedCountry = COUNTRIES.find((c) => c.dialCode === dialCode) ?? null

  const handleCountryChange = (country: Country | null) => {
    if (!country) return
    setState((prev) => ({ ...prev, dialCode: country.dialCode }))
    emit(country.dialCode, national)
  }

  const handleNationalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nat = e.target.value
    setState((prev) => ({ ...prev, national: nat }))
    emit(dialCode, nat)
  }

  const currentSize = size || "default"

  return (
    <div className={cn("flex w-full items-stretch", className)}>
      <Combobox
        items={COUNTRIES}
        value={selectedCountry}
        onValueChange={handleCountryChange}
        itemToStringValue={(c: Country) => `${c.name} ${c.dialCode} ${c.iso}`}
      >
        <ComboboxTrigger
          id={id ? `${id}-country` : undefined}
          aria-label="Country code"
          aria-invalid={props["aria-invalid"]}
          disabled={disabled}
          className={cn(
            "flex w-22 shrink-0 items-center justify-between gap-1.5 rounded-md rounded-r-none border-[1.5px] border-r-0 bg-input font-sans transition-[color,box-shadow] outline-none",
            "focus-visible:z-10 focus-visible:border-r-[1.5px] focus-visible:border-primary-500 dark:focus-visible:border-neutral-500",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive dark:bg-primary-50/10 dark:aria-invalid:border-destructive/50",
            triggerSizeClasses[currentSize]
          )}
        >
          <span className="inline-flex items-center gap-1.5 overflow-hidden">
            {/* <span aria-hidden="true" className="leading-none">
              {selectedCountry ? flagEmoji(selectedCountry.iso) : "🌐"}
            </span> */}
            <span className="font-medium tabular-nums">+{dialCode}</span>
          </span>
        </ComboboxTrigger>
        <ComboboxContent align="start" sideOffset={4} className="w-72 min-w-72">
          <ComboboxInput
            placeholder="Search country or code..."
            showTrigger={false}
          />
          <ComboboxEmpty>No country found.</ComboboxEmpty>
          <ComboboxList>
            {(c: Country) => (
              <ComboboxItem
                key={c.iso}
                value={c}
                className={"flex flex-row justify-between"}
              >
                <div className="flex flex-row gap-2">
                  <span aria-hidden="true">{flagEmoji(c.iso)}</span>
                  <span className="truncate">{c.name}</span>
                </div>

                <span className="ml-auto pl-4 text-xs text-muted-foreground tabular-nums">
                  +{c.dialCode}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Input
        type="tel"
        id={id}
        inputMode="tel"
        autoComplete="tel-national"
        value={national}
        onChange={handleNationalChange}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        className="rounded-l-none focus-visible:z-10"
        {...props}
      />
    </div>
  )
}
