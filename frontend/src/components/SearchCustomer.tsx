import { useState } from 'react'
import { Customer } from '../common/types'
import './Search.css'

type Props = {
  customers: Customer[]
  setSelectedCustomer: (customer: Customer) => void
  customerSearchText: string 
  setCustomerSearchText: (customerSearchText: string) => void
}

const SearchCustomer = (props: Props) => {
  const [foundCustomers, setFoundCustomers] = useState<Customer[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    props.setCustomerSearchText(value)
    const searchResults = [] as Customer[]
    for (let cust of props.customers) {
      let searchTerm = `${cust.firstname} ${cust.lastname} ${cust.city}`
      searchTerm = searchTerm.toLowerCase()
      if (searchTerm.includes(value.toLowerCase())) {
        searchResults.push(cust)
      }
    }
    setFoundCustomers(searchResults)
  }

  const didSelectCustomer = (cust: Customer) => {
    props.setSelectedCustomer(cust)
    setFoundCustomers([])
    props.setCustomerSearchText(`${cust.firstname} ${cust.lastname}`)
  }

  const renderSearchResults = () => {
    return (
      <table>
        <tbody>
          {foundCustomers.map((cust) => (
            <tr
              key={cust.id}
              onClick={didSelectCustomer.bind(null, cust)}
              style={{ cursor: 'pointer' }}
            >
              <td>{cust.firstname}</td>
              <td> {cust.lastname} </td>
              <td> {cust.city} </td>
              <td> {cust.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <label htmlFor='search-customer'>Search Customer</label>
      <input
        id='search-customer'
        name='search-customer'
        type='text'
        placeholder='Search Customer name or city'
        value={props.customerSearchText}
        onChange={handleChange}
      />
      <div>{renderSearchResults()}</div>
    </div>
  )
}

export default SearchCustomer
