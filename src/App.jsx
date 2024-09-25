/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const handleFilter = (data, { selectedUser, selectedCategory, query }) => {
  let filteredData = [...data];

  filteredData = filteredData.map(product => {
    const category = categoriesFromServer.find(
      good => good.id === product.categoryId,
    );
    const user = usersFromServer.find(person => person.id === category.ownerId);

    return {
      ...product,
      category,
      user,
    };
  });

  if (query) {
    const normalizedQuery = query.toLowerCase().trim();

    filteredData = filteredData.filter(
      product =>
        product.category.title?.toLowerCase().includes(normalizedQuery),
      // eslint-disable-next-line function-paren-newline
    );
  }

  if (selectedCategory) {
    filteredData = filteredData.filter(
      product => product.category.title === selectedCategory.title,
    );
  }

  if (selectedUser) {
    filteredData = filteredData.filter(
      product => product.user.name === selectedUser.name,
    );
  }

  return filteredData;
};

export const App = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');

  const visableProducts = handleFilter(productsFromServer, {
    selectedUser,
    selectedCategory,
    query,
  });

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedUser('');
    setQuery('');
  };

  const handleCategorySelection = category => {
    setSelectedCategory(prevSelected => {
      if (prevSelected.some(selectedCat => selectedCat.id === category.id)) {
        return prevSelected.filter(
          selectedCat => selectedCat.id !== category.id,
        );
      }

      return [...prevSelected, category];
    });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#All"
                onClick={() => setSelectedUser('')}
                className={cn({
                  'is-active': !selectedUser,
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href={`#${user.name}`}
                  onClick={() => setSelectedUser(user)}
                  className={cn({
                    'is-active': user === selectedUser,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setSelectedCategory([])}
                className={cn('button mr-6', {
                  'is-success': !selectedCategory.length,
                })}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': category === selectedCategory,
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => handleCategorySelection(category)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleReset()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visableProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visableProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
