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

      temp.childNodes.forEach((nodo) => {
        const esAccent = nodo.nodeType === 1 && nodo.classList.contains('accent');
        const texto = nodo.textContent;
        const contenedor = esAccent ? document.createElement('span') : null;
        if (contenedor) contenedor.className = 'accent';

        const destino = contenedor || titulo;

        [...texto].forEach((caracter) => {
          const span = document.createElement('span');
          span.className = 'letra';
          span.style.animationDelay = delay + 's';
          span.textContent = caracter === ' ' ? '\u00A0' : caracter;
          if (caracter === ' ') span.style.width = '0.28em';
          destino.appendChild(span);
          delay += 0.025;
        });

        if (contenedor) titulo.appendChild(contenedor);
      });
    }

    animarTitulo();

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
