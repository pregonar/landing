jQuery(document).ready(function() {

	/* How to Handle Hashtags */
	jQuery(window).hashchange(function(){
		var hash = location.hash;
		jQuery('a[href='+hash+']').trigger('click');
	});
	jQuery('section.content.hide').hide();
	/* Main Navigation Clicks */
	jQuery('.main-nav ul li a').click(function() {
		var link = jQuery(this).attr('href').substr(1);
		
		if ( !jQuery('section.content.show, section#' + link).is(':animated') ) {
			jQuery('.main-nav ul li a').removeClass('active'); //remove active
			jQuery('section.content.show').addClass('show').animate({'opacity' : 0}, {queue: false, duration: 1000,
				complete: function() {
					jQuery('section.content.show').hide();
					jQuery('a[href="#'+link+'"]').addClass('active'); // add active
					jQuery('section#' + link).show();
					jQuery('section#' + link).addClass('show').animate({'opacity' : 1}, {queue: false, duration: 1000});	
				}
			});
		}
	});

});

// URL de la API de países
const urlAPI = "https://restcountries.com/v3.1/all";

// Función para ordenar países
function ordenarPaises(a, b) {
  if (a.name.common === "Honduras") {
    return -1;
  } else if (b.name.common === "Honduras") {
    return 1;
  } else {
    return a.name.common.localeCompare(b.name.common);
  }
}

// Función para enviar datos
async function enviarDatos() {
  // Obtener datos del formulario
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const pais = document.getElementById("pais").value;
  const genero = document.getElementById("genero").value;

  // Crear objeto con datos
  const datos = {
    nombre,
    correo,
    pais,
    genero,
  };

  

  // Enviar datos a Google Sheets
  await enviarAHojaDeCalculo(datos);

  // Enviar datos a correo electrónico
  await enviarCorreoElectronico(datos);

  // Mostrar mensaje de éxito
  alert("¡Su mensaje ha sido enviado!");

  // Prevenir recarga de la página
  event.preventDefault();
}

// Función para enviar datos a Google Sheets
async function enviarAHojaDeCalculo(datos) {
  // ID de la hoja de cálculo de Google Sheets
  const idHojaDeCalculo = "1wwmI6GzCTuz7qads2qZl89WE5Lk4KHuNTVcDZNhVebE";

  // URL del script de Google Apps Script
  const urlScript = "https://docs.google.com/spreadsheets/d/1wwmI6GzCTuz7qads2qZl89WE5Lk4KHuNTVcDZNhVebE";

  // Enviar datos al script mediante una solicitud POST
  await fetch(urlScript, {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

// Función para enviar datos a correo electrónico
async function enviarCorreoElectronico(datos) {
  // Dirección de correo electrónico de destino
  const correoDestino = "sports2todo@gmail.com";

  // Asunto del correo electrónico
  const asunto = "Nuevo mensaje desde el formulario de contacto";

  // Plantilla del mensaje
  const mensaje = `
    **Nombre:** ${datos.nombre}
    **Correo electrónico:** ${datos.correo}
    **País:** ${datos.pais}
    **Género:** ${datos.genero}
  `;

  // API de correo electrónico gratuita (reemplazar con la API que elijas)
  const API_KEY = "33BKh0ve42PL6uUfr";
  const URL_API = "https://api.emailjs.com/api/v1.0/email/send";

  // Enviar correo electrónico mediante la API
  await fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "service_h3lipng",
      template_id: "template_np6ej6k",
      user_id: API_KEY,
      to: correoDestino,
      from: "noreply@pregonar.com",
      subject: asunto,
      message: mensaje,
    }),
  });
}

// Cargar lista de países al cargar la página
window.onload = () => {
  fetch(urlAPI)
    .then((response) => response.json())
    .then((data) => {
      // Ordenar países
      data.sort(ordenarPaises);

      // Recorrer la lista de países y añadirlos al select
      for (const pais of data) {
        const option = document.createElement("option");
        option.value = pais.cca2;
        option.textContent = pais.name.common;
        document.getElementById("pais").appendChild(option);
      }

      // Seleccionar Honduras por defecto
      document.getElementById("pais").value = "HN";

    
    });
};