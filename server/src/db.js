import {Pool} from 'pg'
import humps from 'humps';

const pool = new Pool({
  host: 'localhost',
  database: 'hackerbook',
})


async function query(sql, params) {
  
  const client = await pool.connect();
/*humps is a library helping to convert snake_case fields used in
 Database to camelCase.*/
  try {
    const result = await client.query(sql, params);
    const rows = humps.camelizeKeys(result.rows);
    /*result is unfold object and then overridden by rows*/
    return {...result, rows};
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
}
export default query;