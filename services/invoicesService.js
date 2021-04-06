const invoicesRepository = require('../repositories/invoicesRepository');

const save = (req) => {
    // TODO: joi validation
    const invoice = req.body;
    // todo check that the job in the invoice belongs to the user's company
    return invoicesRepository.save(invoice);
}

const findByJobId = (req) => {
    const id = parseInt(req.params.id);
    // todo check that the job in the invoice belongs to the user's company
    return invoicesRepository.findByJobId(id);
}

const update = (req) => {
    const { id } = req.params;
    const invoice = req.body;

    // todo check that the job in the invoice belongs to the user's company
    return invoicesRepository.update({ ...invoice, id });
}

const deleteInvoice = (req) => {
    const { id } = req.params;

    // todo check that the job in the invoice belongs to the user's company
    return invoicesRepository.deleteInvoice(id);
}


module.exports = { save, findByJobId, update, deleteInvoice };