import incomeOjb from "./income.js";

class Expense {
    constructor() {
        this.tags = incomeOjb.budgetCategories;
        this.expenses = this.getStorageItem("expenses");

        //ui elements
        this.expenseDropDown = document.getElementById("existingExpenseTagInput");
        this.expenseForm = document.getElementById("expenseAddForm");
        this.expenseChart = document.getElementById("expenseChart");
        this.summaryExpenseChart = document.getElementById("SummaryExpenseChart");

        this.expenseForm.addEventListener('submit', this.addExpenseForm.bind(this))
    }
    //internal calculation methods
    setStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    getStorageItem(item) {
        const localStorageItem = localStorage.getItem(item);

        if (localStorageItem !== null) {
            return JSON.parse(localStorageItem);
        } else {
            return [];
        }
    }
    getLastTagId(item) {
        const storageCategories = this.getStorageItem(item);
        console.log(storageCategories.length)
        if (storageCategories.length) {
            const lastCategory = storageCategories[storageCategories.length - 1];
            return lastCategory.id;
        }
        return 0;
    }
    addExpense(newExpense, tag) {
        let newTagArr = [];

        const lastTagId = this.getLastTagId("expenses");
        const newId = lastTagId + 1;

        const tagObj = {
            id: newId,
            tag: tag,
            expense: newExpense,
        };

        const storageExpenses = this.getStorageItem("expenses");

        //expenses
        if (storageExpenses.length) {
            newTagArr = [...storageExpenses, tagObj];
        }
        else {
            newTagArr.push(tagObj);


        }
        //putting new expenses into storage

        this.setStorageItem("expenses", newTagArr);
        location.reload();
    }
    getAllExpenses() {
        const sortedExpenses = this.expenses.sort((a, b) => (a.id > b.id ? -1 : 1));
        const allExpensesBody = document.getElementById("allExpensesBody");
        let serial = 1;
        sortedExpenses.forEach((item) => {
            allExpensesBody.insertAdjacentHTML("beforeend", `<tr><td>${serial}</td><td>${item.tag}</td><td>${item.expense}</td></tr>`);
            serial++;
        });
    }
    getcategoryExpenses() {
        const expenseList = this.expenses.reduce((acc, curr) => {
            const newObj = {};
            const exists = acc.some(item => item.tag === curr.tag);
            if (exists) {
                const oldObj = acc.filter(item => item.tag === curr.tag);
                oldObj[0].expense =
                    parseInt(oldObj[0].expense) + parseInt(curr.expense);
            } else {
                newObj.tag = curr.tag;
                newObj.expense = parseInt(curr.expense);
                newObj.total = this.tags.filter(
                    item => item.category === curr.tag
                )[0].budget;
                acc.push(newObj);
            }
            return acc;
        }, []);
        return expenseList;
    }
    getTotalExpense() {
        let totalExpense = 0;
        this.expenses.forEach(el => {
            totalExpense += parseInt(el.expense);
        });
        return totalExpense;
    }
    getCategoryExepensesList() {
        const expenseList = this.getcategoryExpenses();
        const expenseListDiv = document.getElementById('catExpensesList');
        const exhaustedDivWidthConstant = 322;
        expenseList.forEach(item => {
            // row element
            const row = document.createElement('tr');
            //cols
            const itemCol = document.createElement('td');
            const exhaustCol = document.createElement('td');
            const totalCol = document.createElement('td');
            // div for showing how much is exhausted from a category
            const exhaustedDiv = document.createElement('div');
            exhaustedDiv.className = 'exhaustionDiv';
            exhaustedDiv.style.width = `${exhaustedDivWidthConstant}px`;
            const innerExhaustionDiv = document.createElement('div');
            innerExhaustionDiv.className = 'innerexhaustionDiv';
            exhaustedDiv.append(innerExhaustionDiv);
            //inner exhaust width calculations
            const exhaustedPercent = item.expense / item.total;
            const innerWidth = exhaustedPercent * exhaustedDivWidthConstant;
            innerExhaustionDiv.style.width = `${innerWidth}px`;

            // putting values into table
            itemCol.textContent = `${item.tag}`;
            exhaustCol.append(exhaustedDiv);
            totalCol.textContent = `${item.expense}/${item.total}`;
            row.append(itemCol, exhaustCol, totalCol);
            expenseListDiv.insertAdjacentElement('afterbegin', row);
        });
    }
    getexpenseChart() {
        const expenseList = this.getcategoryExpenses();
        const expenseLabels = [];
        const expenseData = [];
        expenseList.forEach(item => {
            expenseLabels.push(item.tag);
            expenseData.push(item.expense);
        });
        const data = {
            labels: expenseLabels,
            datasets: [
                {
                    data: expenseData,
                    backgroundColor: [
                        'rgb(1, 142, 203)',
                        'rgb(224, 98, 165)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                    ],
                },
            ],
        };
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Expense Categories',
                    },
                },
            },
        };

        const myChart = new Chart(this.expenseChart, config);
        const myChart2 = new Chart(this.summaryExpenseChart, config);
    }


    //ui interaction

    addBudgetDropdowns() {
        this.tags?.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.category;
            option.text = tag.category;
            this.expenseDropDown.insertAdjacentElement('beforeend', option);
        });
    }
    addExpenseForm(e) {
        e.preventDefault();
        const newExpenseInput = document.getElementById("newExpenseInput").value;
        const newTagInput = document.getElementById("existingExpenseTagInput").value;
        console.log(newExpenseInput, newTagInput);
        this.addExpense(newExpenseInput, newTagInput);
    }
    initiate() {
        this.addBudgetDropdowns();
        this.getAllExpenses();
        this.getCategoryExepensesList();
        this.getexpenseChart();
    }
}
const expenseObj = new Expense()

export default expenseObj;