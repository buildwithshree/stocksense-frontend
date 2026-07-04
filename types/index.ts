export interface User { id:string; email:string; fullName:string; role:"USER"|"ADMIN"; createdAt:string; }
export interface AuthResponse { accessToken:string; refreshToken:string; tokenType:string; expiresInMs:number; user:User; }
export interface PredictionResponse { id:string; ticker:string; companyName:string; currency:string; lastClose:number; predictedClose:number; expectedMovePercent:number; confidenceLower:number; confidenceUpper:number; directionProbability:number; riskScore:number; riskLabel:"Low"|"Moderate"|"High"|"Very High"; modelName:string; modelVersion:string; rmse:number; inferenceTimeMs:number; topFeatures:string[]; generatedAt:string; }
export interface PredictionHistoryItem { id:string; ticker:string; generatedAt:string; modelName:string; predictedClose:number; actualClose:number|null; actualErrorPct:number|null; riskScore:number; riskLabel:string; }
export interface WatchlistItem { id:string; ticker:string; addedAt:string; }
export interface PagedResponse<T> { content:T[]; page:number; size:number; totalElements:number; totalPages:number; }
export interface AdminMetrics { totalUsers:number; totalPredictions:number; predictionsLast24h:number; failedPredictionsLast24h:number; topTickers:{ticker:string;requestCount:number}[]; modelSummaries:{modelName:string;averageRmse:number;averageInferenceTimeMs:number;trainingRuns:number}[]; }
