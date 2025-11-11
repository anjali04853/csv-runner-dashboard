# CSV Runner Dashboard

A Next.js application for uploading, validating, and visualizing running data from CSV files. Built with TypeScript, shadcn/ui, and Recharts.

## 🎯 Project Overview

**Challenge**: CSV Runner Dashboard (Next.js + shadcn/ui)

This application allows users to upload CSV files containing running data (date, person, miles run) and provides comprehensive visualizations and statistics. The dashboard displays both overall metrics and per-person breakdowns with interactive charts.

### Key Features Implemented
- ✅ CSV parsing with robust validation
- ✅ Overall and per-person visualizations
- ✅ Comprehensive metrics (average, min, max, total)
- ✅ Multiple chart types (line, bar, pie)
- ✅ Detailed error handling and user feedback
- ✅ Responsive design with accessibility features
- ✅ Sample CSV download functionality

---

## 🤔 Assumptions & Design Decisions

### Data Format Assumptions
1. **CSV Headers**: Expected headers are `date`, `person`, and `miles run` (case-insensitive, spaces/underscores flexible)
2. **Date Format**: Supports multiple formats (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY) with automatic detection
3. **Miles Run**: Must be a non-negative number. Values over 200 miles trigger a warning but are not rejected
4. **Duplicate Entries**: Records with the same person and date are allowed and all included in calculations (users may run multiple times per day)

### Technical Decisions
1. **Validation Strategy**: Multi-layered validation (file type → headers → row-by-row data) with detailed error reporting
2. **Error Handling**: Graceful degradation - partial data is processed if some rows are valid
3. **Chart Selection**:
   - Line chart for time-series trends (overall view)
   - Bar chart for total distance comparison (per-person)
   - Pie chart for distribution visualization
4. **Performance**: Client-side processing to minimize server load and enable offline capability
5. **State Management**: React hooks (useState) for simplicity - no external state library needed for this scope
6. **Accessibility**: ARIA labels, keyboard navigation, proper color contrast, and semantic HTML

---

## 📋 Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Browser**: Modern browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 14+
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts (visualization)
- Papaparse (CSV parsing)
- date-fns (date handling)

### 2. Environment Variables

No environment variables are required for this application. All processing happens client-side.

If you want to create a `.env.local` file for future extensibility:

```bash
# .env.local (optional)
NEXT_PUBLIC_APP_NAME="CSV Runner Dashboard"
```

### 3. Seed Data (Sample CSV)

A sample CSV can be downloaded directly from the application UI, or create one manually:

**sample-data.csv**:
```csv
date,person,miles run
2024-01-01,Alice,5.2
2024-01-02,Bob,3.8
2024-01-02,Alice,4.5
2024-01-03,Charlie,6.1
2024-01-03,Bob,4.2
2024-01-04,Alice,5.8
2024-01-05,Charlie,7.3
2024-01-05,Bob,3.5
2024-01-06,Alice,4.9
2024-01-07,Charlie,5.5
2024-01-08,Bob,4.0
2024-01-08,Alice,6.2
```

---

## 🏃 Run & Verify

### Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

### Step-by-Step Verification

#### ✅ Acceptance Criteria 1: Sample CSV + Instructions
1. Open http://localhost:3000
2. Click "Sample CSV" button in header
3. A sample CSV file will download automatically
4. Upload instructions are visible on the main page

#### ✅ Acceptance Criteria 2: Overall and Per-Person Charts/Views
1. Upload the sample CSV file (drag & drop or click to browse)
2. **Overall View**: Observe the dashboard overview with 4 metric cards showing:
   - Total Distance
   - Average Distance
   - Longest Run
   - Active Period
3. **Line Chart**: View the "Running Trends Over Time" showing all runners on one chart
4. **Per-Person Views**: Scroll down to see:
   - Bar chart comparing total distances
   - Pie chart showing distribution
   - Tabbed interface for individual runner details

#### ✅ Acceptance Criteria 3: Metrics Computed Correctly
1. With sample data uploaded, verify calculations:
   - **Alice**: Total ~26.6 mi, Average ~5.32 mi, Min 4.5 mi, Max 6.2 mi
   - **Bob**: Total ~15.5 mi, Average ~3.88 mi, Min 3.5 mi, Max 4.2 mi
   - **Charlie**: Total ~19.0 mi, Average ~6.33 mi, Min 5.5 mi, Max 7.3 mi
   - **Overall**: Total ~61.1 mi, Average ~5.09 mi
2. Click through each person's tab to see individual stats

#### ✅ Acceptance Criteria 4: Error Handling for Invalid CSV

Test various error scenarios:

**Test 1: Missing Headers**
Create `bad-headers.csv`:
```csv
date,name,distance
2024-01-01,Alice,5.2
```
Upload → Should show error: "Missing required header: 'person'"

**Test 2: Invalid Date**
Create `bad-date.csv`:
```csv
date,person,miles run
2024-13-45,Alice,5.2
```
Upload → Should show error: "Row 2: date: Invalid date format"

**Test 3: Non-Numeric Miles**
Create `bad-miles.csv`:
```csv
date,person,miles run
2024-01-01,Alice,five
```
Upload → Should show error: "Row 2: miles run: Miles must be a valid number"

**Test 4: Empty File**
Create empty CSV → Should show error: "File is empty"

**Test 5: Negative Miles**
Create `negative.csv`:
```csv
date,person,miles run
2024-01-01,Alice,-5
```
Upload → Should show error: "Row 2: miles run: Miles cannot be negative"

---

## ✨ Features & Limitations

### ✅ What Works

**Core Functionality**:
- CSV upload via drag-and-drop or file picker
- Real-time validation with detailed error messages
- Multiple date format support
- Comprehensive metric calculations
- Three types of visualizations (line, bar, pie)
- Per-person detailed breakdowns
- Responsive design (mobile, tablet, desktop)
- Dark mode support

**Data Quality**:
- Header validation (flexible naming)
- Type validation (dates, numbers)
- Range validation (negative/unrealistic values)
- Duplicate detection warnings
- Partial data processing

**UX Enhancements**:
- Loading states during processing
- Empty state messaging
- Warning dismissal
- Sample CSV download
- Reset functionality
- Recent runs display (per person)
- Color-coded charts

### ⚠️ Known Limitations

1. **File Size**: Maximum 10MB CSV files (configurable in code)
2. **Browser Processing**: Very large datasets (>10,000 rows) may cause UI lag
3. **Date Ambiguity**: DD/MM/YYYY vs MM/DD/YYYY can be ambiguous (defaults to MM/DD/YYYY)
4. **No Data Persistence**: Data is cleared on page refresh (intentional for privacy)
5. **Export**: Cannot export processed data or charts (future enhancement)

### 🔮 Future Improvements

- Export dashboard as PDF/PNG
- Data persistence using local storage or database
- Date range filtering
- Goal setting and progress tracking
- Comparison between time periods
- More chart types (scatter plot, heatmap)
- CSV template generator
- Multi-file upload
- Data validation rules customization
- API endpoints for programmatic access

---

## 🏗️ Architecture Notes

### Folder Structure

```
csv-runner-dashboard/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles & Tailwind
│   └── favicon.ico
├── components/
│   ├── csv-uploader.tsx      # File upload component
│   ├── error-display.tsx     # Error/warning display
│   ├── dashboard-overview.tsx # Metric cards
│   ├── person-breakdown.tsx  # Per-person stats & tabs
│   ├── charts/
│   │   └── overall-chart.tsx # Line chart component
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── alert.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── table.tsx
├── lib/
│   ├── csv-parser.ts         # CSV parsing logic
│   ├── data-validator.ts     # Validation functions
│   ├── metrics-calculator.ts # Statistics & aggregation
│   └── utils.ts              # shadcn utils (cn)
├── types/
│   └── index.ts              # TypeScript interfaces
└── public/
    └── sample-data.csv       # (optional) sample file
```

### Key Components

**CSVUploader** (`components/csv-uploader.tsx`)
- Handles file selection (drag-and-drop + click)
- Validates file before parsing
- Shows processing state
- Emits parsed data to parent

**DashboardOverview** (`components/dashboard-overview.tsx`)
- Displays 4 metric cards with icons
- Shows overall statistics
- Responsive grid layout

**OverallChart** (`components/charts/overall-chart.tsx`)
- Line chart showing trends over time
- One line per person
- Interactive tooltips and legend

**PersonBreakdown** (`components/person-breakdown.tsx`)
- Comparison charts (bar, pie)
- Tabbed interface for individual stats
- Recent runs display

**ErrorDisplay** (`components/error-display.tsx`)
- Shows validation errors grouped by row
- Displays data quality warnings
- Dismissible warnings

### State & Data Flow

```
User uploads CSV
    ↓
CSVUploader validates file
    ↓
csv-parser.ts processes file
    ↓
data-validator.ts validates each row
    ↓
ParseResult emitted to page.tsx
    ↓
metrics-calculator.ts generates dashboard summary
    ↓
Components render with data
```

**State Management**:
- `parseResult`: Holds raw parsed data and errors
- `dashboardData`: Computed summary for visualizations
- `showWarnings`: Controls warning visibility

**Why This Approach**:
- Separation of concerns (parsing vs validation vs calculation)
- Easy to test individual functions
- Reusable validators and metrics calculators
- Type-safe data flow with TypeScript

---

## ♿ Accessibility & UI

### Accessibility Features

1. **Keyboard Navigation**:
   - All interactive elements are keyboard accessible
   - Tab order follows visual flow
   - Focus indicators visible

2. **Screen Reader Support**:
   - Semantic HTML elements (`<header>`, `<main>`, `<footer>`)
   - ARIA labels on icons and buttons
   - Alt text for visual indicators (colors in legends)

3. **Color Contrast**:
   - All text meets WCAG AA standards (4.5:1 minimum)
   - Chart colors selected for visibility
   - Dark mode support with proper contrast

4. **Focus Management**:
   - Visible focus rings on all interactive elements
   - Logical tab order
   - No keyboard traps

5. **Error Messaging**:
   - Clear, descriptive error messages
   - Errors associated with specific fields
   - Visual indicators (icons + text)

### UI Design Principles

1. **Spacing & Typography**:
   - Consistent spacing scale (Tailwind's default)
   - Clear hierarchy with font sizes and weights
   - Adequate whitespace for readability

2. **Responsive Design**:
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px)
   - Charts adapt to container width

3. **Visual Feedback**:
   - Loading spinners during processing
   - Hover states on interactive elements
   - Success indicators for uploaded files
   - Color-coded error severity

4. **Consistency**:
   - shadcn/ui component library for uniform look
   - Consistent iconography (lucide-react)
   - Predictable interaction patterns

---

## 🧪 Testing Recommendations

While automated tests are not included, here are manual testing scenarios:

### Happy Path
1. Upload valid CSV → See full dashboard
2. Multiple people → All shown in charts
3. Single person → Charts adapt correctly
4. Download sample → Upload it → Works perfectly

### Edge Cases
1. Empty CSV → Appropriate error message
2. Only headers, no data → "No valid records found"
3. Mixed valid/invalid rows → Process valid ones, show errors
4. Very large file (>10MB) → File size error
5. Wrong file type (.txt) → Accept if content is CSV
6. Special characters in names → Handle correctly
7. Different date formats in same file → Parse all correctly

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📝 Development Notes

### Code Quality Practices

- **TypeScript**: Strict mode enabled for type safety
- **Linting**: ESLint configuration (Next.js defaults)
- **Formatting**: Consistent code style
- **Comments**: JSDoc comments on complex functions
- **Error Handling**: Try-catch blocks with user-friendly messages

### Performance Considerations

- **Memoization**: Calculations only run when data changes
- **Lazy Loading**: Charts render only when data is available
- **Efficient Re-renders**: Proper component boundaries to prevent unnecessary updates

---

## 📦 Dependencies

### Core
- `next`: ^14.2.0 - React framework
- `react`: ^18.3.0 - UI library
- `react-dom`: ^18.3.0 - React DOM bindings

### UI & Styling
- `tailwindcss`: ^3.4.0 - Utility-first CSS
- `@radix-ui/*`: Various - Accessible component primitives
- `lucide-react`: ^0.263.1 - Icon library

### Data Processing
- `papaparse`: ^5.4.1 - CSV parser
- `date-fns`: ^2.30.0 - Date manipulation

### Visualization
- `recharts`: ^2.10.0 - Charting library

### Development
- `typescript`: ^5.0.0 - Type checking
- `@types/*`: Various - TypeScript definitions

---

## 🤝 Contributing

This is a submission for an internship selection process. If extended for production use:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

---

## 📄 License

This project is created for educational and evaluation purposes.

---

## 👨‍💻 Author

Built as part of the FSD Intern Assignment.

**Contact**: [anjali280v@gmail.com]

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Recharts](https://recharts.org/) for visualization library
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built by**: [Anjali Verma]
**Last Updated**: November 2025
