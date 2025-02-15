
//buscador
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector(".search-button");
    const searchInput = document.querySelector(".search-input");

    searchButton.addEventListener("click", function () {
        searchInput.classList.toggle("active"); // Alternar la visibilidad
        if (searchInput.classList.contains("active")) {
            searchInput.focus(); // Poner el cursor en el input
        }
    });
});

// menu
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu-toggle");
    const menuMobile = document.getElementById("menu-mobile");

    menuButton.addEventListener("click", function () {
        menuMobile.classList.toggle("mostrar");
    });

    // Cerrar menú si se hace clic fuera de él
    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !menuMobile.contains(event.target)) {
            menuMobile.classList.remove("mostrar");
        }
    });
});

function scrollLeft(id) {
    document.getElementById(id).scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight(id) {
    document.getElementById(id).scrollBy({ left: 300, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const carritoContador = document.getElementById("carrito-contador");
    const carritoDiv = document.getElementById("productos-carrito");
    const totalDiv = document.getElementById("total");
    const finalizarCompraBtn = document.getElementById("finalizar-compra");
    const botonesCarrito = document.querySelectorAll(".agregar-carrito");

    // ✅ Función para actualizar el contador del carrito en el ícono del nav
    function actualizarContadorCarrito() {
        const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalCantidad = productosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
        carritoContador.textContent = totalCantidad;
        carritoContador.style.display = totalCantidad > 0 ? "inline-block" : "none";
    }

 // ✅ Función para mostrar los productos en la página de carrito
function mostrarCarrito() {
    const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoDiv.innerHTML = ""; // Limpiar el carrito antes de actualizar
    let total = 0;

    if (productosCarrito.length === 0) {
        carritoDiv.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        productosCarrito.forEach((producto, index) => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto-carrito");
            productoDiv.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Color: ${producto.color}</p>
                <p>Talle: ${producto.talle}</p>
                <p>Precio: ${producto.precio} x ${producto.cantidad} = $${(parseFloat(producto.precio.replace("$", "").replace(",", ".")) * producto.cantidad).toFixed(2)}</p>
                <button class="eliminar-producto" data-index="${index}">Eliminar</button>
            `;
            carritoDiv.appendChild(productoDiv);

            // Sumar precio total
            total += parseFloat(producto.precio.replace("$", "").replace(",", ".")) * producto.cantidad;
        });

        totalDiv.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    }

    actualizarContadorCarrito();
}

// ✅ Función para agregar productos al carrito
botonesCarrito.forEach((boton) => {
    boton.addEventListener("click", function () {
        const productoElemento = this.closest(".producto");
        const productoNombre = productoElemento.querySelector("h3").textContent;
        const colorSelector = productoElemento.querySelector("select[id^='color']");
        const talleSelector = productoElemento.querySelector("select[id^='talle']");
        const precio = productoElemento.querySelector("p").textContent;

        const colorSeleccionado = colorSelector ? colorSelector.value : "No especificado";
        const talleSeleccionado = talleSelector ? talleSelector.value : "No especificado";

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Verificar si el producto ya está en el carrito
        let productoExistente = carrito.find((p) => p.nombre === productoNombre && p.color === colorSeleccionado && p.talle === talleSeleccionado);

        if (productoExistente) {
            // Si ya está en el carrito, aumentar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no está en el carrito, agregarlo con cantidad 1
            carrito.push({
                nombre: productoNombre,
                color: colorSeleccionado,
                talle: talleSeleccionado,
                precio: precio,
                cantidad: 1,
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));

        actualizarContadorCarrito();
        mostrarCarrito();
    });
});

// ✅ Función para eliminar productos del carrito
carritoDiv.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar-producto")) {
        const index = event.target.getAttribute("data-index");
        let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        productosCarrito.splice(index, 1); // Eliminar el producto seleccionado
        localStorage.setItem("carrito", JSON.stringify(productosCarrito));
        mostrarCarrito();
    }
});

// ✅ Evento para finalizar la compra
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener("click", () => {
        datosClienteContainer.classList.remove("hidden");
    });
}

// ✅ Validación de datos personales
function validarCampos() {
    if (nombre.value.trim() !== "" && direccion.value.trim() !== "" && telefono.value.trim() !== "") {
        btnSiguiente.disabled = false;
    } else {
        btnSiguiente.disabled = true;
    }
}

nombre.addEventListener("input", validarCampos);
direccion.addEventListener("input", validarCampos);
telefono.addEventListener("input", validarCampos);

btnSiguiente.addEventListener("click", () => {
    pagoContainer.classList.remove("hidden");
});

metodoPago.addEventListener("change", () => {
    tarjetaContainer.classList.add("hidden");
    transferenciaContainer.classList.add("hidden");

    if (metodoPago.value === "credito" || metodoPago.value === "debito") {
        tarjetaContainer.classList.remove("hidden");
    } else if (metodoPago.value === "transferencia") {
        transferenciaContainer.classList.remove("hidden");
    } else if (metodoPago.value === "mercadoPago") {
        window.location.href = "https://www.mercadopago.com.ar/";
    }
});

// ✅ Validar datos de la tarjeta antes de habilitar el botón de pago
function validarTarjeta() {
    if (numeroTarjeta.value.trim() !== "" && vencimiento.value.trim() !== "" && cvv.value.trim() !== "") {
        btnProcesarPago.disabled = false;
    } else {
        btnProcesarPago.disabled = true;
    }
}

numeroTarjeta.addEventListener("input", validarTarjeta);
vencimiento.addEventListener("input", validarTarjeta);
cvv.addEventListener("input", validarTarjeta);

btnProcesarPago.addEventListener("click", () => {
    alert("Pago procesado correctamente.");
    localStorage.removeItem("carrito"); // Vaciar carrito después del pago
    mostrarCarrito();
});

// ✅ Cargar carrito y contador al iniciar
actualizarContadorCarrito();
mostrarCarrito();
});

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'TU_API_KEY'; // Reemplaza con tu API Key real
    const apiUrl = 'https://api.correoargentino.com.ar/paq-ar/cotizar';

    function esMarDelPlata(direccion) {
        return direccion.toLowerCase().includes("mar del plata");
    }

    async function calcularCostoEnvio(codigoPostalDestino, tipoEnvio) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    "cp_origen": "7600",  // Código postal de tu tienda
                    "cp_destino": codigoPostalDestino,
                    "peso": 1,            // Peso del paquete en kg
                    "alto": 10,           // Alto en cm
                    "largo": 20,          // Largo en cm
                    "ancho": 15,          // Ancho en cm
                    "tipo_envio": tipoEnvio // "domicilio" o "sucursal"
                })
            });

            const data = await response.json();
            return data.costo || 0;
        } catch (error) {
            console.error("Error al obtener el costo de envío:", error);
            return null;
        }
    }

    document.getElementById("btnSiguiente").addEventListener("click", async () => {
        const direccionIngresada = document.getElementById("direccion").value.trim();
        const codigoPostal = document.getElementById("codigoPostal").value.trim();
        const tipoEnvio = document.querySelector('input[name="tipoEnvio"]:checked').value; // Domicilio o sucursal

        if (direccionIngresada === "" || codigoPostal === "") {
            alert("Por favor, ingrese una dirección y código postal válidos.");
            return;
        }

        let costoEnvio = 0;
        if (esMarDelPlata(direccionIngresada)) {
            alert("El envío dentro de Mar del Plata es gratuito.");
        } else {
            costoEnvio = await calcularCostoEnvio(codigoPostal, tipoEnvio);
            if (costoEnvio === null) {
                alert("No se pudo calcular el costo de envío. Intente más tarde.");
                return;
            }
            alert(`El costo de envío a ${direccionIngresada} (${codigoPostal}) es de $${costoEnvio}.`);
        }

        const totalDiv = document.getElementById("total");
        let totalActual = parseFloat(totalDiv.textContent.replace("Total: $", "")) || 0;
        let totalFinal = totalActual + costoEnvio;
        totalDiv.innerHTML = `<strong>Total: $${totalFinal.toFixed(2)}</strong>`;

        document.getElementById("pagoContainer").classList.remove("hidden");
    });
});

function mostrarProductos(categoria) {
    var productosDiv = document.getElementById('productos' + categoria);
    var botonVerMas = document.querySelector('#' + categoria + ' .ver-mas');
  
    if (productosDiv.style.display === 'none') {
      productosDiv.style.display = 'flex';  // Cambiar a 'flex' para mantener la alineación
      botonVerMas.textContent = 'Ver menos'; // Cambiar texto del botón
    } else {
      productosDiv.style.display = 'none';
      botonVerMas.textContent = 'Ver más'; // Volver al texto original del botón
    }
  }