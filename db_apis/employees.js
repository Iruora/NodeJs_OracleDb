const database = require('../services/database.js');

const baseQuery = 
`SELECT employee_id "id",
    first_name "first_name",
   last_name "last_name",
   email "email",
   phone_number "phone_number",
   hire_date "hire_date",
   job_id "job_id",
   salary "salary",
   commission_pct "commission_pct",
   manager_id "manager_id",
   departement_id "departement_id"
FROM employees`;

async function find(context) {
    let query = baseQuery;
    const binds = {};
    if (context.id) {
        binds.employee_id = context.id;

        query += `\nWHERE employee_id = :employee_id`;
    }
    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;