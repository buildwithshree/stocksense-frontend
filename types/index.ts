export interface User { id:string; email:string; fullName:string; role:"USER"|"ADMIN"; createdAt:string; }
export interface AuthResponse { accessToken:string; refreshToken:string; tokenType:string; expiresInMs:number; user:User; }
export interface PredictionResponse { id:string; ticker:string; companyName:string; currency:string; lastClose:number; predictedClose:number; expectedMovePercent:number; confidenceLower:number; confidenceUpper:number; directionProbability:number; riskScore:number; riskLabel:"Low"|"Moderate"|"High"|"Very High"; modelName:string; modelVersion:string; rmse:number; inferenceTimeMs:number; topFeatures:string[]; generatedAt:string; }
export interface PredictionHistoryItem { id:string; ticker:string; generatedAt:string; modelName:string; predictedClose:number; actualClose:number|null; actualErrorPct:number|null; riskScore:number; riskLabel:string; }
export interface WatchlistItem { id:string; ticker:string; addedAt:string; }
export interface PagedResponse<T> { content:T[]; page:number; size:number; totalElements:number; totalPages:number; }
export interface AdminMetrics { totalUsers:number; totalPredictions:number; predictionsLast24h:number; failedPredictionsLast24h:number; topTickers:{ticker:string;requestCount:number}[]; modelSummaries:{modelName:string;averageRmse:number;averageInferenceTimeMs:number;trainingRuns:number}[]; }

// Mirrors the backend's sealed PredictionOutcome (PredictionReady /
// PredictionTraining) and the ML API's 200/202 contract underneath it.
// Modelled as a discriminated union on `status` so every place that
// consumes a prediction result is forced by TypeScript to handle BOTH
// cases — same reasoning as the backend's sealed interface: no nullable
// fields to misuse, no "forgot to check for the training case" bugs.
export interface PredictionReady {
  status: "ready";
  data: PredictionResponse;
}
export interface PredictionTraining {
  status: "training";
  ticker: string;
  message: string;
  retryAfterSeconds: number;
}
export type PredictionOutcome = PredictionReady | PredictionTraining;