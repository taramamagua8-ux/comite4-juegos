/*
================================================================================
Logica de interaccion para la pagina de juegos externos.
Cada boton de juego (Kahoot, Crucigrama, Educaplay) al hacer clic
muestra u oculta (toggle) el contenido asociado. Ademas, si un contenido
esta visible y se hace clic en otro boton, el anterior se oculta
automaticamente para mantener solo uno visible a la vez.
================================================================================
*/

/*
BLOQUE PRINCIPAL: Se ejecuta cuando el DOM esta completamente cargado.
Este bloque obtiene referencias a los elementos del DOM, define funciones
auxiliares y asigna eventos a los botones.
*/
document.addEventListener('DOMContentLoaded', function() {
    // Se usa DOMContentLoaded para asegurar que el HTML ya este cargado antes de manipularlo

    /*
    PASO 1: OBTENER REFERENCIAS A LOS ELEMENTOS DEL DOM.
    Se usan los metodos getElementById para obtener cada boton
    y cada contenedor de contenido por su ID unico.
    Esto permite manipularlos desde JavaScript.
    */
    var btnKahoot = document.getElementById('btn-kahoot');
    // Obtiene el boton de Kahoot por su ID
    var btnCrucigrama = document.getElementById('btn-crucigrama');
    // Obtiene el boton de Crucigrama por su ID
    var btnEducaplay = document.getElementById('btn-educaplay');
    // Obtiene el boton de Educaplay por su ID

    var contentKahoot = document.getElementById('content-kahoot');
    // Obtiene el contenedor de contenido de Kahoot por su ID
    var contentCrucigrama = document.getElementById('content-crucigrama');
    // Obtiene el contenedor de contenido de Crucigrama por su ID
    var contentEducaplay = document.getElementById('content-educaplay');
    // Obtiene el contenedor de contenido de Educaplay por su ID

    /*
    PASO 2: DEFINIR FUNCIONES AUXILIARES.
    Estas funciones ayudan a manejar la visibilidad de los
    contenidos de manera ordenada.
    */

    /*
    FUNCION: ocultarTodosLosContenidos
    DESCRIPCION: Esta funcion recorre todos los contenedores
    de contenido de juegos y les elimina la clase 'active',
    lo que los oculta. Se usa para asegurar que antes de
    mostrar uno nuevo, todos los demas esten ocultos.
    PARAMETROS: ninguno.
    RETORNO: ninguno (void).
    */
    function ocultarTodosLosContenidos() {
        // Remueve la clase 'active' del contenido de Kahoot
        contentKahoot.classList.remove('active');
        // Remueve la clase 'active' del contenido de Crucigrama
        contentCrucigrama.classList.remove('active');
        // Remueve la clase 'active' del contenido de Educaplay
        contentEducaplay.classList.remove('active');
    }

    /*
    FUNCION: mostrarContenido
    DESCRIPCION: Esta funcion recibe un contenedor de contenido
    y le agrega la clase 'active' para hacerlo visible.
    Antes de mostrarlo, oculta todos los demas contenidos
    para que solo uno quede visible a la vez.
    PARAMETROS:
    - contenedor: elemento del DOM que se quiere mostrar.
    RETORNO: ninguno (void).
    */
    function mostrarContenido(contenedor) {
        // Primero oculta todos los contenidos para asegurar que solo uno este visible
        ocultarTodosLosContenidos();
        // Luego agrega la clase 'active' al contenedor deseado
        contenedor.classList.add('active');
    }

    /*
    PASO 3: ASIGNAR EVENTOS A LOS BOTONES.
    Cada boton tiene un evento 'click' que ejecuta una funcion
    para mostrar u ocultar su contenido correspondiente.
    */

    /*
    EVENTO: clic en boton de Kahoot.
    Cuando se hace clic, se verifica si el contenido de Kahoot
    ya esta visible. Si lo esta, se oculta; si no, se muestra.
    */
    btnKahoot.addEventListener('click', function() {
        // Verifica si el contenido de Kahoot tiene la clase 'active'
        if (contentKahoot.classList.contains('active')) {
            // Si esta activo, lo oculta removiendo la clase
            contentKahoot.classList.remove('active');
        } else {
            // Si no esta activo, lo muestra usando la funcion auxiliar
            mostrarContenido(contentKahoot);
        }
    });

    /*
    EVENTO: clic en boton de Crucigrama.
    Funciona igual que el de Kahoot: si el contenido ya esta
    visible se oculta, si no se muestra.
    */
    btnCrucigrama.addEventListener('click', function() {
        // Verifica si el contenido de Crucigrama esta activo
        if (contentCrucigrama.classList.contains('active')) {
            // Si esta activo, lo oculta
            contentCrucigrama.classList.remove('active');
        } else {
            // Si no, lo muestra
            mostrarContenido(contentCrucigrama);
        }
    });

    /*
    EVENTO: clic en boton de Educaplay.
    Mismo comportamiento que los anteriores: toggle de visibilidad.
    */
    btnEducaplay.addEventListener('click', function() {
        // Verifica si el contenido de Educaplay esta activo
        if (contentEducaplay.classList.contains('active')) {
            // Si esta activo, lo oculta
            contentEducaplay.classList.remove('active');
        } else {
            // Si no, lo muestra
            mostrarContenido(contentEducaplay);
        }
    });

});
// Fin del bloque DOMContentLoaded