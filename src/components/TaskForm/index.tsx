import type { Field, Task } from '../../types'
import { DynamicForm } from '../index'

const TaskForm = (
    {
        handleInputChange,
        handleSubmit,
        handleUpdate,
        formData
    }: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: Task
    }
) => {

    const fields: Field[] = [
        { title: 'Title', field: 'title', label: 'Title', type: 'text', required: true },
        { title: 'Description', field: 'description', label: 'Description', type: 'text', required: true },
    ]

    return (
        <DynamicForm fields={fields} title='Task' handleInputChange={handleInputChange} handleSubmit={handleSubmit} formData={formData} handleUpdate={handleUpdate} />
    )
}

export default TaskForm
