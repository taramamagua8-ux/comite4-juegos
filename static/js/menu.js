/*
================================================================================
Logica de navegacion para el menu de juegos. Lee la ruta actual
(window.location.pathname) y decide si mostrar el menu principal o el contenido
de un juego interno. Tambien oculta el menu y muestra el contenido adecuado
mediante la clase 'active'. Esta funcion se ejecuta al cargar la pagina.
================================================================================
*/

/*
FUNCION: window.onload
DESCRIPCION: Se ejecuta cuando todos los recursos de la pagina han cargado.
Contiene la logica de navegacion inicial. Lee la ruta actual, determina
si es la raiz o un juego especifico, y muestra u oculta los elementos
correspondientes.
*/
window.onload = function() {
    // OBTIENE LA RUTA ACTUAL SIN EL DOMINIO
    var path = window.location.pathname;
    // Ejemplo: si la URL es 'http://dominio/juego1', path sera '/juego1'
    // Elimina la barra inicial para obtener el nombre de la pagina
    var page = path.substring(1);
    // Ejemplo: si path es '/juego1', page sera 'juego1'; si es '/', page sera ''

    // OBTIENE REFERENCIAS A LOS ELEMENTOS DEL DOM
    var menu = document.getElementById('menu');
    // Referencia al div del menu principal
    var contentContainer = document.getElementById('page-content');
    // Referencia al contenedor que agrupa todos los contenidos de juegos
    var allPages = document.querySelectorAll('.content');
    // Obtiene una lista de todos los elementos con clase 'content'

    // OCULTA TODOS LOS CONTENIDOS DE JUEGOS
    for (var i = 0; i < allPages.length; i++) {
        // Recorre cada elemento con clase 'content'
        allPages[i].classList.remove('active');
        // Remueve la clase 'active' para ocultarlos todos
    }

    // DECIDE QUE MOSTRAR SEGUN LA RUTA
    if (page === '') {
        // Si la pagina es la raiz (sin parametro)
        menu.style.display = 'block';
        // Muestra el menu principal (display block)
        contentContainer.style.display = 'none';
        // Oculta el contenedor de contenidos (display none)
    } else {
        // Si la ruta no es la raiz (por ejemplo, '/juego1')
        menu.style.display = 'none';
        // Oculta el menu principal
        contentContainer.style.display = 'block';
        // Muestra el contenedor de contenidos

        // BUSCA EL ELEMENTO DE CONTENIDO CORRESPONDIENTE
        var target = document.getElementById('page-' + page);
        // Construye el ID esperado: 'page-' + page (ej: 'page-juego1')
        if (target) {
            // Si existe un elemento con ese ID
            target.classList.add('active');
            // Agrega la clase 'active' para mostrarlo (anula el display none)
        }
    }
};
