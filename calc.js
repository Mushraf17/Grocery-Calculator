const itemForm = document.getElementById("itemForm");
const itemTable = document.querySelector("#itemTable tbody");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const amountGivenInput = document.getElementById("amountGiven");
const changeEl = document.getElementById("change");

let items = [];

const TAX_RATE = 0.07;
const DISCOUNT = 0.10;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(value);
};

function renderItems() {
  itemTable.innerHTML = "";
  let subtotal = 0;

  items.forEach((item, index) => {
    const row = document.createElement("tr");
    const total = item.qty * item.price;
    subtotal += total;

    row.innerHTML = `
      <td>${item.name}</td>
      <td><input type="number" min="1" value="${item.qty}" data-index="${index}" class="qtyInput" /></td>
      <td><input type="number" min="0.01" step="0.01" value="${item.price}" data-index="${index}" class="priceInput" /></td>
      <td>${formatCurrency(total)}</td>
      <td><button onclick="deleteItem(${index})">🗑️</button></td>
    `;

    itemTable.appendChild(row);
  });

  const tax = subtotal * TAX_RATE;
  const discount = subtotal * DISCOUNT;
  const total = subtotal + tax - discount;

  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  discountEl.textContent = formatCurrency(discount);
  totalEl.textContent = formatCurrency(total);

  updateChangeAmount(total);
  attachInputListeners();
}

function attachInputListeners() {
  document.querySelectorAll(".qtyInput").forEach(input => {
    input.addEventListener("change", (e) => {
      const i = e.target.dataset.index;
      items[i].qty = parseInt(e.target.value);
      renderItems();
    });
  });
  document.querySelectorAll(".priceInput").forEach(input => {
    input.addEventListener("change", (e) => {
      const i = e.target.dataset.index;
      items[i].price = parseFloat(e.target.value);
      renderItems();
    });
  });
}

function updateChangeAmount(total) {
  const amountGiven = parseFloat(amountGivenInput.value);
  if (!isNaN(amountGiven)) {
    const change = amountGiven - total;
    changeEl.textContent = change >= 0 ? formatCurrency(change) : "₹0.00";
  } else {
    changeEl.textContent = "₹0.00";
  }
}

function deleteItem(index) {
  items.splice(index, 1);
  renderItems();
}

itemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const qty = parseInt(document.getElementById("itemQty").value);
  const price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || qty <= 0 || price <= 0) {
    alert("Please enter valid values.");
    return;
  }

  items.push({ name, qty, price });
  itemForm.reset();
  renderItems();
});

amountGivenInput.addEventListener("input", () => {
  const subtotal = parseFloat(subtotalEl.textContent.replace(/[^0-9.-]+/g, ""));
  const tax = subtotal * TAX_RATE;
  const discount = subtotal * DISCOUNT;
  const total = subtotal + tax - discount;
  updateChangeAmount(total);
});

renderItems();




