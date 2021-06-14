import query from "./db";
import {groupBy, map} from "ramda";
import DataLoader from "dataloader";
/*ids would be accumulated by dataloader and passed as an argument
 it's a kind of memoization. We collect an array of ids so that get the whole
data in a single request*/

export const findAuthorsByBookIds = async (ids) => {
  const sql = `
    select hb.author.*,
           hb.book_author.book_id
    from hb.author inner join hb.book_author 
      on hb.author.id = hb.book_author.author_id
    where hb.book_author.book_id = ANY($1)
  `;

  const params = [ids];
  
  try {
    const result = await query(sql, params);
/* groupBy method would take the second arg (array) and split it into
KEY: VALUE array where bookId would be the KEY and each element would be VALUE
All elements would be sorted out accordingly*/
    const rowsById = groupBy(author => author.bookId, result.rows);

    return map(id => rowsById[id], ids)

  } catch (e) {
    console.log(e);
    throw e;
  }
  
};
export const findAuthorsByBookIdsLoader = () => 
  new DataLoader(findAuthorsByBookIds);




/*
This method is ineffective since each author's request would make N
additional requests among all books.
export const authorsByBookId = async (id) => {
  const sql = `
    select hb.author.*
    from hb.author inner join hb.book_author
    on hb.author.id = hb.book_author.author_id
    where hb.book_author.book_id = $1
  `;

  const params = [id];

  try {
    const result = await query(sql, params);
    return result.rows;
  } catch (e) {
    console.log(e);
    throw e;
  }
}*/
