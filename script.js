// --- Initial State & Config ---
let expenses = JSON.parse(localStorage.getItem('daily_expenses')) || [];
const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];
const categoryColors = {
    Food: "#ff7675",
    Travel: "#74b9ff",
    Shopping: "#55efc4",
    Bills: "#ffeaa7",
    Other: "#a29bfe"
};

// --- DOM Elements ---
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total-amount');
const chartContainer = document.getElementById('chart-bars');
const emptyState = document.getElementById('empty-state');
const dateDisplay = document.getElementById('current-date');
const themeToggle = document.getElementById('theme-toggle');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    checkDateReset();
    updateUI();
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
    });
});

// --- Core Functions ---

function addExpense(e) {
    e.preventDefault();
    
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!desc || isNaN(amount)) return;

    const newExpense = {
        id: Date.now(),
        desc,
        amount,
        category,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    expenses.unshift(newExpense);
    saveAndRender();
    form.reset();
    document.getElementById('desc').focus();
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('daily_expenses', JSON.stringify(expenses));
    localStorage.setItem('last_active_date', new Date().toDateString());
    updateUI();
}

function updateUI() {
    // 1. Update List
    expenseList.innerHTML = '';
    if (expenses.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        expenses.forEach(exp => {
            const el = document.createElement('div');
            el.className = 'expense-item';
            el.innerHTML = `
                <div class="cat-icon">${getIcon(exp.category)}</div>
                <div class="exp-info">
                    <p>${exp.desc}</p>
                    <span>${exp.time} • ${exp.category}</span>
                </div>
                <div class="exp-amount">$${exp.amount.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">✕</button>
            `;
            expenseList.appendChild(el);
        });
    }

    // 2. Update Totals & Chart
    calculateTotals();
    drawChart();
}

function calculateTotals() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    // Animate number
    animateValue(totalDisplay, parseFloat(totalDisplay.textContent.replace('$', '')), total, 500);
}

function drawChart() {
    chartContainer.innerHTML = '';
    const categoryTotals = categories.map(cat => {
        return {
            name: cat,
            total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
        };
    });

    const maxVal = Math.max(...categoryTotals.map(c => c.total), 10);

    categoryTotals.forEach(cat => {
        const height = (cat.total / maxVal) * 100;
        const barWrapper = document.createElement('div');
        barWrapper.className = 'chart-bar-wrapper';
        barWrapper.innerHTML = `
            <div class="bar" style="height: ${height}%; background: ${categoryColors[cat.name]}" data-val="$${cat.total.toFixed(0)}"></div>
            <div class="bar-label">${cat.name.substring(0, 3)}</div>
        `;
        chartContainer.appendChild(barWrapper);
    });
}

// --- Helpers ---

function getIcon(cat) {
    const icons = { Food: "🍔", Travel: "🚗", Shopping: "🛍️", Bills: "🧾", Other: "✨" };
    return icons[cat] || "💰";
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `$${current.toFixed(2)}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function checkDateReset() {
    const lastDate = localStorage.getItem('last_active_date');
    const today = new Date().toDateString();
    if (lastDate && lastDate !== today) {
        expenses = [];
        localStorage.removeItem('daily_expenses');
    }
}

// --- Event Listeners ---
form.addEventListener('submit', addExpense);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Reset Logic
const modal = document.getElementById('modal-overlay');
document.getElementById('reset-btn').onclick = () => modal.classList.remove('hidden');
document.getElementById('cancel-reset').onclick = () => modal.classList.add('hidden');
document.getElementById('confirm-reset').onclick = () => {
    expenses = [];
    saveAndRender();
    modal.classList.add('hidden');
};

// Export to JSON
document.getElementById('export-btn').onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `expenses_${new Date().toLocaleDateString()}.json`);
    downloadAnchor.click();
};

// Check for saved theme
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
