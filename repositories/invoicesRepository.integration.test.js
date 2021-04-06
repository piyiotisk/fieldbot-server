const companiesRepository = require('./companiesRepository');
const knex = require('../knex/knex');
const invoicesRepository = require('./invoicesRepository');

clearDatabase = async () => {
    await knex('jobs_tags')
        .delete();
    await knex('tags')
        .delete();
    await knex('line_items')
        .delete();
    await knex('invoices')
        .delete();
    await knex('jobs')
        .delete();
    await knex('customers')
        .delete();
    await knex('users')
        .delete();
    await knex('companies')
        .delete();
};

describe('invoicesRepository', () => {
    beforeEach(async () => {
        await clearDatabase();

        // create a company
        await knex.raw('INSERT INTO companies (id, name, "createdAt") VALUES (1, \'company-name\', current_timestamp);');
        // create a customer
        await knex.raw('INSERT INTO customers (id, "createdAt", firstname, lastname, fk_company_id) VALUES (1, current_timestamp, \'John\', \'Doe\', 1);');
        // create a user
        await knex.raw('INSERT INTO users ("id", "createdAt", "email","password","fullname","fk_company_id","emailConfirmed") VALUES (1, current_timestamp, \'user@email.com\', \'pass\', \'J Dane\', 1, TRUE);');
        // create a job for the customer
        await knex.raw('INSERT INTO jobs ("id","createdAt", "name","fk_company_id","fk_user_id","fk_customer_id") VALUES (1, current_timestamp, \'Job name\', 1, 1, 1);');
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        // Closing the DB connection allows Jest to exit successfully.
        await knex.destroy();
    });

    it('should save an invoice', async () => {
        const lineItems = [{
            name: 'line item name',
            description: 'line item 1 descr',
            quantity: 1,
            price: 10.20
        }];

        const invoice = {
            jobId: 1,
            customInvoiceId: "custom-id-1",
            taxIncluded: false,
            taxRate: 19.00,
            lineItems
        };

        const actualInvoice = await invoicesRepository.save(invoice);

        // test invoice
        expect(actualInvoice.jobId).toEqual(invoice.jobId);
        expect(actualInvoice.customInvoiceId).toEqual(invoice.customInvoiceId);
        expect(actualInvoice.taxIncluded).toEqual(invoice.taxIncluded);
        expect(actualInvoice.taxRate).toEqual(invoice.taxRate);

        // test line items
        expect(actualInvoice.lineItems[0].invoiceId).toEqual(actualInvoice.id);
        expect(actualInvoice.lineItems[0].name).toEqual(lineItems[0].name);
        expect(actualInvoice.lineItems[0].description).toEqual(lineItems[0].description);
        expect(actualInvoice.lineItems[0].quantity).toEqual(lineItems[0].quantity);
        expect(actualInvoice.lineItems[0].price).toEqual(lineItems[0].price);
    });

    it('should retrieve an invoice by job id', async () => {
        const lineItems = [{
            name: 'line item name',
            description: 'line item 1 descr',
            quantity: 1,
            price: 10.20
        }];

        const invoice = {
            jobId: 1,
            customInvoiceId: "custom-id-1",
            taxIncluded: false,
            taxRate: 19.00,
            lineItems
        };
        await invoicesRepository.save(invoice);

        const actualInvoice = await invoicesRepository.findByJobId(1);

        // test invoice
        expect(actualInvoice.jobId).toEqual(invoice.jobId);
        expect(actualInvoice.customInvoiceId).toEqual(invoice.customInvoiceId);
        expect(actualInvoice.taxIncluded).toEqual(invoice.taxIncluded);
        expect(actualInvoice.taxRate).toEqual(invoice.taxRate);

        // test line items
        expect(actualInvoice.lineItems[0].invoiceId).toEqual(actualInvoice.id);
        expect(actualInvoice.lineItems[0].name).toEqual(lineItems[0].name);
        expect(actualInvoice.lineItems[0].description).toEqual(lineItems[0].description);
        expect(actualInvoice.lineItems[0].quantity).toEqual(lineItems[0].quantity);
        expect(actualInvoice.lineItems[0].price).toEqual(lineItems[0].price);
    });

    it('should update an invoice by its id', async () => {
        const lineItems = [{
            name: 'line item name',
            description: 'line item 1 descr',
            quantity: 1,
            price: 10.20
        }];

        const invoice = {
            jobId: 1,
            customInvoiceId: "custom-id-1",
            taxIncluded: false,
            taxRate: 19.00,
            lineItems
        };
        const savedInvoice = await invoicesRepository.save(invoice);

        const updatedLineItems = [{
            id: savedInvoice.lineItems[0].id,
            name: 'updated line item name',
            description: 'line item 1 descr',
            quantity: 2,
            price: 13.20
        }];

        const updatedInvoice = {
            id: savedInvoice.id,
            jobId: 1,
            customInvoiceId: "updated-custom-id-1",
            taxIncluded: false,
            taxRate: 19.00,
            lineItems: updatedLineItems
        };

        const actualInvoice = await invoicesRepository.update(updatedInvoice);

        // test invoice
        expect(actualInvoice.jobId).toEqual(updatedInvoice.jobId);
        expect(actualInvoice.customInvoiceId).toEqual(updatedInvoice.customInvoiceId);
        expect(actualInvoice.taxIncluded).toEqual(updatedInvoice.taxIncluded);
        expect(actualInvoice.taxRate).toEqual(updatedInvoice.taxRate);

        // test line items
        expect(actualInvoice.lineItems[0].invoiceId).toEqual(actualInvoice.id);
        expect(actualInvoice.lineItems[0].name).toEqual(updatedLineItems[0].name);
        expect(actualInvoice.lineItems[0].description).toEqual(updatedLineItems[0].description);
        expect(actualInvoice.lineItems[0].quantity).toEqual(updatedLineItems[0].quantity);
        expect(actualInvoice.lineItems[0].price).toEqual(updatedLineItems[0].price);
    });

    it('should delete an invoice by its id', async () => {
        const lineItems = [{
            name: 'line item name',
            description: 'line item 1 descr',
            quantity: 1,
            price: 10.20
        }];

        const invoice = {
            jobId: 1,
            customInvoiceId: "custom-id-1",
            taxIncluded: false,
            taxRate: 19.00,
            lineItems
        };
        const actualInvoice = await invoicesRepository.save(invoice);

        const deleteNumberOfInvoices = await invoicesRepository.deleteInvoice(actualInvoice.id);

        expect(deleteNumberOfInvoices).toEqual(1);
    });

});