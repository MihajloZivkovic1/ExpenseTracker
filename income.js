class Income {
    constructor() {
        this.income = this.calculateCategory("income");
        this.budget = this.calculateCategory("budget")
        this.savings = this.income - this.budget;
        this.incomeCategories = this.getIncomeCategories();
        this.budgetCategories = this.getBudgetCategories();


        //ui elements
        this.incomeAddForm = document.getElementById("incomeAddForm");
        this.budgetAddBtn = document.getElementById("budgetAddBtn");
        this.incomeBudgetTableBody = document.getElementById("incomeBudgetTableBody");
        this.budgetTable = document.getElementById("budgetTable");
        this.incomeChartTableBody = document.getElementById("incomeChartTableBody");
        this.incomeChart = document.getElementById("incomeChart");
        this.incBudCompareChart = document.getElementById("incBudCompareChart");
        this.budgetChartTableBody = document.getElementById("budgetChartTableBody");
        this.SavingsValue = document.getElementById("estimatedSavingsValue");
        this.summaryIncomeChart = document.getElementById("SummaryIncomeChart");





        //event handler

        this.incomeAddForm.addEventListener('submit', this.addIncomeForm.bind(this));
        this.budgetAddBtn.addEventListener('click', this.addBudgetForm.bind(this));
        this.budgetTable.addEventListener("click", this.removeBudgetRow.bind(this));
    }
    //internal calcualtions
    calculateCategory(category) {
        if (this.getStorageItem(category + "Categories")) {
            const categories = this.getStorageItem(category + "Categories");
            return categories.reduce(
                (acc, curr) => (acc += parseInt(curr[category])), 0
            );
        } else {
            return 0;
        }
    }
    setStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    getStorageItem(item) {
        const localStorageItem = localStorage.getItem(item);
        if (localStorageItem !== null) {
            return JSON.parse(localStorageItem)
        }
        else {
            return undefined;
        }
    }
    addIncome(newIncome, source) {
        let newCatArr = [];
        const lastIncomeCatId = this.getLastCategoryId("incomeCategories");
        const newId = lastIncomeCatId + 1;
        const catObj = {
            id: newId,
            source: source,
            income: newIncome,
        };

        const storageIncomeCategories = this.getStorageItem("incomeCategories");

        if (storageIncomeCategories) {
            newCatArr = [...storageIncomeCategories, catObj];
        }
        else {
            newCatArr.push(catObj)
        }
        this.incomeCategories = newCatArr;
        this.setStorageItem('incomeCategories', newCatArr);
        location.reload();//reload page
    }
    getLastCategoryId(categoryName) {
        const storageCategories = this.getStorageItem(categoryName);
        if (storageCategories) {
            const lastCategory = storageCategories[storageCategories.length - 1];
            return lastCategory.id;
        }
        return 0;
    };
    getIncomeCategories() {
        if (this.getStorageItem("incomeCategories"))
            return this.getStorageItem("incomeCategories");

        return [];
    }
    addBudget(newBudget, newCategory) {
        let newCatArr = [];
        const lastBudgetCatId = this.getLastCategoryId("budgetCategories");
        const newId = lastBudgetCatId + 1;


        const catObj = {
            id: newId,
            category: newCategory,
            budget: newBudget,
        };

        const storageBudgetCategories = this.getStorageItem("budgetCategories");

        if (storageBudgetCategories) {
            newCatArr = [...storageBudgetCategories, catObj];
        }
        else {
            newCatArr.push(catObj)
        }
        this.budgetCategories = newCatArr;

        this.setStorageItem('budgetCategories', newCatArr);
        location.reload();//reload page
    }
    getBudgetCategories() {
        if (this.getStorageItem("budgetCategories"))
            return this.getStorageItem("budgetCategories")

        return [];
    }
    removeItem(item, id) {
        const itemCategoryName = item + "Categories";
        const itemCategory = this.getStorageItem(itemCategoryName);
        const newCategoryArray = itemCategory.filter((item) => item.id != id);
        this.setStorageItem(itemCategoryName, newCategoryArray);
        location.reload();
    }
    //ui Interacitions

    addIncomeForm(e) {
        e.preventDefault();



        const newIncomeInput = document.getElementById("newIncomeInput").value
        const newSourceInput = document.getElementById("newIncomeSourceInput").value;
        const existingSourceInput = document.getElementById("existingIncomeSourceInput").value

        const newSource = newSourceInput || existingSourceInput;
        if (newIncomeInput !== "") {
            // console.log(newIncomeInput, newSource)
            this.addIncome(newIncomeInput, newSource);
        }
    }

    addBudgetForm() {
        const newBudget = document.getElementById("budgetInput").value;
        const newBudgetCategory = document.getElementById("budgetCategoryInput").value;
        if (newBudget !== "") {
            this.addBudget(newBudget, newBudgetCategory);
        }
    }
    mapBudgetTable() {
        this.budgetCategories.forEach(item => {
            const tr = document.createElement('tr');
            tr.setAttribute('id', `bRow${item.id}`);
            tr.innerHTML = `<td>${item.category}</td><td>${item.budget}</td>
                                <td><button id="budDelBtn${item.id}" class="del-btn">delete</button></td>`;
            this.incomeBudgetTableBody.insertAdjacentElement("beforeBegin", tr);
        });
    }
    removeBudgetRow(e) {
        const btnID = e.target.id;

        if (btnID.includes("budDelBtn")) {
            const id = btnID.split("budDelBtn")[1];
            const budRowId = `bRow${id}`;

            const budRow = document.getElementById(budRowId);
            budRow.remove();
            this.removeItem("budget", id);
        }
    }
    addIncomeChart() {
        const incomeLabels = [];
        const incomeData = [];
        this.incomeCategories.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<tr><td>-${item.source}</td><td>${item.income}</td></tr>`;
            this.incomeChartTableBody.insertAdjacentElement('beforeEnd', tr);
            incomeLabels.push(item.source);
            incomeData.push(item.income);
        });
        const data = {
            labels: incomeLabels,
            datasets: [
                {
                    data: incomeData,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(1, 142, 203)',
                        'rgb(106, 144, 204)',
                        'rgb(1, 142, 203)',
                        'rgb(102, 55, 221)',
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
                        text: 'Income Sources',
                    },
                },
            },
        };

        const myChart = new Chart(this.incomeChart, config);
        const myChart2 = new Chart(this.summaryIncomeChart, config);
    }
    addBudgetCompareChart() {
        this.budgetCategories.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<tr><td>-${item.category}</td><td>${item.budget}</td></tr>`;
            this.budgetChartTableBody.insertAdjacentElement('beforeEnd', tr);
        });
        this.SavingsValue.textContent = this.savings;

        const data = {
            labels: ['Income/budget'],
            datasets: [
                {
                    label: 'Income',
                    data: [this.income],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(150, 230, 132)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                },
                {
                    label: 'Budget',
                    data: [this.budget],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                },
                {
                    label: 'Savings',
                    data: [this.savings],
                    borderColor: 'rgb(120, 162, 235)',
                    backgroundColor: 'rgb(255, 200, 132)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                },
            ],
        };
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Income Budget Comparison ',
                    },
                },
            },
        };

        const myChart = new Chart(this.incBudCompareChart, config);
    }


    initiate() {
        this.mapBudgetTable();
        this.addIncomeChart();
        this.addBudgetCompareChart();
    }
}
const incomeOjb = new Income()

export default incomeOjb;
