import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSnackbar } from "notistack"
import { useDynamicQuery } from "../../hooks"
import { useAuth } from "../../context/AuthContext"
import type { User } from "../../types"
import { Box, Typography, Paper, CircularProgress, Button, TextField } from "@mui/material"
import { API_BASE_URL } from '../../config'

const UserProfile = () => {
    const { user } = useAuth()
    const { enqueueSnackbar } = useSnackbar()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)

    const USERS_ENDPOINT = `${API_BASE_URL}/users`
    const { data: usersData, isLoading, error } = useDynamicQuery<User[]>(["users"], USERS_ENDPOINT)

    const userData = usersData?.find((u) => u.id === Number(user?.id))

    const [formData, setFormData] = useState<Partial<User>>({})

    const mutation = useMutation({
        mutationFn: async (updatedUser: User) => {
            const response = await fetch(`${USERS_ENDPOINT}/${updatedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            })
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            enqueueSnackbar("Profile updated successfully", { variant: "success" })
            setIsEditing(false)
        },
        onError: () => {
            enqueueSnackbar("Error updating profile", { variant: "error" })
        },
    })

    const handleEdit = () => {
        if (userData) {
            setFormData({ ...userData })
            setIsEditing(true)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({})
    }

    const handleSave = () => {
        if (userData && formData) {
            mutation.mutate({ ...userData, ...formData } as User)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (isLoading) return <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress size={60} /></Box>
    if (error) return <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><Typography variant="h1">{error.message}</Typography></Box>
    if (!userData) return <Typography variant="h1">User not found</Typography>

    const fields = [
        { name: "name", label: "Name" },
        { name: "lastName", label: "Last Name" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "address", label: "Address" },
    ]

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h1" sx={{ mb: 5 }}>
                My Account
            </Typography>
            <Paper sx={{ width: "100%", maxWidth: "700px", p: 4, borderRadius: "16px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Typography sx={{ color: "common.white", fontSize: "24px", fontWeight: "bold" }}>
                                {userData.name.charAt(0).toUpperCase()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                                {userData.name} {userData.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                                {userData.email}
                            </Typography>
                        </Box>
                    </Box>
                    {!isEditing && (
                        <Button variant="contained" onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    )}
                </Box>

                {isEditing ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField name="name" label="Name" size="small" value={formData.name ?? ""} onChange={handleChange} sx={{ flex: 1 }} />
                            <TextField name="lastName" label="Last Name" size="small" value={formData.lastName ?? ""} onChange={handleChange} sx={{ flex: 1 }} />
                        </Box>
                        <TextField name="email" label="Email" size="small" value={formData.email ?? ""} onChange={handleChange} />
                        <TextField name="phone" label="Phone" size="small" value={formData.phone ?? ""} onChange={handleChange} />
                        <TextField name="address" label="Address" size="small" value={formData.address ?? ""} onChange={handleChange} />
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                            <Button variant="contained" onClick={handleSave} disabled={mutation.isPending}>
                                {mutation.isPending ? <CircularProgress size={20} /> : "Save"}
                            </Button>
                            <Button variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {fields.map((field) => (
                            <Box key={field.name} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>{field.label}</Typography>
                                <Typography sx={{ fontWeight: 500 }}>{(userData as Record<string, unknown>)[field.name] as string || "-"}</Typography>
                            </Box>
                        ))}
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                            <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>Member Since</Typography>
                            <Typography sx={{ fontWeight: 500 }}>{userData.createdAt}</Typography>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    )
}

export default UserProfile
