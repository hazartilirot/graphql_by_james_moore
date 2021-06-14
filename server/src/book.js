import query from './db';
import {groupBy, map} from 'ramda'
import DataLoader from "dataloader";

/*export const findBookById = async (id) => {
  const sql = `
  select *
  from hb.book
    where hb.book.id = $1
  `
  const params = [id]

  try {
    const result = await query(sql, params)
    console.log(result.rows)
    return result.rows[0]
  } catch (e) {
    console.log(e)
    throw e;
  }
}*/

export const findBooksByIds = async (ids) => {
  const sql = `
  select *
  from hb.book
  where hb.book.id = ANY($1)
  `
  const params = [ids]

  try {
    const result = await query(sql, params);
    const rowsById = groupBy(book => book.id, result.rows)
    return map(id => rowsById[id] ? rowsById[id][0] : null, ids)
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const findBooksByIdsLoader = () =>
  new DataLoader(findBooksByIds)

const ORDER_BY = {
  ID_DESC: 'id desc',
  RATING_DESC: 'rating desc'
}
export const allBooks = async (args) => {
  const orderBy = ORDER_BY[args.orderBy]
  
  const sql = `select * from hb.book order by ${orderBy}`;
  
  try {
    const result = await query(sql);
    return result.rows;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const imageUrl = (size, id) => {
  const zoom = size === 'SMALL' ? 1 : 0 
  return `http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api`
}