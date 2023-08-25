const form = document.querySelector('#form');
const expenses = document.querySelector('#expenses-name');
const amount = document.querySelector('#expenses-amount');
const list = document.querySelector('.expenses-list');
const clrBtn = document.querySelector('.btn-delete');
const totalAmount = document.querySelector('#total-amount');


function ExpensesObj(id, expenses, amount){
    this.id = id ;
    this.expenses = expenses;
    this.amount = amount;
}

class UI{
    static addToUi(expensesObj){
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = `<span>${expensesObj.expenses}</span>
                        <span>${expensesObj.amount}</span>
                        <span>
                            <i class='fas fa-edit edit'></i>
                            <i class='fas fa-trash-alt delete'></i>
                        </span>`
        list.appendChild(li);
    }

    static addTotalToUi(){
        const expensesArr = store.getExpensesArr();
        totalAmount.innerHTML = `${expensesArr.reduce((acc,curr) =>{return acc += +curr.amount} ,0 )}`;
    }

    static rem(el){
        el.remove();
        UI.addTotalToUi()
    }

    static edit(el){
        const expensesArr = store.getExpensesArr();
        expensesArr.forEach(exp => {
                    if(exp.expenses === el){
                        expenses.value = exp.expenses ;
                        amount.value = exp.amount
                    }
                });
        UI.addTotalToUi();
    }
}

class store{
    static getExpensesArr(){
        let expensesArr = 
        JSON.parse(localStorage.getItem('expensesArr')) === null ?
        [] :
        JSON.parse(localStorage.getItem('expensesArr'));

        return expensesArr
    }

    static addToStorage(expensesObj){
        const expensesArr = store.getExpensesArr();
        expensesArr.push(expensesObj);
        localStorage.setItem('expensesArr', JSON.stringify(expensesArr));
    }

    

    static del(el){
        const expensesArr = store.getExpensesArr();
        const updatedExpensesArr = expensesArr.filter(expense => expense.expenses !== el);
        localStorage.setItem('expensesArr', JSON.stringify(updatedExpensesArr));

    }

    static EventListener(){
        const editBtn = document.querySelectorAll('.edit');
        const delBtn = document.querySelectorAll('.delete');
        editBtn.forEach(edit => {
            edit.addEventListener('click', (e)=>{
                UI.edit(e.target.parentElement.parentElement.firstChild.textContent)
                store.del(e.target.parentElement.parentElement.firstChild.textContent);
                UI.rem(e.target.parentElement.parentElement);
            });
        });
        delBtn.forEach(del => {
            del.addEventListener('click', (e) => {
                store.del(e.target.parentElement.parentElement.firstChild.textContent);
                UI.rem(e.target.parentElement.parentElement)
            })
        })
    }
}




document.addEventListener('DOMContentLoaded', ()=>{
    const expensesArr = store.getExpensesArr();
    expensesArr.forEach(expense => {
        UI.addToUi(expense)
    });
    UI.addTotalToUi();
    store.EventListener();
})

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const expensesValue = expenses.value;
    const amountValue = amount.value;
    if(expensesValue === '' || amountValue === ''){
        alert('Enter the required')
    } else{
        
        const date = new Date();
        const id = date.getTime();
        const expensesObj = new ExpensesObj(id, expensesValue, amountValue)
        expenses.value = '';
        amount.value = '';
        
        UI.addToUi(expensesObj);
        store.addToStorage(expensesObj);
        UI.addTotalToUi();
        store.EventListener();

    }

})

clrBtn.addEventListener('click', ()=>{
    list.innerHTML = '';
    const expensesArr = [];
    localStorage.setItem('expensesArr', JSON.stringify(expensesArr));
    UI.addTotalToUi();
})
