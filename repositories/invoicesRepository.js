const uuid = require('uuid');
const knex = require('../knex/knex');

const mapLineItemsToDTO = (lineItems) => {
    return lineItems.map((lineItem) => mapLineItemToDTO(lineItem));
}

const mapLineItemToDTO = (lineItem) => {
    const { id, fk_invoice_id, created_at, updated_at, name, description, quantity, price } = lineItem;
    return {
        id,
        invoiceId: fk_invoice_id,
        createAt: created_at,
        updatedAt: updated_at,
        name,
        description,
        quantity,
        price: parseFloat(price)
    }
}

const mapInvoiceToDTO = (invoice) => {
    const { created_at, custom_invoice_id, fk_job_id, id, tax_included, tax_rate, updated_at, total } = invoice;
    return {
        createdAt: created_at,
        customInvoiceId: custom_invoice_id,
        jobId: fk_job_id,
        id,
        taxIncluded: tax_included,
        taxRate: parseFloat(tax_rate),
        updatedAt: updated_at,
        total,
    }
}

const saveLineItem = async (invoiceId, lineItem) => {
    const { name, description, quantity, price } = lineItem;

    return await knex('line_items')
        .insert({
            id: uuid.v4(),
            fk_invoice_id: invoiceId,
            name,
            description,
            quantity,
            price
        })
        .returning('*')
        .then((res) => mapLineItemToDTO(res[0]))
        .catch((err) => { console.log(err); throw err });
}

const save = async (invoice) => {
    const { jobId, customInvoiceId, taxIncluded, taxRate, total, lineItems } = invoice;

    const savedInvoice = await knex('invoices')
        .insert({
            id: uuid.v4(),
            fk_job_id: jobId,
            custom_invoice_id: customInvoiceId,
            tax_included: taxIncluded,
            tax_rate: taxRate,
            total: total
        })
        .returning('*')
        .then((res) => mapInvoiceToDTO(res[0]))
        .catch((err) => { console.log(err); throw err });

    const { id: invoiceId } = savedInvoice;

    const promises = lineItems.map(async (lineItem) => await saveLineItem(invoiceId, lineItem));
    const savedLineItems = await Promise.all(promises);

    return { ...savedInvoice, lineItems: [...savedLineItems] }
};


const findByJobId = async (id) => {
    const invoice = await knex('invoices')
        .where('fk_job_id', '=', id)
        .then((res) => mapInvoiceToDTO(res[0]))
        .catch((err) => {
            throw Error(`Finding invoice for company with id:${id} failed`);
        });

    const lineItems = await knex('line_items')
        .where('fk_invoice_id', '=', invoice.id)
        .then((res) => mapLineItemsToDTO(res))
        .catch((err) => {
            throw Error(`Finding line items for invoice with id:${invoice.id} failed`);
        });

    return { ...invoice, lineItems: [...lineItems] }
};

const update = async (invoice) => {
    const { id, customInvoiceId, taxIncluded, taxRate, total, lineItems } = invoice;

    await deleteLineItemsByInvoiceId(id)

    const updatedInvoice = await knex('invoices')
        .where('id', '=', id)
        .update({
            updated_at: new Date(),
            custom_invoice_id: customInvoiceId,
            tax_included: taxIncluded,
            tax_rate: taxRate,
            total: total
        })
        .returning('*')
        .then((res) => mapInvoiceToDTO(res[0]))
        .catch((err) => { console.log(err); throw err });

    const promises = lineItems.map(async (lineItem) => await saveLineItem(id, lineItem));
    const savedLineItems = await Promise.all(promises);

    return { ...updatedInvoice, lineItems: [...savedLineItems] }
}

const deleteLineItemsByInvoiceId = async (invoiceId) => {
    return await knex('line_items')
        .where('fk_invoice_id', '=', invoiceId)
        .del()
        .catch((err) => {
            throw Error(`Deleting line items for invoice with id:${id} failed`);
        });
}

const deleteInvoice = async (id) => {
    await deleteLineItemsByInvoiceId(id);

    return await knex('invoices')
        .where('id', '=', id)
        .del()
        .catch((err) => {
            throw Error(`Deleting invoice with id:${id} failed`);
        });
};

module.exports = { save, findByJobId, update, deleteInvoice }
