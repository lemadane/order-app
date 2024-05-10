import { useFormik } from 'formik';
import { CustomerFormErrors, Customer } from '../common/types';
import { useState } from 'react';
import { createCustomerService } from '../common/services';

export default function CustomerUi() {
  const numericRegex = /^[0-9]*$/;
  const [customers, setCustomers] = useState([] as Customer[]);
  const [hasErrors, setHasErrors] = useState(true);
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      mobile: '',
      city: '',
    },
    onSubmit: async (values) => {
      const customer = await createCustomerService(values);
      setCustomers([...customers, customer]);
    },
    validate: (values) => {
      let errors = {} as CustomerFormErrors;
      if (!values.firstname) {
        errors.firstname = 'First name is required';
      }
      if (!values.lastname) {
        errors.firstname = 'Last is required';
      }
      if (!values.mobile) {
        errors.mobile = 'Mobile number is required';
      } else if (
        values.mobile.length !== 10 &&
        !numericRegex.test(values.mobile)
      ) {
        errors.mobile = 'Mobile number must be 10 digits';
      }
      if (!values.city) {
        errors.city = 'City is required';
      }
      setHasErrors(Object.values(errors).length > 0);
      return errors;
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Customer</h2>
      <div className='form-control'>
        <label htmlFor='firstname'>First Name</label>
        <input
          type='text'
          id='firstname'
          name='firstname'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstname}
        />
        {formik.errors.firstname && formik.touched.firstname ? (
          <div className='error'>Error: {formik.errors.firstname}</div>
        ) : null}
      </div>
      <div className='form-control'>
        <label htmlFor='lastname'>Last Name</label>
        <input
          type='text'
          id='lastname'
          name='lastname'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastname}
        />
        {formik.errors.lastname && formik.touched.lastname ? (
          <div className='error'>Error: {formik.errors.lastname}</div>
        ) : null}
      </div>
      <div className='form-control'>
        <label htmlFor='mobile'>Mobile Number</label>
        <input
          type='text'
          id='mobile'
          name='mobile'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.mobile}
        />
        {formik.errors.mobile && formik.touched.mobile ? (
          <div className='error'>Error: {formik.errors.mobile}</div>
        ) : null}
      </div>
      <div className='form-control'>
        <label htmlFor='city'>City</label>
        <input
          type='text'
          id='city'
          name='city'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.city}
        />
        {formik.errors.city && formik.touched.city ? (
          <div className='error'>Error: {formik.errors.city}</div>
        ) : null}
      </div>
      <button
        type='submit'
        disabled={hasErrors}
      >
        Submit
      </button>
      
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>City</th>
          </tr>
        </thead>
       
        <tbody className='scrollit'>
        {customers.map((customer) => {
          return (
            <tr
              className='output'
              key={customer.id}
            >
              <td>{customer.firstname} </td>
              <td>{customer.lastname} </td>
              <td>{customer.mobile} </td>
              <td>{customer.city} </td>
            </tr>
          );
        })}
        </tbody>
      </table>
     
    </form>
  );
}
