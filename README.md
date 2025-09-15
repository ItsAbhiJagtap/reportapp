# React Reporting Dashboard

A modern, responsive React application built with Vite and TailwindCSS that provides a comprehensive reporting interface with advanced filtering, sorting, and export capabilities.

## 🚀 Quick Start

### Option 1: Using Command Prompt (Recommended)
1. Open **Command Prompt (cmd)** as Administrator
2. Navigate to the project directory:
   ```cmd
   cd C:\Users\91766\react-reporting-app
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the development server:
   ```cmd
   npm run dev
   ```

### Option 2: Using the Batch Files
1. Double-click `install.bat` to install dependencies
2. Double-click `start.bat` to start the development server

### Option 3: Using PowerShell (if execution policy allows)
1. Open PowerShell as Administrator
2. Set execution policy (temporarily):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Navigate to the project directory and run:
   ```powershell
   npm install
   npm run dev
   ```

## 📋 Features

### Core Functionality
- ✅ **Dynamic Data Table**: Displays employee data with customizable columns
- ✅ **Advanced Search & Filtering**: Search across all fields and filter by multiple criteria
- ✅ **Column-based Sorting**: Click headers to sort data in ascending/descending order
- ✅ **Column Customization**: Show/hide columns as needed
- ✅ **Pagination**: Navigate through large datasets efficiently
- ✅ **Export Options**: Export data to Excel (.xlsx) and PDF (.pdf) formats

### UI/UX Features
- ✅ **Modern Design**: Clean, professional interface using TailwindCSS
- ✅ **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Smooth Animations**: Framer Motion animations for enhanced user experience
- ✅ **Summary Statistics**: Display totals and averages for key metrics

### Technical Features
- ✅ **React 18**: Built with modern React functional components and hooks
- ✅ **Vite**: Fast development server and build tool
- ✅ **TailwindCSS**: Utility-first CSS framework for rapid styling
- ✅ **Framer Motion**: Smooth animations and transitions
- ✅ **SheetJS**: Excel file generation and export
- ✅ **jsPDF**: PDF generation with autoTable plugin

## 🎯 Usage Guide

1. **Search**: Use the search bar to find specific records across all fields
2. **Filter**: Use the dropdown filters to narrow down results by department, status, category, location, or date range
3. **Sort**: Click on column headers to sort data
4. **Customize Columns**: Use the "Customize Columns" button to show/hide specific columns
5. **Export**: Use the export buttons to download data as Excel or PDF files
6. **Dark Mode**: Toggle the sun/moon icon to switch between light and dark themes
7. **Pagination**: Use the pagination controls at the bottom to navigate through pages

## 📊 Sample Data

The application includes realistic employee data with 15 records including:
- Employee ID, Name, Email
- Department, Position, Salary
- Start Date, Status, Location
- Employment Category, Performance Rating

## 🏗️ Project Structure

```
react-reporting-app/
├── src/
│   ├── components/
│   │   ├── SearchPanel.jsx          # Search and filter controls
│   │   ├── ReportTable.jsx          # Main data table with pagination
│   │   ├── ColumnCustomizer.jsx     # Column visibility controls
│   │   ├── ExportButtons.jsx        # Excel and PDF export functionality
│   │   ├── DarkModeToggle.jsx       # Dark mode toggle component
│   │   ├── KPICards.jsx             # Key performance indicator cards
│   │   ├── ChartsPanel.jsx          # Data visualization charts
│   │   ├── CSSParticlesBackground.jsx # Animated background particles
│   │   ├── EmployeeDetailCard.jsx   # Employee detail modal
│   │   ├── NotificationSystem.jsx   # System notifications
│   │   ├── CustomReportModal.jsx    # Custom report generation
│   │   └── Sparkline.jsx            # Mini chart components
│   ├── data/
│   │   └── sampleData.js            # Sample employee data and column definitions
│   ├── hooks/
│   │   └── useRealTimeData.js       # Real-time data simulation hook
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles and TailwindCSS imports
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # TailwindCSS configuration
├── vite.config.js                   # Optimized Vite configuration
├── postcss.config.js                # PostCSS configuration
├── install.bat                      # Windows installation script
├── start.bat                        # Windows start script
├── setup-git.bat                    # Git repository setup script
└── README.md                        # This file
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (optimized with code splitting)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts and cache

### Dependencies
- **React 18.2.0** - UI library
- **Vite 4.5.0** - Build tool and dev server
- **TailwindCSS 3.3.5** - CSS framework
- **Framer Motion 10.16.4** - Animation library
- **SheetJS 0.18.5** - Excel export
- **jsPDF 2.5.1** - PDF export
- **Lucide React 0.292.0** - Icons

## 🎨 Customization

### Adding New Columns
1. Update the `columnDefinitions` array in `src/data/sampleData.js`
2. Add corresponding data fields to the sample data
3. The new columns will automatically appear in the column customizer

### Modifying Filters
1. Edit the filter options in `src/components/SearchPanel.jsx`
2. Update the filter logic in `src/App.jsx` if needed

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Component-specific styles are handled through TailwindCSS classes

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## ⚡ Performance & Optimizations

### Built-in Optimizations
- **Code Splitting**: Automatic chunking of vendor libraries, animations, charts, and utilities
- **Tree Shaking**: Unused code elimination for smaller bundle sizes
- **CSS Optimization**: Consolidated styles with CSS custom properties for better maintainability
- **Font Loading**: Optimized Google Fonts loading with preconnect
- **Component Optimization**: Removed duplicate components and unused imports
- **Memory Management**: Efficient particle animations with reduced motion support

### Performance Features
- Handles up to 1000+ records efficiently
- Pagination set to 10 items per page by default
- Export functions work with current filtered/sorted dataset
- Optimized animations for smooth performance
- Lazy loading of chart components
- Debounced search and filter operations

## 🔧 Troubleshooting

### Common Issues

1. **PowerShell Execution Policy Error**:
   - Use Command Prompt instead of PowerShell
   - Or run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

2. **Dependencies not installing**:
   - Make sure Node.js and npm are properly installed
   - Try using Command Prompt instead of PowerShell

3. **Build errors**:
   - Ensure all dependencies are properly installed
   - Check for any syntax errors in the code

4. **Export not working**:
   - Check browser console for JavaScript errors
   - Ensure pop-ups are allowed for downloads

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure all dependencies are installed correctly
3. Verify that the development server is running on the correct port (usually http://localhost:5173)

## 📝 License

This project is open source and available under the MIT License.

---

## 🎉 Success!

If everything is set up correctly, you should see:
- A modern employee reporting dashboard
- Search and filter functionality
- Sortable columns
- Export to Excel and PDF
- Dark mode toggle
- Responsive design
- Smooth animations

The application will be available at `http://localhost:5173` when the development server is running.
#   r e p o r t a p p 
 
 
