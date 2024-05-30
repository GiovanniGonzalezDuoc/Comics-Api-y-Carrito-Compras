// Obtener el parámetro "carrito" de la URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const carritoCodificado = urlParams.get('carrito');

// Decodificar la cadena JSON del carrito
const carritoJSON = decodeURIComponent(carritoCodificado);
const carrito = JSON.parse(carritoJSON);

// Mostrar los detalles del carrito en la página de pago
const detallesCarritoElemento = document.getElementById('detallesCarrito');
detallesCarritoElemento.innerHTML = '';

function aumentarCantidad(producto) {
    if (producto.cantidad < producto.stock) { // Verificar si la cantidad es menor que el stock disponible
        producto.cantidad++;
        mostrarCarrito();
    } else {
        alert('¡No hay suficiente stock disponible!');
    }
}

function reducirCantidad(producto) {
    if (producto.cantidad > 1) {
        producto.cantidad--;
        mostrarCarrito();
    } else {
        // Si la cantidad es 1 y se presiona el botón de reducir, eliminar el producto del carrito
        const index = carrito.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            carrito.splice(index, 1);
            mostrarCarrito();
        }
    }
}

function mostrarCarrito() {
    detallesCarritoElemento.innerHTML = '';

    carrito.forEach((producto) => {
        const detalleProducto = document.createElement('div');
        detalleProducto.classList.add('producto');

        // Primer div con la imagen
        const divImagen = document.createElement('div');
        divImagen.classList.add('imagen-container');
        const imagenProducto = document.createElement('img');
        imagenProducto.src = producto.imagen;
        imagenProducto.alt = producto.nombre;
        divImagen.appendChild(imagenProducto);
        detalleProducto.appendChild(divImagen);

        // Segundo div con la información
        const divInformacion = document.createElement('div');
        divInformacion.classList.add('informacion-container');
        
        const nombreProducto = document.createElement('span');
        nombreProducto.textContent = producto.nombre;
        divInformacion.appendChild(nombreProducto);

        const cantidadProducto = document.createElement('span');
        cantidadProducto.textContent = `Cantidad: ${producto.cantidad}`;
        divInformacion.appendChild(cantidadProducto);

        const precioProducto = document.createElement('span');
        precioProducto.textContent = `Precio total: $${producto.precio * producto.cantidad}`;
        divInformacion.appendChild(precioProducto);

        const botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.classList.add('aumentar');
        botonAumentar.addEventListener('click', () => aumentarCantidad(producto));
        divInformacion.appendChild(botonAumentar);

        const botonReducir = document.createElement('button');
        botonReducir.textContent = '-';
        botonReducir.classList.add('reducir');
        botonReducir.addEventListener('click', () => reducirCantidad(producto));
        divInformacion.appendChild(botonReducir);

        detalleProducto.appendChild(divInformacion);

        detallesCarritoElemento.appendChild(detalleProducto);
    });
}

mostrarCarrito();

document.getElementById('btnPagar').addEventListener('click', function() {
    window.location.href = './pagar.html';
});
