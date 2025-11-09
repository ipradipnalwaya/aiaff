# Design Guidelines: Gemini AI Affiliate Content Creator

## Design Approach

**Selected System**: Material Design 3 principles adapted for productivity
**Justification**: This is a utility-focused content creation tool requiring clarity, efficiency, and information density. Users need to focus on inputs and outputs without visual distraction.

**Key Principles**:
- Clarity over decoration
- Efficient information hierarchy
- Streamlined workflow from input → generation → output
- Professional, trustworthy aesthetic for content creators

---

## Typography

**Font Stack**:
- Primary: Inter (Google Fonts) - body text, inputs, labels
- Monospace: JetBrains Mono - code/HTML output displays

**Hierarchy**:
- H1: 2.5rem (40px), font-semibold - page title
- H2: 1.875rem (30px), font-semibold - section headers
- H3: 1.25rem (20px), font-medium - subsection headers
- Body: 1rem (16px), font-normal - paragraph text, form labels
- Small: 0.875rem (14px), font-normal - helper text, metadata
- Code: 0.9375rem (15px), font-mono - generated output

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing: p-2, gap-2 (element internal padding)
- Standard spacing: p-4, gap-4, m-4 (form fields, card padding)
- Section spacing: p-6, p-8 (containers, major sections)
- Large spacing: p-12, py-16 (page sections, vertical rhythm)

**Grid Structure**:
- Max width container: max-w-7xl mx-auto px-6
- Two-column layout for input/output: grid grid-cols-1 lg:grid-cols-2 gap-8
- Form groups: space-y-6
- Input fields: space-y-2

---

## Component Library

### Navigation & Header
- Top navbar with app branding (left), user actions (right)
- Sticky positioning with subtle border bottom
- Height: h-16, padding: px-6

### Input Form Section
**Container**: Rounded corners (rounded-lg), border, padding p-6

**Form Fields**:
- Label: text-sm font-medium, mb-2
- Text inputs: rounded-md border, px-4 py-2, focus ring
- Textarea: min-h-32 for descriptions, min-h-48 for resource text
- Multi-URL input: Dynamic add/remove buttons, each URL gets own input field with delete icon
- Dropdowns: Custom select with chevron icon, same styling as text inputs

**Field Groups**:
- Product Name: Single-line input
- Product Description: Textarea (min-h-32)
- Affiliate URLs: Repeatable input group with "+ Add URL" button
- Resource Input: Tabbed interface switching between "Paste Text" (textarea) and "Enter URL" (input)
- Tone Selector: Dropdown with options (Professional, Casual, Enthusiastic, Informative)

### Action Buttons
- Primary CTA: "Generate Content" - large button, px-8 py-3, rounded-lg, font-semibold
- Secondary: "Clear Form" - outlined style, same size
- Button group: flex gap-4, justify-end alignment

### Output Display Section
**Container**: Rounded corners (rounded-lg), border, min-h-96

**Tab System**:
- Tab navigation: Plain Text | HTML Code
- Tab buttons: px-6 py-3, border-b-2 for active state

**Output Areas**:
- Plain Text: Whitespace-preserved, readable line-height (leading-relaxed)
- HTML Code: Monospace font, syntax-aware display, scrollable
- Both: Padding p-6, max-height with overflow-y-auto

**Copy Actions**:
- "Copy to Clipboard" button positioned top-right of output area
- Icon + text label, small size (px-4 py-2)

### Content Preview Card
- Generated sections clearly delineated
- Headings use defined typography hierarchy
- Lists properly formatted with appropriate spacing
- Affiliate links visually indicated (underline, distinctive treatment)

### Loading States
- Spinner with "Generating content..." message
- Centered in output area during AI processing
- Skeleton loaders for form if needed during URL scraping

### Status Messages
- Toast notifications: positioned top-right, rounded-lg, px-6 py-4
- Success: with checkmark icon
- Error: with alert icon
- Auto-dismiss after 5 seconds

---

## Images

**No hero image required** - this is a tool/dashboard application focused on functionality.

**Icon Usage**:
- Use **Heroicons** (outline style) via CDN
- Form field icons: 20px (w-5 h-5)
- Button icons: 16px (w-4 h-4)
- Navigation icons: 24px (w-6 h-6)

**Suggested Icons**:
- Sparkles icon: for "Generate" button
- DocumentText: for plain text output
- Code: for HTML output
- Link: for affiliate URL fields
- Plus/Minus: for add/remove URL actions
- Clipboard: for copy actions

---

## Interaction Patterns

**Form Behavior**:
- Real-time character count for textareas
- Inline validation with error messages below fields
- URL format validation on blur
- Disable generate button until required fields filled

**Output Behavior**:
- Smooth tab transitions (no page reload)
- Highlight code syntax in HTML tab
- Scroll to output area after generation completes
- Confirmation before clearing form with unsaved content

**Responsive Breakpoints**:
- Mobile (<768px): Stack input/output vertically, full-width components
- Tablet (768px-1024px): Single column with comfortable spacing
- Desktop (>1024px): Two-column layout, input left, output right