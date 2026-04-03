import type { Field, Order, User, Product } from '../../types'
import { DynamicForm } from '../index'
import type { SelectChangeEvent } from '@mui/material'

const OrderForm = (
    {
        handleInputChange,
        handleSelectChange,
        handleSubmit,
        handleUpdate,
        formData,
        users,
        products
    }: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange: (e: SelectChangeEvent<string | string[]>, field: Field) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        handleUpdate?: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: Order;
        users: User[];
        products: Product[];
    }
) => {

    const fields: Field[] = [
        { 
            title: 'Client', 
            field: 'clientId', 
            label: 'Client', 
            type: 'select', 
            required: true,
            multiple: false,
            options: users.map(user => ({ label: `${user.name} ${user.lastName}`, value: user.id }))
        },
        { 
            title: 'Products', 
            field: 'productIds', 
            label: 'Products', 
            type: 'select', 
            required: true,
            multiple: true,
            options: products.map(product => ({ label: product.name, value: product.id }))
        },
    ]

    return (
        <DynamicForm 
            fields={fields} 
            title='Order' 
            handleInputChange={handleInputChange} 
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit} 
            formData={formData} 
            handleUpdate={handleUpdate} 
        />
    )
}

export default OrderForm
