import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BookSearchForm, BookSearchResults } from './components/Book';
import Error from './components/Error';
import fetch from "./fetch";
import {path, map, pathOr} from "ramda";

const query = `
fragment SearchBook on SearchBookResult {
  id
  title
  description
  authors
  imageUrl
}
query SearchBook($query: String!) {
  searchBook(query: $query) {
    ...SearchBook
  }
}
`

const createBookMutation = `
mutation CreateBook($googleBookId: ID!){
  createBook(googleBookId: $googleBookId) {
    id
  }
}
`

class AddBook extends Component {
  state = {
    term: '',
    results: [],
    redirectBookId: null,
    errors: [],
  };
  
  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };
  
  search = async e => {
    e.preventDefault();
    // eslint-disable-next-line
    const { term } = this.state;
    
    try {
      const variables = {query: term}
      const result = await fetch({query, variables})
      const results = pathOr([], ['data', 'searchBook'], result);
      const listErrors = pathOr([], ['errors'], results)
      const errors = map(error => error.message , listErrors)
      this.setState({ results, errors });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  };
  
  addBook = async googleBookId => {
    try {
      const variables = {googleBookId}
      const result = await fetch({query: createBookMutation, variables});
      const redirectBookId = path(['data', 'createBook', 'id'], result);
      const errorList = pathOr([], ['errors'], result);
      const errors = map(error => error.message, errorList)
      this.setState({ redirectBookId, errors });
    } catch (err) {
      this.setState({ errors: [err.message] });
    }
  };
  
  render() {
    const { redirectBookId } = this.state;
    return (
      <div className="cf black-80 mv2">
        {redirectBookId && <Redirect to={`/book/${redirectBookId}`} />}
        <Error errors={this.state.errors} />
        <BookSearchForm
          search={this.search}
          handleChange={this.handleChange}
          term={this.state.term}
        />
        <BookSearchResults
          results={this.state.results}
          addBook={this.addBook}
        />
      </div>
    );
  }
}

export default AddBook;
