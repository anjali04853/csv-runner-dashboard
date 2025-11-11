# Testing Checklist

Use this checklist to thoroughly test the CSV Runner Dashboard before submission or deployment.

## 🎯 Acceptance Criteria Testing

### ✅ 1. Sample CSV + Instructions

- [ ] "Sample CSV" button is visible in header
- [ ] Clicking button downloads a file
- [ ] Downloaded file is named `sample-running-data.csv`
- [ ] File contains valid CSV data with headers: date, person, miles run
- [ ] Upload instructions are clear on main page
- [ ] Instructions mention required columns

**Expected**: Sample CSV downloads and contains correct format

---

### ✅ 2. Overall and Per-Person Charts/Views

#### Overall Dashboard
- [ ] 4 metric cards display correctly
- [ ] Total Distance shows sum of all miles
- [ ] Average Distance calculated correctly
- [ ] Longest Run shows maximum value
- [ ] Active Period shows date range
- [ ] Line chart renders with data
- [ ] All people shown in line chart legend
- [ ] Chart tooltips work on hover
- [ ] Chart is responsive on mobile

**Expected**: Complete dashboard with all metrics and visualizations

#### Per-Person Views
- [ ] Bar chart comparing total distances renders
- [ ] Pie chart showing distribution renders
- [ ] Tabs for each person are clickable
- [ ] Individual stats cards show correct data
- [ ] Recent runs list displays (max 5)
- [ ] "Best" badge appears on personal record
- [ ] Percentage of total calculated correctly
- [ ] Charts use consistent colors per person

**Expected**: Per-person breakdown with multiple visualization types

---

### ✅ 3. Metrics Computed Correctly

Use this sample data to verify calculations:

```csv
date,person,miles run
2024-01-01,Alice,5.0
2024-01-02,Alice,6.0
2024-01-03,Bob,3.0
2024-01-04,Bob,4.0
```

**Verify**:
- [ ] Alice Total: 11.0 mi
- [ ] Alice Average: 5.5 mi
- [ ] Alice Min: 5.0 mi
- [ ] Alice Max: 6.0 mi
- [ ] Bob Total: 7.0 mi
- [ ] Bob Average: 3.5 mi
- [ ] Bob Min: 3.0 mi
- [ ] Bob Max: 4.0 mi
- [ ] Overall Total: 18.0 mi
- [ ] Overall Average: 4.5 mi
- [ ] Overall Min: 3.0 mi
- [ ] Overall Max: 6.0 mi
- [ ] Alice percentage: ~61.1%
- [ ] Bob percentage: ~38.9%

**Expected**: All calculations match expected values

---

### ✅ 4. Error Handling for Invalid CSV

#### Test Scenarios

**Missing Headers**
```csv
date,name,distance
2024-01-01,Alice,5.0
```
- [ ] Error message appears
- [ ] Mentions "Missing required header: 'person'" or similar
- [ ] No dashboard displayed

**Invalid Date Format**
```csv
date,person,miles run
invalid-date,Alice,5.0
```
- [ ] Error for specific row
- [ ] Mentions "Invalid date format"
- [ ] Suggests correct format

**Non-Numeric Miles**
```csv
date,person,miles run
2024-01-01,Alice,five
```
- [ ] Error for specific row
- [ ] Mentions "must be a valid number"

**Negative Miles**
```csv
date,person,miles run
2024-01-01,Alice,-5
```
- [ ] Error for specific row
- [ ] Mentions "cannot be negative"

**Empty File**
- [ ] Upload empty CSV
- [ ] Error: "File is empty"

**Wrong File Type**
- [ ] Upload .txt file without CSV extension
- [ ] Accepts if content is valid CSV OR shows error

**Missing Values**
```csv
date,person,miles run
2024-01-01,,5.0
```
- [ ] Error: "Person name is required"

**Large File (>10MB)**
- [ ] Error: "File size must be less than 10MB"

**Mixed Valid/Invalid Rows**
```csv
date,person,miles run
2024-01-01,Alice,5.0
invalid,Bob,3.0
2024-01-03,Charlie,4.0
```
- [ ] Shows errors for invalid rows
- [ ] Processes valid rows
- [ ] Dashboard displays with valid data only

**Expected**: All error scenarios handled gracefully with clear messages

---

## 🎨 UI/UX Testing

### Layout & Design
- [ ] Header displays correctly
- [ ] Logo/title visible
- [ ] Navigation works smoothly
- [ ] Footer present
- [ ] Consistent spacing throughout
- [ ] No overlapping elements
- [ ] Colors meet contrast requirements
- [ ] Typography is readable

### Responsive Design
Test on:
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large Desktop (1920px+)

**Check**:
- [ ] Layout adapts properly
- [ ] Text remains readable
- [ ] Charts resize correctly
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate (44x44px min)

### Loading States
- [ ] Spinner shows while processing
- [ ] "Processing CSV..." message appears
- [ ] Upload button disables during processing
- [ ] No flash of unstyled content

### Empty States
- [ ] Initial state: upload area prominent
- [ ] After error: clear message and reset option
- [ ] No data: appropriate message

### Interactive Elements
- [ ] Buttons have hover states
- [ ] Cards have subtle shadow/border
- [ ] Drag-and-drop area highlights on drag over
- [ ] Chart tooltips appear on hover
- [ ] Tabs highlight when active
- [ ] "Upload New" button resets state

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] No keyboard traps

### Screen Reader
Test with screen reader (NVDA, JAWS, VoiceOver):
- [ ] Page title announced
- [ ] Headings have proper hierarchy (h1, h2, h3)
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels
- [ ] Errors announced
- [ ] Chart data described (alt text/aria-labels)
- [ ] Loading states announced

### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Interactive elements ≥ 3:1
- [ ] Information not conveyed by color alone
- [ ] Chart lines distinguishable
- [ ] Error states clear without color

### Focus Management
- [ ] Focus outline visible
- [ ] Focus doesn't jump unexpectedly
- [ ] Focus trapped in modals (if applicable)
- [ ] Focus returns after modal closes

### ARIA Attributes
- [ ] `role` attributes used appropriately
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-describedby` on form fields with errors
- [ ] `aria-live` regions for dynamic content
- [ ] `aria-busy` during loading

---

## 🚀 Performance Testing

### File Processing
- [ ] Small CSV (<100 rows): instant
- [ ] Medium CSV (100-1000 rows): <2 seconds
- [ ] Large CSV (1000-5000 rows): <5 seconds
- [ ] No UI freezing during processing

### Chart Rendering
- [ ] Charts render smoothly
- [ ] No lag on interactions (hover, click)
- [ ] Animations are smooth (60fps)
- [ ] Responsive to window resize

### Memory
- [ ] No memory leaks after multiple uploads
- [ ] Browser remains responsive
- [ ] Charts update without full page reload

---

## 🌐 Browser Compatibility

### Desktop Browsers
Test on latest versions:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)
- [ ] Samsung Internet

### Features to Check
- [ ] CSV upload works
- [ ] Drag-and-drop works (desktop)
- [ ] Charts render correctly
- [ ] Tooltips appear
- [ ] Responsive layout
- [ ] No console errors

---

## 🔒 Security Testing

### Input Validation
- [ ] Only CSV files accepted
- [ ] File size limits enforced
- [ ] Headers validated before processing
- [ ] XSS: Special characters in CSV handled safely
- [ ] CSV Injection: Formulas in CSV don't execute

### Privacy
- [ ] Data stays client-side (no server upload)
- [ ] No data persistence (cleared on refresh)
- [ ] No tracking scripts (unless intended)

---

## 📊 Data Accuracy Testing

### Edge Cases
- [ ] Single person dataset
- [ ] Single run dataset
- [ ] Same date for all runs
- [ ] Same person, multiple dates
- [ ] Duplicate date+person entries
- [ ] Very small values (0.1 miles)
- [ ] Very large values (100+ miles)
- [ ] Future dates
- [ ] Very old dates
- [ ] Dates spanning multiple years

### Calculations
Create test CSVs and verify:
- [ ] Sum calculations
- [ ] Average calculations
- [ ] Min/Max detection
- [ ] Percentage calculations
- [ ] Date range calculation
- [ ] Rounding to 2 decimal places

---

## 🐛 Bug Testing

### Common Issues to Check
- [ ] Console has no errors
- [ ] No 404s in network tab
- [ ] No broken images
- [ ] No infinite loops
- [ ] State updates correctly
- [ ] No race conditions in async operations
- [ ] Charts don't overlap text
- [ ] Mobile menu works (if applicable)
- [ ] Modals close properly
- [ ] Forms reset after submission

---

## 📝 Documentation Testing

### README.md
- [ ] All sections present
- [ ] Setup instructions work
- [ ] Commands execute successfully
- [ ] Screenshots are current
- [ ] Links work
- [ ] Formatting is correct

### Code Comments
- [ ] Complex logic explained
- [ ] JSDoc comments present
- [ ] Types documented
- [ ] No outdated comments

---

## ✅ Pre-Submission Checklist

### Code Quality
- [ ] No console.log statements
- [ ] No TODO comments
- [ ] No commented-out code
- [ ] Consistent formatting
- [ ] No linter errors
- [ ] TypeScript errors resolved

### Repository
- [ ] README.md complete
- [ ] .gitignore configured
- [ ] No secrets committed
- [ ] package.json up-to-date
- [ ] Clean commit history
- [ ] Meaningful commit messages

### Deployment
- [ ] Builds successfully
- [ ] Works in production mode
- [ ] Deployed to hosting platform
- [ ] Live URL accessible
- [ ] Mobile experience verified on real device

---

## 📋 Testing Sign-Off

**Tested By**: ___________________

**Date**: ___________________

**Platforms Tested**:
- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] iOS
- [ ] Android

**Browsers Tested**: ___________________

**Issues Found**: ___________________

**Severity**:
- [ ] Critical (blocks submission)
- [ ] Major (should fix)
- [ ] Minor (nice to have)

**Ready for Submission**: Yes / No

---

**Last Updated**: November 2025