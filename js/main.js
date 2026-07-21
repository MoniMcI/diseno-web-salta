    const titulo = document.getElementById('titulo');

    function animarTitulo() {
      // Guarda el contenido real del H1 (el que ve Google) la primera vez, antes de reemplazarlo
      if (!titulo.dataset.original) {
        titulo.dataset.original = titulo.innerHTML;
      }

      const temp = document.createElement('div');
      temp.innerHTML = titulo.dataset.original;

      titulo.innerHTML = '';
      let delay = 0;

      function crearLetra(caracter) {
        const span = document.createElement('span');
        span.className = 'letra';
        span.style.animationDelay = delay + 's';
        span.textContent = caracter;
        delay += 0.025;
        return span;
      }

      temp.childNodes.forEach((nodo) => {
        const esAccent = nodo.nodeType === 1 && nodo.classList.contains('accent');
        const texto = nodo.textContent;
        const destinoFinal = esAccent ? document.createElement('span') : titulo;
        if (esAccent) destinoFinal.className = 'accent';

        // Separar en palabras, para que cada palabra quede agrupada y no se corte a mitad
        const palabras = texto.split(' ');

        palabras.forEach((palabra, indice) => {
          if (palabra.length > 0) {
            const contenedorPalabra = document.createElement('span');
            contenedorPalabra.className = 'palabra';
            [...palabra].forEach((caracter) => {
              contenedorPalabra.appendChild(crearLetra(caracter));
            });
            destinoFinal.appendChild(contenedorPalabra);
          }

          // Espacio entre palabras (no en la última)
          if (indice < palabras.length - 1) {
            destinoFinal.appendChild(crearLetra('\u00A0'));
            delay -= 0.025; // el espacio no suma delay extra
          }
        });

        if (esAccent) titulo.appendChild(destinoFinal);
      });
    }

    animarTitulo();

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
