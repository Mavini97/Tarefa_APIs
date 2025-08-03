const form = document.getElementById("add-form");
const API_URL = "http://localhost:3000/products";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProduct = {
    name: form.name.value.trim(),
    price: parseFloat(form.price.value),
    image: form.image.value.trim(),
    category: form.category.value.trim(),
    description: form.description.value.trim(),
    rating: parseFloat(form.rating.value),
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProduct)
    });

    if (res.ok) {
      window.location.href = "index.html";
    } else {
      alert("Erro ao adicionar o produto.");
    }
  } catch (err) {
    console.error("Erro:", err);
  }
});
