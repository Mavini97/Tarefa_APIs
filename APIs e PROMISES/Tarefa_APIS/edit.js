
const API_URL = "http://localhost:3000/products";

const form = document.getElementById("edit-form");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("ID não fornecido.");
  window.location.href = "index.html";
}


async function fetchProduct() {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const product = await res.json();


    form.name.value = product.name;
    form.price.value = product.price;
    form.image.value = product.image;
    form.category.value = product.category;
    form.description.value = product.description;
    form.rating.value = product.rating;
    form.inStock.checked = Boolean(product.inStock);
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
    alert("Erro ao carregar produto. Veja o console.");
    window.location.href = "index.html";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProduct = {
    name: form.name.value.trim(),
    price: parseFloat(form.price.value),
    image: form.image.value.trim(),
    category: form.category.value.trim(),
    description: form.description.value.trim(),
    rating: parseFloat(form.rating.value),
    inStock: form.inStock.checked
  };

  if (!updatedProduct.name) {
    alert("O nome da peça é obrigatório.");
    form.name.focus();
    return;
  }
  if (isNaN(updatedProduct.price) || updatedProduct.price < 0) {
    alert("Preço deve ser um número ≥ 0.");
    form.price.focus();
    return;
  }
  if (isNaN(updatedProduct.rating) || updatedProduct.rating < 0 || updatedProduct.rating > 5) {
    alert("Avaliação deve ser entre 0 e 5.");
    form.rating.focus();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct)
    });

    if (res.ok) {
      window.location.href = "index.html";
    } else {
      const dados = await res.json().catch(() => null);
      console.error("Erro ao atualizar produto:", res.status, dados);
      alert(`Erro ao atualizar produto. HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Falha na requisição de atualização.");
  }
});

fetchProduct();

