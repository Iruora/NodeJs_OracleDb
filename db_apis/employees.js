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
   department_id "department_id"
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
  // ......................................
  const updateSql = 
  `update employees
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where employee_id = :employee_id`;
  // .......................................
  const deleteSql =
 `begin
 
    delete from employees
    where employee_id = :employee_id;
 
    :rowcount := sql%rowcount;
 
  end;`
// --------------------------------------------------------------------------------
async function find(context) {
    let query = baseQuery;
    const binds = {};
    if (context.id) {
        binds.employee_id = context.id;

        query += `\nWHERE employee_id = :employee_id`;
    }

    if (context.skip) {
        binds.row_offset = context.skip;

        query += '\noffset :row_offset rows';
    }

    const limit = (context.limit > 0) ? context.limit : 30;

    binds.row_limit = limit;

    query += '\nfetch next :row_limit rows only';
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
async function update(emp) {
    const employee = Object.assign({}, emp);
    const result = await database.simpleExecute(updateSql, employee);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return employee;
    } else {
        return null;
    }
}
// ---------------------------------------------------------------------------------------
async function remove(id) {
    const binds = {
        employee_id: id,
        rowcount: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER
        }
    }

    const result = await database.simpleExecute(deleteSql, binds);

    return result.outBinds.rowcount === 1;
}
// ---------------------------------------------------------------------------------------
module.exports.find = find;
module.exports.create = create;
module.exports.update = update;
module.exports.delete = remove;