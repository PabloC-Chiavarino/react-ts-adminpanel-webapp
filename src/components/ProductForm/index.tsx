import type { Field, Product } from '../../types'
import { DynamicForm } from '../index'

const ProductForm = (
    {
        handleChange,
        handleSubmit,
        formData
    }
        : {
            handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
            handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
            formData: Product
        }) => {

    const fields: Field[] = [
        { title: 'Product', field: 'name', label: 'Product', type: 'text', required: true },
        { title: 'Category', field: 'category', label: 'Category', type: 'text', required: true },
        { title: 'Price', field: 'price', label: 'Price', type: 'number', required: true },
        { title: 'Stock', field: 'stock', label: 'Stock', type: 'number', required: true }
    ]

    return (
        <DynamicForm fields={fields} title='Product' handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} />
    )
}

export default ProductForm