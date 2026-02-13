import { useQuery } from '@tanstack/react-query'

export function useDynamicQuery<T>(queryKey: string[], url: string) {
    const fetcher = async (): Promise<T> => {

        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        return data
    }

    const { data, isLoading, error } = useQuery<T, Error>({
        queryKey,
        queryFn: fetcher,
        staleTime: Infinity
    })

    return { data, isLoading, error }
}