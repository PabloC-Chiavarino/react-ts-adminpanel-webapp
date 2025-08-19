import { DynamicForm } from "../index";
import { type SelectChangeEvent } from '@mui/material';
import type { Field, Event } from "../../types";

const EventForm = (
    {
        handleInputChange,
        handleSelectChange,
        handleSubmit,
        handleUpdate,
        formData
    }: {
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange: (e: SelectChangeEvent<string | string[]>, field: Field) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: Event
    }
) => {

    const fields: Field[] = [
        { title: 'Title', field: 'title', label: 'Title', type: 'text', required: true },
        { title: 'Description', field: 'description', label: 'Description', type: 'text', required: true },
        { title: 'Category', field: 'category', label: 'Category', type: 'select', required: true, options: [{ value: 1, label: 'Low' }, { value: 2, label: 'Medium' }, { value: 3, label: 'High' }] },
    ]

    return (
        <DynamicForm fields={fields} title='Event' handleInputChange={handleInputChange} handleSubmit={handleSubmit} formData={formData} handleUpdate={handleUpdate} handleSelectChange={handleSelectChange} />
    )
}

export default EventForm