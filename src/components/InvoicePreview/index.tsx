import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import type { Invoice, User, Product } from "../../types"

const InvoicePreview = ({ formData, users, products }: { formData: Invoice, users: User[], products: Product[] }) => {
    return (
        <Box sx={{
                pointerEvents: 'all',
                width: '650px',
                height: '330px',
                overflowY: 'hidden',
                backgroundColor: '#fff',
                borderRadius: '8px',
                position: 'absolute',
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                zIndex: 0,
                transform: formData.clientId !== null || formData.productIds.length !== 0 ? 'translateY(0%)' : 'translateY(100%)',
                transition: 'transform 0.2s ease',
                boxShadow: 3
            }}>
                <TableContainer component={Paper} sx={{ width: '100%', zIndex: 1, overflowY: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 22, p: 2.5, display: 'flex', justifyContent: 'center' }}>Client</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ p: 0, height: 38, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>
                                    {formData.clientId ? users.find(user => user.id === formData.clientId)?.name + ' ' + users.find(user => user.id === formData.clientId)?.lastName : ''}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 22, p: 2.5, display: 'flex', justifyContent: 'center' }}>Products</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    <Box sx={{ height: 5 * 38, overflowY: 'scroll' }}>
                        <Table>
                            <TableBody>
                                {products.filter(product => formData.productIds.includes(product.id)).map((product, index) => (
                                    <TableRow key={index} >
                                        <TableCell sx={{ p: 0, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>
                                            {product.name}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </Box>
    )
}

export default InvoicePreview