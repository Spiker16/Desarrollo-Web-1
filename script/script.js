document.addEventListener('DOMContentLoaded', () => {

    // Referencias a elementos del DOM (Input, Selectores, Botón, Tablero)
    const input = document.getElementById('note-input');
    const colorSelect = document.getElementById('color-select');
    const shapeSelect = document.getElementById('shape-select');
    const addBtn = document.getElementById('add-btn');
    const board = document.getElementById('board');

    // 1. CARGAR DATOS (localStorage)
    let notesData = [];
    try {
        const storedData = localStorage.getItem('stickyNotes');
        if (storedData) notesData = JSON.parse(storedData);
    } catch (error) {
        console.error("Error cargando notas:", error);
        notesData = [];
    }

    // Función auxiliar: Fecha actual
    function getCurrentDate() {
        return new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    // Función auxiliar: Guardar en LocalStorage
    function saveToStorage() {
        try {
            localStorage.setItem('stickyNotes', JSON.stringify(notesData));
        } catch (error) {
            console.error("No se pudo guardar:", error);
        }
    }

    // 2. RENDERIZAR NOTA (Dibujar en pantalla)
    function renderNote(noteObj) {
        const note = document.createElement('div');
        
        // Calculamos rotación aleatoria visual (solo estética, entre -3 y 3 grados)
        const randomRotate = Math.floor(Math.random() * 6) - 3; 

        // Aplicamos clases dinámicas según la selección del usuario
        // sticky-note: clase base
        // color-{n}: define el fondo
        // shape-{tipo}: define el tamaño
        note.className = `sticky-note color-${noteObj.color} shape-${noteObj.shape}`;
        note.style.transform = `rotate(${randomRotate}deg)`;

        note.innerHTML = `
            <button class="delete-btn" title="Eliminar">×</button>
            <div class="note-content">${noteObj.text}</div>
            <div class="note-date">${noteObj.date}</div>
        `;

        // Lógica del Botón Eliminar
        note.querySelector('.delete-btn').onclick = () => {
            // Animación de salida
            note.style.transition = "all 0.3s";
            note.style.transform = "scale(0)";
            note.style.opacity = "0";
            
            setTimeout(() => {
                note.remove(); // Quitar del HTML
                
                // Quitar de la lista de datos usando el ID único
                notesData = notesData.filter(n => n.id !== noteObj.id);
                saveToStorage(); // Guardar cambios
            }, 300);
        };

        board.appendChild(note);
    }

    // 3. CREAR NUEVA NOTA (Capturar datos)
    function createNewNote() {
        const text = input.value.trim();
        if (text === "") {
            alert("Escribe algo primero.");
            return;
        }

        // Crear objeto con las elecciones del usuario (inputs y selects)
        const newNoteObj = {
            id: Date.now(),
            text: text,
            date: getCurrentDate(),
            color: colorSelect.value, // Valor del select de color (1, 2, 3, 4)
            shape: shapeSelect.value  // Valor del select de forma (square, wide, tall)
        };

        // Agregar, guardar y dibujar
        notesData.push(newNoteObj);
        saveToStorage();
        renderNote(newNoteObj);

        // Limpiar input
        input.value = "";
        input.focus();
    }

    // 4. INICIALIZAR (Dibujar notas guardadas al cargar)
    if (notesData.length > 0) {
        notesData.forEach(renderNote);
    }

    // Event Listeners
    addBtn.onclick = createNewNote;
    input.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') createNewNote(); 
    });

});