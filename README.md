💎 SpendWise: One-Day Expense Tracker
A high-end, vanilla JavaScript fintech dashboard for daily financial clarity.

SpendWise is a premium web application designed to track expenses for a single 24-hour cycle. Built with a focus on Micro-interactions, Glassmorphism, and Data Visualization, it offers a "SaaS-product" feel using zero external dependencies or frameworks.

🚀 Key Features
Glassmorphism UI: A sleek, semi-transparent interface with background blur effects and fluid animations.

Live Data Visualization: A custom-built, responsive bar chart that animates in real-time as expenses are added or removed.

Intelligent Auto-Reset: The app automatically detects a new calendar day and clears the local storage to keep your focus on today.

Animated Totals: Utilizes a custom requestAnimationFrame counter to roll numbers up/down smoothly.

Persistence: All data is saved to localStorage, ensuring your list stays intact even after a page refresh.

Dual-Mode Support: Fully optimized Light and Dark modes with persistent user preference.

Data Portability: Export your daily transactions into a structured JSON file with a single click.

🛠️ Technical Stack
Structure: Semantic HTML5

Styling: Modern CSS3 (Flexbox, Grid, Custom Variables, Backdrop Filters)

Logic: Vanilla JavaScript (ES6+ Modular approach)

Icons: Unicode/Emoji-based for zero-latency loading.

📁 File Structure
Plaintext
spendwise/
├── index.html   # Main dashboard structure & Modal components
├── style.css    # Design tokens, animations, and responsive layouts
└── script.js    # State management, chart logic, and storage handling
📖 How to Use
Add Expense: Type your purchase name, enter the amount, and select a category. Hit Enter or click "Add to List."

Analyze: Watch the "Spending Breakdown" chart update. The bars scale relative to your highest spending category.

Manage: Click the ✕ on any transaction to remove it and update the daily total instantly.

Themes: Use the 🌓 icon in the header to switch between light and dark aesthetics.

New Day: The app resets at midnight, but you can manually wipe data using the "Reset Day" button.

⚡ Development Notes (For Engineers)
No Chart Libraries: The chart is rendered using a dynamic mapping of the expenses array to a series of div elements, with heights calculated as a percentage of the maximum value.

Theming: Controlled via a .dark-mode class applied to the <body> which overrides root CSS variables.

Validation: Amount inputs are strictly enforced as numbers with two-decimal precision via JS logic.

Pro Tip: To test the auto-reset logic without waiting 24 hours, manually change the last_active_date value in your browser's Local Storage to a date in the past.
