/*
================================================================================
Logica de interaccion para el juego de trivias. Sigue el mismo
patron que interaccion.js del quiz de reciclaje: maneja clics en opciones,
actualiza puntaje y progreso, deshabilita botones de una pregunta tras
responder, y muestra resultado final al completar todas las preguntas.
================================================================================
*/

// ================================================================
// VARIABLES GLOBALES DE ESTADO
// ================================================================

// Declaramos e inicializamos la variable 'puntaje' que almacenara la cantidad de respuestas correctas.
let puntaje = 0;

// Declaramos e inicializamos la variable 'respondidas' que almacenara cuantas preguntas se han respondido.
let respondidas = 0;

// ================================================================
// SELECCION DE ELEMENTOS DEL DOM
// ================================================================

// Seleccionamos todos los botones de opcion (clase "opcion").
// Devuelve una NodeList (similar a un array) con todos esos elementos.
const opciones = document.querySelectorAll(".opcion");

// Elemento donde se muestra el puntaje.
const puntajeElemento = document.getElementById("puntaje");

// Elemento donde se muestra el numero de preguntas respondidas.
const respondidasElemento = document.getElementById("respondidas");

// Elemento donde se muestra el total de preguntas.
const totalElemento = document.getElementById("total");

// Elemento donde se muestra el mensaje final.
const mensajeResultado = document.getElementById("mensajeResultado");

// Boton para reiniciar el quiz.
const reiniciarBtn = document.getElementById("reiniciar");

// ================================================================
// CALCULO DEL TOTAL DE PREGUNTAS
// ================================================================

// Contamos cuantas preguntas hay en total (elementos con clase "pregunta").
const totalPreguntas = document.querySelectorAll(".pregunta").length;

// Actualizamos el contenido de texto del elemento que muestra el total.
totalElemento.textContent = totalPreguntas;

// ================================================================
// MANEJO DE CLIC EN OPCIONES
// ================================================================

// Recorremos cada boton de opcion con forEach.
opciones.forEach(opcion => {

    // A cada boton le agregamos un event listener para el evento "click".
    opcion.addEventListener("click", () => {

        // Obtenemos todos los botones de opcion que estan dentro del mismo contenedor padre (la misma pregunta).
        // Esto se hace para agrupar los botones por pregunta.
        const hermanos = opcion.parentElement.querySelectorAll(".opcion");

        // Verificamos si al menos uno de los botones hermanos tiene la propiedad 'disabled' en true
        // (es decir, si la pregunta ya fue respondida).
        // Convertimos la NodeList a un array con Array.from y usamos el metodo 'some'.
        const yaRespondida = Array.from(hermanos).some(btn => btn.disabled);

        // Si la pregunta ya fue respondida, salimos de la funcion sin procesar el clic.
        if (yaRespondida) return;

        // ================================================================
        // MARCAR RESPUESTA COMO CORRECTA O INCORRECTA
        // ================================================================

        // Verificamos el atributo personalizado 'data-correct' del boton clickeado.
        // Si es "true", la respuesta es correcta.
        if (opcion.dataset.correct === "true") {

            // Añadimos la clase CSS "correcta" al boton (cambia su estilo).
            opcion.classList.add("correcta");

            // Incrementamos el contador de puntaje en 1.
            puntaje++;

            // Actualizamos el texto del elemento que muestra el puntaje.
            puntajeElemento.textContent = puntaje;

        } else {

            // Si es incorrecta, añadimos la clase "incorrecta".
            opcion.classList.add("incorrecta");
        }

        // ================================================================
        // DESACTIVAR BOTONES DE LA MISMA PREGUNTA
        // ================================================================

        // Recorremos todos los botones hermanos y los deshabilitamos (disabled = true).
        hermanos.forEach(btn => btn.disabled = true);

        // ================================================================
        // ACTUALIZAR PROGRESO
        // ================================================================

        // Incrementamos el contador de preguntas respondidas.
        respondidas++;

        // Actualizamos el elemento que muestra el numero de respondidas.
        respondidasElemento.textContent = respondidas;

        // ================================================================
        // VERIFICAR SI TERMINO EL QUIZ
        // ================================================================

        // Si el numero de respondidas es igual al total de preguntas, mostramos el resultado final.
        if (respondidas === totalPreguntas) {

            // Calculamos el porcentaje de aciertos redondeado.
            const porcentaje = Math.round((puntaje / totalPreguntas) * 100);

            // Creamos un mensaje con el puntaje y el porcentaje.
            mensajeResultado.textContent = `¡Completado! Puntaje final: ${puntaje}/${totalPreguntas} (${porcentaje}%).`;

            // Desplazamos suavemente la vista hacia la seccion de resultados.
            document.getElementById("resultado").scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ================================================================
// REINICIAR QUIZ
// ================================================================

// Agregamos un event listener al boton de reinicio para el evento "click".
reiniciarBtn.addEventListener("click", () => {

    // Restablecemos el puntaje a 0.
    puntaje = 0;

    // Restablecemos el numero de respondidas a 0.
    respondidas = 0;

    // Actualizamos los elementos de texto.
    puntajeElemento.textContent = puntaje;
    respondidasElemento.textContent = respondidas;

    // Limpiamos el mensaje de resultado.
    mensajeResultado.textContent = "";

    // Recorremos todos los botones de opcion de todas las preguntas.
    document.querySelectorAll(".opcion").forEach(op => {

        // Removemos las clases "correcta" e "incorrecta" para que vuelvan a su estado original.
        op.classList.remove("correcta", "incorrecta");

        // Habilitamos nuevamente todos los botones (disabled = false).
        op.disabled = false;
    });

    // Desplazamos la vista hacia la parte superior de la pagina.
    window.scrollTo({ top: 0, behavior: "smooth" });
});