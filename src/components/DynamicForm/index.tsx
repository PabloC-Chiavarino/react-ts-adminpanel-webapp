import type { Field } from '../../types';
import { Box, TextField, Button, Typography } from '@mui/material'

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
        handleChange,
        handleSubmit,
        formData
    }: {
        fields: Field[];
        title: string;
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        formData: T;
    }
) => {

    const fieldPairs = groupByPairs(fields)

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
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
                backgroundColor: '#fff',
                zIndex: 100,
            }}
        >
            <Typography variant="h6" sx={{ alignSelf: 'center', mb: 1.5, fontWeight: 'bold', fontSize: 22 }}>
                Nuevo {title}
            </Typography>
            {fieldPairs.map((pair, key) => (
                <Box
                    key={key}
                    sx={{
                        display: 'flex',
                        width: '100%',
                        gap: 3,
                        px: 4
                    }}
                >
                    {pair.map((field, key) => (
                        <TextField
                            key={key}
                            name={field.field}
                            size='small'
                            label={field.label}
                            onChange={handleChange}
                            required={true}
                            value={formData[field.field] ?? ''}
                            sx={{ flex: 1 }}
                        />
                    ))}
                </Box>
            ))}
            <Button type='submit' variant="contained" sx={{ width: '120px', height: '45px', mt: 1 }}>
                AGREGAR
            </Button>
        </Box>
    )
}

export default DynamicForm