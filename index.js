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
    //Se consulta el concierto con ese id
    return db.collection('conciertos').doc(id).get();
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
                        <button class="btn btn-primary btn-delete" data-id="${doc.id}">
                            🗑 Borrar
                        </button>
                        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
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

        //Se registra un listener de click en todos los botones "editar"
        const botonesEdit = conciertosContainer.querySelectorAll(".btn-edit");

        //Por cada boton, se registra el evento de click
        botonesEdit.forEach( (btn) => {
            
            btn.addEventListener("click", async (evento) => {
                try {
                    //Se impreme a cual botón se presionó click
                    const conciertoId = evento.target.dataset.id;

                    //Se consulta el concierto
                    const conciertoDocument = await consultarConcierto(conciertoId);
                    const concierto = conciertoDocument.data();

                    //Se escriben los datos del concierto
                    conciertoForm["concierto-nombre"].value = concierto.nombre;
                    conciertoForm["concierto-descripcion"].value = concierto.descripcion;
                    conciertoForm["concierto-url"].value = concierto.url;

                    //Se cambia al estado de edición
                    editStatus = true;
                    id = conciertoId;
                    conciertoForm["btn-concierto-form"].innerText = "Actualizar";

                } catch (error) {
                    console.log(error);
                }
            });

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
