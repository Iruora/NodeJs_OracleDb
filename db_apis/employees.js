const database = require('../services/database.js');
const oracledb = require('oracledb');
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
// ......................................
const createSql = `insert into employees (
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id
  ) values (
    :first_name,
    :last_name,
    :email,
    :phone_number,
    :hire_date,
    :job_id,
    :salary,
    :commission_pct,
    :manager_id,
    :department_id
  ) returning employee_id
  into :employee_id`;
// --------------------------------------------------------------------------------
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
// --------------------------------------------------------------------------------------
async function create(emp) {
    const employee = Object.assign({}, emp);

    employee.employee_id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }

    const result = await database.simpleExecute(createSql, employee);

    employee.employee_id = result.outBinds.employee_id[0];

    return employee;
}
// ---------------------------------------------------------------------------------------
module.exports.find = find;
module.exports.create = create;