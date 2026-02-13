import { type SelectChangeEvent } from '@mui/material';
import type { Field } from '../../types';
import { Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material'

const groupByPairs = <T,>(arr: T[]): T[][] => {
    const pairs: T[][] = []
    for (let i = 0; i < arr.length; i += 2) {
        pairs.push(arr.slice(i, i + 2))
    }
    return pairs
}

const DynamicForm = <T extends Record<string, unknown>>(
    {
        fields,
        title,
        handleInputChange,
        handleSelectChange,
        handleSubmit,
        handleUpdate,
        formData
    }: {
        fields: Field[];
        title: string;
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSelectChange?: (e: SelectChangeEvent<string | string[]>, field: Field) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        handleUpdate?: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: T;
    }
) => {

    const fieldPairs = groupByPairs(fields)

    const existingUser = formData.id !== 0

    return (
        <Box
            component="form"
            onSubmit={existingUser && handleUpdate ? handleUpdate : handleSubmit}
            sx={{
                pointerEvents: 'all',
                width: '650px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                gap: 3,
                pt: 4,
                pb: 5,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'background.paper',
                zIndex: 100,
            }}
        >
            <Typography variant="h6" sx={{ alignSelf: 'center', mb: 1.5, fontWeight: 'bold', fontSize: 22 }}>
                New {title}
            </Typography>
            {fieldPairs.map((pair, pairIndex) => (
                <Box
                    key={`pair-${pairIndex}`}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        gap: 3,
                        px: 4
                    }}
                >
                    {pair.map((field, fieldIndex) => (
                        field.type === 'select' ? (
                            <FormControl sx={{ flex: 1, }} key={`field-${fieldIndex}`}>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    labelId={field.label}
                                    required={true}
                                    multiple={field.multiple}
                                    name={field.field}
                                    size='small'
                                    label={field.label}
                                    onChange={(e) => handleSelectChange!(e, field)}
                                    value={
                                        field.multiple
                                            ? Array.isArray(formData[field.field])
                                                ? (formData[field.field] as number[]).map(String)
                                                : []
                                            : typeof formData[field.field] === 'number'
                                                ? String(formData[field.field])
                                                : ''
                                    }
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        '& .MuiSelect-select': {
                                            textAlign: 'center',
                                        }
                                    }}
                                >
                                    {field.options!.map((option, optionIndex) => (
                                        <MenuItem key={optionIndex} value={String(option.value)}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                key={`pair-${fieldIndex}`}
                                name={field.field}
                                size='small'
                                label={field.label}
                                onChange={handleInputChange}
                                required={true}
                                value={formData[field.field] ?? ''}
                                sx={{ flex: 1 }}
                            />
                        )
                    ))}
                </Box>
            ))}
            <Button type='submit' variant="contained" sx={{ width: '120px', height: '45px', mt: 1 }}>
                {existingUser ? 'UPDATE' : 'ADD'}
            </Button>
        </Box>
    )
}

export default DynamicForm