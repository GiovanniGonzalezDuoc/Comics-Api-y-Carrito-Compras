import { getPersonajes } from "./Peticiones/getPersonajes.js";

// Inicializar el carrito de compras
const carrito = [];

// Función para enviar datos del cómic seleccionado
const enviarDatos = (comic) => {
    const rutaArchivoHTML = "../personaje.html";
    console.log(comic);
    fetch(rutaArchivoHTML)
        .then(response => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const imagePage = doc.getElementById("imagePage");
            imagePage.src = comic.imagen;

            const namePage = doc.getElementById("namePage");
            namePage.textContent = `Título: ${comic.nombre}`;

            const descriptionPage = doc.getElementById("descriptionPage");
            comic.descripcion === "" ? descriptionPage.textContent = `Sin descripción` : descriptionPage.textContent = `Descripción: ${comic.descripcion}`;

            const precioPage = doc.getElementById("precioPage");
            precioPage.textContent = `El Precio Del Comics es: ${comic.precio}`;

            const nuevoHtml = new XMLSerializer().serializeToString(doc);

            document.body.innerHTML = nuevoHtml;
        })
        .catch((error) => {
            console.log(`El error es: ${error}`);
        });
};

// Función para agregar un cómic al carrito
const agregarAlCarrito = (comic) => {
    if (comic.stock > 0) {
        const index = carrito.findIndex(item => item.id === comic.id);
        if (index !== -1) {
            carrito[index].cantidad++;
        } else {
            comic.cantidad = 1;
            carrito.push(comic);
        }
        comic.stock--;
        actualizarCarrito();
    } else {
        alert('¡Producto agotado!');
    }
};

// Función para eliminar un cómic del carrito
const eliminarDelCarrito = (index) => {
    const comic = carrito[index];
    comic.stock++;
    if (comic.cantidad > 1) {
        comic.cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    actualizarCarrito();
};

// Función para aumentar la cantidad de un cómic en el carrito
const aumentarCantidad = (index) => {
    const comic = carrito[index];
    if (comic.stock > 0) {
        comic.cantidad++;
        comic.stock--;
        actualizarCarrito();
    } else {
        alert('¡No hay suficiente stock!');
    }
};

// Función para disminuir la cantidad de un cómic en el carrito
const disminuirCantidad = (index) => {
    const comic = carrito[index];
    if (comic.cantidad > 1) {
        comic.cantidad--;
        comic.stock++;
        actualizarCarrito();
    }
};

// Función para actualizar el carrito en la interfaz
const actualizarCarrito = () => {
    const carritoElemento = document.getElementById('carrito');
    carritoElemento.innerHTML = '';

    carrito.forEach((comic, index) => {
        const li = document.createElement('li');
        li.textContent = `${comic.nombre} x${comic.cantidad} - $${comic.precio * comic.cantidad}`;

        const cantidadWrapper = document.createElement('div');
        cantidadWrapper.classList.add('cantidad-buttons');

        const cantidadLabel = document.createElement('span');
        cantidadLabel.classList.add('cantidad-label');
        cantidadLabel.textContent = 'Cantidad:';

        const btnAumentar = document.createElement('button');
        btnAumentar.textContent = '+';
        btnAumentar.addEventListener('click', () => aumentarCantidad(index));

        const btnDisminuir = document.createElement('button');
        btnDisminuir.textContent = '-';
        btnDisminuir.addEventListener('click', () => disminuirCantidad(index));

        cantidadWrapper.appendChild(cantidadLabel);
        cantidadWrapper.appendChild(btnDisminuir);
        cantidadWrapper.appendChild(btnAumentar);

        li.appendChild(cantidadWrapper);

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarDelCarrito(index));

        li.appendChild(botonEliminar);
        carritoElemento.appendChild(li);
    });
};


// Función para crear las tarjetas de los cómics
const crearCard = (comics = []) => {
    let comicsRow = document.getElementById("comicsRow");
    comics.forEach((comic) => {
        const divCol = document.createElement("div");
        divCol.classList.add("col-xl-3", "col-lg-3", "col-md-3", "col-sm-12", "col-xs-12", "mt-2", "mb-2");

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = comic.imagen;
        img.alt = `Imagen de ${comic.nombre}`;
        img.classList.add("card-img-top");

        const divBody = document.createElement("div");
        divBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = `Título: ${comic.nombre}`;

        const precio = document.createElement("p");
        precio.classList.add("card-text");
        precio.textContent = `El precio del cómic: ${comic.precio}`;

        const stock = document.createElement("p");
        stock.classList.add("card-text");
        stock.textContent = `Stock: ${comic.stock}`;

        const btnVer = document.createElement("button");
        btnVer.classList.add("btn", "btn-success");
        btnVer.textContent = "Ver Detalles";
        btnVer.addEventListener("click", () => enviarDatos(comic));

        const btnAgregar = document.createElement("button");
        btnAgregar.classList.add("btn", "btn-primary", "ml-2");
        btnAgregar.textContent = "Agregar al Carrito";
        btnAgregar.addEventListener("click", () => agregarAlCarrito(comic));

        divBody.appendChild(title);
        divBody.appendChild(precio);
        divBody.appendChild(stock);
        divBody.appendChild(btnVer);
        divBody.appendChild(btnAgregar);

        card.appendChild(img);
        card.appendChild(divBody);

        divCol.appendChild(card);

        comicsRow.appendChild(divCol);
    });
};

// Evento click para el botón "Pagar"
document.getElementById('btnPagar').addEventListener('click', () => {
    // Crear una cadena JSON con los datos del carrito
    const carritoJSON = JSON.stringify(carrito);
    
    // Codificar la cadena JSON para pasarla como parámetro en la URL
    const carritoCodificado = encodeURIComponent(carritoJSON);

    // Redireccionar a la página de pago con los detalles del carrito en la URL
    window.location.href = `pago.html?carrito=${carritoCodificado}`;
});


// Cargar los cómics y crear las tarjetas
getPersonajes()
    .then(data => crearCard(data))
    .catch(error => console.log(`El error es: ${error}`));
