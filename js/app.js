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
        .then(response => response.json())
        .then(result => showSaucers(result))
        .catch((error) => console.log(error));
};

// show Saucers data
function showSaucers(saucers) {
    const content = document.querySelector('.contenido');

    saucers.forEach(saucer => {

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
            addSaucer({ ...saucer, quantity })
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
function addSaucer(product) {
    let { order } = client;

    if (product.quantity > 0) {

        //checks if the element already exists in the array
        if (order.some(item => item.id === product.id)) {

            //the item already exists
            const updatedOrder = order.map(item => {

                if (item.id === product.id) {
                    item.quantity = product.quantity;
                }

                return item;
            });

            client.order = [...updatedOrder];

        } else {

            //the item does not exist yet
            client.order = [...order, product];
        };

    } else {

        //check if there is a product with zero quantity in the order
        const checkingOrder = order.filter(item => item.id !== product.id);
        client.order = [...checkingOrder];
    }

    //clear summary content
    clearSummary();

    //Checking if the order contains saucers
    if (client.order.length) {
        // Updating the consumption summary
        showSummary();
    } else {
        //Showing empty summary message
        emptySummary();
    }
};

//show the summary
function showSummary() {
    const summaryContent = document.querySelector('#resumen .contenido');

    //creating div summary info.
    const summary = document.createElement('div');
    summary.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //creating table info.
    const table = document.createElement('p');
    table.textContent = 'Mesa: ';
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('span');
    tableSpan.textContent = client.table;
    tableSpan.classList.add('fw-normal');

    table.appendChild(tableSpan);

    //creating time info.
    const time = document.createElement('p');
    time.textContent = 'Hora: ';
    time.classList.add('fw-bold');

    const timeSpan = document.createElement('span');
    timeSpan.textContent = client.time;
    timeSpan.classList.add('fw-normal');

    time.appendChild(timeSpan);

    //creating title section
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('py-4', 'text-center');

    //Iterating over the orders array
    const group = document.createElement('ul');
    group.classList.add('list-group');

    const { order } = client

    //showing elements of the order array
    order.forEach(item => {
        const { id, nombre, precio, quantity } = item;

        //name element
        const list = document.createElement('li');
        list.classList.add('list-group-item');

        const elementName = document.createElement('h4');
        elementName.classList.add('my-4');
        elementName.textContent = nombre;

        list.appendChild(elementName);

        //quantity element
        const elementQuantity = document.createElement('p');
        elementQuantity.classList.add('fw-bold');
        elementQuantity.textContent = 'Cantidad: ';

        const valueQuantity = document.createElement('span');
        valueQuantity.classList.add('fw-normal');
        valueQuantity.textContent = quantity;

        elementQuantity.appendChild(valueQuantity);
        list.appendChild(elementQuantity);

        //price element
        const elementPrice = document.createElement('p');
        elementPrice.classList.add('fw-bold');
        elementPrice.textContent = 'Precio: ';

        const valuePrice = document.createElement('span');
        valuePrice.classList.add('fw-normal');
        valuePrice.textContent = `$${precio}`;

        elementPrice.appendChild(valuePrice);
        list.appendChild(elementPrice);

        //subtotal element
        const elementSubtotal = document.createElement('p');
        elementSubtotal.classList.add('fw-bold');
        elementSubtotal.textContent = 'Subtotal: ';

        const valueSubtotal = document.createElement('span');
        valueSubtotal.classList.add('fw-normal');
        valueSubtotal.textContent = calculateSubtotal(precio, quantity);

        elementSubtotal.appendChild(valueSubtotal);
        list.appendChild(elementSubtotal);

        //button to delete product
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.textContent = 'Eliminar de la orden';
        deleteBtn.onclick = function () {
            deleteProduct(id);
        };

        list.appendChild(deleteBtn);

        //adding order list to group
        group.appendChild(list);

    });

    //adding summary to content div
    summary.appendChild(table);
    summary.appendChild(time);
    summary.appendChild(heading);
    summary.appendChild(group);
    summaryContent.appendChild(summary);
};

//clear the content in the summary
function clearSummary() {
    const summaryContent = document.querySelector('#resumen .contenido');

    while (summaryContent.firstChild) {
        summaryContent.removeChild(summaryContent.firstChild);
    }
};

//calculates the subtotal of a product
function calculateSubtotal(price, quantity) {
    return `$${price * quantity}`;
};

//Remove a product from the list
function deleteProduct(id) {
    const { order } = client;
    const updatedOrder = order.filter(item => item.id !== id);
    client.order = [...updatedOrder];

    //clear summary content
    clearSummary();

    //Checking if the order contains saucers
    if (client.order.length) {
        // Updating the consumption summary
        showSummary();
    }else{
        //showing empty summary message
        emptySummary();
    }

    //reset value of deleted product to zero
    const deleteProductId = `#product-${id}`;
    const productInput = document.querySelector(deleteProductId);
    productInput.value = '0';

};

//Create empty summary message
function emptySummary() {
    const summaryContent = document.querySelector('#resumen .contenido');
    const message = document.createElement('p');
    message.classList.add('text-center');
    message.textContent = 'Añade los elementos del pedido';

    summaryContent.appendChild(message);
};