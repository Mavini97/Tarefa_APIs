const API_URL = "http://localhost:3000/products";
const productList = document.getElementById("product-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
const limit = 9; 

async function fetchProducts(page) {
  try {
    const res = await fetch(`${API_URL}?_limit=${limit}&_page=${page}`);
    const data = await res.json();

    const totalItems = res.headers.get("X-Total-Count");
    const totalPages = Math.ceil(totalItems / limit);

    renderProducts(data);
    updatePaginationInfo(page, totalPages);

    prevBtn.disabled = page === 1;
    nextBtn.disabled = page >= totalPages;

  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
  }
}

function renderProducts(products) {
  productList.innerHTML = ""; 

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="superior">
        <img src="${product.image}" alt="${product.name}" />
        <div class="topo">
          <div class="nota">
            <p>${product.rating.toFixed(1)}</p>
            <img src="/imgs/estrela.png" alt="estrela">
          </div>
          <div class="buttons">
            <a href="edit.html?id=${product.id}" class="edit-btn"><img src="/imgs/editar.png" alt="editar"></a>
            <a class="delete-btn" data-id="${product.id}"><img src="/imgs/excluir.png" alt="excluir"> </a>
          </div>
        </div>
      </div>  
      <div class="inferior">
        <div class="nome">
          <h3>${product.name}</h3>
          <h4>${product.category}</h4>
          <p id="descricao">${product.description}</p>
        </div>    
        <div class="preco">
          <p class="estoque" style="color: ${product.inStock ? 'black' : 'red'}">
            ${product.inStock ? 'Disponível' : 'Indisponível'}
          </p>
          <p>R$ ${product.price.toFixed(2)}</p>
        </div>
      </div> 
    `;

    productList.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = button.dataset.id;
      if (confirm("Tem certeza que deseja excluir este produto?")) {
        await deleteProduct(id);
        fetchProducts(currentPage);
      }
    });
  });
}

function updatePaginationInfo(page, totalPages) {
  currentPage = page;

  prevBtn.disabled = page === 1;
  nextBtn.disabled = page >= totalPages;

  pageInfo.innerHTML = '';

  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page" + (i === page ? " active" : "");
    btn.addEventListener("click", () => {
      if (currentPage !== i) {
        fetchProducts(i);
      }
    });
    pageInfo.appendChild(btn);
  }

  document.querySelector(".container").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function deleteProduct(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("Erro ao deletar:", err);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchProducts(currentPage - 1);
  }
});

nextBtn.addEventListener("click", () => {
  fetchProducts(currentPage + 1);
});

fetchProducts(currentPage);
