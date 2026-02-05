// Функция скрытия возрастного гейта (18+)
function enterSite() {
  document.getElementById('ageGate').style.display = 'none';
}

// Функция открытия модального окна с деталями товара
function openModal(item) {
  // Основная информация
  document.getElementById('modal-img').src = item.image;
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-description').textContent = item.description;

  const detailsDiv = document.getElementById('modal-details');
  const stockDiv = document.getElementById('modal-stock');
  detailsDiv.innerHTML = '';
  stockDiv.innerHTML = '';

  // Заголовок списка (вкусы или цвета)
  let listTitle = item.flavors ? 'Доступные вкусы:' : 'Доступные цвета:';
  let listItems = item.flavors || item.colors || [];

  if (listItems.length > 0) {
    detailsDiv.innerHTML = `<p style="color:#39ff14; margin-bottom:10px; font-weight:bold;">${listTitle}</p><ul class="variants-list">`;
    
    listItems.forEach(variant => {
      // variant — это объект { name: "Название", available: true/false }
      const availClass = variant.available ? 'stock-yes' : 'stock-no';
      const dotClass = variant.available ? 'dot-yes' : 'dot-no';
      
      detailsDiv.innerHTML += `
        <li class="${availClass}">
          <span class="variant-dot ${dotClass}"></span>
          ${variant.name}
        </li>
      `;
    });
    
    detailsDiv.innerHTML += '</ul>';
  } else {
    detailsDiv.innerHTML = '<p>Вкусы/цвета не указаны</p>';
  }

  // Общее наличие товара (по quantity)
  if (item.quantity > 0) {
    stockDiv.innerHTML = `<p class="stock-yes big-stock">В наличии: ${item.quantity} шт.</p>`;
  } else {
    stockDiv.innerHTML = `
      <div class="out-of-stock-banner">Товар временно отсутствует</div>
      <p class="stock-no big-stock">Нет в наличии</p>
    `;
  }

  // Показ модалки
  document.getElementById('productModal').style.display = 'flex';
}

// Закрытие модалки
function closeModal() {
  document.getElementById('productModal').style.display = 'none';
}

// Закрытие по клику вне модалки
window.onclick = function(event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeModal();
  }
};

// Рендер карточек на главной
function renderProducts(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach(item => {
    const product = document.createElement('div');
    product.className = 'product';
    
    if (item.quantity === 0) {
      product.classList.add('out-of-stock');
    }

    product.onclick = () => openModal(item);

    product.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p class="${item.quantity > 0 ? 'stock-yes' : 'stock-no'}">
        ${item.quantity > 0 ? 'В наличии: ' + item.quantity + ' шт.' : 'Нет в наличии'}
      </p>
    `;

    container.appendChild(product);
  });
}

// Загрузка data.json
fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(data => {
    renderProducts(data.liquids, 'liquids-products');
    renderProducts(data.pods, 'pods-products');
  })
  .catch(error => {
    console.error('Ошибка загрузки data.json:', error);
  });