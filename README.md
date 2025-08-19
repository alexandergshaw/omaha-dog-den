# Omaha Dog Den - Professional Dog Sitting Services

A fully accessible dog-sitting website with comprehensive accessibility metrics and monitoring features.

## Features

### Core Website Features
- Professional dog sitting service information
- Service descriptions and pricing
- Customer testimonials
- Contact form with validation
- Responsive design for all devices

### Accessibility Features

#### 🎯 Comprehensive Accessibility Metrics Dashboard
- **Real-time accessibility scoring** - Overall, contrast, keyboard navigation, and ARIA scores
- **Automated accessibility auditing** - Runs comprehensive checks on demand
- **Color contrast analysis** - WCAG AA/AAA compliance checking
- **Keyboard navigation testing** - Ensures all interactive elements are accessible
- **ARIA validation** - Validates ARIA labels and semantic markup
- **Screen reader simulation** - Shows how content appears to assistive technologies

#### ♿ Built-in Accessibility Features
- **WCAG 2.1 AA compliant** color contrasts
- **Semantic HTML structure** with proper landmarks
- **Keyboard navigation support** with visible focus indicators
- **Screen reader optimization** with descriptive alt text and ARIA labels
- **Skip navigation links** for efficient browsing
- **Form accessibility** with proper labels and error messaging
- **Responsive design** that works across all devices
- **Motion preference respect** - reduces animations for users who prefer reduced motion

#### 🔧 Accessibility Tools
- **Interactive accessibility dashboard** - Fixed position panel with metrics
- **One-click accessibility audit** - Comprehensive site analysis
- **Color contrast checker** - Real-time contrast ratio analysis
- **Keyboard navigation tester** - Validates tab order and focus management
- **Screen reader simulator** - Preview content as heard by screen readers

#### 📊 Metrics Tracked
- Color contrast ratios (WCAG compliance)
- Keyboard accessibility score
- ARIA implementation quality
- Semantic structure validation
- Form accessibility compliance
- Image alt text coverage
- Heading hierarchy validation
- Link accessibility assessment

## How to Use

### Viewing the Site
1. Open `index.html` in a web browser
2. The accessibility dashboard will appear in the top-right corner
3. Click the accessibility icon (♿) to open the metrics panel

### Running Accessibility Tests
1. **Full Audit**: Click "Run Accessibility Audit" for comprehensive analysis
2. **Keyboard Test**: Click "Test Keyboard Navigation" to validate tab order
3. **Contrast Check**: Click "Check Color Contrast" to analyze color ratios
4. **Screen Reader**: Click "Simulate Screen Reader" to preview content

### Understanding Scores
- **90-100%**: Excellent accessibility (green)
- **70-89%**: Good accessibility (yellow) 
- **0-69%**: Needs improvement (red)

## Technical Implementation

### Accessibility Standards
- WCAG 2.1 AA compliance
- Section 508 compliance
- ADA compliance considerations

### Technologies Used
- Semantic HTML5
- CSS3 with accessibility best practices
- Vanilla JavaScript for accessibility tools
- CSS custom properties for theming
- Media queries for responsive design

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with graceful degradation)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure
```
omaha-dog-den/
├── index.html              # Main website file
├── styles.css              # CSS with accessibility features
├── accessibility-metrics.js # Accessibility monitoring system
├── main.js                 # Website functionality
└── README.md              # This file
```

## Accessibility Features Details

### Color and Contrast
- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- Large text meets 3:1 minimum ratio
- High contrast mode support
- Color is not the only way information is conveyed

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the site
- Visible focus indicators on all focusable elements
- Skip links for efficient navigation
- No keyboard traps

### Screen Readers
- Semantic HTML structure with proper landmarks
- Descriptive alt text for all images
- ARIA labels for complex interactions
- Screen reader-friendly form labels and error messages
- Live regions for dynamic content updates

### Forms
- All form controls have associated labels
- Required fields clearly marked
- Error messages are descriptive and accessible
- Form validation works with assistive technologies

### Responsive Design
- Mobile-friendly navigation
- Readable text at all zoom levels (up to 200%)
- Touch targets meet minimum size requirements
- Horizontal scrolling avoided

## Future Enhancements
- Voice navigation support
- Enhanced screen reader optimizations
- Additional accessibility testing tools
- Integration with automated testing frameworks
- Accessibility reporting dashboard

## Contributing
When contributing, please ensure all changes maintain or improve accessibility:
1. Test with keyboard navigation only
2. Verify color contrast ratios
3. Test with screen readers
4. Run the built-in accessibility audit
5. Validate HTML and ARIA markup

## License
This project is licensed under the MIT License.