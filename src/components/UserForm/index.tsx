import type { Field } from '../../types'
import { DynamicForm } from '../index'

const UserForm = () => {

    const fields: Field[] = [
        { title: 'Name', field: 'name', label: 'Name', type: 'text', required: true },
        { title: 'Last name', field: 'lastName', label: 'Last name', type: 'text', required: true },
        { title: 'Email', field: 'email', label: 'Email', type: 'email', required: true },
        { title: 'Phone', field: 'phone', label: 'Phone', type: 'text', required: true },
        { title: 'Address', field: 'address', label: 'Address', type: 'text', required: true },
    ]

    return (
        <DynamicForm fields={fields} title='User'/>
    )
}

export default UserForm
