const socket = io();

socket.on("products", (data) => {

    renderProducts(data);
})

const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.classList.add("productsContainer");
    containerProducts.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cardProducto");
        card.innerHTML = `
                        <div class="cardContent">
                            <p>ID: ${item.id}</p>
                            <p class="cardTitle">Título: ${item.title}</p>
                            <img src="${item.img}" alt="${item.title}" class="cardImg">
                            <p class="cardDescription">Descripción: ${item.description}</p>
                            <p class="cardPrice">Precio: ${item.price}</p>
                            <div class="cardFooter">
                                <p class="cardStock">Stock: ${item.stock}</p>
                                <p class="cardCategory">Categoría: ${item.category}</p>
                            </div>
                        </div>
                        <button class="cardButton"> Eliminar </button>
                        `

        containerProducts.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("deleteProduct", id);
}

//AGREGAR PRODUCTO
document.getElementById("addProductForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    };

    socket.emit("addProduct", newProduct);

    document.getElementById("addProductForm").reset();
});

socket.on("products", (data) => {
    renderProducts(data);
});
