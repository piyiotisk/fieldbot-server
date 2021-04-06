const bcrypt = require('bcrypt');
const knex = require('../knex/knex');

const save = async (user) => {
    const { email, fullname, password } = user;

    return await knex('users')
        .insert({
            createdAt: new Date(),
            email: email.toLowerCase(),
            emailConfirmed: false,
            fullname,
            password: await hashPassword(password)
        })
        .returning('*')
        .then((res) => res[0])
        .catch((err) => { console.log(err); throw err });
}

const update = async (user) => {
    const { email, fk_company_id } = user;

    return await knex('users')
        .where('email', '=', email)
        .update({
            updatedAt: new Date(),
            fk_company_id
        })
        .returning('*')
        .then((res) => res[0])
        .catch((err) => { console.log(err); throw err });
}

const hashPassword = async (plaintextPassword) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plaintextPassword, salt);
}

const getUserByEmail = async (email) =>
    await knex('users')
        .where({ email })
        .first()
        .catch((err) => { console.log(err); throw err });

const verify = async (email) => {
    const user = await getUserByEmail(email);
    if (user) {
        return await knex('users')
            .where('email', '=', email)
            .update({
                updatedAt: new Date(),
                emailConfirmed: true,
            })
            .returning('*')
            .then((res) => res[0])
            .catch((err) => { console.log(err); throw err });
    }
    throw new Error('User does not exist');
}

const updatePassword = async (email, password) => {
    const user = await getUserByEmail(email);
    if (user) {
        return await knex('users')
            .where('email', '=', email)
            .update({
                updatedAt: new Date(),
                password: await hashPassword(password)
            })
            .returning('*')
            .then((res) => res[0])
            .catch((err) => { console.log(err); throw err });
    }
    throw new Error('Update password failed');
}

module.exports = { getUserByEmail, save, verify, updatePassword, update }
