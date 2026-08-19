import { useState } from 'react'
import { AtSign, Eye, KeyRound, Search } from 'lucide-react'
import {
  ColorPicker,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/ui/core'
import { ShowcaseCard } from '../components/showcase-card'

export function FormsSection() {
  const [selectedColor, setSelectedColor] = useState('#7c3aed')
  const [otpValue, setOtpValue] = useState('')
  const [radioValue, setRadioValue] = useState('standard')

  return (
    <section id="forms" className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-ns-primary/20 text-xs font-bold text-ns-primary-lt">
            03
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ns-text">
            Form Controls & Inputs (`src/shared/ui/core/`)
          </h3>
        </div>
        <p className="mt-1 text-sm text-ns-muted">
          Input controls, form field containers, validation states, and color
          picker tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Standard Inputs */}
        <ShowcaseCard
          title="Text Input & States"
          description="Standard text inputs, placeholders, and disabled states"
          codeBadge="<Input />"
        >
          <div className="w-full max-w-sm space-y-3">
            <Input placeholder="Standard placeholder..." />
            <Input defaultValue="Pre-filled text content" />
            <Input disabled placeholder="Disabled input state..." />

            <Input
              id="login-password"
              type="password"
              placeholder="Show password toggle ..."
              showPasswordToggle
            />
          </div>
        </ShowcaseCard>

        {/* Input Groups with Addons */}
        <ShowcaseCard
          title="Input Groups & Addons"
          description="Attached icons, prefixes, suffixes, and inline action buttons"
          codeBadge="<InputGroup />"
        >
          <div className="w-full max-w-sm space-y-3">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Search className="size-4 text-ns-muted" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search nodes or tags..." />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <AtSign className="size-4 text-ns-muted" />
              </InputGroupAddon>
              <InputGroupInput placeholder="username" />
              <InputGroupAddon align="inline-end">
                <span className="text-xs whitespace-nowrap text-ns-muted">
                  .nodespace.io
                </span>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <KeyRound className="size-4 text-ns-muted" />
              </InputGroupAddon>
              <InputGroupInput type="password" placeholder="Enter password" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="ghost" size="icon-xs">
                  <Eye className="size-3.5 text-ns-muted" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ShowcaseCard>

        {/* Select Dropdowns */}
        <ShowcaseCard
          title="Select Dropdown"
          description="Single-value dropdown selector"
          codeBadge="<Select />"
        >
          <div className="w-full max-w-sm space-y-3">
            <Select defaultValue="general">
              <SelectTrigger>
                <SelectValue placeholder="Select workspace category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">📁 General Workspace</SelectItem>
                <SelectItem value="notes">📝 Personal Notes</SelectItem>
                <SelectItem value="projects">🚀 Active Projects</SelectItem>
                <SelectItem value="archive">📦 Archived Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ShowcaseCard>

        {/* Radio Group */}
        <ShowcaseCard
          title="Radio Group Selection"
          description="Single-choice selection control"
          codeBadge="<RadioGroup />"
        >
          <RadioGroup
            value={radioValue}
            onValueChange={setRadioValue}
            className="w-full max-w-sm space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="r1" />
              <label
                htmlFor="r1"
                className="cursor-pointer text-xs font-medium text-ns-text"
              >
                Standard Cloud Sync
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="local" id="r2" />
              <label
                htmlFor="r2"
                className="cursor-pointer text-xs font-medium text-ns-text"
              >
                Local-Only Storage (Encrypted)
              </label>
            </div>
          </RadioGroup>
        </ShowcaseCard>

        {/* Input OTP */}
        <ShowcaseCard
          title="Input OTP (Verification Code)"
          description="6-digit verification code input slots"
          codeBadge="<InputOTP maxLength={6} />"
        >
          <div className="flex flex-col items-center gap-2">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <span className="text-xs text-ns-muted">
              Current OTP:{' '}
              {otpValue ? (
                <strong className="text-ns-primary-lt">{otpValue}</strong>
              ) : (
                'None'
              )}
            </span>
          </div>
        </ShowcaseCard>

        {/* Field with Validation & Helper */}
        <ShowcaseCard
          title="Field Container & Validation"
          description="Form field wrapper with label, helper text, and validation error messages"
          codeBadge="<Field><FieldError /></Field>"
        >
          <FieldGroup className="w-full max-w-sm">
            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <Input placeholder="you@example.com" />
              <FieldDescription>
                We will never share your email address.
              </FieldDescription>
            </Field>

            <Field data-invalid={true}>
              <FieldLabel>Workspace Name</FieldLabel>
              <Input defaultValue="Invalid Space @" aria-invalid={true} />
              <FieldError>
                Workspace name can only contain alphanumeric characters.
              </FieldError>
            </Field>
          </FieldGroup>
        </ShowcaseCard>

        {/* Textarea */}
        <ShowcaseCard
          title="Textarea"
          description="Multi-line text input control"
          codeBadge="<Textarea />"
        >
          <div className="w-full max-w-sm">
            <Textarea
              rows={3}
              placeholder="Write a quick summary of your note..."
              defaultValue="Quick note: Need to synchronize the design tokens and verify the contrast ratios in light mode."
            />
          </div>
        </ShowcaseCard>

        {/* Color Picker Component */}
        <ShowcaseCard
          title="Color Picker Component"
          description="Color picker supporting preset swatches and custom HEX values"
          codeBadge="<ColorPicker />"
          className="md:col-span-2"
        >
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-around">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-semibold tracking-wider text-ns-muted uppercase">
                Preset Palette
              </span>
              <ColorPicker
                value={selectedColor}
                onChange={setSelectedColor}
                variant="inline"
              />
            </div>
            <div className="flex min-w-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-ns-border-soft bg-ns-surface/50 p-4">
              <span className="text-xs text-ns-muted">Selected Color</span>
              <div
                className="size-12 rounded-lg border border-ns-border shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: selectedColor }}
              />
              <code className="font-mono text-xs font-semibold text-ns-text">
                {selectedColor}
              </code>
            </div>
          </div>
        </ShowcaseCard>
      </div>
    </section>
  )
}
