# Register Page - Quick Reference Guide

## 🎨 Color Palette

### Light Theme (Default)
```
Primary Blue:        #2563eb (buttons, links)
Dark Navy:           #0f172a (headings, labels, input text)
Dark Slate:          #475569 (subtitles, helper text)
Medium Gray:         #94a3b8 (placeholders)
Light Gray:          #f9fafb (left section background)
White:               #ffffff (right section, inputs)
Border Gray:         #e2e8f0 (input borders)
Light Red (errors):  #fee2e2
Red (errors):        #dc2626
Light Green (success):#dcfce7
Green (success):     #16a34a
Gray (disabled):     #cbd5e1
```

### Dark Theme
```
Background:          #0f172a (dark navy)
Surfaces:            #1e293b (inputs, cards)
Text Primary:        #ffffff (headings, labels)
Text Secondary:      #cbd5e1 (subtitles, helper text)
Border:              #334155 (subtle borders)
```

---

## 📐 Sizing Standards

### Typography
```
Heading:             32px / 40px (display font, bold)
Form Title:          24px (mobile)
Subtitle:            12px / 14px
Labels:              12px (uppercase)
Input/Button Text:   16px (prevents zoom on mobile)
Small Text:          12px
Extra Small:         10px
```

### Spacing
```
Extra Small:         4px
Small:               8px
Base:                12px
Medium:              16px
Large:               24px
Extra Large:         32px
Huge:                40px / 60px
```

### Components
```
Border Radius:       8px (inputs, buttons)
Container Radius:    16px (form sections)
Min Button Height:   48px (desktop), 44px (mobile)
Input Padding:       12px 16px (height ~48px)
Label-Input Gap:     12px
Form Group Gap:      24px
Button Group Gap:    12px
```

---

## 🔧 Layout Constants

### Desktop (>1200px)
```
Container Padding:   40px
Form Width:          50%
Form Padding:        60px horizontal / 60px vertical
Max Container Width: 1200px
Two-Column:          Yes
Left Section:        Visible
```

### Tablet (768px - 1024px)
```
Container Padding:   30px
Form Width:          50%
Form Padding:        50px horizontal / 50px vertical
Two-Column:          Yes (maintained)
Responsive:          Yes
```

### Mobile (<768px)
```
Container Padding:   20px
Form Width:          100%
Form Padding:        20px
Two-Column:          No (stacked)
Left Section:        Hidden (display: none)
Full Width Buttons:  Yes
```

---

## 🎯 Key CSS Classes

### Structure
```
.registerContainer      - Main flex container
.brandingSection        - Left info panel (light)
.formSection            - Right form panel (white)
.formCard               - Form wrapper (transparent)
```

### Form Elements
```
.formTitle              - "Create Account" heading
.formSubtitle           - "Step 2 of 2..." text
.formGroup              - Individual field wrapper
.label                  - Field label
.inputWrapper           - Input + icon wrapper
.input                  - Input field
.input.inputError       - Error state
.input.inputSuccess     - Success state
.inputsValidationIcon   - Checkmark icon
```

### Buttons
```
.buttonGroup            - Container for buttons
.submitButton           - "Create Account" button
.backButton             - "Back" button
.submitButton:disabled  - Disabled state
```

### Text
```
.benefitIcon            - Emoji icons
.benefit                - Feature list items
.termsCheckbox          - Terms agreement
.signinLink             - Sign in link
.signinText             - "Already have account?" text
```

---

## 🎨 Styling Patterns

### Input Styling
```css
/* Default state */
border: 2px solid #e2e8f0;
background: #ffffff;
color: #0f172a;

/* Focus state */
border-color: primary-blue;
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);

/* Error state */
border-color: #dc2626;
background: #fee2e2;

/* Success state */
border-color: #16a34a;
background: #dcfce7;
```

### Button Styling
```css
/* Primary button (active) */
background: #2563eb;
color: white;
min-height: 48px;

/* Primary button (hover) */
background: #1e40af;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

/* Disabled button */
background: #cbd5e1;
opacity: 1;
cursor: not-allowed;
```

### Text Styling
```css
/* Headings */
color: #0f172a;
font-weight: bold;
font-family: display/serif;

/* Labels */
color: #0f172a;
font-weight: semibold;
text-transform: uppercase;
letter-spacing: 0.5px;

/* Helper text */
color: #475569;
font-weight: normal;
font-size: 12px;
```

---

## 📱 Responsive Breakpoints

```css
Desktop:     >1200px   /* Full layout, 40px padding */
Tablet:      768-1024px /* Tighter spacing */
Mobile:      <768px    /* Stacked, hidden left section */

/* Specific breakpoints */
@media (max-width: 1200px) { /* Tablet adjustments */
@media (max-width: 1024px) { /* Mobile transition */
@media (max-width: 640px)  { /* Small mobile adjustments */
```

---

## 🌙 Dark Mode Implementation

```css
@media (prefers-color-scheme: dark) {
  .brandingSection { background-color: #0f172a; }
  .formSection { background-color: #0f172a; }
  .input { 
    background-color: #1e293b;
    color: #ffffff;
    border-color: #334155;
  }
  /* ...more dark mode rules */
}
```

---

## ✅ Common Adjustments

### Make Text Larger
```css
.formTitle { font-size: 48px; }  /* default: 32px */
.label { font-size: 14px; }      /* default: 12px */
```

### Adjust Spacing
```css
.formGroup { gap: 32px; }        /* default: 24px */
.buttonGroup { margin-top: 40px; } /* default: 24px */
```

### Change Color Scheme
```css
/* Update all #0f172a to new dark color */
/* Update all #2563eb to new primary color */
/* Update all #f9fafb to new light color */
```

### Mobile-Only Adjustments
```css
@media (max-width: 768px) {
  .registerContainer { padding: 15px; }
  .formSection { padding: 25px; }
}
```

---

## 🐛 Troubleshooting

### Issue: Text not visible
**Check:** Background color, text color, contrast ratio
**Solution:** Ensure text color is #0f172a or #475569, not lighter

### Issue: Form fields look cramped
**Check:** Padding values, gap between elements
**Solution:** Increase padding to 12px 16px, gaps to 24px

### Issue: Mobile layout broken
**Check:** Media query breakpoints, display: none rules
**Solution:** Verify max-width values match responsive strategy

### Issue: Buttons not clickable
**Check:** z-index, pointer-events, cursor property
**Solution:** Ensure cursor: pointer and no pointer-events: none

### Issue: Dark mode colors wrong
**Check:** Dark mode media query, color values
**Solution:** Verify all colors are updated in @media (prefers-color-scheme: dark)

---

## 📋 Testing Checklist

- [ ] Desktop (1200px+): Two columns visible, proper layout
- [ ] Tablet (768-1024px): Two columns, responsive spacing
- [ ] Mobile (<768px): Single column, left section hidden
- [ ] All text: Dark, readable, proper contrast
- [ ] Form fields: Visible, accessible, properly spaced
- [ ] Buttons: Clickable, clear states, 48px minimum
- [ ] Focus states: Blue borders visible
- [ ] Error states: Red borders and backgrounds
- [ ] Success states: Green checkmarks visible
- [ ] Dark mode: All text readable, proper contrast
- [ ] Input font: 16px (prevents mobile zoom)
- [ ] Touch targets: 44-48px minimum

---

## 🚀 Quick Deploy

**Step 1:** Verify no CSS errors
```
npm run dev
/* Check browser console for errors */
```

**Step 2:** Test all breakpoints
```
Desktop, Tablet, Mobile views
Dark mode preference
All form interactions
```

**Step 3:** Review layout
```
Two-column centered
All text readable
All fields visible
Professional appearance
```

**Step 4:** Deploy
```
npm run build
Deploy dist/ folder
Verify in production
```

---

**Document Version:** 1.0
**Last Updated:** January 7, 2026
**Status:** Production Ready ✅
