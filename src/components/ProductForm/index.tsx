import type { Field } from '../../types'
import { DynamicForm } from '../index'

const ProductForm = () => {

    const fields: Field[] = [
        { title: 'Product', field: 'product', label: 'Product', type: 'text', required: true },
        { title: 'Category', field: 'category', label: 'Category', type: 'text', required: true },
        { title: 'Price', field: 'price', label: 'Price', type: 'number', required: true },
        { title: 'Stock', field: 'stock', label: 'Stock', type: 'number', required: true }
    ]

    return (
        <DynamicForm fields={fields} title='Product'/>
    )
}

export default ProductForm