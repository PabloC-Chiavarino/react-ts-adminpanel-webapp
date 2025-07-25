import type { Field, User } from '../../types'
import { DynamicForm } from '../index'

const UserForm = (
    {
        handleChange,
        handleSubmit,
        handleUpdate,
        formData
    }: {
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: User
    }
) => {

    const fields: Field[] = [
        { title: 'Name', field: 'name', label: 'Name', type: 'text', required: true },
        { title: 'Last name', field: 'lastName', label: 'Last name', type: 'text', required: true },
        { title: 'Email', field: 'email', label: 'Email', type: 'email', required: true },
        { title: 'Phone', field: 'phone', label: 'Phone', type: 'text', required: true },
        { title: 'Address', field: 'address', label: 'Address', type: 'text', required: true },
    ]

    return (
        <DynamicForm fields={fields} title='User' handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} handleUpdate={handleUpdate} />
    )
}

export default UserForm
