document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Escuchar eventos de productos
    socket.on("productos", (data) => {
        renderProductos(data);
    });

    // Renderizar productos en el contenedor
    const renderProductos = (data) => {
        const contenedorProductos = document.getElementById("contenedorProductos");
        if (contenedorProductos) {
            contenedorProductos.innerHTML = "";

            data.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("product-card");

                card.innerHTML = `<p class="product-id">ID: ${item.id}</p>
                                    <p class="product-title">Título: ${item.title}</p>
                                    <p class="product-description">Descripción: ${item.description}</p>
                                    <p class="product-price">Precio: $${item.price}</p>
                                    <p class="product-thumbnails">Imagen: ${item.thumbnails}</p>
                                    <p class="product-code">Código: ${item.code}</p>
                                    <p class="product-stock">Stock: ${item.stock}</p>
                                    <p class="product-category">Categoría: ${item.category}</p>
                                    <p class="product-status">Estado: ${item.status ? 'Disponible' : 'No Disponible'}</p>
                                    <button class="delete-button">Eliminar ❌</button>
                                    `;
                contenedorProductos.appendChild(card);

                const eliminarButton = card.querySelector(".delete-button");
                if (eliminarButton) {
                    eliminarButton.addEventListener("click", () => {
                        eliminarProducto(item.id);
                    });
                }
            });
        } else {
            console.error("El contenedor de productos no se encontró en el DOM");
        }
    };

    // Función para eliminar un producto
    const eliminarProducto = (id) => {
        socket.emit("eliminarProducto", id);
    };

    // Agregar un producto mediante el formulario
    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", () => {
            agregarProducto();
        });
    } else {
        console.error("El botón de enviar no se encontró en el DOM");
    }

    const agregarProducto = () => {
        const producto = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            thumbnails: document.getElementById("thumbnails").value,
            code: document.getElementById("code").value,
            stock: document.getElementById("stock").value,
            category: document.getElementById("category").value,
            status: document.getElementById("status").value === "true",
        };

        socket.emit("agregarProducto", producto);

        // Limpiar los campos del formulario después de enviar el producto
        document.getElementById("title").value = '';
        document.getElementById("description").value = '';
        document.getElementById("price").value = '';
        document.getElementById("thumbnails").value = 'Sin Imagen';
        document.getElementById("code").value = '';
        document.getElementById("stock").value = '';
        document.getElementById("category").value = '';
        document.getElementById("status").value = 'true';
    };
});
