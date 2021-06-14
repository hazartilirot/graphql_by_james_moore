import query from "./db";
import {groupBy, map} from "ramda";
import DataLoader from "dataloader";

const ORDER_BY = {
  ID_DESC: 'id desc',
  ID_ASC: 'id asc'
}

export const allReviews = async (args) => {
  const orderBy = ORDER_BY[args.orderBy]
  
  const sql = `select * from hb.review order by ${orderBy}`
  
  try {
    const result = await query(sql)
    return result.rows;
  } catch (e) {
    console.log(e);
    throw e
  }
}
export const findReviewsByIds = async (ids) => {
  const sql = `
  select *
  from hb.review
  where book_id = ANY($1)
  order by id;
  `
  const params = [ids];

  try {
    const result = await query(sql, params);
    const rowsById = groupBy(review => review.bookId, result.rows)
    return map(id => rowsById[id], ids)
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export const findReviewsByIdsLoader = () => new DataLoader(findReviewsByIds)

export const createReview = async (reviewInput) => {
  const {bookId, email, name, rating, title, comment} = reviewInput;
  const sql = `
    select * from hb.create_review($1, $2, $3, $4, $5, $6)
  `
  const params = [bookId, email, name, rating, title, comment]

  try {
    const result = await query(sql, params)
    return result.rows[0]
  } catch (e) {
    console.log(e)
    throw e
  }
}