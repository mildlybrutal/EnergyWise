export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    status?: number;
}

export interface AISuggestion {
    suggestion: string;
    potentialSavingsUnits: number;
    potentialCostSavings: number;
}

export interface UsageResponse {
    message: string;
    suggestions: AISuggestion[];
}