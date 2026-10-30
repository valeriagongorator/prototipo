// Datos simulados del Piloto con 4 emprendedores de Pasto
const emprendedores = [
    {
        id: 1,
        nombre: "Taller Artesanal Mopa-Mopa Don José",
        categoria: "Artesanías",
        ubicacion: "Barrio San Juan, Comuna 1, Pasto",
        lat: 1.2136,
        lng: -77.2811,
        historia: "Maestro artesano con más de 35 años preservando la técnica ancestral del Barniz de Pasto (Mopa-Mopa).",
        productos: ["Caja Decorada Barniz - $85.000", "Plato de Pared Tallado - $120.000"],
        whatsapp: "573135281338",
        imagen: "assets/mopa-mopa.svg"
    },
    {
        id: 2,
        nombre: "Sabores de mi Tierra - Doña María",
        categoria: "Gastronomía",
        ubicacion: "Corregimiento de Catambuco, Pasto",
        lat: 1.1680,
        lng: -77.2880,
        historia: "Cocinera tradicional dedicada a la preparación de cuy asado, empanadas de añejo y champús.",
        productos: ["Plato de Cuy Tradicional - $45.000", "Empanadas de Añejo (Docena) - $18.000"],
        whatsapp: "573135281338",
        imagen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80"
    },
    {
        id: 3,
        nombre: "AgroAsociación Café y Sabores de Genoy",
        categoria: "Agroindustria",
        ubicacion: "Corregimiento de Genoy, Pasto",
        lat: 1.2550,
        lng: -77.3050,
        historia: "Colectivo campesino de producción de café especial de altura y mermeladas de frutas autóctonas.",
        productos: ["Café Especial Genoy (500g) - $24.000", "Mermelada de Uvilla - $12.000"],
        whatsapp: "573135281338",
        imagen: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80"
    },
    {
        id: 4,
        nombre: "Tejidos Ancestrales Guanga",
        categoria: "Artesanías",
        ubicacion: "Corregimiento de Obonuco, Pasto",
        lat: 1.2010,
        lng: -77.2950,
        historia: "Asociación de mujeres tejedoras en guanga preservando simbología indígena en lana de oveja.",
        productos: ["Ruana de Lana Virgen - $150.000", "Bufanda Artesanal - $40.000"],
        whatsapp: "573135281338",
        imagen: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=500&q=80"
    }
];

let map = null;
let markers = [];
let categoriaActiva = "todas";

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderGrid(emprendedores);
    initMap();
});

// Renderizar tarjetas
function renderGrid(items) {
    const grid = document.getElementById("gridEmprendimientos");
    if (!items.length) {
        grid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-magnifying-glass"></i><h3>No encontramos resultados</h3><p>Prueba con otro nombre, producto o ubicación.</p></div>';
        return;
    }
    grid.innerHTML = "";
    items.forEach(emp => {
        grid.innerHTML += `
            <div class="card-item">
                <img src="${emp.imagen}" alt="${emp.nombre}" class="card-img">
                <div class="card-body">
                    <span class="card-tag">${emp.categoria}</span>
                    <h3 class="card-title">${emp.nombre}</h3>
                    <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${emp.ubicacion}</p>
                    <button class="btn-wa" onclick="abrirModal(${emp.id})">
                        <i class="fa-solid fa-eye"></i> Ver Detalle y Contactar
                    </button>
                </div>
            </div>
        `;
    });
}

// Inicializar Mapa con Leaflet en Pasto
function initMap() {
    map = L.map('map').setView([1.2136, -77.2811], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    emprendedores.forEach(emp => {
        const marker = L.marker([emp.lat, emp.lng]).addTo(map);
        marker.bindPopup(`
            <strong>${emp.nombre}</strong><br>
            ${emp.categoria} - ${emp.ubicacion}<br><br>
            <a href="https://wa.me/${emp.whatsapp}?text=Hola,%20vi%20su%20negocio%20en%20Red%20Emprende%20Pasto" target="_blank" style="color:green;font-weight:bold;">Contactar por WhatsApp</a>
        `);
        markers.push(marker);
    });
}

// Cambiar pestañas
function switchTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    button.classList.add('active');

    if (tabId === 'mapa' && map) {
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// Modal Ficha Comercial
function abrirModal(id) {
    const emp = emprendedores.find(e => e.id === id);
    const modal = document.getElementById("modalEmprendedor");
    const body = document.getElementById("modalBody");

    body.innerHTML = `
        <h2 style="color:#003366;">${emp.nombre}</h2>
        <p style="color:#666;margin-bottom:10px;"><i class="fa-solid fa-location-dot"></i> ${emp.ubicacion}</p>
        <p style="margin-bottom:15px;">${emp.historia}</p>
        <h4 style="margin-bottom:8px;">Catálogo de Productos (Sin Comisiones):</h4>
        <ul style="margin-bottom:15px;padding-left:20px;">
            ${emp.productos.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <a href="https://wa.me/${emp.whatsapp}?text=Hola,%20vi%20su%20producto%20en%20Red%20Emprende%20Pasto%20y%20deseo%20comprar" target="_blank" class="btn-wa">
            <i class="fa-brands fa-whatsapp"></i> Hablar Directo por WhatsApp
        </a>
    `;
    modal.style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalEmprendedor").style.display = "none";
}

// Filtros
function filtrarCategoria(cat, button) {
    document.querySelectorAll('.cat-chip').forEach(el => el.classList.remove('active'));
    button.classList.add('active');
    categoriaActiva = cat;
    filtrarEmprendimientos();
}

function filtrarEmprendimientos() {
    const text = document.getElementById("searchInput").value.toLowerCase();
    const filtrados = emprendedores.filter(e => {
        const coincideCategoria = categoriaActiva === 'todas' || e.categoria === categoriaActiva;
        const contenido = [e.nombre, e.ubicacion, e.categoria, ...e.productos].join(' ').toLowerCase();
        return coincideCategoria && contenido.includes(text);
    });
    renderGrid(filtrados);
}

function verEnMapa(categoria) {
    const tab = document.querySelectorAll('.tab-btn')[1];
    switchTab('mapa', tab);
    if (map) {
        const normalizar = valor => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const objetivo = emprendedores.find(e => normalizar(e.categoria).includes(normalizar(categoria)));
        if (objetivo) setTimeout(() => map.setView([objetivo.lat, objetivo.lng], 12), 220);
    }
}

// Asistencia en Audio para adultos mayores
function reproducirAudioGuia() {
    const texto = "Bienvenido a Red Emprende Pasto. Aquí puede encontrar artesanías y comida típica de Pasto. Para comprar, toque el botón verde de WhatsApp y hablará directamente con el artesano sin pagar comisiones.";
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-CO";
    synth.speak(utterance);
}
