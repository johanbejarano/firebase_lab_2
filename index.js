
const conciertoForm = document.getElementById("concierto-form");
const conciertosContainer = document.getElementById("conciertos-container");

let editStatus = false;
let id = '';

//Create
const guardarConcierto = (nombre, descripcion, url, foto) => {
    console.log(`Guardando el concierto con los siguientes datos:
        ${nombre} ${descripcion} ${url} ${foto}`);
}

//Read
const consultarConcierto = (id) => {
    console.log(`Consultando el concierto: ${id}`);
}

//Read all
const concultarConciertos = () => {
    console.log('Consultando todos los conciertos...');
}

//Update
const actualizarConcierto = (id, nuevoConcierto) => {
    console.log(`Actualizando el concierto: ${id}
        con los siguientes datos: ${nuevoConcierto}`);
}

//Delete
const eliminarConcierto = (id) => {
    console.log(`Eliminando el concierto ${id}`);
}

listenerLectorDeConciertos = (funcionCallback) => {
    //Escuchar cuando un concierto nuevo se registre
};


//Cuando se cargue la página (HTML DOM)
window.addEventListener("DOMContentLoaded", async (e) => {
    //Se registra un listener de conciertos
    
    //Se cuando reporte un nuevo concierto, se agrega a la lista
    //Ejemplo:
    let nombreConcierto = 'Guayacán';
    let descripcionConcierto = 'Concierto en vivo de Guayacán';
    let urlConcierto = 'https://www.youtube.com/watch?v=XJ1zqHE3pRQ';

    conciertosContainer.innerHTML += `<div class="row">
        <div class="card card-body mt-2 border-primary col-6">
            <h3 class="h5">${nombreConcierto}</h3>
            <p>${descripcionConcierto}</p>
            
            <div>
                <button class="btn btn-primary btn-delete" data-id="1">
                    🗑 Borrar
                </button>
                <button class="btn btn-secondary btn-edit" data-id="2">
                    🖉 Editar
                </button>
            </div>
        </div>

        <div class="card card-body mt-2 border-primary col-6">
            <h3 class="h5">Imagen</h3>
            <img src="https://cr00.epimg.net/programa/imagenes/2018/04/10/top_caracol/1523311540_877253_1523316535_noticia_normal.jpg" width="200px"/>
        </div>
    </div>`;


});

//Cuando se hace submit en la página
conciertoForm.addEventListener("submit", async (e) => {

    //No haga submit
    e.preventDefault();

    //Se leen los atributos del concierto
    const txtNombreConcierto = conciertoForm["concierto-nombre"];
    const txtDescripcionConcierto = conciertoForm["concierto-descripcion"];
    const txtUrl = conciertoForm["concierto-url"];
    const txtFoto = conciertoForm["concierto-foto"];

    try {
        if (!editStatus) {
            //Se quiere guardar un concierto
            await guardarConcierto(
                txtNombreConcierto.value,
                txtDescripcionConcierto.value,
                txtUrl.value,
                txtFoto.files[0]
                )
           
        } else {
            //Se quiere actualizar un concierto
            await actualizarConcierto(id, {
                nombre: txtNombreConcierto.value,
                descripcion: txtDescripcionConcierto.value,
                url: txtUrl.value
            })

            editStatus = false;
            id = '';
            conciertoForm['btn-concierto-form'].innerText = 'Guardar concierto'; //Se cambia la etiqueta del botón
        }

        //Se resetea el formulario
        conciertoForm.reset();

        //Se pone el foco en el campo nombre concierto
        txtNombreConcierto.focus();
    } catch (error) {
        console.log(error);
    }
});
