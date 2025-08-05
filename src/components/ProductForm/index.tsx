import type { Field, Product } from '../../types'
import { DynamicForm } from '../index'

const ProductForm = (
    {
        handleInputChange,
        handleSubmit,
        handleUpdate,
        formData
    }
        : {
            handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
            handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
            handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
            formData: Product
        }) => {

    const fields: Field[] = [
        { title: 'Product', field: 'name', label: 'Product', type: 'text', required: true },
        { title: 'Category', field: 'category', label: 'Category', type: 'text', required: true },
        { title: 'Price', field: 'price', label: 'Price', type: 'number', required: true },
        { title: 'Stock', field: 'stock', label: 'Stock', type: 'number', required: true }
    ]

    return (
        <DynamicForm fields={fields} title='Product' handleInputChange={handleInputChange} handleSubmit={handleSubmit} formData={formData} handleUpdate={handleUpdate} />
    )
}

export default ProductForm