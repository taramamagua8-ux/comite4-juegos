/*
================================================================================
Logica completa del juego de decision "El Codigo Perdido".
Define la estructura de escenas (id, texto, opciones), maneja la navegacion
entre escenas, el contador de decisiones, la deteccion de finales y el
reinicio del juego. Ahora incluye una bandera de procesamiento para evitar
clics multiples y el texto final muestra el numero exacto de decisiones.
================================================================================
*/

/*
BLOQUE PRINCIPAL: Se ejecuta cuando el DOM esta completamente cargado.
Inicializa el juego, configura eventos y carga la primera escena.
*/
document.addEventListener('DOMContentLoaded', function() {
    // Se usa DOMContentLoaded para asegurar que el HTML ya este cargado

    /*
    ================================================================
    DEFINICION DE LA BASE DE DATOS DE ESCENAS
    Cada escena tiene:
    - id: identificador unico (string)
    - text: texto que se muestra al jugador (string)
    - options: array de objetos con:
        - text: texto del boton
        - nextScene: id de la siguiente escena (si es null, es un final)
        - esFinal: booleano que indica si es un final
    ================================================================
    */
    var scenes = {
        // Escena inicial: el descubrimiento
        'inicio': {
            id: 'inicio',
            text: 'Eres un desarrollador novato. Una noche, mientras revisas código legacy, encuentras un archivo oculto llamado "proyecto_alfa.exe". Al abrirlo, ves un mensaje críptico: "El sistema colapsará en 24 horas si no se aplica el parche correcto." Tienes dos opciones:',
            options: [
                { text: '🔍 Analizar el código del archivo', nextScene: 'analizar', esFinal: false },
                { text: '🚨 Alertar al equipo de seguridad', nextScene: 'alertar', esFinal: false }
            ]
        },
        // Escena: analizar el código
        'analizar': {
            id: 'analizar',
            text: 'Decides abrir el archivo en un editor hexadecimal. Descubres que el código contiene una vulnerabilidad crítica en la autenticación. Puedes intentar parchearla por tu cuenta o pedir ayuda a un experto.',
            options: [
                { text: '🛠️ Intentar parchear el código solo', nextScene: 'parche_solo', esFinal: false },
                { text: '👨‍💻 Consultar a un experto en seguridad', nextScene: 'consulta_experto', esFinal: false }
            ]
        },
        // Escena: alertar al equipo
        'alertar': {
            id: 'alertar',
            text: 'Envías un correo urgente al equipo de seguridad. Ellos responden que ya lo sabían, pero que no tienen recursos para solucionarlo. Te piden que "hagas lo que puedas" con el tiempo restante. ¿Qué haces?',
            options: [
                { text: '📚 Investigar en foros de programación', nextScene: 'investigar_foros', esFinal: false },
                { text: '💻 Escribir un script de emergencia', nextScene: 'script_emergencia', esFinal: false }
            ]
        },
        // Finales (nextScene = null)
        'parche_solo': {
            id: 'parche_solo',
            text: 'Trabajas toda la noche y logras aplicar un parche que estabiliza el sistema. El equipo te felicita, pero te das cuenta de que descuidaste tu salud. FINAL: "El héroe solitario"',
            options: [],
            esFinal: true
        },
        'consulta_experto': {
            id: 'consulta_experto',
            text: 'El experto revisa tu análisis y te guía para implementar una solución robusta. El sistema se recupera y ganas el respeto de tus colegas. FINAL: "El aprendiz sabio"',
            options: [],
            esFinal: true
        },
        'investigar_foros': {
            id: 'investigar_foros',
            text: 'Encuentras un hilo de un foro donde alguien tuvo un problema similar. Sigues los pasos y logras restaurar el sistema a tiempo. FINAL: "El investigador"',
            options: [],
            esFinal: true
        },
        'script_emergencia': {
            id: 'script_emergencia',
            text: 'Escribes un script que automatiza el parche, pero olvidas probarlo en un entorno seguro. El script causa un error crítico y el sistema colapsa. FINAL: "El apresurado"',
            options: [],
            esFinal: true
        }
    };

    /*
    ================================================================
    VARIABLES DE ESTADO DEL JUEGO
    ================================================================
    */
    var currentSceneId = 'inicio';        // ID de la escena actual
    var decisionCount = 0;                // Numero de decisiones tomadas
    var gameEnded = false;               // Bandera para saber si termino
    var processing = false;              // Bandera para evitar clics multiples durante transiciones

    // Referencias a elementos del DOM
    var storyTextEl = document.getElementById('story-text');
    var optionsContainer = document.getElementById('options-container');
    var decisionCountEl = document.getElementById('decision-count');
    var resetBtn = document.getElementById('reset-btn');

    /*
    ================================================================
    FUNCION: cargarEscena
    DESCRIPCION: Carga una escena por su ID. Actualiza el texto,
    genera los botones de opciones, maneja los finales y actualiza
    el contador.
    PARAMETROS:
    - sceneId: string con el ID de la escena a cargar.
    RETORNO: ninguno.
    ================================================================
    */
    function cargarEscena(sceneId) {
        // Si ya se esta procesando una transicion, ignorar
        if (processing) return;
        processing = true; // Bloquea nuevos clics

        // Obtiene la escena del objeto scenes
        var scene = scenes[sceneId];
        if (!scene) {
            // Si no existe, muestra un mensaje de error
            storyTextEl.textContent = 'Error: escena no encontrada.';
            processing = false;
            return;
        }

        // Actualiza el texto de la historia (con efecto de fade simple)
        storyTextEl.style.opacity = '0';    // Oculta el texto
        setTimeout(function() {
            // Si es un final, añade el numero de decisiones al texto
            var finalText = scene.text;
            if (scene.esFinal || scene.options.length === 0) {
                // Añade el contador actual al texto del final
                finalText += ' (Has tomado ' + decisionCount + ' decisión' + (decisionCount !== 1 ? 'es' : '') + ').';
            }
            storyTextEl.textContent = finalText; // Cambia el texto
            storyTextEl.style.opacity = '1';     // Lo muestra
        }, 200);

        // Limpia el contenedor de opciones
        optionsContainer.innerHTML = '';

        // Si es un final (esFinal === true o no tiene opciones)
        if (scene.esFinal || scene.options.length === 0) {
            gameEnded = true;
            // Muestra el boton de reinicio
            resetBtn.style.display = 'block';
            // Añade una clase de pulso al texto para enfatizar
            storyTextEl.classList.add('pulse');
        } else {
            gameEnded = false;
            resetBtn.style.display = 'none';
            storyTextEl.classList.remove('pulse');
            // Genera los botones de opcion
            scene.options.forEach(function(option) {
                var btn = document.createElement('button');
                // Crea un elemento button
                btn.textContent = option.text;
                // Asigna el texto de la opcion
                btn.className = 'option-btn';
                // Clase CSS para estilos
                btn.dataset.next = option.nextScene;
                // Guarda el ID de la siguiente escena en un atributo data
                // Añade evento click
                btn.addEventListener('click', function() {
                    // Si el juego ya termino o esta procesando, no hace nada
                    if (gameEnded || processing) return;
                    // Incrementa el contador de decisiones
                    decisionCount++;
                    decisionCountEl.textContent = decisionCount;
                    // Carga la siguiente escena
                    var next = this.dataset.next;
                    if (next) {
                        cargarEscena(next);
                    } else {
                        // Si no hay siguiente, se considera final (pero no deberia ocurrir)
                        cargarEscena(sceneId); // Recarga la misma (pero ya es final)
                    }
                });
                optionsContainer.appendChild(btn);
                // Agrega el boton al contenedor
            });
        }

        // Libera la bandera de procesamiento (despues de un pequeño retraso para permitir la transicion)
        setTimeout(function() {
            processing = false;
        }, 300);
    }

    /*
    ================================================================
    FUNCION: reiniciarJuego
    DESCRIPCION: Reinicia el juego a la escena inicial, resetea
    el contador y oculta el boton de reinicio.
    PARAMETROS: ninguno.
    RETORNO: ninguno.
    ================================================================
    */
    function reiniciarJuego() {
        // Evita reiniciar mientras se procesa
        if (processing) return;
        // Reinicia variables de estado
        currentSceneId = 'inicio';
        decisionCount = 0;
        gameEnded = false;
        // Actualiza el contador visual
        decisionCountEl.textContent = '0';
        // Oculta el boton de reinicio
        resetBtn.style.display = 'none';
        // Quita la clase pulse del texto
        storyTextEl.classList.remove('pulse');
        // Carga la escena inicial
        cargarEscena('inicio');
    }

    /*
    ================================================================
    CONFIGURACION DE EVENTOS INICIALES
    ================================================================
    */
    // Evento para el boton de reinicio
    resetBtn.addEventListener('click', reiniciarJuego);

    // Carga la primera escena al iniciar
    cargarEscena('inicio');

});
// Fin del bloque DOMContentLoaded