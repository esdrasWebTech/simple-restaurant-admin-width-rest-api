let client = {
    table: '',
    time: '',
    order: []
}

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
};

function showSections(){
    const sections = document.querySelectorAll('.d-none');
    sections.forEach( section => section.classList.remove('d-none') );
};