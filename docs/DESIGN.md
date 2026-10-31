# UPTIME — Complete UI/UX Design Document

> **Version:** 1.0  
> **Project:** UPTIME — AI-Assisted On-Demand Technician Dispatch Platform  
> **Platforms:** 6 (React PWA + Flutter x2 + React x3)  
> **Institution:** DSATM Bengaluru — VTU — 2026-27  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity & Visual Language](#2-brand-identity--visual-language)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing & Layout System](#5-spacing--layout-system)
6. [Component Library](#6-component-library)
7. [Icon System](#7-icon-system)
8. [Animation & Motion](#8-animation--motion)
9. [Dark Mode](#9-dark-mode)
10. [Accessibility](#10-accessibility)
11. [Responsive Design](#11-responsive-design)
12. [Owner Web App — All Screens](#12-owner-web-app--all-screens)
13. [Owner Mobile App — All Screens](#13-owner-mobile-app--all-screens)
14. [Technician Web App — All Screens](#14-technician-web-app--all-screens)
15. [Technician Mobile App — All Screens](#15-technician-mobile-app--all-screens)
16. [Admin Web App — All Screens](#16-admin-web-app--all-screens)
17. [Navigation Architecture](#17-navigation-architecture)
18. [Interaction Patterns](#18-interaction-patterns)
19. [Error & Empty States](#19-error--empty-states)
20. [Loading States](#20-loading-states)
21. [Multilingual UI](#21-multilingual-ui)
22. [Industry-Specific Design](#22-industry-specific-design)
23. [Design References & Inspiration](#23-design-references--inspiration)
24. [Tailwind CSS Configuration](#24-tailwind-css-configuration)
25. [Flutter Theme Configuration](#25-flutter-theme-configuration)

---

## 1. Design Philosophy

### Core Principles

```
1. TRUST FIRST
   Every design decision builds confidence.
   Verified badges, ratings, real photos,
   tamper-proof certificates — visible always.
   Users must feel safe before they act.

2. SPEED OVER DECORATION
   When a machine breaks down, owners are
   stressed. Get them to "Book Now" in
   under 3 taps. No unnecessary animations,
   no decorative elements that slow loading.

3. INCLUSIVE BY DEFAULT
   Minimum tap target: 48×48px (WCAG)
   Voice input on every text field
   Works on ₹5,000 Android phones
   Readable in direct sunlight (high contrast)
   Usable by someone who cannot read (icons)

4. INFORMATION HIERARCHY
   Most important info: top-left (LTR reading)
   One primary action per screen
   Secondary actions visually subordinate
   Never show more than 3 choices at once

5. FEEDBACK ALWAYS
   Every tap gets instant visual feedback
   Loading states within 100ms
   Success/error never silent
   User always knows what happened

6. INDIA-FIRST
   Rupee symbol (₹) not dollar ($)
   Indian number format: 1,00,000 not 100,000
   Dates: DD/MM/YYYY not MM/DD/YYYY
   Phone: 10-digit without country code entry
   Languages: Regional first, English fallback
```

### Design References

```
Urban Company → Trust signals, clean white,
                verified badges, category grid
Uber          → Live map, bottom sheet overlay,
                real-time tracking marker
Swiggy        → Status stepper, order tracking,
                delivery ETA countdown
Ajio          → Bold product cards, strong
                typography, smooth scroll
PhonePe       → Payment UX, UPI flow,
                transaction history
Google Maps   → Navigation, search bar,
                place cards, route display
```

---

## 2. Brand Identity & Visual Language

### Logo

```
Primary Logo:
  Text: U P T I M E
  Style: Bold, wide letter-spacing (0.15em)
  The "U" contains an upward arrow (↑)
  Arrow color: Electric Teal #00D4AA
  Text color: Deep Blue #1A3C6E

Logo variants:
  ┌─────────────────────────────────────┐
  │  Full (horizontal):                 │
  │  [U↑]PTIME  AI Repair Platform      │
  │                                     │
  │  Icon only (app icon):              │
  │  [U↑] on Deep Blue square          │
  │  Rounded corners (r=22%)            │
  │                                     │
  │  Dark mode:                         │
  │  [U↑]PTIME in White + Teal         │
  │                                     │
  │  Monochrome:                        │
  │  All White (for dark backgrounds)   │
  │  All Deep Blue (for light)          │
  └─────────────────────────────────────┘

Minimum sizes:
  Digital: 120px wide (full logo)
           32px wide (icon only)
  Print:   3cm wide (full logo)

Clear space:
  All sides: = height of the "U" letter
```

### Brand Voice

```
Tone: Confident, clear, empathetic
      Never technical jargon to owners
      Always solution-focused

Headlines:   Short. Action-oriented. 
             "Find your technician in seconds"
             "Your machine is back online"

Body text:   Plain language. Max 2 sentences.
             "Raju Kumar is 8 minutes away.
              He's fixed 47 motors this year."

Error text:  Blame the system, not the user.
             "We couldn't connect. Please try again."
             Never: "Invalid input"

Success text: Celebratory but brief.
              "Booked! ✓"
              "Payment done ✓"
```

---

## 3. Color System

### Primary Palette

```css
/* CSS Custom Properties — root */
:root {
  /* Primary */
  --color-blue-900:   #0D2347;   /* Darkest blue */
  --color-blue-800:   #132B52;   /* Dark panel */
  --color-blue-700:   #1A3C6E;   /* Brand Deep Blue */
  --color-blue-600:   #1E5799;   /* Hover state */
  --color-blue-500:   #2563EB;   /* Automobile industry */
  --color-blue-100:   #DBEAFE;   /* Light blue bg */
  --color-blue-50:    #EFF6FF;   /* Subtle blue bg */

  /* Accent */
  --color-teal-500:   #00D4AA;   /* Brand Electric Teal */
  --color-teal-600:   #00B894;   /* Teal hover */
  --color-teal-100:   #CCFBF1;   /* Light teal bg */
  --color-teal-50:    #F0FDFB;   /* Subtle teal bg */

  /* Neutral */
  --color-dark:       #0F172A;   /* Primary text */
  --color-gray-700:   #334155;   /* Secondary text */
  --color-gray-500:   #64748B;   /* Placeholder */
  --color-gray-300:   #CBD5E1;   /* Border */
  --color-gray-100:   #F1F5F9;   /* Card background */
  --color-gray-50:    #F8FAFC;   /* Page background */
  --color-white:      #FFFFFF;   /* Pure white */

  /* Industry */
  --color-industrial: #7C3AED;   /* Purple */
  --color-automobile: #2563EB;   /* Blue */
  --color-electronics:#0891B2;   /* Cyan */

  /* Semantic */
  --color-success:    #16A34A;   /* Green */
  --color-warning:    #D97706;   /* Amber */
  --color-danger:     #DC2626;   /* Red */
  --color-info:       #2563EB;   /* Blue */

  /* Status */
  --color-posted:     #64748B;   /* Gray */
  --color-matched:    #2563EB;   /* Blue */
  --color-en-route:   #D97706;   /* Amber */
  --color-in-progress:#7C3AED;   /* Purple */
  --color-completed:  #16A34A;   /* Green */
  --color-cancelled:  #DC2626;   /* Red */
  --color-disputed:   #EA580C;   /* Orange */
}
```

### Dark Mode Palette

```css
:root[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-dark:      #F8FAFC;   /* Light text on dark */
    --color-gray-700:  #CBD5E1;
    --color-gray-500:  #94A3B8;
    --color-gray-300:  #334155;
    --color-gray-100:  #1E293B;   /* Card background dark */
    --color-gray-50:   #0F172A;   /* Page background dark */
    --color-white:     #1E293B;   /* "White" in dark mode */

    /* Brand colors stay same in dark mode */
    --color-blue-700:  #1A3C6E;
    --color-teal-500:  #00D4AA;
  }
}
```

### Color Usage Rules

```
Deep Blue (#1A3C6E):
  → Navigation bars
  → Primary buttons
  → Section headers
  → Active states
  → Chart primary line

Electric Teal (#00D4AA):
  → Accent underlines
  → Success indicators
  → Active toggle/switch
  → Highlights in charts
  → CTA secondary color

Pure White (#FFFFFF):
  → Page background
  → Card backgrounds
  → Text on dark backgrounds

Gray-50 (#F8FAFC):
  → Alternate row background
  → Input field background
  → Disabled button background

NEVER use:
  → More than 3 colors in one component
  → Pure black (#000000) for text
  → Red for anything except errors/danger
  → Green for anything except success
```

---

## 4. Typography System

### Font Stack

```css
/* Primary — all UI text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', sans-serif;

/* Monospace — code, IDs, invoice numbers */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Load Inter from Google Fonts */
@import url('https://fonts.googleapis.com/css2?
  family=Inter:wght@400;500;600;700&display=swap');
```

### Type Scale

```
Display XL:  48px / 700 / -0.02em  → Hero headlines
Display L:   36px / 700 / -0.02em  → Page titles (mobile hero)
Heading 1:   28px / 700 / -0.01em  → Section titles
Heading 2:   22px / 600 / -0.01em  → Card titles, modal titles
Heading 3:   18px / 600 / 0em      → Sub-section titles
Heading 4:   15px / 600 / 0em      → Small section labels
Body Large:  16px / 400 / 0em      → Important body text
Body:        14px / 400 / 0.01em   → Standard body text
Body Small:  13px / 400 / 0.01em   → Secondary text
Caption:     12px / 400 / 0.02em   → Timestamps, labels
Micro:       11px / 500 / 0.02em   → Badges, tags, chips
Code:        13px / 400 / 0em      → Job numbers, USNs
```

### Flutter Equivalent

```dart
// lib/core/config/theme.dart

static const TextTheme textTheme = TextTheme(
  displayLarge:  TextStyle(fontSize:48, fontWeight:FontWeight.w700,
                           letterSpacing:-0.5, fontFamily:'Inter'),
  displayMedium: TextStyle(fontSize:36, fontWeight:FontWeight.w700,
                           letterSpacing:-0.3, fontFamily:'Inter'),
  headlineLarge: TextStyle(fontSize:28, fontWeight:FontWeight.w700,
                           fontFamily:'Inter'),
  headlineMedium:TextStyle(fontSize:22, fontWeight:FontWeight.w600,
                           fontFamily:'Inter'),
  headlineSmall: TextStyle(fontSize:18, fontWeight:FontWeight.w600,
                           fontFamily:'Inter'),
  titleLarge:    TextStyle(fontSize:16, fontWeight:FontWeight.w600,
                           fontFamily:'Inter'),
  bodyLarge:     TextStyle(fontSize:16, fontWeight:FontWeight.w400,
                           fontFamily:'Inter'),
  bodyMedium:    TextStyle(fontSize:14, fontWeight:FontWeight.w400,
                           fontFamily:'Inter'),
  bodySmall:     TextStyle(fontSize:13, fontWeight:FontWeight.w400,
                           fontFamily:'Inter'),
  labelLarge:    TextStyle(fontSize:14, fontWeight:FontWeight.w600,
                           fontFamily:'Inter'),
  labelMedium:   TextStyle(fontSize:12, fontWeight:FontWeight.w500,
                           fontFamily:'Inter'),
  labelSmall:    TextStyle(fontSize:11, fontWeight:FontWeight.w500,
                           fontFamily:'Inter'),
);
```

### Typography Rules

```
Line height:
  Headings:  1.2× font size
  Body text: 1.5× font size
  Long-form: 1.7× font size

Max line length:
  Desktop:   65–75 characters
  Mobile:    40–50 characters

Text alignment:
  UI labels:   Left (never center for body)
  Numbers:     Right (for tables)
  Hero text:   Center (landing page only)
  Error msgs:  Left

Language-specific:
  Hindi/Kannada: Noto Sans (Google Fonts)
  All regional:  Same size as English
  Never reduce   font size for regional scripts
```

---

## 5. Spacing & Layout System

### Spacing Scale (4px base)

```
2px  → 0.5  → Micro gaps, icon padding
4px  → 1    → Tight inline spacing
8px  → 2    → Default inline padding
12px → 3    → Component internal padding
16px → 4    → Standard spacing unit
20px → 5    → Medium gaps
24px → 6    → Section padding
32px → 8    → Large section gaps
40px → 10   → Hero section padding
48px → 12   → Page section gaps
64px → 16   → Major section dividers

Tailwind usage:
  p-2  → 8px padding
  p-4  → 16px padding
  p-6  → 24px padding
  gap-4 → 16px gap in flex/grid
  mb-8  → 32px margin bottom
```

### Layout Grid

```
Desktop (≥1280px):
  Container max-width: 1200px
  Columns: 12
  Gutter:  24px
  Margin:  auto (centered)

Laptop (1024-1279px):
  Container: 960px
  Columns:   12
  Gutter:    20px

Tablet (768-1023px):
  Container: 720px
  Columns:   8
  Gutter:    16px

Mobile (320-767px):
  Container: 100%
  Columns:   4
  Gutter:    16px
  Margin:    16px left/right

Flutter layout:
  Mobile:  16px horizontal padding
  Tablet:  24px horizontal padding
  Desktop: 32px horizontal padding
  Max content width: 600px (single column)
```

### Border Radius

```
None:    0px   → Tables, dividers
Small:   4px   → Badges, tags, chips
Medium:  8px   → Cards, inputs, buttons
Large:   12px  → Bottom sheets, modals
XLarge:  16px  → Feature cards, hero
Full:    999px → Pill buttons, avatars

Flutter:
  BorderRadius.circular(4)   → Small
  BorderRadius.circular(8)   → Medium
  BorderRadius.circular(12)  → Large
  BorderRadius.circular(16)  → XLarge
  BorderRadius.circular(100) → Full
```

### Shadows

```css
/* Elevation system */
--shadow-xs:   0 1px 2px rgba(0,0,0,0.05);
--shadow-sm:   0 1px 3px rgba(0,0,0,0.10),
               0 1px 2px rgba(0,0,0,0.06);
--shadow-md:   0 4px 6px rgba(0,0,0,0.07),
               0 2px 4px rgba(0,0,0,0.06);
--shadow-lg:   0 10px 15px rgba(0,0,0,0.10),
               0 4px 6px rgba(0,0,0,0.05);
--shadow-xl:   0 20px 25px rgba(0,0,0,0.10),
               0 10px 10px rgba(0,0,0,0.04);

/* Usage:
   Cards:        shadow-sm
   Modals:       shadow-lg
   Dropdowns:    shadow-md
   Bottom sheets:shadow-xl
   Hoverd cards: shadow-md
*/
```

---

## 6. Component Library

### Buttons

```
Primary Button:
  Background:  Deep Blue #1A3C6E
  Text:        White, 14px, SemiBold
  Padding:     12px 24px
  Radius:      8px
  Height:      44px (minimum)
  Hover:       Blue-600 #1E5799
  Disabled:    Gray-300 bg, Gray-500 text
  Loading:     Spinner replaces label

Secondary Button:
  Background:  Transparent
  Border:      1.5px Deep Blue
  Text:        Deep Blue, 14px, SemiBold
  Same size as Primary

Destructive Button:
  Background:  Red #DC2626
  Text:        White
  Used for:    Delete, Cancel job

Text Button:
  No background, no border
  Text:        Teal #00D4AA
  Underline on hover

Icon Button:
  Size:        40×40px (min 44×44 touch target)
  Background:  Gray-100 on hover

Flutter equivalent:
  Primary:   ElevatedButton (Blue bg)
  Secondary: OutlinedButton (Blue border)
  Text:      TextButton (Teal)
  Icon:      IconButton (44px splash)
```

### Input Fields

```
Default state:
  Border:      1px Gray-300
  Background:  Gray-50
  Padding:     12px 16px
  Radius:      8px
  Height:      48px
  Placeholder: Gray-400

Focus state:
  Border:      2px Deep Blue #1A3C6E
  Background:  White
  Shadow:      0 0 0 3px rgba(26,60,110,0.15)

Error state:
  Border:      2px Red #DC2626
  Background:  Red-50 #FEF2F2
  Icon:        ⚠ Red icon right side

Success state:
  Border:      2px Green #16A34A
  Icon:        ✓ Green icon right side

Disabled state:
  Background:  Gray-100
  Text:        Gray-400
  Cursor:      not-allowed

Label:
  Position:    Above input, 8px gap
  Size:        13px, SemiBold
  Color:       Gray-700

Helper text:
  Below input, 4px gap
  Size:        12px, Regular
  Color:       Gray-500 (normal), Red (error)

Flutter:
  TextFormField with InputDecoration
  focusedBorder: OutlineInputBorder (Blue)
  errorBorder:   OutlineInputBorder (Red)
```

### Cards

```
Standard Card:
  Background:  White
  Border:      1px Gray-100
  Radius:      12px
  Shadow:      shadow-sm
  Padding:     16px

Interactive Card (clickable):
  + Hover:     shadow-md, scale(1.01)
  + Active:    scale(0.99)
  + Cursor:    pointer

Feature Card:
  + Gradient border (Blue to Teal)
  Background: White
  Padding:    20px

Stats Card:
  Background: Blue-50 or Teal-50
  Border-left: 3px Deep Blue or Teal
  No shadow

Job Status Card:
  Left border color = job status color
  Background: White
  Shows: job number, status badge,
         owner/tech name, amount

Flutter Card:
  Card(
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12)
    ),
    child: Padding(padding: EdgeInsets.all(16)),
  )
```

### Badges & Tags

```
Status Badge (job):
  Radius:   999px (pill shape)
  Padding:  4px 12px
  Size:     12px, SemiBold
  Colors:   Match status colors

  POSTED:      Gray bg, Gray text
  MATCHED:     Blue bg, White text
  EN_ROUTE:    Amber bg, White text
  IN_PROGRESS: Purple bg, White text
  COMPLETED:   Green bg, White text
  CANCELLED:   Red bg, White text
  DISPUTED:    Orange bg, White text

Industry Badge:
  INDUSTRIAL:  Purple bg
  AUTOMOBILE:  Blue bg
  ELECTRONICS: Cyan bg
  All: White text, pill shape

Match Score Badge:
  "92% match" → Green if >80%, Amber if 60-80%
  Background: Colored bg, White text
  Position:   Top-right of technician card

Verified Badge:
  Blue circle with ✓ white
  Size: 18px inline with name
  Tooltip: "Verified by UPTIME"

NFT Badge:
  Gradient border (Purple to Gold)
  Shimmer animation
  "Blockchain Verified" caption
```

### Navigation

```
Web — Top Navigation Bar:
  Height:       64px
  Background:   Deep Blue #1A3C6E
  Logo:         Left side, white
  Links:        Center (desktop), hamburger (mobile)
  Actions:      Right (language, notification bell, avatar)
  Active link:  Teal underline 2px

Web — Sidebar (Owner):
  Width:        260px (expanded), 64px (collapsed)
  Background:   White
  Border:       1px right Gray-200
  Active item:  Blue-50 bg, Blue-700 text, Blue left border 3px
  Icon + Label: Both visible when expanded
  Icons only:   When collapsed (tooltip on hover)

Web — Bottom Tab (Mobile/Owner Web):
  5 tabs: Home, Jobs, Assets, Market, Profile
  Active: Teal icon + label
  Inactive: Gray icon + label

Flutter Bottom Nav:
  BottomNavigationBar or NavigationBar
  5 items with NavigationDestination
  selectedItemColor: Teal
  unselectedItemColor: Gray-400
  showSelectedLabels: true
  showUnselectedLabels: true
```

### Modals & Bottom Sheets

```
Web Modal:
  Overlay:     rgba(0,0,0,0.5) backdrop blur 4px
  Width:       480px (small), 640px (medium), 800px (large)
  Radius:      16px top, 0 bottom (bottom-sheet style on mobile)
  Animation:   slide-up 200ms ease-out
  Close:       ✕ button top-right, click outside

Flutter Bottom Sheet:
  showModalBottomSheet with:
    isScrollControlled: true (full height possible)
    backgroundColor: White
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20))
    )
  Handle: Gray pill 32×4px at top center
  Max height: 90% of screen

Flutter Dialog:
  AlertDialog for confirmations
  radius: 16px
  Actions: TextButton (cancel) + ElevatedButton (confirm)
```

### Tables (Web)

```
Header:
  Background: Gray-50
  Border-bottom: 2px Gray-200
  Text: 12px, SemiBold, Gray-600, Uppercase

Rows:
  Height: 52px
  Border-bottom: 1px Gray-100
  Hover: Gray-50 background
  Even rows: White (no zebra — Urban Company style)

Sortable columns:
  Arrow icon on hover
  Active sort: Blue arrow

Pagination:
  Below table, right-aligned
  Previous/Next + page numbers
  "Showing 1-10 of 234 results"

Responsive:
  < 768px: horizontal scroll
  or: card-view mode (stack columns)
```

---

## 7. Icon System

### Icon Library

```
Primary: Lucide React (Web)
         lucide_flutter (Flutter)

Why Lucide:
  → Consistent 2px stroke weight
  → 24px grid, scales cleanly
  → 1000+ icons covering all needs
  → MIT license (free)
  → Tree-shakeable (only import used icons)

Size variants:
  16px → Inline with text, badges
  20px → Button icons
  24px → Standard UI icons
  32px → Feature icons (large cards)
  48px → Illustration-style (empty states)

Stroke width:
  Standard UI: 2px
  Bold UI:     2.5px (for emphasis)

Color:
  Matches text color by default
  Teal for active/positive
  Red for errors/destructive
  Gray-400 for inactive/disabled
```

### Custom Industry Icons

```
Industrial:  Factory/gear SVG icon
Automobile:  Car SVG icon
Electronics: Circuit board SVG icon

All custom icons:
  Grid: 24×24px
  Stroke: 2px
  No fill (outline style)
  Consistent with Lucide style

File locations:
  Web:     src/assets/icons/*.svg
  Flutter: assets/icons/*.svg
```

### Status Icons

```
✓ Completed     → Lucide: CheckCircle (Green)
⚡ In Progress  → Lucide: Zap (Purple)
🔄 En Route     → Lucide: Navigation (Amber)
🔔 Posted       → Lucide: Bell (Gray)
✕ Cancelled     → Lucide: XCircle (Red)
⚠ Disputed     → Lucide: AlertTriangle (Orange)
🤖 AI           → Lucide: Bot (Blue)
📍 Location     → Lucide: MapPin (Red)
⭐ Rating       → Lucide: Star (Amber filled)
🔒 Tamper-proof → Lucide: Lock (Green)
📹 Video call   → Lucide: Video (Teal)
```

---

## 8. Animation & Motion

### Principles

```
Duration scale:
  Instant:     0ms   → Toggle state, checkbox
  Fast:       100ms  → Button press feedback
  Standard:   200ms  → Modal open, dropdown
  Smooth:     300ms  → Page transition
  Deliberate: 400ms  → Hero animations
  Lottie:     custom → Success, loading, empty

Easing:
  ease-out    → Elements entering screen
  ease-in     → Elements leaving screen
  ease-in-out → Elements moving on screen
  spring      → Interactive elements (Flutter)

Never animate:
  → Content that users are reading
  → Form validation errors (show instantly)
  → Loading skeletons (they ARE the animation)
```

### Web Animations (Framer Motion / Tailwind)

```tsx
// Page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0,
             transition: { duration: 0.3, ease: 'easeOut' }},
  exit:    { opacity: 0, y: -20,
             transition: { duration: 0.2, ease: 'easeIn' }}
};

// Card hover
className="transition-all duration-200
           hover:shadow-md hover:scale-[1.01]
           active:scale-[0.99]"

// Status badge pulse (for active jobs)
className="animate-pulse" // Tailwind built-in

// Skeleton shimmer
className="animate-pulse bg-gradient-to-r
           from-gray-200 via-gray-100 to-gray-200
           bg-size-200 animate-shimmer"
```

### Lottie Animations

```
success.json:
  Trigger:  Job completed, payment done
  Duration: 1.5 seconds
  Loop:     false
  Colors:   Green + White

booking_confirmed.json:
  Trigger:  After technician booked
  Duration: 2 seconds
  Loop:     false

ai_thinking.json:
  Trigger:  While Gemini processes
  Duration: loop until done
  Colors:   Blue + Teal + Purple

technician_coming.json:
  Trigger:  Technician accepted, en route
  Duration: loop
  Colors:   Blue + Amber

job_complete.json:
  Trigger:  Mark complete tapped
  Duration: 2 seconds
  Loop:     false
  Colors:   Green confetti

badge_earned.json:
  Trigger:  New badge unlocked
  Duration: 2.5 seconds
  Loop:     false
  Colors:   Gold + Purple

empty_state.json:
  Trigger:  Empty list/no results
  Duration: loop (gentle)
  Colors:   Gray-400
```

### Flutter Animations

```dart
// Micro-animation on card tap
GestureDetector(
  onTapDown: (_) => setState(() => _scale = 0.97),
  onTapUp:   (_) => setState(() => _scale = 1.0),
  child: AnimatedScale(
    scale: _scale,
    duration: Duration(milliseconds: 100),
    child: JobCard(),
  ),
)

// Page transitions (go_router)
CustomTransitionPage(
  transitionsBuilder: (context, animation, _, child) =>
    SlideTransition(
      position: Tween<Offset>(
        begin: Offset(1, 0), end: Offset.zero,
      ).animate(CurvedAnimation(
        parent: animation, curve: Curves.easeOut
      )),
      child: child,
    ),
)

// Bottom sheet animation
showModalBottomSheet(
  // Flutter handles spring animation automatically
  isScrollControlled: true,
  ...
)

// Availability toggle
AnimatedSwitcher(
  duration: Duration(milliseconds: 200),
  child: is_available
    ? OnlineIndicator(key: ValueKey('on'))
    : OfflineIndicator(key: ValueKey('off')),
)
```

---

## 9. Dark Mode

### Web Dark Mode

```css
/* Automatic (follows OS preference) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Override all color tokens */
    --color-dark:     #F8FAFC;
    --color-gray-50:  #0F172A;  /* Page bg */
    --color-gray-100: #1E293B;  /* Card bg */
    --color-gray-300: #334155;  /* Border */
    --color-white:    #1E293B;  /* "White" surfaces */
  }
}

/* Manual override (user setting) */
:root[data-theme="dark"]  { /* same overrides */ }
:root[data-theme="light"] { /* force light mode */ }
```

### Flutter Dark Mode

```dart
MaterialApp(
  theme:     _lightTheme,
  darkTheme: _darkTheme,
  themeMode: ThemeMode.system, // follows OS

  // Manual: read from user_preferences
  themeMode: userPref.darkMode
    ? ThemeMode.dark
    : ThemeMode.light,
)

static final ThemeData _darkTheme = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    primary:    Color(0xFF1A3C6E),
    secondary:  Color(0xFF00D4AA),
    surface:    Color(0xFF1E293B),
    background: Color(0xFF0F172A),
    onPrimary:  Colors.white,
    onSurface:  Color(0xFFF8FAFC),
  ),
  scaffoldBackgroundColor: Color(0xFF0F172A),
  cardColor:               Color(0xFF1E293B),
);
```

### Dark Mode Rules

```
Always maintain:
  → Brand Blue #1A3C6E (unchanged)
  → Teal #00D4AA (unchanged)
  → Status colors (Green/Red/Amber unchanged)
  → Images/media (unchanged)

Invert:
  → White backgrounds → Dark surfaces
  → Dark text → Light text
  → Light borders → Dark borders
  → Shadows: reduce opacity by 50%

Never invert:
  → Photos and illustrations
  → Maps (use Google Maps dark mode API)
  → Charts (use dark chart theme)
  → Brand logo (use white variant)

Google Maps dark mode:
  mapStyle: [{
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }]
  }, ...]
```

---

## 10. Accessibility

### WCAG 2.1 Level AA Requirements

```
Color contrast:
  Normal text (< 18px):    4.5:1 minimum
  Large text (≥ 18px):     3.0:1 minimum
  UI components/graphics:  3.0:1 minimum

  ✅ Deep Blue on White:   10.7:1 (passes AAA)
  ✅ Teal on White:         2.9:1 (fails — use for decorative only)
  ✅ Dark text on Gray-50:  12.6:1 (passes AAA)
  ✅ White on Blue-700:     10.7:1 (passes AAA)

Touch targets (mobile):
  Minimum: 44×44px (WCAG 2.1)
  Preferred: 48×48px
  Spacing: 8px between targets
  Never: two targets within 8px of each other

Focus indicators (web):
  Visible outline on all interactive elements
  outline: 2px solid #1A3C6E
  outline-offset: 2px
  Remove default only if custom is more visible
  Never: outline: none without replacement

Screen reader:
  All images: alt="" or meaningful alt text
  Icon buttons: aria-label="Button purpose"
  Form inputs: associated <label> element
  Modals: aria-labelledby, aria-describedby
  Status updates: aria-live="polite"
  Loading states: aria-busy="true"
  Custom widgets: role="..." attributes

Flutter accessibility:
  Semantics widget on all custom widgets
  excludeSemantics: false by default
  label, hint, button, textField roles
  MergeSemantics for complex widgets
```

### India-Specific Accessibility

```
Voice Input:
  Every text field has voice icon
  Web Speech API (Chrome/Android WebView)
  speech_to_text package (Flutter)
  Supports: EN, HI, KN, TA, TE, ML, MR, GU, BN
  Fallback: keyboard input always available

Low Literacy Mode:
  Icons replace text labels where possible
  Large touch targets (56×56px)
  Voice feedback (flutter_tts)
  Step-by-step wizard flows (no free text)

Feature Phone Users:
  WhatsApp chatbot fallback
  SMS-based OTP (no smartphone needed)
  USSD menu (future scope)

Outdoor Visibility:
  High contrast mode toggle in settings
  Minimum text: 16px on mobile (not 14px)
  No light gray on white combinations
  Strong shadows on maps/cards

Indian Sign Language (ISL):
  Video guides for key flows
  Settings → Accessibility → ISL mode
  Plays ISL video alongside text
  Stored in Cloudinary

Motor Accessibility:
  All flows completable with one hand
  Critical buttons: bottom of screen (thumb reach)
  Swipe gestures have button alternatives
  No time-limited interactions (except auction)
```

---

## 11. Responsive Design

### Breakpoints

```css
/* Tailwind breakpoints (mobile-first) */
sm:   640px   /* Large phones landscape */
md:   768px   /* Tablets portrait */
lg:   1024px  /* Tablets landscape / small laptop */
xl:   1280px  /* Desktop */
2xl:  1536px  /* Wide desktop */

/* Usage */
className="w-full md:w-1/2 lg:w-1/3"
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Layout Patterns Per Screen Size

```
Mobile (< 640px):
  → Single column layout
  → Bottom navigation bar
  → Full-width cards
  → Stacked form fields
  → Bottom sheet instead of modal
  → No sidebar

Tablet (640-1023px):
  → 2-column grid for cards
  → Side navigation (collapsible)
  → Modals (not bottom sheets)
  → Map + detail side by side

Desktop (≥ 1024px):
  → Fixed sidebar (260px)
  → 3-4 column card grids
  → Data tables
  → Full map view with panel
  → Keyboard shortcuts

Adaptive patterns:
  JobList:
    Mobile:  Vertical card list
    Tablet:  2-col card grid
    Desktop: Table with sort/filter

  LiveTracking:
    Mobile:  Full-screen map + bottom sheet
    Tablet:  Map left (60%), panel right (40%)
    Desktop: Map left (70%), panel right (30%)

  Dashboard:
    Mobile:  Vertical scroll cards
    Tablet:  2-col stats + recent jobs
    Desktop: Sidebar + 4-col stats grid
```

### Flutter Responsive

```dart
// Detect screen size
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile, tablet, desktop;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1024) return desktop;
    if (width >= 640)  return tablet;
    return mobile;
  }
}

// Adaptive padding
EdgeInsets get screenPadding {
  final width = MediaQuery.of(context).size.width;
  if (width >= 1024) return EdgeInsets.symmetric(horizontal:32);
  if (width >= 640)  return EdgeInsets.symmetric(horizontal:24);
  return EdgeInsets.symmetric(horizontal:16);
}
```

---

## 12. Owner Web App — All Screens

### Screen 1: Landing Page

```
Layout:    Full-page hero + sections
URL:       uptime.in

Hero section:
  Background: Deep Blue gradient (dark to darker)
  Headline:   "Downtime ends here." (Display XL, White)
  Subhead:    "AI-powered technician dispatch for
               industrial, automobile & electronics repair"
  CTA pair:   [Book a Repair →] [Watch Demo]
  Visual:     3D illustration or animation of
               all 3 industry icons orbiting logo

Industry section:
  3 cards side by side:
  🏭 Industrial   🚗 Automobile   📱 Electronics
  Each: Icon + headline + 3 bullet points + CTA

Stats bar:
  69 Features | 19 World-First | 3 Industries | ₹0 Dev Cost

How it works:
  6-step horizontal flow with icons
  (Animated on scroll — Framer Motion)

Why UPTIME:
  4 feature highlights with icons
  Trust signals: ratings, verified, tamper-proof

Social proof:
  Technician count, cities, jobs completed

Footer:
  Links: Privacy, Terms, Contact
  Language selector
  Social media icons
```

### Screen 2: Login / Signup

```
Layout:    Centered card on gradient bg

Login card:
  Width:  420px (desktop), full-width (mobile)
  Logo:   Top center
  Title:  "Sign in to UPTIME"
  Fields: Phone number (with +91 prefix)
  Button: [Send OTP →] (Primary, full width)
  Link:   "New to UPTIME? Create account"

OTP screen:
  Title:  "Enter OTP"
  Subtext:"Sent to +91 XXXXXX1234"
  Input:  6 boxes (one digit each, auto-advance)
  Timer:  "Resend in 00:45" countdown
  Link:   "Resend OTP" (active after timer)
  Button: [Verify →]

Signup additions:
  Full name field
  Industry selection (3 cards, pick one+)
  Terms acceptance checkbox
```

### Screen 3: Onboarding

```
3-step wizard:
  Step 1: Industry setup
    Pick industries you operate in
    (Multi-select: Industrial / Automobile / Electronics)
    Visual: Large illustrated cards

  Step 2: Add first asset
    Quick add: machine / vehicle / device
    Name + type + photo (optional)
    Skip option

  Step 3: Enable notifications
    Toggle: Push, SMS, Email
    Language preference selector
    CTA: [Start using UPTIME →]

Progress: Dots at top (3 dots)
Back:     Available except step 1
```

### Screen 4: Dashboard

```
Layout: Sidebar (desktop) / Bottom nav (mobile)

Top section:
  Greeting:      "Good morning, Sharma! 👋"
  Industry tabs: [🏭 Industrial] [🚗 Auto] [📱 Electronics]
                 (Selected industry highlighted in Teal)

Active job banner (if any):
  Full-width card: Blue bg
  "Raju Kumar is en route — 8 mins away"
  [Track Live →] button

Quick Actions grid (2×2 or 2×3):
  [Report Fault]    [Book Service]
  [Virtual Consult] [Add Asset]
  [Marketplace]     [Insurance]
  Each: Icon + label + industry color

Asset Health row:
  Horizontal scroll cards
  Each: Asset name + health gauge + status

Prediction Alerts:
  Card: "⚠ CNC Lathe #1 may need bearing
         replacement in 18 days — ₹800-1,200"
  [Schedule Service] button

Recent Jobs:
  Last 3 jobs as compact cards
  Status + date + technician + amount
  [View All →] link

Stats (bottom):
  4 cards: Total Jobs | This Month | Total Spent | Savings
```

### Screen 5: Report Fault

```
Step 1: Select asset
  Industry auto-selected from context
  Asset picker: Grid of asset cards
  + "Add new asset" option

Step 2: Describe fault
  Voice input button (mic icon, prominent)
  Text area: "Describe the problem..."
  Language selector (EN/HI/KN etc.)
  Hint: "Or tap mic to speak"

Step 3: Add media (optional but recommended)
  Grid of add buttons:
  [📷 Add Photos] [🎥 Add Video]
  [🎤 Record Sound] [📄 Add Document]
  Preview thumbnails after adding

Step 4: Set urgency
  3 options with visual difference:
  🟢 Low (flexible timing)
  🟡 Medium (today)
  🔴 High (urgent, now)
  ⚡ Critical (emergency, auction)

[Analyse Fault →] button (Primary, full-width)
```

### Screen 6: AI Diagnosis

```
Loading state:
  Lottie ai_thinking animation
  "Analysing your fault report..."
  Steps shown: "Reading description...
                Analysing photos... Done ✓"

Result card:
  Fault category: "Motor Bearing Failure"
  Confidence:     "87% confidence"
  Urgency:        ⚡ HIGH badge (colored)
  
  Estimate box:   "₹800 – ₹1,200"
  Timeline:       "2–3 hours"
  Skills needed:  [Motor Repair] [Bearing Replacement]

  Diagnosis text:
  "Based on your description and sound recording,
   the motor shows classic signs of bearing wear.
   Immediate attention recommended to prevent
   further damage to the motor housing."

  Safety warning (if any):
  ⚠ Orange box: "Turn off machine power before
                  technician arrives"

[Find Technicians →] button
[Edit fault details] link
```

### Screen 7: Select Technician

```
Header:
  "8 technicians available nearby"
  Sort: [Best Match ▼] [Nearest] [Highest Rated]

Technician cards (vertical list):
  Each card:
  ┌────────────────────────────────────────┐
  │  [Photo]  Raju Kumar           92% ▓▓▓ │
  │  ⭐4.8 (127 jobs)  📍2.3 km  ⏱8 mins  │
  │  Skills: Motor Repair, Bearings ✓✓     │
  │  ₹800–1,200 estimated                  │
  │              [View Profile] [Book Now →]│
  └────────────────────────────────────────┘

  Match score bar: Teal fill (92%)
  Skills: Show only matching skills (green ticks)
  Distance + ETA: Prominent

Map toggle:
  "Show on Map" → pins all technicians on Google Map
  Click pin → show card for that tech

Virtual Consult option:
  Top of list: "Not sure? Try Virtual Consultation first"
  [₹99 Quick Check] [₹199 Full Diagnosis]
```

### Screen 8: Live Tracking (Uber-style)

```
Full-screen Google Map:
  Owner pin:     Blue (home/factory location)
  Tech pin:      Animated car/person icon moving
  Route line:    Teal dashed line
  ETA ring:      Circle around tech shrinking as approaches

Bottom sheet (slides up):
  Handle: Gray pill at top
  
  Status stepper:
  ●──●──○──○──○
  Posted → Matched → En Route → Arrived → In Progress
  
  Tech info card:
  [Photo] Raju Kumar ⭐4.8
          Motor Specialist · 127 jobs
          [📞 Call] [💬 Chat]
  
  ETA card:
  "8 minutes away"
  (updates live via WebSocket)
  
  OTP card (visible when tech near):
  "Share this OTP with technician"
  [  4  7  2  9  ]  (large digits)
  "Valid for 10 minutes"

  [Track on Full Screen] toggle
```

### Screen 9: Job History

```
Filter bar:
  All | Active | Completed | Cancelled
  Date range picker
  Industry filter
  Search by job number

Job list:
  Compact cards:
  ┌─────────────────────────────────────────┐
  │ UPT-2026-00234     ✓ COMPLETED  13/10/26│
  │ Motor Bearing Repair — CNC Lathe #1     │
  │ Raju Kumar · ₹1,050 · ⭐4.5 rated      │
  │ [View Details] [Download Certificate]  │
  └─────────────────────────────────────────┘

Empty state:
  Lottie empty animation
  "No jobs yet"
  [Report your first fault →]
```

### Screen 10: Job Details

```
Header: UPT-2026-00234 | ✓ COMPLETED
Tamper-proof badge: 🔒 SHA-256 Verified

Sections:
  1. Job Summary
     Asset, fault category, date, duration

  2. Technician
     Photo, name, rating, contact

  3. Timeline
     Vertical timeline of all events with timestamps

  4. Work Done
     Checklist (all steps marked complete)
     Before/after photos grid
     Parts used table: Name | Qty | Cost

  5. Financial
     Labour: ₹700
     Parts:  ₹350
     GST:    ₹95 (18%)
     Total:  ₹1,145

  6. Certificate
     [Download PDF Certificate 📄]
     [Verify Authenticity 🔒]

  7. Rating
     Stars given (or rating form if pending)
```

### Screen 11: Digital Twin

```
Asset selector: Tabs for each asset
                (Machines / Vehicles / Devices)

Health gauge:
  Large circular gauge (0–100%)
  Color: Green > 80%, Amber 50-80%, Red < 50%
  Center: Score + status label

Component grid:
  2-column grid of component cards
  Each: Name + mini gauge + status
  Tapping shows detail + history

Prediction panel:
  Timeline of upcoming maintenance
  Each: Fault name + probability + date + cost
  [Schedule preventive service →]

History chart:
  Line chart: health score over time
  Vertical lines at each repair date

Savings calculator:
  "Preventive maintenance saved you ₹12,400
   in emergency repairs this year"
```

### Screen 12: Insurance Page

```
Tabs: Policies | Claims | Warranties | AMC

Policies tab:
  Active policy card:
  ┌──────────────────────────────────────┐
  │ Device Shield Plus                   │
  │ Coverage: ₹25,000                   │
  │ Valid: 01/01/26 – 31/12/26          │
  │ Claims used: 1 of 2                 │
  │ [File Claim] [View Details]         │
  └──────────────────────────────────────┘

Warranty vault tab:
  Searchable list of all warranties
  OCR scan button: Add new warranty card
  Expiry alerts highlighted in Amber

Claim form:
  Incident type selector
  Date picker
  Description text area
  Evidence upload (photos, FIR)
  [Submit Claim →]

Claim tracker:
  Status stepper: Filed → Under Review →
                  AI Assessed → Approved → Settled
```

### Screen 13: Marketplace

```
Search bar with category filter

Featured: Refurbished devices carousel
          (Grade A+ items with trust badges)

Category grid:
  [Spare Parts] [Tools] [Refurbished] [Request Part]

Product card:
  Image (Cloudinary CDN)
  Name + quality badge (OEM/Compatible)
  Price + discounted price (strikethrough)
  "Compatible with: Honda City, Hyundai i20"
  [Add to Cart] button

Cart:
  Slide-out drawer (right side, desktop)
  Bottom sheet (mobile)
  Items + quantities + subtotal
  Delivery estimate
  [Checkout →]

Spare parts request:
  "Can't find what you need?"
  [Request a specific part →]
  Form: Part name + device + budget + urgency
```

### Screen 14: Video Consultation

```
Step 1: Choose tier
  3 cards:
  Quick Check ₹99  |  Full Diagnosis ₹199  |  Extended ₹299
  (Currently highlighted: Full Diagnosis — recommended)

Step 2: Available specialists
  List of available techs for video
  Shows: Name, rating, industry, "Available now" badge
  [Book 30-min call →]

Step 3: Video Call Screen
  Layout:
  ┌─────────────────────────────────────────┐
  │ LIVE  Virtual Repair Call    [End Call] │
  │                                         │
  │ ┌─────────────────────────────────────┐│
  │ │                                     ││
  │ │   [Owner's camera feed]             ││
  │ │                                     ││
  │ │  AI overlay:                        ││
  │ │  ⚠ "Condenser coil shows            ││
  │ │      dust buildup"                  ││
  │ └─────────────────────────────────────┘│
  │                                         │
  │ ┌────┐ Suresh K  ⭐4.9 AC Specialist   │
  │ │Tech│ "Please show the outdoor unit"  │
  │ └────┘                                 │
  │                                         │
  │ [🔇 Mute] [📷 Flip] [✏ Annotate]      │
  └─────────────────────────────────────────┘

Post-call:
  Outcome: Fixed remotely OR Visit needed
  If visit: [Book Physical Visit →]
            "₹199 deducted from service charge"
```

---

## 13. Owner Mobile App — All Screens

### Screen Inventory

```
Auth flow:
  SplashScreen           → Logo + auth check
  OnboardingScreen       → 3-slide intro
  IndustrySetupScreen    → Pick industry
  LoginScreen            → Phone + OTP
  SignupScreen
  OTPScreen              → 6-pin entry

Home:
  HomeScreen             → Dashboard (see below)

Fault Report:
  FaultReportScreen      → Form + media
  AIDiagnosisScreen      → Results
  CostEstimateScreen     → Breakdown

Booking:
  TechnicianListScreen   → Ranked list
  TechnicianProfileScreen → Full profile
  BookingConfirmScreen   → Confirm + pay

Tracking:
  LiveTrackingScreen     → Full-screen map
  OTPShareScreen         → OTP display

Job History:
  JobHistoryScreen       → Filtered list
  JobDetailsScreen       → Full details
  RateJobScreen          → 1-5 stars

Assets:
  AssetsScreen           → Tabs (machine/vehicle/device)
  AddAssetScreen         → Quick add form
  AssetDetailsScreen     → Health + history

Digital Twin:
  DigitalTwinScreen      → Health gauge + components
  ComponentHealthScreen  → Component detail

Insurance:
  InsuranceScreen        → Policies/Claims/Warranties
  PolicyDetailsScreen
  FileClaimScreen
  ClaimTrackerScreen
  WarrantyScreen
  AMCScreen

Marketplace:
  MarketplaceScreen      → Product grid
  ProductDetailsScreen   → Full product
  CartScreen             → Cart management
  RefurbishedScreen      → Certified used

Video Consult:
  ConsultBookingScreen   → Tier selection
  VideoCallScreen        → Agora call UI

Payments:
  PaymentScreen          → Razorpay flow
  WalletScreen           → Balance + history
  SubscriptionScreen     → Plan selection

Wiki:
  WikiScreen             → Search + browse
  WikiArticleScreen      → Article detail

Notifications:
  NotificationsScreen    → All notifications

Profile:
  ProfileScreen          → Edit profile
  SettingsScreen         → App preferences
```

### Mobile-Specific Design Decisions

```
Bottom Navigation (5 tabs):
  Home | Jobs | Assets | Market | Profile
  Icons: Home, Briefcase, Server, ShoppingBag, User
  Active: Teal icon + label
  Badge: Red dot on Jobs (active job count)

Gesture support:
  Swipe right: Go back (all screens)
  Swipe down: Dismiss bottom sheets
  Pull to refresh: All list screens
  Swipe on job card: Quick actions (rate/invoice)

Safe area:
  Top: env(safe-area-inset-top) — Status bar
  Bottom: env(safe-area-inset-bottom) — Home bar
  All bottom nav above safe area inset

SOS Button:
  HomeScreen only (automobile industry)
  Red FAB bottom-right
  "Emergency SOS"
  Tap: Immediate auction job posted
  Long-press prevention: confirm dialog

Offline indicator:
  Orange banner top: "You're offline"
  Only show when relevant actions blocked

Haptic feedback:
  Light: Toggle switches
  Medium: Button taps
  Heavy: Job accepted/completed
  Error: Validation failed, payment failed
```

### Home Screen Layout (Mobile)

```
┌───────────────────────────────────┐
│ 🌅 Good morning, Sharma!          │ ← greeting
│    [🏭] [🚗] [📱] industry tabs   │
├───────────────────────────────────┤
│ ⚡ Active Job                      │ ← Blue banner
│   Raju en route · 8 mins away →   │
├───────────────────────────────────┤
│ Quick Actions                     │
│ [Report Fault] [Book Service]     │
│ [Video Consult][Add Asset]        │
├───────────────────────────────────┤
│ Asset Health                      │
│ ← [CNC Lathe 87%][Car 92%] →     │ ← horizontal scroll
├───────────────────────────────────┤
│ ⚠ Prediction Alert                │
│ CNC may need service in 18 days  │
│ [Schedule] → │
├───────────────────────────────────┤
│ Recent Jobs                       │
│ [completed job card]              │
│ [completed job card]              │
│ View all jobs →                   │
└───────────────────────────────────┘
[Home] [Jobs] [Assets] [Market] [Me]
```

---

## 14. Technician Web App — All Screens

### Screen 1: Dashboard

```
Header stats row:
  Today's earnings: ₹1,240
  Jobs completed:   3
  Rating:          4.8 ⭐
  Online since:    2h 30m

Active job banner (if any):
  Blue bg: "UPT-2026-00891 — In Progress"
  [View Job →]

Upcoming jobs list:
  Scheduled jobs for today

Earnings chart:
  Weekly bar chart (Recharts)
  This week vs last week comparison

Performance snapshot:
  Acceptance rate: 94% 🟢
  On-time rate:    87% 🟡
  Completion rate: 99% 🟢
```

### Screen 2: Earnings Page

```
Period selector: [Week] [Month] [Year] [Custom]

Summary cards:
  Gross earnings: ₹28,450
  Platform fee:   ₹2,845 (10%)
  TDS deducted:   ₹284 (1%)
  Net payout:     ₹25,321

Line chart: Daily earnings trend (Recharts)

Wallet balance card:
  Balance: ₹8,230
  [Withdraw to Bank →]
  Min withdrawal: ₹100

Transaction list:
  TanStack Table with:
  Date | Job # | Amount | Status | Invoice
  Sortable, filterable, exportable

[Download GST Report] button
[Download Tax Summary] button
```

### Screen 3: Badges Page

```
Badge collection grid (3 columns):
  Each badge card:
  ┌──────────────┐
  │   🏆 badge   │
  │   image      │
  │  "50 Jobs"   │
  │  ████░░ 80%  │ ← progress to next tier
  │  47 of 50    │
  └──────────────┘

  Earned: Full color + glow
  Locked: Grayscale + lock icon
  NFT badge: Gold shimmer border

Progress summary:
  "4 badges earned · 3 in progress"

NFT section:
  "Your 2 NFT badges are on Polygon blockchain"
  [View on Blockchain →]
```

### Screen 4: Availability Calendar

```
Month calendar view:
  Each day: Colored dot
  Green = available, Red = busy, Gray = off

  Click day → Set availability:
  [Available] [Unavailable] + time range

Weekly schedule:
  Monday–Sunday
  Toggle per day
  Time range: From 08:00 To 20:00

Service area map:
  Google Maps with draggable radius circle
  Center: Tech's home location
  Radius: Adjustable 1–20km slider

Industry filter:
  Which industries to accept: [All] [Industrial] [Auto] [Electronics]
```

---

## 15. Technician Mobile App — All Screens

### Screen Inventory

```
Auth:
  SplashScreen
  OnboardingScreen
  SkillSetupScreen        → Select skills + proficiency
  DocumentUploadScreen    → Aadhaar, certs
  LoginScreen
  OTPScreen

Home:
  TechHomeScreen          → Dashboard + availability

Job Requests:
  JobRequestScreen        → Full-screen with 60s timer
  JobRequestDetailsScreen → Pre-accept details
  AuctionScreen           → Racing mode

Navigation:
  NavigationScreen        → Turn-by-turn to job
  ArrivalScreen           → "I've Arrived" button

OTP Verify:
  OTPEntryScreen          → Enter owner OTP

Job Execution:
  ChecklistScreen         → Step checklist
  AICopilotScreen         → AI guide steps
  PartsLoggingScreen      → Add parts
  LiveStreamScreen        → Live stream for owner
  JobCompleteScreen       → Sign + complete

Earnings:
  EarningsScreen          → Charts + history
  WithdrawalScreen        → Bank withdrawal

Badges:
  BadgesScreen            → Collection + progress

Job History:
  JobHistoryScreen        → Past jobs list
  JobDetailScreen         → Details

Video Consult:
  VideoAnswerScreen       → Answer consult call

Wiki:
  WikiScreen
  WikiArticleScreen

Notifications:
  NotificationsScreen

Profile:
  ProfileScreen
  SettingsScreen
```

### Critical Screens — Field-Optimised Design

```
Job Request Screen:
┌───────────────────────────────────────┐
│ ⚡ NEW JOB REQUEST                     │
│         [00:47] countdown ring        │
│                                       │
│ Motor Bearing Failure                 │
│ 🏭 Industrial · ⚡ HIGH               │
│ 📍 2.3 km away · ⏱ 8 mins ETA        │
│ ₹800 – ₹1,200 estimated              │
│                                       │
│ [View Details ↓]                      │
│                                       │
│ [✕ DECLINE]        [✓ ACCEPT →]       │
│  (Gray outline)    (Green, large)     │
└───────────────────────────────────────┘
Notes:
  → Full screen, no other UI
  → Accept button: 80% of bottom
  → Loud notification sound
  → Phone vibration pattern
  → Accept requires single tap (not double)

AI Copilot Screen:
┌───────────────────────────────────────┐
│ Step 3 of 8          [⚠ Safety Note] │
│ ─────────────────────                 │
│                                       │
│ Check capacitor voltage               │
│                                       │
│ Use multimeter red probe on +         │
│ terminal, black on – terminal.        │
│ Reading should be 320–350V DC.        │
│ If below 200V → replace capacitor.   │
│                                       │
│ Tool needed: Multimeter               │
│                                       │
│ [📷 Take Photo to Verify]             │
│                                       │
│ [← Previous]    [Next Step →]        │
└───────────────────────────────────────┘
Notes:
  → Large text (minimum 16px)
  → One step at a time (no overwhelm)
  → Photo capture before advancing
  → Safety warnings always visible

Job Complete Screen:
┌───────────────────────────────────────┐
│        ✓ Almost Done!                 │
│                                       │
│ Summary:                              │
│ Labour:    ₹700                       │
│ Parts:     Motor capacitor  ₹320      │
│ Total:     ₹1,020                     │
│                                       │
│ [Before Photo] [After Photo]          │
│  (thumbnail)    (thumbnail)           │
│                                       │
│ Owner Signature:                      │
│ ┌─────────────────────────────────┐   │
│ │  (signature pad)                │   │
│ └─────────────────────────────────┘   │
│ [Clear]                               │
│                                       │
│ [🔒 Complete & Lock Job →]            │
└───────────────────────────────────────┘
```

---

## 16. Admin Web App — All Screens

### Screen 1: Live Dashboard

```
Top row — 4 KPI cards:
  Active Jobs  |  Online Technicians  |
  Today Revenue|  Platform Health Score

Platform Health gauge:
  Circular 0-100 with color zones
  Green 80-100 | Amber 50-79 | Red <50
  Sub-metrics: AI accuracy, dispute rate, etc.

Live Jobs Map:
  Full-width Google Map
  All active job pins (color by status)
  All active tech pins (moving)
  Heatmap toggle

Recent alerts feed:
  Right sidebar
  Epidemic alerts (red)
  Silent killer (orange)
  New disputes (yellow)
  Low tech count in city (blue)

Quick stats row:
  Pending verifications | Open disputes |
  Active epidemics | DLQ messages
```

### Screen 2: Technician Verification Queue

```
Table columns:
  Applied | Name | Industry | Documents | Status | Actions

Row expansion:
  Click row → expand inline document viewer
  Show all uploaded docs (Aadhaar, certs, photo)
  Face match score display

Action panel:
  [✓ Approve] [✕ Reject] [Request Resubmit]
  Rejection reason dropdown + custom text
  "Email notification will be sent automatically"

Filters:
  Industry | Status | Date range | City
```

### Screen 3: Epidemic Monitor

```
Alert cards (red border):
  Device Model | Fault Type | Affected Count |
  First detected | Status | [Respond →]

Heatmap:
  Chart.js heatmap
  X-axis: Days | Y-axis: Fault categories
  Color intensity = report count

Response actions:
  [Notify all affected owners]
  [Contact manufacturer]
  [Create wiki article]
  [Class-action support]

Resolution flow:
  Admin notes + resolution timestamp
  Auto-notifies all affected users
```

### Screen 4: AI Settings Page

```
Prompt editor:
  Left: Prompt selector (dropdown)
  Right: Monaco-style code editor
  Gemini model selector
  Temperature slider (0.0 – 1.0)
  [Test Prompt →] with sample input

Matching weights:
  Distance weight: [====|] 40%
  Skill weight:    [========|] 60%
  (Sliders that must total 100%)
  [Save & Apply →]

Feature flags:
  Toggle list with descriptions
  Industry filter per flag
  Rollout percentage slider
  Last modified by + date

Commission rates:
  Per industry: Industrial [10%] Automobile [10%] Electronics [10%]
  Subscription discount rates
```

---

## 17. Navigation Architecture

### Owner Web — Route Structure

```
/ (public)
├── /login
├── /signup
├── /otp
├── /onboarding

/dashboard (protected)
├── /dashboard/home
├── /dashboard/report-fault
│   ├── /diagnosis
│   └── /select-technician
├── /dashboard/tracking/:jobId
├── /dashboard/jobs
│   └── /dashboard/jobs/:id
├── /dashboard/rate/:jobId
├── /dashboard/assets
│   ├── /machines
│   │   ├── /:id
│   │   └── /add
│   ├── /vehicles
│   └── /devices
├── /dashboard/twin/:assetId
├── /dashboard/insurance
│   ├── /claim
│   └── /warranty
├── /dashboard/marketplace
│   ├── /:productId
│   └── /cart
├── /dashboard/video-consult
├── /dashboard/wiki
│   └── /:slug
├── /dashboard/notifications
├── /dashboard/payments
│   └── /wallet
├── /dashboard/profile
└── /dashboard/settings

/* Error routes */
/404, /500, /offline
```

### Flutter — go_router Structure

```dart
// All routes defined in core/config/router.dart

GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: SplashScreen),
    GoRoute(path: '/onboarding', builder: OnboardingScreen),
    GoRoute(path: '/login', builder: LoginScreen),
    GoRoute(path: '/signup', builder: SignupScreen),
    GoRoute(path: '/otp', builder: OTPScreen),

    ShellRoute(  // Bottom nav shell
      builder: (ctx, state, child) => MainShell(child),
      routes: [
        GoRoute(path: '/home', builder: HomeScreen),
        GoRoute(path: '/jobs', builder: JobHistoryScreen,
          routes: [
            GoRoute(path: ':id', builder: JobDetailsScreen),
            GoRoute(path: ':id/rate', builder: RateJobScreen),
          ]
        ),
        GoRoute(path: '/assets', builder: AssetsScreen,
          routes: [
            GoRoute(path: 'add', builder: AddAssetScreen),
            GoRoute(path: ':id', builder: AssetDetailsScreen),
          ]
        ),
        GoRoute(path: '/marketplace', builder: MarketplaceScreen),
        GoRoute(path: '/profile', builder: ProfileScreen),
      ]
    ),

    // Full screen (no bottom nav)
    GoRoute(path: '/fault-report', builder: FaultReportScreen),
    GoRoute(path: '/ai-diagnosis', builder: AIDiagnosisScreen),
    GoRoute(path: '/select-tech', builder: TechnicianListScreen),
    GoRoute(path: '/tracking/:jobId', builder: LiveTrackingScreen),
    GoRoute(path: '/otp-share/:jobId', builder: OTPShareScreen),
    GoRoute(path: '/video-call/:consultId', builder: VideoCallScreen),
  ]
)
```

---

## 18. Interaction Patterns

### Pull to Refresh

```dart
// All list screens
RefreshIndicator(
  color: Color(0xFF00D4AA),      // Teal spinner
  backgroundColor: Colors.white,
  onRefresh: () => ref.refresh(jobListProvider),
  child: ListView.builder(...),
)
```

### Infinite Scroll / Pagination

```tsx
// React — TanStack Query infinite scroll
const { data, fetchNextPage, hasNextPage } =
  useInfiniteQuery({
    queryKey: ['jobs'],
    queryFn: ({ pageParam = 0 }) =>
      jobService.getJobs({ page: pageParam }),
    getNextPageParam: (last) => last.hasMore
      ? last.page + 1 : undefined,
  });

// Intersection Observer triggers next page
// when last item enters viewport
```

### Optimistic Updates

```tsx
// When owner books a technician
// Show "Booked!" immediately, revert if API fails
const mutation = useMutation({
  mutationFn: bookTechnician,
  onMutate: async (techId) => {
    // Optimistically update UI
    queryClient.setQueryData(['job'], (old) => ({
      ...old, status: 'MATCHED', technicianId: techId
    }));
  },
  onError: (err, techId, context) => {
    // Revert on failure
    queryClient.setQueryData(['job'], context.prev);
    toast.error("Booking failed. Please try again.");
  }
});
```

### Swipe Actions (Flutter)

```dart
// Job history — swipe left/right
Dismissible(
  key: Key(job.id.toString()),
  background: Container(
    color: Colors.green,
    child: Icon(Icons.star, color: Colors.white), // Rate
  ),
  secondaryBackground: Container(
    color: Colors.blue,
    child: Icon(Icons.download, color: Colors.white), // Invoice
  ),
  confirmDismiss: (direction) async {
    if (direction == DismissDirection.startToEnd) {
      // Navigate to rate screen
      context.push('/jobs/${job.id}/rate');
      return false; // Don't actually dismiss
    } else {
      // Download invoice
      await downloadInvoice(job.id);
      return false;
    }
  },
  child: JobHistoryCard(job: job),
)
```

### Form Validation

```tsx
// React — Zod + React Hook Form
const schema = z.object({
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
});

// Error shown inline below field
// Never show all errors at once
// Validate on blur (not on every keystroke)
```

### Toast Notifications

```tsx
// Success
toast.success('Job booked! Raju Kumar is on the way.', {
  duration: 4000,
  position: 'top-center',
  icon: '✓',
});

// Error
toast.error('Booking failed. Try again.', {
  duration: 6000,
  action: { label: 'Retry', onClick: retry },
});

// Info
toast('Technician 8 minutes away', {
  icon: '📍',
  duration: 5000,
});
```

---

## 19. Error & Empty States

### Error States

```
Network error:
  Icon:    WiFi off illustration
  Title:   "Can't connect"
  Body:    "Check your internet connection"
  Action:  [Try again] button

Server error (500):
  Icon:    Server with ⚠
  Title:   "Something went wrong"
  Body:    "We're fixing this. Try again in a moment."
  Action:  [Retry] + [Go home]

Not found (404):
  Icon:    Map with ❓ pin
  Title:   "Page not found"
  Body:    "This page doesn't exist or was moved."
  Action:  [Go to dashboard →]

No permission (403):
  Icon:    Lock illustration
  Title:   "Access restricted"
  Body:    "You don't have permission to view this."
  Action:  [Contact support]

AI unavailable:
  Icon:    Robot with ⚠
  Title:   "AI analysis slow"
  Body:    "You can describe the fault manually below."
  Action:  Shows manual fault entry form immediately
  Note:    Never block the flow — degrade gracefully

Payment failed:
  Icon:    Card with ✕
  Title:   "Payment failed"
  Body:    Specific reason (insufficient funds / expired etc.)
  Action:  [Try again] [Use different method]
```

### Empty States

```
No jobs yet:
  Lottie: empty_state.json (gentle loop)
  Title:  "No jobs yet"
  Body:   "Report your first fault to get started"
  Action: [Report Fault →]

No technicians:
  Icon:   Person with ⊘
  Title:  "No technicians nearby"
  Body:   "Try expanding your search radius or try later"
  Action: [Try again] [Increase radius]

No notifications:
  Icon:   Bell with ✓
  Title:  "All caught up!"
  Body:   "No new notifications"
  None:   No action button needed

Empty marketplace:
  Icon:   Shopping bag ⊘
  Title:  "No products found"
  Body:   "Try different search terms or filters"
  Action: [Clear filters] or [Request a part]

No search results:
  Icon:   Search ⊘
  Title:  "No results for '{query}'"
  Body:   "Check spelling or try different keywords"
  Action: [Clear search]
```

---

## 20. Loading States

### Shimmer Skeleton

```tsx
// Every list screen shows skeleton while loading
// NOT a spinner (spinners feel slow)

// Job list skeleton
function JobListSkeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"/>
          <div className="h-3 bg-gray-200 rounded w-1/4"/>
        </div>
      ))}
    </div>
  );
}
```

```dart
// Flutter shimmer
Shimmer.fromColors(
  baseColor:  Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Column(
    children: List.generate(3, (_) => JobCardSkeleton()),
  ),
)
```

### Progress Indicators

```
Page load:      Linear progress bar (top of page)
                Teal color, thin (3px)

Button loading: Spinner replaces button label
                Button stays same size (no layout shift)
                Disabled state during loading

File upload:    Circular progress per file
                Overall progress bar if multiple

AI processing:  Lottie ai_thinking animation
                Step-by-step progress text

Map loading:    Google Maps handles internally
                Custom loading: Gray placeholder rectangle
```

---

## 21. Multilingual UI

### Language Selector Component

```tsx
// Compact dropdown in header
function LanguageSelector() {
  const languages = [
    { code: 'en', label: 'English',  native: 'English' },
    { code: 'hi', label: 'Hindi',    native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada',  native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil',    native: 'தமிழ்' },
    { code: 'te', label: 'Telugu',   native: 'తెలుగు' },
    { code: 'ml', label: 'Malayalam',native: 'മലയാളം' },
    { code: 'mr', label: 'Marathi',  native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'bn', label: 'Bengali',  native: 'বাংলা' },
  ];
  // Shows native script in dropdown
  // Switches i18next locale on select
  // Saves to user_preferences
}
```

### Regional Script Fonts

```css
/* Hindi, Marathi */
[lang="hi"], [lang="mr"] {
  font-family: 'Noto Sans Devanagari', 'Inter', sans-serif;
}
/* Kannada */
[lang="kn"] {
  font-family: 'Noto Sans Kannada', 'Inter', sans-serif;
}
/* Tamil */
[lang="ta"] {
  font-family: 'Noto Sans Tamil', 'Inter', sans-serif;
}
/* Telugu */
[lang="te"] {
  font-family: 'Noto Sans Telugu', 'Inter', sans-serif;
}
/* Malayalam */
[lang="ml"] {
  font-family: 'Noto Sans Malayalam', 'Inter', sans-serif;
}
/* Gujarati */
[lang="gu"] {
  font-family: 'Noto Sans Gujarati', 'Inter', sans-serif;
}
/* Bengali */
[lang="bn"] {
  font-family: 'Noto Sans Bengali', 'Inter', sans-serif;
}
```

### i18next Translation Keys

```json
// en.json (example structure)
{
  "common": {
    "bookNow": "Book Now",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "loading": "Loading...",
    "retry": "Try Again",
    "save": "Save",
    "viewAll": "View All"
  },
  "dashboard": {
    "greeting": "Good {{timeOfDay}}, {{name}}!",
    "activeJob": "{{name}} is {{eta}} minutes away",
    "noJobs": "No jobs yet. Report your first fault.",
    "reportFault": "Report Fault"
  },
  "job": {
    "status": {
      "POSTED": "Posted",
      "MATCHED": "Matched",
      "EN_ROUTE": "En Route",
      "ARRIVED": "Arrived",
      "IN_PROGRESS": "In Progress",
      "COMPLETED": "Completed",
      "CANCELLED": "Cancelled"
    }
  },
  "errors": {
    "network": "Check your internet connection",
    "server": "Something went wrong. Try again.",
    "notFound": "This page doesn't exist"
  }
}
```

---

## 22. Industry-Specific Design

### Color Coding Throughout App

```
When user selects Industrial industry:
  → Navbar accent: Purple #7C3AED
  → Active tab: Purple
  → Industry badge: Purple
  → Feature icons: Purple tint
  → Chart primary: Purple

When user selects Automobile:
  → Accent: Blue #2563EB
  → All industry elements: Blue

When user selects Electronics:
  → Accent: Cyan #0891B2
  → All industry elements: Cyan

Note: Brand Deep Blue always stays same
      Only accent/highlight changes per industry
```

### Industry-Specific Icons & Imagery

```
Industrial screens:
  Asset icons: CNC, conveyor, motor, pump, press
  Illustrations: Factory floor, machines
  Colors: Purple + Gray palette

Automobile screens:
  Asset icons: Car, bike, truck, EV, auto-rickshaw
  Map markers: Vehicle icons
  SOS button: Prominent red
  Colors: Blue + Gray palette

Electronics screens:
  Asset icons: Phone, laptop, AC, fridge, TV
  Data protection: Shield icon throughout
  End of life: Memory reel visual
  Colors: Cyan + Gray palette
```

### Industry Dashboard Differences

```
Industrial Dashboard:
  Quick actions: [Report Fault] [Add Machine] [Wiki]
  Health row:    Machine health gauges
  Prediction:    Production downtime alerts
  Stats:         Downtime hours saved

Automobile Dashboard:
  Quick actions: [Report Fault] [SOS] [Pre-purchase Scan]
  Health row:    Vehicle health + mood score
  Documents:     Insurance/PUC expiry alerts
  Stats:         Km driven this month

Electronics Dashboard:
  Quick actions: [Report Fault] [Device Health] [Warranty]
  Health row:    Device health scores
  Alerts:        Silent killer alerts (red border)
  Stats:         Electricity savings
```

---

## 23. Design References & Inspiration

### Specific Elements Borrowed

```
Urban Company → Pure white backgrounds
               Generous white space (not cramped)
               Green "Verified" badges on service cards
               Category icon grid on homepage
               Clean bottom sheet overlays
               Step-by-step booking wizard
               Trust signals on every card

Uber          → Full-screen map as primary UI
               Bottom sheet that slides up over map
               Real-time pin animation (smooth movement)
               ETA countdown prominently displayed
               Driver/tech card with photo + name + rating
               "Your trip is arriving" style status cards
               Status stepper with icons

Swiggy        → Delivery status stepper
               Celebration animation on order placed
               "Live tracking" emphasis
               Restaurant/tech card layout

Ajio          → Bold, confident typography
               Product card with clear hierarchy
               Price + strikethrough discount
               Smooth category filter tabs

PhonePe       → Payment flow UX
               Transaction history cards
               Wallet balance display
               UPI success animation

Google Maps   → Search bar above map
               Place information cards
               Route line colors (Teal for our brand)
               Navigation bar style
```

---

## 24. Tailwind CSS Configuration

```typescript
// tailwind.config.ts — Complete configuration

import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        brand: {
          'blue-900': '#0D2347',
          'blue-800': '#132B52',
          'blue-700': '#1A3C6E',   // primary
          'blue-600': '#1E5799',
          'blue-500': '#2563EB',
          'blue-100': '#DBEAFE',
          'blue-50':  '#EFF6FF',
          'teal-500': '#00D4AA',   // accent
          'teal-600': '#00B894',
          'teal-100': '#CCFBF1',
          'teal-50':  '#F0FDFB',
        },
        industry: {
          industrial:  '#7C3AED',
          automobile:  '#2563EB',
          electronics: '#0891B2',
        },
        status: {
          posted:      '#64748B',
          matched:     '#2563EB',
          'en-route':  '#D97706',
          progress:    '#7C3AED',
          completed:   '#16A34A',
          cancelled:   '#DC2626',
          disputed:    '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight:'1.1', letterSpacing:'-0.02em' }],
        'display-l':  ['36px', { lineHeight:'1.2', letterSpacing:'-0.02em' }],
        'heading-1':  ['28px', { lineHeight:'1.3', letterSpacing:'-0.01em' }],
        'heading-2':  ['22px', { lineHeight:'1.3', letterSpacing:'-0.01em' }],
        'heading-3':  ['18px', { lineHeight:'1.4' }],
        'heading-4':  ['15px', { lineHeight:'1.4' }],
        'body-lg':    ['16px', { lineHeight:'1.5' }],
        'body':       ['14px', { lineHeight:'1.5' }],
        'body-sm':    ['13px', { lineHeight:'1.5' }],
        'caption':    ['12px', { lineHeight:'1.5' }],
        'micro':      ['11px', { lineHeight:'1.5', letterSpacing:'0.02em' }],
      },
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
        'modal': '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer:  'shimmer 2s linear infinite',
        slideUp:  'slideUp 0.3s ease-out',
        fadeIn:   'fadeIn 0.2s ease-in',
      },
      backgroundSize: {
        '200': '200%',
      },
    },
  },

  plugins: [],
} satisfies Config
```

---

## 25. Flutter Theme Configuration

```dart
// lib/core/config/theme.dart — Complete theme

import 'package:flutter/material.dart';

class UptimeTheme {
  // ── Colors ─────────────────────────────────────────────
  static const Color blue700      = Color(0xFF1A3C6E); // primary
  static const Color blue600      = Color(0xFF1E5799);
  static const Color blue50       = Color(0xFFEFF6FF);
  static const Color teal500      = Color(0xFF00D4AA); // accent
  static const Color teal600      = Color(0xFF00B894);
  static const Color dark         = Color(0xFF0F172A);
  static const Color gray700      = Color(0xFF334155);
  static const Color gray500      = Color(0xFF64748B);
  static const Color gray300      = Color(0xFFCBD5E1);
  static const Color gray100      = Color(0xFFF1F5F9);
  static const Color gray50       = Color(0xFFF8FAFC);
  static const Color white        = Color(0xFFFFFFFF);
  static const Color success      = Color(0xFF16A34A);
  static const Color warning      = Color(0xFFD97706);
  static const Color danger       = Color(0xFFDC2626);
  static const Color industrial   = Color(0xFF7C3AED);
  static const Color automobile   = Color(0xFF2563EB);
  static const Color electronics  = Color(0xFF0891B2);

  // ── Light Theme ────────────────────────────────────────
  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter',
    brightness: Brightness.light,

    colorScheme: ColorScheme.light(
      primary:        blue700,
      secondary:      teal500,
      surface:        white,
      background:     gray50,
      error:          danger,
      onPrimary:      white,
      onSecondary:    white,
      onSurface:      dark,
      onBackground:   dark,
      outline:        gray300,
      surfaceVariant: gray100,
    ),

    // AppBar
    appBarTheme: AppBarTheme(
      backgroundColor:  blue700,
      foregroundColor:  white,
      elevation:        0,
      centerTitle:      false,
      titleTextStyle:   TextStyle(
        fontSize: 18, fontWeight: FontWeight.w600,
        color: white, fontFamily: 'Inter',
      ),
      iconTheme: IconThemeData(color: white),
    ),

    // Bottom Navigation
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      backgroundColor:      white,
      selectedItemColor:    teal500,
      unselectedItemColor:  gray500,
      selectedLabelStyle:   TextStyle(fontSize:12, fontWeight:FontWeight.w600),
      unselectedLabelStyle: TextStyle(fontSize:12),
      showSelectedLabels:   true,
      showUnselectedLabels: true,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),

    // Cards
    cardTheme: CardTheme(
      color:            white,
      elevation:        2,
      shadowColor:      Colors.black.withOpacity(0.10),
      shape:            RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: EdgeInsets.zero,
    ),

    // Elevated Button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor:    blue700,
        foregroundColor:    white,
        elevation:          0,
        padding:            EdgeInsets.symmetric(horizontal:24, vertical:14),
        minimumSize:        Size(0, 48),
        shape:              RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        textStyle: TextStyle(
          fontSize:14, fontWeight:FontWeight.w600, fontFamily:'Inter'
        ),
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor:  blue700,
        side:             BorderSide(color:blue700, width:1.5),
        padding:          EdgeInsets.symmetric(horizontal:24, vertical:14),
        minimumSize:      Size(0, 48),
        shape:            RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        textStyle: TextStyle(
          fontSize:14, fontWeight:FontWeight.w600, fontFamily:'Inter'
        ),
      ),
    ),

    // Text Button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: teal500,
        textStyle: TextStyle(
          fontSize:14, fontWeight:FontWeight.w600, fontFamily:'Inter'
        ),
      ),
    ),

    // Input Fields
    inputDecorationTheme: InputDecorationTheme(
      filled:           true,
      fillColor:        gray50,
      contentPadding:   EdgeInsets.symmetric(horizontal:16, vertical:14),
      border:           OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide:   BorderSide(color:gray300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide:   BorderSide(color:gray300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide:   BorderSide(color:blue700, width:2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide:   BorderSide(color:danger, width:2),
      ),
      labelStyle:       TextStyle(color:gray500, fontFamily:'Inter'),
      hintStyle:        TextStyle(color:gray500, fontFamily:'Inter'),
      errorStyle:       TextStyle(color:danger,  fontFamily:'Inter'),
      prefixIconColor:  gray500,
      suffixIconColor:  gray500,
    ),

    // Chip
    chipTheme: ChipThemeData(
      backgroundColor:     gray100,
      selectedColor:       blue50,
      labelStyle:          TextStyle(fontSize:13, fontFamily:'Inter'),
      padding:             EdgeInsets.symmetric(horizontal:12, vertical:4),
      shape:               RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(999),
        side: BorderSide(color:gray300),
      ),
    ),

    // Divider
    dividerTheme: DividerThemeData(
      color:     gray100,
      thickness: 1,
      space:     1,
    ),

    // Switch
    switchTheme: SwitchThemeData(
      thumbColor: MaterialStateProperty.resolveWith((states) =>
        states.contains(MaterialState.selected) ? white : gray500),
      trackColor: MaterialStateProperty.resolveWith((states) =>
        states.contains(MaterialState.selected) ? teal500 : gray300),
    ),

    // Progress Indicator
    progressIndicatorTheme: ProgressIndicatorThemeData(
      color:           teal500,
      linearTrackColor: gray100,
    ),

    // Text Theme
    textTheme: TextTheme(
      displayLarge:   TextStyle(fontSize:48, fontWeight:FontWeight.w700,
                                letterSpacing:-0.5, color:dark),
      displayMedium:  TextStyle(fontSize:36, fontWeight:FontWeight.w700,
                                letterSpacing:-0.3, color:dark),
      headlineLarge:  TextStyle(fontSize:28, fontWeight:FontWeight.w700, color:dark),
      headlineMedium: TextStyle(fontSize:22, fontWeight:FontWeight.w600, color:dark),
      headlineSmall:  TextStyle(fontSize:18, fontWeight:FontWeight.w600, color:dark),
      titleLarge:     TextStyle(fontSize:16, fontWeight:FontWeight.w600, color:dark),
      bodyLarge:      TextStyle(fontSize:16, fontWeight:FontWeight.w400, color:dark),
      bodyMedium:     TextStyle(fontSize:14, fontWeight:FontWeight.w400, color:dark),
      bodySmall:      TextStyle(fontSize:13, fontWeight:FontWeight.w400, color:gray700),
      labelLarge:     TextStyle(fontSize:14, fontWeight:FontWeight.w600, color:dark),
      labelMedium:    TextStyle(fontSize:12, fontWeight:FontWeight.w500, color:gray700),
      labelSmall:     TextStyle(fontSize:11, fontWeight:FontWeight.w500, color:gray500),
    ),
  );

  // ── Dark Theme ─────────────────────────────────────────
  static ThemeData get darkTheme => lightTheme.copyWith(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: Color(0xFF0F172A),
    colorScheme: ColorScheme.dark(
      primary:        blue700,
      secondary:      teal500,
      surface:        Color(0xFF1E293B),
      background:     Color(0xFF0F172A),
      error:          danger,
      onPrimary:      white,
      onSecondary:    white,
      onSurface:      Color(0xFFF8FAFC),
      onBackground:   Color(0xFFF8FAFC),
      outline:        Color(0xFF334155),
      surfaceVariant: Color(0xFF1E293B),
    ),
    cardTheme: CardTheme(
      color: Color(0xFF1E293B),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color:Color(0xFF334155)),
      ),
    ),
  );

  // ── Industry Color Helper ──────────────────────────────
  static Color industryColor(String industry) => switch(industry) {
    'INDUSTRIAL'  => industrial,
    'AUTOMOBILE'  => automobile,
    'ELECTRONICS' => electronics,
    _             => blue700,
  };

  // ── Status Color Helper ────────────────────────────────
  static Color statusColor(String status) => switch(status) {
    'POSTED'      => gray500,
    'MATCHED'     => automobile,
    'EN_ROUTE'    => warning,
    'IN_PROGRESS' => industrial,
    'COMPLETED'   => success,
    'CANCELLED'   => danger,
    'DISPUTED'    => Color(0xFFEA580C),
    _             => gray500,
  };
}
```

---

*UPTIME Design Document — v1.0*  
*"Downtime ends here."*  
*DSATM Bengaluru — VTU — 2026-27*

---

## Appendix — Missing Items Added

### Tech Home Screen Layout

```
TechHomeScreen (Flutter) layout:
┌───────────────────────────────────────┐
│ 🟢 Online  UPTIME Tech      [Bell 🔔] │
│ Good morning, Raju! ₹1,240 today     │
├───────────────────────────────────────┤
│ ● Online / ○ Offline  [big toggle]   │
│ "You are visible to owners nearby"   │
├───────────────────────────────────────┤
│ ⚡ Active Job Banner (if any)         │
│ UPT-2026-00891 · IN PROGRESS →       │
├───────────────────────────────────────┤
│ Today's Stats                         │
│ [3 Jobs] [₹1,240] [4.9⭐] [94% acc] │
├───────────────────────────────────────┤
│ Upcoming Jobs                         │
│ [Scheduled job card]                  │
│ [Scheduled job card]                  │
├───────────────────────────────────────┤
│ Earnings Preview                      │
│ Mini bar chart: Mon–Sun this week    │
│ "₹8,230 this week ↑12% vs last"     │
└───────────────────────────────────────┘
[Home] [Jobs] [Earnings] [Badges] [Me]
```

### React Router v6 + Deep Links

```tsx
// Owner Web — React Router v6 setup
// src/router.tsx

import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  // Public routes
  { path: '/',        element: <LandingPage /> },
  { path: '/login',   element: <LoginPage /> },
  { path: '/signup',  element: <SignupPage /> },
  { path: '/otp',     element: <OTPPage /> },

  // Protected routes (wrapped in AuthGuard)
  {
    path: '/dashboard',
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
    children: [
      { index: true,              element: <DashboardPage /> },
      { path: 'report-fault',     element: <ReportFaultPage /> },
      { path: 'ai-diagnosis',     element: <AIDiagnosisPage /> },
      { path: 'select-tech',      element: <SelectTechnicianPage /> },
      { path: 'tracking/:jobId',  element: <JobTrackingPage /> },
      { path: 'jobs',             element: <JobHistoryPage /> },
      { path: 'jobs/:id',         element: <JobDetailsPage /> },
      { path: 'jobs/:id/rate',    element: <RateJobPage /> },
      { path: 'assets',           element: <AssetsPage /> },
      { path: 'assets/add',       element: <AddAssetPage /> },
      { path: 'assets/:id',       element: <AssetDetailsPage /> },
      { path: 'twin/:assetId',    element: <DigitalTwinPage /> },
      { path: 'insurance',        element: <InsurancePage /> },
      { path: 'marketplace',      element: <MarketplacePage /> },
      { path: 'marketplace/:id',  element: <ProductDetailsPage /> },
      { path: 'video-consult',    element: <VideoConsultPage /> },
      { path: 'wiki',             element: <WikiPage /> },
      { path: 'wiki/:slug',       element: <WikiArticlePage /> },
      { path: 'notifications',    element: <NotificationsPage /> },
      { path: 'wallet',           element: <WalletPage /> },
      { path: 'subscription',     element: <SubscriptionPage /> },
      { path: 'profile',          element: <ProfilePage /> },
      { path: 'settings',         element: <SettingsPage /> },
    ]
  },

  // Error routes
  { path: '/404',    element: <NotFoundPage /> },
  { path: '*',       element: <Navigate to="/404" /> },
]);

// Deep link handler (PWA — web push notification routing)
// When FCM notification arrives with data.url:
// navigator to the URL directly (React Router handles it)
// Example: data.url = '/dashboard/tracking/12345'
// → navigates to live tracking for job 12345

// Service Worker push handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.openWindow(url)  // Opens/focuses the PWA
  );
});
```


---

## ADDENDUM — Path Selection Screen Design (v1.1)

> **New screen added after AI Diagnosis result**

### Screen: Resolution Path Selection

```
Layout: Bottom-sheet style on mobile
        Centered modal on desktop

Header section:
  ┌──────────────────────────────────────────┐
  │  AI Diagnosis Result                     │
  │  ──────────────────────────────────────  │
  │  Fault:      Motor Bearing Failure       │
  │  Confidence: ██████████░░ 87%            │
  │  Urgency:    [⚡ HIGH]  (Red badge)      │
  │  Est. Cost:  ₹800 – ₹1,500             │
  │  Safe to run: ❌ Stop machine now        │
  └──────────────────────────────────────────┘

Path cards (3 large tappable cards):

Card A — AI Copilot:
  Background: Blue-50 (#EFF6FF)
  Border:     2px Deep Blue
  Icon:       🤖 Robot (32px, Blue)
  Title:      "Try AI Copilot"
  Subtitle:   "Let AI guide you step by step"
  Badge:      [FREE] Green pill
  Arrow:      → right side
  Tap:        → opens AI Copilot screen

Card B — Video Consultation:
  Background: Teal-50 (#F0FDFB)
  Border:     2px Teal
  Icon:       📹 Video (32px, Teal)
  Title:      "Video Consultation"
  Subtitle:   "Talk to a specialist right now"
  Badge:      [₹199] Teal pill
  Sub-badge:  "Available now — 3 specialists"
  Arrow:      → right side
  Tap:        → opens consult booking

Card C — Book Technician:
  Background: White
  Border:     2px Gray-200
  Icon:       🔧 Wrench (32px, Gray)
  Title:      "Book Technician"
  Subtitle:   "Send someone to your location"
  Badge:      [₹800+] Gray pill
  Sub-text:   "8 techs available — 8 mins away"
  Arrow:      → right side
  Tap:        → opens technician list

Skip link (bottom):
  Text:       "Skip — I already know what I need →"
  Color:      Teal, underline
  Tap:        → goes directly to technician list

Flutter widget code pattern:
  Column(children: [
    AIResultCard(diagnosis: diagnosis),
    SizedBox(height: 16),
    Text("What would you like to do?",
      style: theme.textTheme.headlineSmall),
    SizedBox(height: 12),
    PathCard(
      icon: Icons.smart_toy,
      title: "Try AI Copilot",
      subtitle: "Let AI guide you step by step",
      badge: "FREE",
      badgeColor: Colors.green,
      color: UptimeTheme.blue50,
      borderColor: UptimeTheme.blue700,
      onTap: () => context.push('/ai-copilot/$jobId'),
    ),
    SizedBox(height: 12),
    PathCard(
      icon: Icons.video_call,
      title: "Video Consultation",
      subtitle: "Talk to a specialist right now",
      badge: "₹199",
      badgeColor: UptimeTheme.teal500,
      color: UptimeTheme.teal50,
      borderColor: UptimeTheme.teal500,
      onTap: () => context.push('/video-consult/$jobId'),
    ),
    SizedBox(height: 12),
    PathCard(
      icon: Icons.build,
      title: "Book Technician",
      subtitle: "Send someone to your location",
      badge: "₹800+",
      badgeColor: UptimeTheme.gray500,
      color: Colors.white,
      borderColor: UptimeTheme.gray300,
      onTap: () => context.push('/select-tech/$jobId'),
    ),
    SizedBox(height: 16),
    TextButton(
      onPressed: () => context.push('/select-tech/$jobId'),
      child: Text("Skip — I already know what I need →"),
    ),
  ])
```

### Escalation Banner Design

```
Shown inside AI Copilot screen after 3 failed steps:

┌────────────────────────────────────────────┐
│ 💡 Need more help?                         │
│ This repair may need a specialist.         │
│                                            │
│ [📹 Video Consult ₹199] [🔧 Book Tech]   │
└────────────────────────────────────────────┘

Colors: Amber-50 background, Amber border
Position: Sticky bottom of copilot screen
Dismissible: Yes (X button)
```

### Post-Video Consult Banner

```
Shown after video consult ends with "visit needed":

┌────────────────────────────────────────────┐
│ ✓ ₹199 consultation done                  │
│ Tech recommends a physical visit.          │
│ Your consult fee will be deducted.         │
│                                            │
│ [Book the Same Technician →]              │
└────────────────────────────────────────────┘

Colors: Green-50 background, Green border
CTA: Prominent Deep Blue button
```


---

## 25. Technician Verification UI/UX Specification (TECHNICIAN_VERIFICATION.md)

### 25.1 Technician Onboarding Wizard (tech-web & Flutter)

(tech-web + Flutter later)

```
Step 1  Phone OTP (done)         Step 5  Licence upload (only if trade is regulated)
Step 2  Profile + choose trades  Step 6  Bank account + penny drop
Step 3  Identity (consent -> Aadhaar QR / ID upload -> selfie)
Step 4  Skill proof + skill test per trade   Step 7  Status screen ("Under review", ETA, what is missing)
Each step saves progress. Show a progress bar and the current level (L0 -> L3).
Rejected items show the reason in plain language + [Resubmit].
```

---

### 25.2 Admin KYC Review Screen (admin-web)

(admin-web)

```
Left: case summary (name, phone, trades, level, flags: DUPLICATE_IDENTITY / NAME_MISMATCH / LOW_FACE_SCORE)
Center: document viewer (signed URL, watermark "UPTIME KYC - reviewer id"), zoom, rotate
Right: extracted data vs profile data (name, YOB, last4) with match score + checklist:
  [ ] Name matches   [ ] Photo matches selfie   [ ] Document not expired
  [ ] Issuer genuine (opened SIDH / DigiLocker / phone call)   [ ] Trade matches evidence
Actions: Approve / Reject (reason code required) / Request resubmission / Escalate
SLA: 48 hours; show "waiting since" timer; oldest first.
Every view and decision -> audit_trail (actor, action, technician, doc, timestamp).
```

