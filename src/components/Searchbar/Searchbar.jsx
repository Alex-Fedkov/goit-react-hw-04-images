import PropTypes from 'prop-types';
import { useState } from 'react';
import { 
  Header,
  Form,
  Button,
  Span,
  Input,
  } from "./style.jsx";

const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChange = event => {
    setSearchQuery(event.target.value);
  }

  const onSubmitForm = event => {
    event.preventDefault();
    onSubmit(searchQuery.trim());
  }
  
  return (
    <Header>
      <Form onSubmit={onSubmitForm}>
        <Button type="submit">
          <Span>Search</Span>
        </Button>

        <Input
          type="text"
          value={searchQuery}
          onChange={onChange}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </Form>
    </Header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,      
}

export default Searchbar;