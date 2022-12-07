// Selección de elementos
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");

// Renderizar productos

const productsEl = document.getElementById("products");
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    
    data.forEach(element => {
          
      let div = document.createElement("div");
      productsEl.innerHTML += `
            <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src="${element.imgSrc}" alt="${element.nombre}">
                    </div>
                    <div class="desc">
                        <h2>${element.nombre}</h2>
                        <h2><small>$</small>${element.precio}</h2>
                        <p>
                            ${element.descripcion}
                        </p>
                    </div>
                    <div class="add-to-wishlist">
                        <img src="https://res.cloudinary.com/dldvgt3pe/image/upload/v1666769869/heart_ydpi0l.png" alt="add to wish list">
                    </div>
                    <div class="add-to-cart" onclick="agregarAlCarrito(${element.id})">
                        <img src="https://res.cloudinary.com/dldvgt3pe/image/upload/v1666769851/bag-plus_podsbe.png" alt="add to cart">
                    </div>
                </div>
            </div>
        `;
        productsEl.append(div);
      });
});

// Arreglo carrito
let carrito = JSON.parse(localStorage.getItem("CARRITO")) || [];
actualizarCarrito();

// Agregar al carrito
function agregarAlCarrito(id) {
  // verificación de elementos ya existentes en el carrito
  if (carrito.some((data) => data.id === id)) {
    actualizarUnidades("mas", id);
  } else {
    const item = productos.find((data) => data.id === id);

    carrito.push({
      ...item,
      numeroDeUnidades: 1,
    });
  }

  actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  renderizarItemsCarrito();
  renderizarSubtotal();

  // Guardar en el local storage
  localStorage.setItem("CARRITO", JSON.stringify(carrito));
}

// Calcular y renderizar el subtotal
function renderizarSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

    carrito.forEach((data) => {
    totalPrice += data.precio * data.numeroDeUnidades;
    totalItems += data.numeroDeUnidades;
  });

  subtotalEl.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(2)}`;
  totalItemsInCartEl.innerHTML = totalItems;
}

// Renderizar items del carrito
function renderizarItemsCarrito() {
  cartItemsEl.innerHTML = ""; // Eliminar algún elemento del carrito
  carrito.forEach((element) => {
    cartItemsEl.innerHTML += `
        <div class="cart-item">
            <div class="item-info" onclick="eliminarProductoDelCarrito(${element.id})">
                <img src="${element.imgSrc}" alt="${element.nombre}">
                <h4>${element.nombre}</h4>
            </div>
            <div class="unit-price">
                <small>$</small>${element.precio}
            </div>
            <div class="units">
                <div class="btn menos" onclick="actualizarUnidades('menos', ${element.id})">-</div>
                <div class="number">${element.numeroDeUnidades}</div>
                <div class="btn mas" onclick="actualizarUnidades('mas', ${element.id})">+</div>           
            </div>
        </div>
      `;
  });
}

// Eliminar elemento del carrito
function eliminarProductoDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);

  actualizarCarrito();
}

// Actualizar el numero de unidades en el
function actualizarUnidades(action, id) {
  carrito = carrito.map((element) => {
    let numeroDeUnidades = element.numeroDeUnidades;

    if (element.id === id) {
      if (action === "menos" && numeroDeUnidades > 1) {
        numeroDeUnidades--;
      } else if (action === "mas" && numeroDeUnidades < element.instock) {
        numeroDeUnidades++;
      }
    }

    return {
      ...element,
      numeroDeUnidades,
    };
  });

  actualizarCarrito();
}
