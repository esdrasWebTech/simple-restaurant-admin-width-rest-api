let client = {
    table: '',
    time: '',
    order: []
}

const saucerCategories = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
};

const btnCreateOrder = document.querySelector('#guardar-cliente');
btnCreateOrder.addEventListener('click', createOrder);

function createOrder() {
    const table = document.querySelector('#mesa').value;
    const time = document.querySelector('#hora').value;

    //validating order form
    const orderFields = [table, time].some(field => field === '');

    if (orderFields) {

        //checking if the alert exists
        const alertExists = document.querySelector('.invalid-feedback');

        if (!alertExists) {

            const alertUser = document.createElement('div');
            alertUser.classList.add('invalid-feedback', 'd-block', 'text-center');
            alertUser.textContent = 'Ambos campos son bligatorios';
            document.querySelector('.modal-body').appendChild(alertUser);

            setTimeout(() => {

                alertUser.remove();
            }, 3000)
        }

        return;
    }

    //assign order data to the client
    client = { ...client, table, time };

    //hide modal 
    const modal = document.querySelector('#formulario');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();

    //show sections
    showSections();

    //get Saucers data
    getSaucers();
};

function showSections() {
    const sections = document.querySelectorAll('.d-none');
    sections.forEach(section => section.classList.remove('d-none'));
};

function getSaucers() {

    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then( response => response.json())
        .then( result => showSaucers(result))
        .catch((error) => console.log(error));
};

// show Saucers data
function showSaucers(saucers){
    const content = document.querySelector('.contenido');

    saucers.forEach( saucer => {

        //creating the saucer row
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        //creating name column
        const name = document.createElement('div');
        name.classList.add('col-md-4');
        name.textContent = saucer.nombre;

        //creating price column
        const price = document.createElement('div');
        price.classList.add('col-md-2', 'fw-bold');
        price.textContent = `$${saucer.precio}`;

        //creating category column
        const category = document.createElement('div');
        category.classList.add('col-md-3');
        category.textContent = saucerCategories[saucer.categoria];

        //creating input column
        const divInput = document.createElement('div');
        divInput.classList.add('col-md-3');

        const input = document.createElement('input');
        input.classList.add('form-control');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.id = `product-${saucer.id}`;

        //identifying the quantity of client saucer
        input.onchange = function () {
            const quantity = parseInt(input.value);
            addSaucer({...saucer, quantity})
        };

        //adding saucer info. to row
        divInput.appendChild(input);
        row.appendChild(name);
        row.appendChild(price);
        row.appendChild(category);
        row.appendChild(divInput);
        content.appendChild(row);

    });
};

//get the quantity of saucers ordered
function addSaucer(product){
    let {order} = client;

    if(product.quantity > 0){

        //checks if the element already exists in the array
        if( order.some( item => item.id === product.id ) ){

            //the item already exists
            const updatedOrder = order.map( item => {

                if( item.id === product.id ){
                    item.quantity = product.quantity;
                }

                return item;
            });

            client.order = [...updatedOrder];

        }else{

            //the item does not exist yet
            client.order = [...order, product];
        };

    }else{

        //check if there is a product with zero quantity in the order
        const checkingOrder = order.filter( item => item.id !== product.id );
        client.order = [...checkingOrder];
    }

    console.log(client.order);
};
