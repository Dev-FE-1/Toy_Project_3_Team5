import React from 'react';
import { useParams } from 'react-router-dom';

const Search: React.FC = () => {
  const { keyword } = useParams();

  return (
    <div>
      <div>{keyword}</div>
    </div>
  );
};

export default Search;
