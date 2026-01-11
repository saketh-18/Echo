import { apiClient } from "@/api/client"


export const connectionsRepo = {
    getConnections() {
        return apiClient("connections")
    }
}