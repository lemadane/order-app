import React, { useState } from 'react';
import { Sku } from '../common/types';
import './Search.css';

type Props = {
  skus: Sku[];
  setSelectedSku: (sku: Sku) => void;
  skuSearchText: string;
  setSkuSearchText: (skuSearchText: string) => void;
};

const SearchSku = (props: Props) => {
  const [foundSkus, setFoundSkus] = useState<Sku[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    props.setSkuSearchText(value);
    const searchResults = [] as Sku[];
    for (let sku of props.skus) {
      if (
        sku.code.toLowerCase().includes(value.toLowerCase()) ||
        sku.name.toLowerCase().includes(value.toLowerCase())
      ) {
        searchResults.push(sku);
      }
    }
    setFoundSkus(searchResults);
  };


  const didSelectSku = (sku: Sku) => {
    props.setSelectedSku(sku)
    setFoundSkus([])
    props.setSkuSearchText(sku.name)
  }


  const renderSearchResults = () => {
    return (
      <table>
        <tbody>
          {foundSkus.map((sku) => (
            <tr
              key={sku.id}
              onClick={didSelectSku.bind(null, sku)}
              style={{ cursor: 'pointer' }}
            >
              <td>{sku.code}</td>
              <td> {sku.name} </td>
              <td> {sku.unit} </td>
              <td> {sku.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <label htmlFor='search-sku'>Search SKU</label>
      <input
        id='search-sku'
        name='search-sku'
        type='text'
        placeholder='Search SKU by code or name'
        value={props.skuSearchText}
        onChange={handleChange}
      />
      <div>{renderSearchResults()}</div>
    </div>
  );
};

export default SearchSku;
