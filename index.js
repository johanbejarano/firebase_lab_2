//Referencia a la BD de firestore
const db = firebase.firestore();

const conciertoForm = document.getElementById("concierto-form");
const conciertosContainer = document.getElementById("conciertos-container");

let editStatus = false;
let id = '';

//Create
const guardarConcierto = (nombre, descripcion, url, foto) => {
    console.log(`Guardando el concierto con los siguientes datos:
        ${nombre} ${descripcion} ${url} ${foto}`);

    //Se guarda el documento en firestore
    db.collection('conciertos').doc().set({
        nombre: nombre,
        descripcion: descripcion,
        url: url
    });
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

const listenerLectorDeConciertos = (funcionCallback) => {
    //Escuchar cuando un concierto nuevo se registre
    db.collection('conciertos').onSnapshot(funcionCallback);
};


//Cuando se cargue la página (HTML DOM)
window.addEventListener("DOMContentLoaded", async (e) => {
    //Se registra un listener de conciertos
    listenerLectorDeConciertos((querySnapshot) => {

        //Borra la lista de ocnciertos de la pantalla
        conciertosContainer.innerHTML = "";
        
        //Por cada documento, haga
        querySnapshot.forEach((doc) => {
            //Se obtiene el documento del concierto

            const concierto = doc.data();
            
            //Ese concierto se muestra en la pantalla
            let nombreConcierto = concierto.nombre;
            let descripcionConcierto = concierto.descripcion;
            let urlConcierto = concierto.url;

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
                    <img src="${urlConcierto}" width="200px"/>
                </div>
            </div>`;


        });

    });
    
    
    

    


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
