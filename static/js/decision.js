/*
================================================================================
Logica completa del juego de decision "El Café Perfecto".
Define una historia ramificada sobre la preparación del café, con múltiples
finales. Incluye manejo de escenas, contador de decisiones, bloqueo de clics
múltiples y reinicio.
================================================================================
*/

document.addEventListener('DOMContentLoaded', function() {

    /*
    ================================================================
    BASE DE DATOS DE ESCENAS - Historia del Café
    ================================================================
    */
    var scenes = {

        // ========== INICIO ==========
        'inicio': {
            id: 'inicio',
            text: 'Eres un barista aprendiz en una cafetería de especialidad. Hoy llega un cliente muy exigente que pide "el mejor café de tu vida". Tienes que decidir cada paso para impresionarlo. ¿Por dónde empiezas?',
            options: [
                { text: '🌱 Seleccionar los granos de café', nextScene: 'seleccion_grano', esFinal: false },
                { text: '⚙️ Revisar el equipo de preparación', nextScene: 'revisar_equipo', esFinal: false }
            ]
        },

        // ========== RAMA: SELECCIONAR GRANO ==========
        'seleccion_grano': {
            id: 'seleccion_grano',
            text: 'Tienes dos tipos de granos disponibles: Arábica de Etiopía (afrutado y ácido) y Robusta de Vietnam (fuerte y amargo). ¿Cuál eliges?',
            options: [
                { text: '🇪🇹 Arábica etíope', nextScene: 'arabica', esFinal: false },
                { text: '🇻🇳 Robusta vietnamita', nextScene: 'robusta', esFinal: false }
            ]
        },

        // ========== RAMA: REVISAR EQUIPO ==========
        'revisar_equipo': {
            id: 'revisar_equipo',
            text: 'Revisas la máquina de espresso, la prensa francesa y la V60. Todas están en buen estado, pero cada una da un perfil de sabor diferente. ¿Qué método usas?',
            options: [
                { text: '☕ Espresso', nextScene: 'espresso', esFinal: false },
                { text: '🫗 Prensa francesa', nextScene: 'francesa', esFinal: false },
                { text: '🧪 V60 (filtro de papel)', nextScene: 'v60', esFinal: false }
            ]
        },

        // ========== SUB-RAMAS DE GRANO ==========
        'arabica': {
            id: 'arabica',
            text: 'Eliges el Arábica etíope. Su acidez brillante y notas de frutos rojos son prometedoras. Ahora debes decidir el tueste: ¿claro o medio?',
            options: [
                { text: '🔥 Tueste claro (más acidez)', nextScene: 'tueste_claro', esFinal: false },
                { text: '🔥 Tueste medio (equilibrio)', nextScene: 'tueste_medio', esFinal: false }
            ]
        },

        'robusta': {
            id: 'robusta',
            text: 'Optas por el Robusta vietnamita. Es más fuerte y con cafeína extra. Para suavizarlo, puedes molerlo más grueso o añadir un toque de leche. ¿Qué haces?',
            options: [
                { text: '⚙️ Molienda gruesa', nextScene: 'molienda_gruesa', esFinal: false },
                { text: '🥛 Añadir leche vaporizada', nextScene: 'leche_robusta', esFinal: false }
            ]
        },

        // ========== SUB-RAMAS DE EQUIPO ==========
        'espresso': {
            id: 'espresso',
            text: 'Usas la máquina de espresso. La presión es clave. ¿Qué presión eliges? (9 bares es estándar, 12 bares da más cuerpo)',
            options: [
                { text: '⚡ 9 bares (estándar)', nextScene: 'espresso_9', esFinal: false },
                { text: '💪 12 bares (intenso)', nextScene: 'espresso_12', esFinal: false }
            ]
        },

        'francesa': {
            id: 'francesa',
            text: 'La prensa francesa necesita un tiempo de extracción preciso. ¿Cuánto tiempo dejas reposar el café?',
            options: [
                { text: '⏱️ 3 minutos (cuerpo ligero)', nextScene: 'francesa_3', esFinal: false },
                { text: '⏱️ 5 minutos (cuerpo completo)', nextScene: 'francesa_5', esFinal: false }
            ]
        },

        'v60': {
            id: 'v60',
            text: 'La V60 requiere un vertido controlado. ¿Cómo viertes el agua?',
            options: [
                { text: '💧 Vertido continuo y lento', nextScene: 'v60_lento', esFinal: false },
                { text: '💧 Vertido por pulsos', nextScene: 'v60_pulsos', esFinal: false }
            ]
        },

        // ========== MÁS ESCENAS INTERMEDIAS ==========
        'tueste_claro': {
            id: 'tueste_claro',
            text: 'El tueste claro resalta las notas frutales. Ahora debes elegir la molienda: ¿fina o media?',
            options: [
                { text: '🔪 Molienda fina', nextScene: 'fina_arabica', esFinal: false },
                { text: '🔪 Molienda media', nextScene: 'media_arabica', esFinal: false }
            ]
        },

        'tueste_medio': {
            id: 'tueste_medio',
            text: 'El tueste medio da un equilibrio entre acidez y cuerpo. ¿Qué temperatura de agua usas?',
            options: [
                { text: '🌡️ 92°C', nextScene: 'temp_92', esFinal: false },
                { text: '🌡️ 96°C', nextScene: 'temp_96', esFinal: false }
            ]
        },

        'molienda_gruesa': {
            id: 'molienda_gruesa',
            text: 'Mueles grueso para reducir la amargor. El café sale suave pero con poco cuerpo. El cliente lo prueba y...',
            options: [
                { text: '😐 Le parece aceptable', nextScene: 'final_aceptable', esFinal: true },
                { text: '😍 Le encanta la suavidad', nextScene: 'final_encanta', esFinal: true }
            ]
        },

        'leche_robusta': {
            id: 'leche_robusta',
            text: 'Añades leche vaporizada al Robusta. La combinación es cremosa pero la leche tapa el sabor. ¿Qué haces?',
            options: [
                { text: '🍯 Añadir un toque de canela', nextScene: 'final_canela', esFinal: false },
                { text: '🍫 Rallar chocolate amargo', nextScene: 'final_chocolate', esFinal: false }
            ]
        },

        'espresso_9': {
            id: 'espresso_9',
            text: 'El espresso a 9 bares sale equilibrado. El cliente lo prueba y pide algo más intenso. ¿Qué haces?',
            options: [
                { text: '🔄 Ofrecer un ristretto', nextScene: 'final_ristretto', esFinal: false },
                { text: '💧 Añadir un poco de agua caliente (Americano)', nextScene: 'final_americano', esFinal: false }
            ]
        },

        'espresso_12': {
            id: 'espresso_12',
            text: 'El espresso a 12 bares es muy intenso y con crema espesa. El cliente queda sorprendido. Le encanta. ¡Éxito!',
            options: [], // Final directo
            esFinal: true
        },

        'francesa_3': {
            id: 'francesa_3',
            text: '3 minutos dan un café ligero y suave. El cliente lo disfruta pero pide más cuerpo. Le ofreces otro con 5 minutos.',
            options: [
                { text: '🔄 Hacer otro con 5 minutos', nextScene: 'francesa_5', esFinal: false },
                { text: '🫗 Añadir un poco de crema', nextScene: 'final_crema', esFinal: false }
            ]
        },

        'francesa_5': {
            id: 'francesa_5',
            text: '5 minutos dan un café con cuerpo y sedoso. El cliente queda satisfecho. ¡Gran trabajo!',
            options: [],
            esFinal: true
        },

        'v60_lento': {
            id: 'v60_lento',
            text: 'Vertido lento y constante. El café queda limpio y brillante. El cliente lo describe como "perfecto". ¡Lo lograste!',
            options: [],
            esFinal: true
        },

        'v60_pulsos': {
            id: 'v60_pulsos',
            text: 'Vertido por pulsos. El café tiene más capas de sabor, pero el cliente lo encuentra confuso. No le gusta.',
            options: [], // Final malo
            esFinal: true
        },

        'fina_arabica': {
            id: 'fina_arabica',
            text: 'Molienda fina para Arábica. Extracción rápida, pero el café sale demasiado ácido. El cliente frunce el ceño.',
            options: [], // Final malo
            esFinal: true
        },

        'media_arabica': {
            id: 'media_arabica',
            text: 'Molienda media. El café tiene el punto justo de acidez y dulzor. El cliente pide otro. ¡Triunfo!',
            options: [],
            esFinal: true
        },

        'temp_92': {
            id: 'temp_92',
            text: '92°C es ideal para Arábica medio. El café está perfecto. El cliente te da una propina generosa.',
            options: [],
            esFinal: true
        },

        'temp_96': {
            id: 'temp_96',
            text: '96°C quema los aceites del Arábica. El café sale amargo y el cliente se queja. Mala elección.',
            options: [],
            esFinal: true
        },

        // ========== FINALES ADICIONALES ==========
        'final_aceptable': {
            id: 'final_aceptable',
            text: 'El cliente dice que está bien, pero no impresionado. Te pide la cuenta. FINAL: "Aceptable pero olvidable".',
            options: [],
            esFinal: true
        },

        'final_encanta': {
            id: 'final_encanta',
            text: 'El cliente queda fascinado con la suavidad del Robusta molido grueso. Dice que es el mejor café que ha probado. ¡Éxito! FINAL: "El suave ganador".',
            options: [],
            esFinal: true
        },

        'final_canela': {
            id: 'final_canela',
            text: 'La canela le da un toque cálido y especiado. El cliente lo adora. FINAL: "El toque canela".',
            options: [],
            esFinal: true
        },

        'final_chocolate': {
            id: 'final_chocolate',
            text: 'El chocolate amargo realza el sabor del Robusta. El cliente pide la receta. FINAL: "El maestro chocolatero".',
            options: [],
            esFinal: true
        },

        'final_ristretto': {
            id: 'final_ristretto',
            text: 'Haces un ristretto con la misma dosis pero menos agua. Es intenso y concentrado. El cliente lo aprueba. FINAL: "El ristretto salvador".',
            options: [],
            esFinal: true
        },

        'final_americano': {
            id: 'final_americano',
            text: 'El Americano diluye el espresso, pero el cliente quería intensidad. No le gusta. FINAL: "El agua que arruinó todo".',
            options: [],
            esFinal: true
        },

        'final_crema': {
            id: 'final_crema',
            text: 'Añades crema de leche al café de 3 minutos. Ahora tiene cuerpo y suavidad. El cliente sonríe. FINAL: "La crema salvadora".',
            options: [],
            esFinal: true
        }

    }; // Fin de scenes

    /*
    ================================================================
    VARIABLES DE ESTADO
    ================================================================
    */
    var currentSceneId = 'inicio';
    var decisionCount = 0;
    var gameEnded = false;
    var processing = false;

    var storyTextEl = document.getElementById('story-text');
    var optionsContainer = document.getElementById('options-container');
    var decisionCountEl = document.getElementById('decision-count');
    var resetBtn = document.getElementById('reset-btn');

    /*
    ================================================================
    FUNCIONES PRINCIPALES
    ================================================================
    */
    function cargarEscena(sceneId) {
        if (processing) return;
        processing = true;

        var scene = scenes[sceneId];
        if (!scene) {
            storyTextEl.textContent = 'Error: escena no encontrada.';
            processing = false;
            return;
        }

        storyTextEl.style.opacity = '0';
        setTimeout(function() {
            var finalText = scene.text;
            if (scene.esFinal || scene.options.length === 0) {
                finalText += ' (Has tomado ' + decisionCount + ' decisión' + (decisionCount !== 1 ? 'es' : '') + ').';
            }
            storyTextEl.textContent = finalText;
            storyTextEl.style.opacity = '1';
        }, 200);

        optionsContainer.innerHTML = '';

        if (scene.esFinal || scene.options.length === 0) {
            gameEnded = true;
            resetBtn.style.display = 'block';
            storyTextEl.classList.add('pulse');
        } else {
            gameEnded = false;
            resetBtn.style.display = 'none';
            storyTextEl.classList.remove('pulse');
            scene.options.forEach(function(option) {
                var btn = document.createElement('button');
                btn.textContent = option.text;
                btn.className = 'option-btn';
                btn.dataset.next = option.nextScene;
                btn.addEventListener('click', function() {
                    if (gameEnded || processing) return;
                    decisionCount++;
                    decisionCountEl.textContent = decisionCount;
                    var next = this.dataset.next;
                    if (next) {
                        cargarEscena(next);
                    } else {
                        cargarEscena(sceneId);
                    }
                });
                optionsContainer.appendChild(btn);
            });
        }

        setTimeout(function() {
            processing = false;
        }, 300);
    }

    function reiniciarJuego() {
        if (processing) return;
        currentSceneId = 'inicio';
        decisionCount = 0;
        gameEnded = false;
        decisionCountEl.textContent = '0';
        resetBtn.style.display = 'none';
        storyTextEl.classList.remove('pulse');
        cargarEscena('inicio');
    }

    /*
    ================================================================
    EVENTOS E INICIO
    ================================================================
    */
    resetBtn.addEventListener('click', reiniciarJuego);
    cargarEscena('inicio');

});
