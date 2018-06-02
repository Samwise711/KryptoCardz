import React, { Component } from 'react';
import { Form, Input, Card, Button, Grid, Dropdown } from 'semantic-ui-react';
import { Link } from '../routes';


const sortOptions1 = [
  {
    text: 'Created',
    value: 'created'
  },
  {
    text: 'Price',
    value: 'meta',
  },
  {
    text: 'Name',
    value: 'header',
  },
  // {
  //   text: 'Rarity',
  //   value: 'Rarity',
  // }
]

const sortOptions2 = [
  {
    text: 'High to low',
    value: 'High to low',
  },
  {
    text: 'Low to high',
    value: 'Low to high',
  }
]


let SortBy = ({sort1Handler, sort2Handler}) =>
  <Grid.Column width={5}>
    <h4 style={{display: 'inline'}}>Sort by :   </h4>
    <Dropdown
      style={{display: 'inline'}}
      placeholder='Select option'
      defaultValue='created'
      fluid selection options={sortOptions1}
      onChange={sort1Handler} />
    <Dropdown
      style={{display: 'inline'}}
      placeholder='Select option'
      defaultValue='Low to high'
      fluid selection options={sortOptions2}
      onChange={sort2Handler} />
  </Grid.Column>


let CreateNewBtn = () =>
    <Grid.Column width={3}>
      <div style={{ float: 'right' }}>
        <Link route="/campaigns/new">
          <a>
          <Button floated="right" content="Create Card" icon="add" primary/>
          </a>
        </Link>
      </div>
    </Grid.Column>

let SearchValueBtn = ({searchValue}) =>
    <Grid.Column width={3}>
      <div style={{ float: 'left', marginLeft: '-25px' }}>
        <Link route={`/search/${searchValue}`} >
          <a>
          <Button floated="right" content="Search" />
          </a>
        </Link>
      </div>
    </Grid.Column>

let SearchField = ({searchHandler, searchValue}) =>
    <Grid.Column width={5}>
      <Form>
        <Form.Field>
          <Input
          className='icon'
          placeholder='Search by name...'
          value={searchValue}
          onChange={searchHandler}
            />
        </Form.Field>
      </Form>
    </Grid.Column>

let SearchSortPart = ({searchHandler, searchValue, sort1Handler, sort2Handler}) =>
    <Grid.Row>
      <SearchField searchHandler={searchHandler} searchValue={searchValue}/>
      <SearchValueBtn searchValue={searchValue}/>
      <SortBy sort1Handler={sort1Handler} sort2Handler={sort2Handler}/>
      <CreateNewBtn/>
    </Grid.Row>

export default SearchSortPart;
