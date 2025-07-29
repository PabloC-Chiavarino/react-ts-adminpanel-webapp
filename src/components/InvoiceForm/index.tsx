import { Box, type SelectChangeEvent } from '@mui/material';
import type { Field, Invoice, Product, User } from '../../types'
import { DynamicForm, InvoicePreview } from '../index'

const InvoiceForm = (
    {
        handleInputChange,
        handleSelectChange,
        handleSubmit,
        formData,
        users,
        products,
    }: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange: (e: SelectChangeEvent<string | string[]>, field: Field) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: Invoice;
        users: User[];
        products: Product[];
    }
) => {

    const fields: Field[] = [
        {
            title: 'Client', field: 'clientId', label: 'Client', type: 'select', required: true, multiple: false, options: users.map(user => (
                { value: user.id, label: user.name + ' ' + user.lastName }
            ))
        },
        {
            title: 'Products', field: 'productIds', label: 'Products', type: 'select', required: true, multiple: true, options: products.map(product => (
                { value: product.id, label: product.name }
            ))
        }
    ]

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <DynamicForm fields={fields} title='Invoice' handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleSubmit={handleSubmit} formData={formData} />
            <InvoicePreview formData={formData} users={users} products={products} />
        </Box>
    )
}

export default InvoiceForm
