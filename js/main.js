    const titulo = document.getElementById('titulo');

function animarTituloElemento(elemento) {
  if (!elemento.dataset.original) {
    elemento.dataset.original = elemento.innerHTML;
  }
  const temp = document.createElement("div");
  temp.innerHTML = elemento.dataset.original;
  elemento.innerHTML = "";
  let delay = 0;

  function crearLetra(caracter) {
    const span = document.createElement("span");
    span.className = "letra";
    span.style.animationDelay = delay + "s";
    span.textContent = caracter;
    delay += 0.025;
    return span;
  }

  temp.childNodes.forEach((nodo) => {
    const esAccent =
      nodo.nodeType === 1 &&
      nodo.classList &&
      nodo.classList.contains("accent");
    const texto = nodo.textContent;
    const destinoFinal = esAccent ? document.createElement("span") : elemento;
    if (esAccent) destinoFinal.className = "accent";

    const palabras = texto.split(" ");
    palabras.forEach((palabra, indice) => {
      if (palabra.length > 0) {
        const contenedorPalabra = document.createElement("span");
        contenedorPalabra.className = "palabra";
        [...palabra].forEach((caracter) =>
          contenedorPalabra.appendChild(crearLetra(caracter)),
        );
        destinoFinal.appendChild(contenedorPalabra);
      }
      if (indice < palabras.length - 1) {
        destinoFinal.appendChild(crearLetra("\u00A0"));
        delay -= 0.025;
      }
    });

    if (esAccent) elemento.appendChild(destinoFinal);
  });
}

// El hero se anima apenas carga la página, como siempre
animarTituloElemento(titulo);

// Los h2 de cada sección se animan recién cuando entran en pantalla al scrollear
const titulosSeccion = document.querySelectorAll(".servicios-titulo h2");
const observadorTitulos = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        animarTituloElemento(entrada.target);
        observadorTitulos.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.3 },
);

titulosSeccion.forEach((h2) => observadorTitulos.observe(h2));

    // --- Menú hamburguesa (mobile) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navEl = document.querySelector('header nav');

    if (menuToggle && navEl) {
      menuToggle.addEventListener('click', () => {
        const abierto = navEl.classList.toggle('abierto');
        menuToggle.classList.toggle('activo', abierto);
        menuToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      });

      // Cerrar el menú al elegir una sección
      navEl.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navEl.classList.remove('abierto');
          menuToggle.classList.remove('activo');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // --- Envío del formulario de contacto (Netlify Forms, sin recargar la página) ---
    const formContacto = document.getElementById('formContacto');

    if (formContacto) {
      formContacto.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const datos = new FormData(formContacto);

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(datos).toString(),
        })
          .then((respuesta) => {
            if (!respuesta.ok) {
              throw new Error('Respuesta no exitosa: ' + respuesta.status);
            }
            formContacto.innerHTML = `
              <div class="form-exito">
                <strong>¡Gracias por escribir!</strong>
                <span>Tu consulta se envió correctamente. Te voy a responder a la brevedad.</span>
              </div>
            `;
          })
          .catch((error) => {
            console.error('Error al enviar el formulario:', error);
            alert('Hubo un problema al enviar el formulario. Probá de nuevo o escribime directo a mbguantay@gmail.com');
          });
      });
    }

    // --- Animación de aparición + conectores calculados entre los pasos del proceso ---
    const pasos = document.querySelectorAll('.proceso-paso');
    const track = document.querySelector('.proceso-track');

    function dibujarConectores() {
      if (!track) return;
      track.querySelectorAll('.proceso-conector').forEach((el) => el.remove());

      const listaPasos = [...pasos];
      const rectTrack = track.getBoundingClientRect();

      for (let i = 0; i < listaPasos.length - 1; i++) {
        const r1 = listaPasos[i].getBoundingClientRect();
        const r2 = listaPasos[i + 1].getBoundingClientRect();

        const x1 = r1.left + r1.width / 2 - rectTrack.left;
        const y1 = r1.top + r1.height / 2 - rectTrack.top;
        const x2 = r2.left + r2.width / 2 - rectTrack.left;
        const y2 = r2.top + r2.height / 2 - rectTrack.top;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        const angulo = Math.atan2(dy, dx);
        const radio = r1.width / 2;
        const largoVisible = Math.max(distancia - radio * 2, 0);

        const inicioX = x1 + Math.cos(angulo) * radio;
        const inicioY = y1 + Math.sin(angulo) * radio;

        const conector = document.createElement('div');
        conector.className = 'proceso-conector';
        conector.style.width = largoVisible + 'px';
        conector.style.left = inicioX + 'px';
        conector.style.top = inicioY + 'px';
        conector.style.transform = `rotate(${angulo}rad)`;
        track.appendChild(conector);
      }
    }

    if (pasos.length) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.35 });

      pasos.forEach((paso) => {
        observador.observe(paso);
        paso.addEventListener('transitionend', dibujarConectores);
      });

      window.addEventListener('load', dibujarConectores);
      window.addEventListener('resize', dibujarConectores);
      dibujarConectores();
    }

    const titulosH3 = document.querySelectorAll(
      ".servicio-card h3, .proyecto-body h3, .credenciales-izq h3, .contacto-izq h3",
    );
    titulosH3.forEach((h3) => h3.classList.add("reveal"));

    const observadorH3 = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observadorH3.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    titulosH3.forEach((h3) => observadorH3.observe(h3));
