const itemForm = document.getElementById("itemForm");
const itemTable = document.querySelector("#itemTable tbody");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const exportBtn = document.getElementById("exportBtn");
const themeToggle = document.getElementById("toggleTheme");

let items = JSON.parse(localStorage.getItem("groceryItems")) || [];
const TAX_RATE = 0.07;
const DISCOUNT = 0.10;

function saveToLocalStorage() {
  localStorage.setItem("groceryItems", JSON.stringify(items));
}

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
      <td>$${(total).toFixed(2)}</td>
      <td><button onclick="deleteItem(${index})">🗑️</button></td>
    `;

    itemTable.appendChild(row);
  });

  const tax = subtotal * TAX_RATE;
  const discount = subtotal * DISCOUNT;
  const total = subtotal + tax - discount;

  subtotalEl.textContent = subtotal.toFixed(2);
  taxEl.textContent = tax.toFixed(2);
  discountEl.textContent = discount.toFixed(2);
  totalEl.textContent = total.toFixed(2);

  attachInputListeners();
  saveToLocalStorage();
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

exportBtn.addEventListener("click", () => {
  let csv = "Item,Quantity,Price,Total\n";
  items.forEach(item => {
    csv += `${item.name},${item.qty},${item.price},${(item.qty * item.price).toFixed(2)}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "grocery-list.csv";
  a.click();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderItems();
