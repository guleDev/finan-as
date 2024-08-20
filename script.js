const tbody= document.querySelector("tbody");
const descItem= document.querySelector("#desc");
const amount= document.querySelector("#amount");
const type= document.querySelector("#type");
const btnNew= document.querySelector("#btnNew");

const incomes= document.querySelector(".incomes");
const expenses= document.querySelector(".expenses");
const total= document.querySelector(".total");

let items;

function btnNewClick(){
    if (descItem.value === "" || amount.value ==="" || type.value === ""){
        return alert("Preencha todos os campos!");
    }

    items.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value,
    });

    setItensBD();

    loadItens();

    descItem.value= "";
    amount.value= "";
};

function deleteItem(index){
    items.splice(index, 1);
    setItensBD();
    loadItens();
};

function insertItem(item, index){
    let tr= document.createElement("tr");

    tr.innerHTML= `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td class="columnType">${
            item.type === "Entrada"
            ? '<span class="material-symbols-outlined arrow_upward">expand_circle_up</span>'
            : '<span class="material-symbols-outlined arrow_downward">expand_circle_down</span>'
        }</td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})"><span class="material-symbols-outlined delete">delete</span></button>
        </td>
    `;

    tbody.appendChild(tr);
};

function loadItens(){
    items= getItensBD();
    tbody.innerHTML= "";
    items.forEach((item, index)=> {
        insertItem(item, index);
    });

    getTotals();
};

function getTotals(){
    const amountIncomes= items
    .filter((item)=> item.type === "Entrada")
    .map((transaction)=> Number(transaction.amount));

    const amountExpenses= items
    .filter((item)=> item.type === "Saída")
    .map((transaction)=> Number(transaction.amount));

    const totalIncomes= amountIncomes
    .reduce((acc, cur)=> acc + cur, 0)
    .toFixed(2);

    const totalExpenses= Math.abs(
        amountExpenses.reduce((acc, cur)=> acc + cur, 0)
    ).toFixed(2);

    const totalItems= (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML= totalIncomes;
    expenses.innerHTML= totalExpenses;
    total.innerHTML= totalItems;
}

const getItensBD= ()=> JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD= ()=> 
    localStorage.setItem("db_items", JSON.stringify(items));

loadItens();
