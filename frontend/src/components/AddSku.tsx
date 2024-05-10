import { useFormik } from 'formik';
import { SkuFormErrors, Sku } from '../common/types';
import { useState } from 'react';
import { createSkuService } from '../common/services';

export default function SkuUi() {
  const [skuList, setSkuList] = useState([] as Sku[]);
  const [hasErrors, setHasErrors] = useState(true);
  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      unit: '',
      image: '',
      price: '',
    },
    onSubmit: async (values) => {
      const input ={
        code: values.code,
        name: values.name,
        unit: values.unit,
        image: values.image,
        price: parseFloat(values.price),
      }
      const sku = await createSkuService(input);
      setSkuList([...skuList, sku]);
    },
    validate: (values) => {
      let errors = {} as SkuFormErrors;
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (!values.code) {
        errors.code = 'Code is required';
      }
      if (!values.unit) {
        errors.unit = 'Unit is required';
      }
      if (!values.price) {
        errors.price = 'Price is required';
      } else if (parseFloat(values.price) <= 0) {
        errors.price = 'Price must be greater than 0';
      }
      setHasErrors(Object.values(errors).length > 0);
      return errors;
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h2>SKU</h2>

        <div className='form-control'>
          <label htmlFor='code'>Code</label>
          <input
            type='text'
            id='code'
            name='code'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.code}
          />
          {formik.errors.code && formik.touched.code ? (
            <div className='error'>Error: {formik.errors.code}</div>
          ) : null}
        </div>

        <div className='form-control'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            name='name'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name ? (
            <div className='error'>Error: {formik.errors.name}</div>
          ) : null}
        </div>

        <div className='form-control'>
          <label htmlFor='unit'>Unit</label>
          <input
            type='text'
            id='unit'
            name='unit'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.unit}
          />
          {formik.errors.unit && formik.touched.unit ? (
            <div className='error'>Error: {formik.errors.unit}</div>
          ) : null}
        </div>

        <div className='form-control'>
          <label htmlFor='image'>Image</label>
          <input
            type='text'
            id='image'
            name='image'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.image}
          />
          {formik.errors.image && formik.touched.image ? (
            <div className='error'>Error: {formik.errors.image}</div>
          ) : null}
        </div>

        <div className='form-control'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            id='price'
            name='price'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.errors.price && formik.touched.price ? (
            <div className='error'>Error: {formik.errors.price}</div>
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
            <th>Code</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Image</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {skuList.map((sku) => {
            return (
              <tr
                className='output'
                key={sku.id}
              >
                <td>{sku.code} </td>
                <td>{sku.name} </td>
                <td>{sku.unit} </td>
                <td>{sku.image} </td>
                <td>{sku.price} </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </form>
    </>
  );
}
