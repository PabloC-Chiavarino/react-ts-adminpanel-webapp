import { useQuery } from '@tanstack/react-query'

export function useDynamicQuery<T>(pathKey: string) {
    const fetcher = async (): Promise<T> => {
        try {
            const response = await fetch(pathKey)
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw error
        }
    }

    const { data, isLoading, error } = useQuery<T, Error>({
        queryKey: [pathKey],
        queryFn: fetcher
    })

    return { data, isLoading, error }
}