# Vertical Button Column Component

A comprehensive, accessible vertical button column component for data table UIs with modern neon effects and full keyboard support.

## Features

- **5 Action Buttons**: Select All, Export to Excel, Export to PDF, Custom Report, Clear Selection
- **Color-coded Actions**: Green for success actions, red for danger actions, blue for neutral actions
- **Neon Hover Effects**: Beautiful border animation effects on hover
- **Keyboard Shortcuts**: Ctrl+A for select all, Esc for clear selection
- **Accessibility**: WCAG AA compliant with proper focus states and ARIA labels
- **Mobile Responsive**: Optimized for all screen sizes
- **Dark Mode Support**: Full dark/light theme support
- **Loading States**: Visual feedback during export operations
- **Confirmation Dialogs**: Optional confirmation for destructive actions
- **Notifications**: Success/error feedback with toast notifications

## Installation

```bash
npm install xlsx jspdf jspdf-autotable framer-motion lucide-react
```

## Usage

```jsx
import VerticalButtonColumn from './components/VerticalButtonColumn';
import './components/VerticalButtonColumn.css';

function MyDataTable() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleCustomReport = (selectedIndices) => {
    // Handle custom report logic
    console.log('Custom report for:', selectedIndices);
  };

  return (
    <div className="table-container">
      {/* Your data table */}
      <table>
        {/* Table content */}
      </table>

      {/* Vertical Button Column */}
      <VerticalButtonColumn
        data={data}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
        onCustomReport={handleCustomReport}
        isDarkMode={false}
        showTooltips={true}
        enableKeyboardShortcuts={true}
        enableConfirmation={true}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | Array of data objects for the table |
| `selectedRows` | Array | `[]` | Array of selected row indices |
| `onSelectionChange` | Function | Required | Callback when selection changes |
| `onCustomReport` | Function | Optional | Callback for custom report action |
| `isDarkMode` | Boolean | `false` | Enable dark mode styling |
| `className` | String | `''` | Additional CSS classes |
| `showTooltips` | Boolean | `true` | Show tooltips on hover |
| `enableKeyboardShortcuts` | Boolean | `true` | Enable keyboard shortcuts |
| `enableConfirmation` | Boolean | `true` | Show confirmation for destructive actions |

## Button Actions

### 1. Select All / Deselect All
- **Color**: Green
- **Function**: Toggles selection of all rows
- **Keyboard**: Ctrl+A
- **Icon**: CheckSquare/Square

### 2. Export to Excel
- **Color**: Green
- **Function**: Exports selected rows to .xlsx file
- **Disabled**: When no rows selected
- **Icon**: FileSpreadsheet

### 3. Export to PDF
- **Color**: Red
- **Function**: Exports selected rows to PDF
- **Disabled**: When no rows selected
- **Icon**: FileText

### 4. Custom Report
- **Color**: Blue
- **Function**: Opens custom report interface
- **Icon**: FileBarChart

### 5. Clear Selection
- **Color**: Red
- **Function**: Clears all selections
- **Keyboard**: Esc
- **Confirmation**: Optional confirmation dialog
- **Icon**: XCircle

## Keyboard Shortcuts

- **Ctrl+A** (or Cmd+A): Select all rows
- **Esc**: Clear selection (with optional confirmation)

## Accessibility Features

- **WCAG AA Compliant**: Proper color contrast ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Visible focus indicators
- **High Contrast Mode**: Enhanced borders and effects
- **Reduced Motion**: Respects user motion preferences

## Styling

The component uses CSS custom properties for easy theming:

```css
:root {
  --button-green: #10b981;
  --button-red: #ef4444;
  --button-blue: #3b82f6;
  --button-bg: rgba(255, 255, 255, 0.1);
  --button-border-radius: 8px;
}
```

## Mobile Responsiveness

- **Desktop**: Full feature set with tooltips and shortcuts
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Simplified layout, hidden shortcuts, larger touch targets

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- **React**: 16.8+ (hooks required)
- **Framer Motion**: 6.0+ (animations)
- **Lucide React**: 0.200+ (icons)
- **XLSX**: 0.18+ (Excel export)
- **jsPDF**: 2.5+ (PDF export)
- **jsPDF AutoTable**: 3.5+ (PDF tables)

## Customization

### Custom Colors
```css
.action-button-green {
  color: #your-green-color;
  border-color: #your-green-color;
}
```

### Custom Animations
```css
.action-button:hover:not(.disabled) {
  transform: translateY(-2px); /* Custom hover effect */
}
```

### Custom Button Order
Modify the `buttons` array in the component to reorder or add/remove buttons.

## Examples

See `VerticalButtonColumnDemo.jsx` for a complete working example with sample data and table integration.

## License

MIT License - feel free to use in your projects!
