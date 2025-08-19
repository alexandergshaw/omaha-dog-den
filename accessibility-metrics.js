/**
 * Accessibility Metrics and Monitoring System
 * Provides comprehensive accessibility testing and reporting for the Omaha Dog Den website
 */

class AccessibilityMetrics {
    constructor() {
        this.results = {
            overallScore: 0,
            contrastScore: 0,
            keyboardScore: 0,
            ariaScore: 0,
            issues: [],
            recommendations: []
        };
        
        this.initialize();
        this.setupEventListeners();
        this.runInitialAudit();
    }
    
    initialize() {
        // Create accessibility dashboard if it doesn't exist
        this.dashboard = document.getElementById('accessibility-dashboard');
        this.toggle = document.getElementById('accessibility-toggle');
        this.panel = document.getElementById('accessibility-panel');
        this.report = document.getElementById('accessibility-report');
        
        // Initialize keyboard navigation tracking
        this.keyboardNavigation = {
            activeElement: null,
            focusableElements: [],
            currentIndex: -1
        };
        
        // Initialize color contrast checker
        this.contrastChecker = new ColorContrastChecker();
        
        // Initialize ARIA validator
        this.ariaValidator = new AriaValidator();
        
        // Initialize keyboard tester
        this.keyboardTester = new KeyboardTester();
        
        console.log('Accessibility Metrics System initialized');
    }
    
    setupEventListeners() {
        // Toggle dashboard
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleDashboard());
            this.toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDashboard();
                }
            });
        }
        
        // Tool buttons
        const runAuditBtn = document.getElementById('run-audit');
        const testKeyboardBtn = document.getElementById('test-keyboard');
        const checkContrastBtn = document.getElementById('check-contrast');
        const simulateScreenReaderBtn = document.getElementById('simulate-screen-reader');
        
        if (runAuditBtn) runAuditBtn.addEventListener('click', () => this.runFullAudit());
        if (testKeyboardBtn) testKeyboardBtn.addEventListener('click', () => this.testKeyboardNavigation());
        if (checkContrastBtn) checkContrastBtn.addEventListener('click', () => this.checkColorContrast());
        if (simulateScreenReaderBtn) simulateScreenReaderBtn.addEventListener('click', () => this.simulateScreenReader());
        
        // Track focus changes for keyboard navigation analysis
        document.addEventListener('focusin', (e) => this.trackFocus(e));
        document.addEventListener('keydown', (e) => this.trackKeyboardUsage(e));
        
        // Monitor form interactions
        document.addEventListener('submit', (e) => this.validateFormAccessibility(e));
        
        // Monitor dynamic content changes
        this.observeContentChanges();
    }
    
    toggleDashboard() {
        const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        this.toggle.setAttribute('aria-expanded', newState);
        
        if (newState) {
            this.panel.removeAttribute('hidden');
            this.panel.style.display = 'block';
        } else {
            this.panel.setAttribute('hidden', '');
            this.panel.style.display = 'none';
        }
    }
    
    async runFullAudit() {
        this.updateReport('Running comprehensive accessibility audit...');
        
        try {
            // Reset results
            this.results = {
                overallScore: 0,
                contrastScore: 0,
                keyboardScore: 0,
                ariaScore: 0,
                issues: [],
                recommendations: []
            };
            
            // Run all accessibility tests
            await Promise.all([
                this.checkColorContrast(),
                this.testKeyboardNavigation(),
                this.validateAriaImplementation(),
                this.checkSemanticStructure(),
                this.validateForms(),
                this.checkImages(),
                this.analyzeHeadingStructure(),
                this.checkLinkAccessibility()
            ]);
            
            // Calculate overall score
            this.calculateOverallScore();
            
            // Update dashboard
            this.updateDashboard();
            
            // Generate report
            this.generateReport();
            
        } catch (error) {
            this.updateReport(`Error during accessibility audit: ${error.message}`);
            console.error('Accessibility audit error:', error);
        }
    }
    
    async checkColorContrast() {
        const elements = document.querySelectorAll('*');
        let passCount = 0;
        let totalCount = 0;
        const issues = [];
        
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const textColor = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Skip elements without text content
            if (!element.textContent.trim() || element.children.length > 0) return;
            
            totalCount++;
            
            const contrast = this.contrastChecker.getContrastRatio(textColor, backgroundColor);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            // WCAG AA standards
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || fontWeight >= 700));
            const requiredRatio = isLargeText ? 3 : 4.5;
            
            if (contrast >= requiredRatio) {
                passCount++;
            } else {
                issues.push({
                    element: element.tagName.toLowerCase(),
                    text: element.textContent.substring(0, 50) + '...',
                    contrast: contrast.toFixed(2),
                    required: requiredRatio,
                    severity: contrast < 3 ? 'high' : 'medium'
                });
            }
        });
        
        this.results.contrastScore = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 100;
        this.results.issues.push(...issues.map(issue => ({
            type: 'contrast',
            ...issue
        })));
        
        this.updateScoreDisplay('contrast-score', this.results.contrastScore);
        return this.results.contrastScore;
    }
    
    async testKeyboardNavigation() {
        const focusableElements = this.getFocusableElements();
        let score = 100;
        const issues = [];
        
        // Check if all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]');
        
        interactiveElements.forEach(element => {
            const isVisible = this.isElementVisible(element);
            const isFocusable = this.isElementFocusable(element);
            
            if (isVisible && !isFocusable) {
                score -= 10;
                issues.push({
                    type: 'keyboard',
                    element: element.tagName.toLowerCase(),
                    issue: 'Interactive element not focusable',
                    severity: 'high'
                });
            }
        });
        
        // Check for focus indicators
        const elementsWithoutFocusIndicator = [];
        focusableElements.forEach(element => {
            const styles = window.getComputedStyle(element, ':focus');
            const outline = styles.outline;
            const boxShadow = styles.boxShadow;
            
            if (outline === 'none' && boxShadow === 'none') {
                elementsWithoutFocusIndicator.push(element);
                score -= 5;
            }
        });
        
        if (elementsWithoutFocusIndicator.length > 0) {
            issues.push({
                type: 'keyboard',
                issue: `${elementsWithoutFocusIndicator.length} elements missing focus indicators`,
                severity: 'medium'
            });
        }
        
        // Check for keyboard traps
        const hasKeyboardTrap = this.checkForKeyboardTraps(focusableElements);
        if (hasKeyboardTrap) {
            score -= 20;
            issues.push({
                type: 'keyboard',
                issue: 'Potential keyboard trap detected',
                severity: 'high'
            });
        }
        
        this.results.keyboardScore = Math.max(0, score);
        this.results.issues.push(...issues);
        
        this.updateScoreDisplay('keyboard-score', this.results.keyboardScore);
        return this.results.keyboardScore;
    }
    
    async validateAriaImplementation() {
        let score = 100;
        const issues = [];
        
        // Check required ARIA labels
        const elementsNeedingLabels = document.querySelectorAll('input:not([type="hidden"]), select, textarea, button:not([aria-label]):not([aria-labelledby])');
        elementsNeedingLabels.forEach(element => {
            const hasLabel = this.hasAccessibleLabel(element);
            if (!hasLabel) {
                score -= 10;
                issues.push({
                    type: 'aria',
                    element: element.tagName.toLowerCase(),
                    issue: 'Missing accessible label',
                    severity: 'high'
                });
            }
        });
        
        // Check ARIA roles
        const elementsWithRoles = document.querySelectorAll('[role]');
        elementsWithRoles.forEach(element => {
            const role = element.getAttribute('role');
            const validRoles = this.getValidAriaRoles();
            
            if (!validRoles.includes(role)) {
                score -= 5;
                issues.push({
                    type: 'aria',
                    element: element.tagName.toLowerCase(),
                    issue: `Invalid ARIA role: ${role}`,
                    severity: 'medium'
                });
            }
        });
        
        // Check ARIA properties
        const ariaAttributes = ['aria-expanded', 'aria-controls', 'aria-describedby', 'aria-labelledby'];
        ariaAttributes.forEach(attr => {
            const elements = document.querySelectorAll(`[${attr}]`);
            elements.forEach(element => {
                const value = element.getAttribute(attr);
                if (attr === 'aria-controls' || attr === 'aria-describedby' || attr === 'aria-labelledby') {
                    const targetElement = document.getElementById(value);
                    if (!targetElement) {
                        score -= 5;
                        issues.push({
                            type: 'aria',
                            element: element.tagName.toLowerCase(),
                            issue: `${attr} references non-existent element: ${value}`,
                            severity: 'medium'
                        });
                    }
                }
            });
        });
        
        this.results.ariaScore = Math.max(0, score);
        this.results.issues.push(...issues);
        
        this.updateScoreDisplay('aria-score', this.results.ariaScore);
        return this.results.ariaScore;
    }
    
    async checkSemanticStructure() {
        const issues = [];
        
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                issues.push({
                    type: 'semantic',
                    element: heading.tagName.toLowerCase(),
                    issue: `Heading level skipped (h${lastLevel} to h${level})`,
                    severity: 'medium'
                });
            }
            lastLevel = level;
        });
        
        // Check for main landmark
        const mainElements = document.querySelectorAll('main, [role="main"]');
        if (mainElements.length === 0) {
            issues.push({
                type: 'semantic',
                issue: 'Missing main landmark',
                severity: 'high'
            });
        } else if (mainElements.length > 1) {
            issues.push({
                type: 'semantic',
                issue: 'Multiple main landmarks found',
                severity: 'medium'
            });
        }
        
        // Check for navigation landmarks
        const navElements = document.querySelectorAll('nav, [role="navigation"]');
        if (navElements.length === 0) {
            issues.push({
                type: 'semantic',
                issue: 'No navigation landmarks found',
                severity: 'medium'
            });
        }
        
        this.results.issues.push(...issues);
    }
    
    async validateForms() {
        const forms = document.querySelectorAll('form');
        const issues = [];
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Check for labels
                const hasLabel = this.hasAccessibleLabel(input);
                if (!hasLabel) {
                    issues.push({
                        type: 'form',
                        element: input.tagName.toLowerCase(),
                        issue: 'Form control missing label',
                        severity: 'high'
                    });
                }
                
                // Check required fields
                if (input.hasAttribute('required')) {
                    const hasRequiredIndicator = this.hasRequiredIndicator(input);
                    if (!hasRequiredIndicator) {
                        issues.push({
                            type: 'form',
                            element: input.tagName.toLowerCase(),
                            issue: 'Required field not clearly indicated',
                            severity: 'medium'
                        });
                    }
                }
                
                // Check error messages
                const hasErrorMessage = input.hasAttribute('aria-describedby');
                if (input.getAttribute('aria-invalid') === 'true' && !hasErrorMessage) {
                    issues.push({
                        type: 'form',
                        element: input.tagName.toLowerCase(),
                        issue: 'Invalid field missing error message',
                        severity: 'high'
                    });
                }
            });
        });
        
        this.results.issues.push(...issues);
    }
    
    async checkImages() {
        const images = document.querySelectorAll('img');
        const issues = [];
        
        images.forEach(img => {
            const altText = img.getAttribute('alt');
            const isDecorative = img.hasAttribute('role') && img.getAttribute('role') === 'presentation';
            
            if (!isDecorative && (altText === null || altText === undefined)) {
                issues.push({
                    type: 'image',
                    element: 'img',
                    issue: 'Image missing alt attribute',
                    src: img.src.substring(0, 50) + '...',
                    severity: 'high'
                });
            }
            
            if (altText === img.src || altText === 'image' || altText === 'photo') {
                issues.push({
                    type: 'image',
                    element: 'img',
                    issue: 'Non-descriptive alt text',
                    alt: altText,
                    severity: 'medium'
                });
            }
        });
        
        this.results.issues.push(...issues);
    }
    
    async analyzeHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues = [];
        
        if (headings.length === 0) {
            issues.push({
                type: 'heading',
                issue: 'No headings found on page',
                severity: 'high'
            });
            this.results.issues.push(...issues);
            return;
        }
        
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count === 0) {
            issues.push({
                type: 'heading',
                issue: 'No h1 heading found',
                severity: 'high'
            });
        } else if (h1Count > 1) {
            issues.push({
                type: 'heading',
                issue: 'Multiple h1 headings found',
                severity: 'medium'
            });
        }
        
        this.results.issues.push(...issues);
    }
    
    async checkLinkAccessibility() {
        const links = document.querySelectorAll('a');
        const issues = [];
        
        links.forEach(link => {
            const linkText = link.textContent.trim();
            const hasHref = link.hasAttribute('href');
            const ariaLabel = link.getAttribute('aria-label');
            
            if (!hasHref) {
                issues.push({
                    type: 'link',
                    element: 'a',
                    issue: 'Link missing href attribute',
                    text: linkText.substring(0, 30) + '...',
                    severity: 'high'
                });
            }
            
            if (!linkText && !ariaLabel) {
                issues.push({
                    type: 'link',
                    element: 'a',
                    issue: 'Link missing accessible text',
                    href: link.href,
                    severity: 'high'
                });
            }
            
            const genericTexts = ['click here', 'read more', 'more info', 'here', 'link'];
            if (genericTexts.includes(linkText.toLowerCase())) {
                issues.push({
                    type: 'link',
                    element: 'a',
                    issue: 'Link text not descriptive',
                    text: linkText,
                    severity: 'medium'
                });
            }
        });
        
        this.results.issues.push(...issues);
    }
    
    calculateOverallScore() {
        const scores = [
            this.results.contrastScore,
            this.results.keyboardScore,
            this.results.ariaScore
        ];
        
        // Weight the scores and apply penalties for critical issues
        let weightedScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        // Apply penalties for high severity issues
        const highSeverityIssues = this.results.issues.filter(issue => issue.severity === 'high').length;
        const mediumSeverityIssues = this.results.issues.filter(issue => issue.severity === 'medium').length;
        
        weightedScore -= (highSeverityIssues * 5) + (mediumSeverityIssues * 2);
        
        this.results.overallScore = Math.max(0, Math.round(weightedScore));
        this.updateScoreDisplay('overall-score', this.results.overallScore);
    }
    
    updateScoreDisplay(elementId, score) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = `${score}%`;
        
        // Update score styling based on value
        element.className = 'score-display';
        if (score >= 90) {
            element.classList.add('excellent');
        } else if (score >= 70) {
            element.classList.add('good');
        } else {
            element.classList.add('poor');
        }
    }
    
    updateDashboard() {
        // Update all score displays
        this.updateScoreDisplay('overall-score', this.results.overallScore);
        this.updateScoreDisplay('contrast-score', this.results.contrastScore);
        this.updateScoreDisplay('keyboard-score', this.results.keyboardScore);
        this.updateScoreDisplay('aria-score', this.results.ariaScore);
    }
    
    generateReport() {
        const report = this.report;
        if (!report) return;
        
        const issuesByType = this.groupIssuesByType();
        let reportHTML = '<h3>Accessibility Audit Report</h3>';
        
        // Summary
        reportHTML += `
            <div class="report-summary">
                <p><strong>Overall Score:</strong> ${this.results.overallScore}%</p>
                <p><strong>Total Issues:</strong> ${this.results.issues.length}</p>
                <p><strong>High Priority:</strong> ${this.results.issues.filter(i => i.severity === 'high').length}</p>
                <p><strong>Medium Priority:</strong> ${this.results.issues.filter(i => i.severity === 'medium').length}</p>
            </div>
        `;
        
        // Issues by category
        Object.keys(issuesByType).forEach(type => {
            const typeIssues = issuesByType[type];
            reportHTML += `<h4>${type.charAt(0).toUpperCase() + type.slice(1)} Issues (${typeIssues.length})</h4>`;
            reportHTML += '<ul>';
            typeIssues.forEach(issue => {
                reportHTML += `<li class="issue-${issue.severity}">${issue.issue}</li>`;
            });
            reportHTML += '</ul>';
        });
        
        // Recommendations
        reportHTML += this.generateRecommendations();
        
        report.innerHTML = reportHTML;
    }
    
    groupIssuesByType() {
        const grouped = {};
        this.results.issues.forEach(issue => {
            if (!grouped[issue.type]) {
                grouped[issue.type] = [];
            }
            grouped[issue.type].push(issue);
        });
        return grouped;
    }
    
    generateRecommendations() {
        const recommendations = [];
        const issueTypes = new Set(this.results.issues.map(issue => issue.type));
        
        if (issueTypes.has('contrast')) {
            recommendations.push('Increase color contrast ratios to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)');
        }
        
        if (issueTypes.has('keyboard')) {
            recommendations.push('Ensure all interactive elements are keyboard accessible and have visible focus indicators');
        }
        
        if (issueTypes.has('aria')) {
            recommendations.push('Add proper ARIA labels and ensure all ARIA references point to existing elements');
        }
        
        if (issueTypes.has('form')) {
            recommendations.push('Associate form controls with labels and provide clear error messages');
        }
        
        if (issueTypes.has('image')) {
            recommendations.push('Add descriptive alt text to images or mark decorative images appropriately');
        }
        
        if (issueTypes.has('heading')) {
            recommendations.push('Use proper heading hierarchy (h1-h6) and ensure page has a single h1');
        }
        
        if (issueTypes.has('link')) {
            recommendations.push('Use descriptive link text that makes sense out of context');
        }
        
        let html = '<h4>Recommendations</h4><ul>';
        recommendations.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        html += '</ul>';
        
        return html;
    }
    
    async simulateScreenReader() {
        this.updateReport('Simulating screen reader experience...');
        
        const content = this.extractScreenReaderContent();
        const simulation = this.createScreenReaderSimulation(content);
        
        this.updateReport(`
            <h4>Screen Reader Simulation</h4>
            <div class="screen-reader-content">
                ${simulation}
            </div>
            <p><em>This shows how your content would be announced by a screen reader.</em></p>
        `);
    }
    
    extractScreenReaderContent() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, input, label, img[alt], [aria-label]');
        const content = [];
        
        elements.forEach(element => {
            if (!this.isElementVisible(element)) return;
            
            let text = '';
            const tagName = element.tagName.toLowerCase();
            
            switch (tagName) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    text = `Heading level ${tagName.charAt(1)}: ${element.textContent.trim()}`;
                    break;
                case 'a':
                    text = `Link: ${element.textContent.trim() || element.getAttribute('aria-label')}`;
                    break;
                case 'button':
                    text = `Button: ${element.textContent.trim() || element.getAttribute('aria-label')}`;
                    break;
                case 'img':
                    text = `Image: ${element.getAttribute('alt')}`;
                    break;
                case 'input':
                    const label = this.getAssociatedLabel(element);
                    text = `${element.type} input: ${label}`;
                    break;
                default:
                    text = element.textContent.trim();
            }
            
            if (text) {
                content.push(text);
            }
        });
        
        return content;
    }
    
    createScreenReaderSimulation(content) {
        return content.map(item => `<div class="sr-item">${item}</div>`).join('');
    }
    
    // Utility methods
    getFocusableElements() {
        const selectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];
        
        return Array.from(document.querySelectorAll(selectors.join(', ')))
            .filter(element => this.isElementVisible(element));
    }
    
    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetParent !== null;
    }
    
    isElementFocusable(element) {
        const tabindex = element.getAttribute('tabindex');
        if (tabindex === '-1') return false;
        
        const focusableTypes = ['a', 'button', 'input', 'select', 'textarea'];
        return focusableTypes.includes(element.tagName.toLowerCase()) || tabindex >= 0;
    }
    
    hasAccessibleLabel(element) {
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        const associatedLabel = this.getAssociatedLabel(element);
        
        return !!(ariaLabel || ariaLabelledBy || associatedLabel);
    }
    
    getAssociatedLabel(element) {
        const id = element.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return label.textContent.trim();
        }
        
        const parentLabel = element.closest('label');
        if (parentLabel) return parentLabel.textContent.trim();
        
        return null;
    }
    
    hasRequiredIndicator(element) {
        const label = this.getAssociatedLabel(element);
        return label && (label.includes('*') || label.includes('required'));
    }
    
    checkForKeyboardTraps(focusableElements) {
        // Simple keyboard trap detection
        // In a real implementation, this would be more sophisticated
        return false;
    }
    
    getValidAriaRoles() {
        return [
            'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
            'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
            'contentinfo', 'definition', 'dialog', 'directory', 'document',
            'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
            'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
            'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
            'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
            'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
            'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
            'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
            'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
            'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
    }
    
    trackFocus(event) {
        this.keyboardNavigation.activeElement = event.target;
        this.keyboardNavigation.currentIndex = this.keyboardNavigation.focusableElements.indexOf(event.target);
    }
    
    trackKeyboardUsage(event) {
        // Track tab navigation
        if (event.key === 'Tab') {
            // Update focusable elements list
            this.keyboardNavigation.focusableElements = this.getFocusableElements();
        }
    }
    
    validateFormAccessibility(event) {
        const form = event.target;
        const inputs = form.querySelectorAll('input, select, textarea');
        let hasErrors = false;
        
        inputs.forEach(input => {
            if (!this.hasAccessibleLabel(input)) {
                hasErrors = true;
                console.warn('Form submitted with unlabeled input:', input);
            }
        });
        
        if (hasErrors) {
            console.warn('Form accessibility issues detected');
        }
    }
    
    observeContentChanges() {
        const observer = new MutationObserver(mutations => {
            let shouldReaudit = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if added nodes contain interactive elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasInteractiveElements = node.querySelectorAll('a, button, input, select, textarea').length > 0;
                            if (hasInteractiveElements) {
                                shouldReaudit = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReaudit) {
                // Debounce re-audit
                clearTimeout(this.reauditTimeout);
                this.reauditTimeout = setTimeout(() => {
                    this.runInitialAudit();
                }, 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    updateReport(content) {
        if (this.report) {
            this.report.innerHTML = content;
        }
    }
    
    runInitialAudit() {
        // Run a quick initial audit to populate the dashboard
        setTimeout(() => {
            this.checkColorContrast();
            this.testKeyboardNavigation();
            this.validateAriaImplementation();
            this.calculateOverallScore();
        }, 1000);
    }
}

// Color Contrast Checker utility class
class ColorContrastChecker {
    getContrastRatio(color1, color2) {
        const rgb1 = this.getRGB(color1);
        const rgb2 = this.getRGB(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    getRGB(color) {
        // Handle various color formats
        if (color.startsWith('rgb')) {
            const matches = color.match(/\d+/g);
            return matches ? matches.map(Number) : null;
        }
        
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            if (hex.length === 3) {
                return [
                    parseInt(hex[0] + hex[0], 16),
                    parseInt(hex[1] + hex[1], 16),
                    parseInt(hex[2] + hex[2], 16)
                ];
            }
            if (hex.length === 6) {
                return [
                    parseInt(hex.slice(0, 2), 16),
                    parseInt(hex.slice(2, 4), 16),
                    parseInt(hex.slice(4, 6), 16)
                ];
            }
        }
        
        // Default to white for transparent/unknown colors
        return [255, 255, 255];
    }
    
    getLuminance([r, g, b]) {
        const sRGB = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    }
}

// ARIA Validator utility class
class AriaValidator {
    validateAriaAttributes(element) {
        const issues = [];
        const attributes = element.attributes;
        
        for (let attr of attributes) {
            if (attr.name.startsWith('aria-')) {
                const validation = this.validateAriaAttribute(attr.name, attr.value, element);
                if (!validation.valid) {
                    issues.push(validation);
                }
            }
        }
        
        return issues;
    }
    
    validateAriaAttribute(name, value, element) {
        const validations = {
            'aria-expanded': (val) => ['true', 'false'].includes(val),
            'aria-hidden': (val) => ['true', 'false'].includes(val),
            'aria-live': (val) => ['off', 'polite', 'assertive'].includes(val),
            'aria-invalid': (val) => ['true', 'false', 'grammar', 'spelling'].includes(val)
        };
        
        if (validations[name]) {
            const isValid = validations[name](value);
            return {
                valid: isValid,
                attribute: name,
                value: value,
                message: isValid ? null : `Invalid value for ${name}: ${value}`
            };
        }
        
        return { valid: true };
    }
}

// Keyboard Tester utility class
class KeyboardTester {
    async testTabOrder() {
        const focusableElements = this.getFocusableElements();
        const results = {
            totalElements: focusableElements.length,
            reachableElements: 0,
            issues: []
        };
        
        // Simulate tab navigation
        for (let i = 0; i < focusableElements.length; i++) {
            const element = focusableElements[i];
            try {
                element.focus();
                if (document.activeElement === element) {
                    results.reachableElements++;
                } else {
                    results.issues.push({
                        element: element,
                        issue: 'Element not reachable via tab navigation'
                    });
                }
            } catch (error) {
                results.issues.push({
                    element: element,
                    issue: 'Error focusing element: ' + error.message
                });
            }
        }
        
        return results;
    }
    
    getFocusableElements() {
        return Array.from(document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }
}

// Initialize the accessibility metrics system when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityMetrics = new AccessibilityMetrics();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AccessibilityMetrics, ColorContrastChecker, AriaValidator, KeyboardTester };
}