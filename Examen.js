class RelativeTime extends HTMLElement {
  constructor() {
      super();
  }
  connectedCallback() {
      this.render()

      setInterval(() => {
          this.render()
      }, 1000)
  }

  static get observedAttributes() {
      return ['time']
  }

  attributeChangedCallback(name, oldValue, newValue) {
      this.render();
  }

  render() {
      const time = new Date(this.getAttribute('time')).getTime();
      const now = Date.now();

      const diff = now - time;
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

      let aux = '...';

      if (years >= 1)
          aux = `Hace ${years} año${years > 1 ? 's' : ''}`
      else if (months >= 1)
          aux = `Hace ${months} mes${months > 1 ? 'es' : ''}`
      else if (weeks >= 1)
          aux = `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
      else if (days >= 1)
          aux = `Hace ${days} día${days > 1 ? 's' : ''}`
      else if (hours >= 1)
          aux = `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      else if (minutes >= 1)
          aux = `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      else if (seconds >= 1)
          aux = `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`
      this.textContent = aux;


  }
}
customElements.define('relative-time', RelativeTime);

class ProductsViewer extends HTMLElement {
  constructor() {
    super();
    this.cart = []; // Inicializamos un carrito vacío
  }

  connectedCallback() {
    this.loadArticles();
  }

  categoria() {
    const pagina = window.location.pathname.split('/').pop();

    
    const categorias = {
        return: 'https://products-foniuhqsba-uc.a.run.app/TVs',
       
        
    };

    
   
}

  async loadArticles() {
    try {
      const url = this.categoria();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los artículos');
      }
      const articles = await response.json();
      this.renderArticles(articles);
    } catch (error) {
      console.error('Error:', error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }

  renderArticles(articles) {
    const template = document.getElementById('article-template');

    // Limpiar contenido existente
    this.innerHTML = '';

    articles.forEach(article => {
      // Clonar el contenido de la plantilla
      const articleContent = document.importNode(template.content, true);

      // Rellenar la plantilla con los datos del artículo
      articleContent.querySelector('.link').href = `./producto.html?id=${article.id}`;
      articleContent.querySelector('.imagenP').src = article.image;
      articleContent.querySelector('.title').textContent = article.title;
      articleContent.querySelector('.precio').textContent = `${article.price}`;
      articleContent.querySelector('.rating').textContent = `${article.rating}`;

      // Configurar el botón "Comprar"
      const comprarButton = articleContent.querySelector('.comprar');
      comprarButton.addEventListener('click', () => this.addToCart(article));

      // Actualizar el popover con las etiquetas del producto
      const tagsContainer = document.querySelector("#popover_1");

      // Limpiar cualquier contenido inicial
      tagsContainer.innerHTML = "";

      // Crear elementos <li> dinámicamente para las etiquetas
      article.tags.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = tag; // Asignar el texto del tag
        tagsContainer.appendChild(li);
      });

      // Añadir el artículo al componente
      this.appendChild(articleContent);
    });
  }

  addToCart(article) {
    // Verificar si el producto ya está en el carrito
    const existingItem = this.cart.find(item => item.id === article.id);
    if (existingItem) {
      existingItem.quantity++; // Incrementar cantidad si ya existe
    } else {
      this.cart.push({ ...article, quantity: 1 }); // Agregar nuevo producto
    }

    this.updateCartPopover();
  }

  updateCartPopover() {
    const cartPopover = document.querySelector("#popover_3");
    cartPopover.innerHTML = ""; // Limpiar el contenido actual del carrito

    if (this.cart.length === 0) {
      cartPopover.innerHTML = "<li>El carrito está vacío</li>";
      return;
    }
    let total = 0;

    this.cart.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = ` 
      <img src="${item.image}" alt="${item.title}" class="cart-image">
      <div class="product-info">
        <span>${item.title}</span><br>
        <span>${item.price}</span>
      </div>
      
      <button class="remove" data-id="${item.id}">Eliminar</button>
      <button class="buy" data-id="${item.id}">Comprar</button>
      
    `;
      cartPopover.appendChild(li);
       // Acumular el precio de cada producto en el total
       total += parseFloat(item.price);
      // Configurar el botón para eliminar un producto
      li.querySelector('.remove').addEventListener('click', () => this.removeFromCart(item.id));
      li.querySelector('.buy').addEventListener('click', () => this.buyfromCart(item.id));
    });
    const totalElement = document.createElement("li");
    totalElement.innerHTML = `Total: <strong>${total.toFixed(2)} €</strong>`;
    cartPopover.appendChild(totalElement);
  }

  removeFromCart(id) {
    // Eliminar el producto del carrito
    this.cart = this.cart.filter(item => item.id !== id);
    this.updateCartPopover();
  }
  buyfromCart(id) {
    // Comprar el producto del carrito
    const item = this.cart.find(item => item.id === id); // Encontrar el producto en el carrito
  if (item) {
    alert(`Has comprado el producto: ${item.title}`);
    // Eliminar el producto del carrito después de la compra
    this.cart = this.cart.filter(item => item.id !== id);
    this.updateCartPopover();
    
  }
  }
}

// Definir el elemento personalizado
customElements.define('product-viewer', ProductsViewer);

const getId = () => {
  const searchParams = new URLSearchParams(location.search.slice(1));
  return Number(searchParams.get('id'));
}

class CustomArticle extends HTMLElement {
  constructor() {
    super()
    this.id = getId();
    console.log({ id: this.id });
  }

  connectedCallback() {
    this.render();
  }

  async loadArticles() {
    try {
      const response = await fetch('https://products-foniuhqsba-uc.a.run.app/TVs');
      if (!response.ok) throw new Error('Error al cargar los artículos');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      return [];
    }
  }

  async render() {
    // 1. API get All Articles
    const articles = await this.loadArticles();
    console.log({ articles });
    // 2. Filtrar el artículo por id
    const article = articles.find(article => article.id == this.id);
    console.log({ article });

    // 3. Rellenar el HTML con los datos del artículo
    this.querySelector('.title').textContent = article.title;
    this.querySelector('.price').textContent = article.price;
    this.querySelector('.imagen').src = article.image;
    this.querySelector('.description').textContent = article.description;
    

    function formatFeatures(features) { // Función para dar formato a las características
      const formattedFeatures = features.map((feature) => {
        return `
          <div class="feature-item">
            <strong>${feature.type.replace('_', ' ').toUpperCase()}:</strong> ${feature.value}
          </div>
        `;
      });
      return formattedFeatures.join('');
    }
    

    this.querySelector('.features').innerHTML = formatFeatures(article.features);
    const tagsContainer = document.querySelector("#popover_2");

    // Limpiar cualquier contenido inicial
    tagsContainer.innerHTML = "";

    // Recorrer las etiquetas del producto y crear elementos <li> dinámicamente
    article.tags.forEach(tag => {
      const li = document.createElement("li"); // Crear elemento <li>
      li.textContent = tag; // Asignar el texto del tag
      tagsContainer.appendChild(li); // Agregar <li> a la lista <ul>
    });

    console.log('OK');
  }
}

customElements.define('custom-article', CustomArticle);

class CustomSearch extends HTMLElement {
  constructor() {
    super();
    this.articles = [];
  }

  connectedCallback() {
    const dialogBtn = this.querySelector('.dialog-search');
    const closeBtn = this.querySelector('.close-btn');
    const dialog = this.querySelector('dialog');
    dialogBtn.addEventListener('click', () => dialog.showModal());
    closeBtn.addEventListener('click', () => dialog.close());
    const siteSearch = this.querySelector('#site-search');
    siteSearch.addEventListener('input', (event) => this.search(event));

    // Cargar artículos antes de mostrar resultados
    this.loadArticles()
      .then(articles => {
        this.articles = articles;
        this.renderResults(''); // Mostrar todos al principio
      })
      .catch(error => console.error('Error al cargar artículos para la búsqueda:', error));
  }

  async loadArticles() {
    try {
      const response = await fetch('https://products-foniuhqsba-uc.a.run.app/TVs');
      if (!response.ok) throw new Error('Error al cargar los artículos');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      return [];
    }
  }

  search(event) {
    event.preventDefault();
    const term = event.target.value;
    this.renderResults(term);
  }

  renderResults(term = '') {
    const searchResults = this.querySelector('#search-results');
    searchResults.innerHTML = '';

    const filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(term.toLowerCase())
    );

    const template = this.querySelector('template').content;
    filteredArticles.forEach(article => {
      const li = template.cloneNode(true); // Clonar el contenido del template
      li.querySelector('.item-image').src = article.image;
      li.querySelector('.item-description').textContent = article.title;
      const titleLink = li.querySelector('.item-title a');
      titleLink.textContent = article.title;
      titleLink.href = `producto.html?id=${article.id}`;
      searchResults.appendChild(li);
    });
  }
}

customElements.define('custom-search', CustomSearch);

















