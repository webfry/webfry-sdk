export interface WebfryClientOptions {
  /** Base URL with or without trailing /api. Example: https://webfry.dev */
  baseUrl?: string;
  /** API key for authenticated endpoints. */
  apiKey?: string;
  /** Optional custom fetch implementation. */
  fetchImpl?: typeof fetch;
  /** Request timeout in ms. Defaults to 15000. */
  timeoutMs?: number;
}

export class WebfryApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "WebfryApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface ApiKeyRequest {
  email: string;
  password: string;
}

export interface ApiKeyResponse {
  api_key: string;
}

export interface UserInfoResponse {
  email: string;
  paid_until: string | null;
  plan: "starter" | "pro" | "enterprise" | string;
  api_usage: number;
  max_usage_for_plan: number | null;
  created_at: string;
}

export interface PasswordCheckBody {
  password: string;
}

export interface StrengthResult {
  score: number;
  label: string;
  feedback: string[];
  length?: number;
  entropy?: number;
  charset_size?: number;
  estimated_crack_time?: string;
}

export interface HashLookupBody {
  hashes: string;
}

export interface HashResult {
  hash: string;
  plaintext?: string | null;
  type?: string | null;
  found: boolean;
}

export interface HashSummary {
  total_searched: number;
  total_found: number;
  success_rate: number;
}

export interface HashLookupOutput {
  results: HashResult[];
  summary: HashSummary;
}

export interface HashGeneratorRequest {
  algorithm: string;
  plaintext: string;
}

export interface HashGeneratorResponse {
  algorithm: string;
  hash: string;
}

export interface Base64Request {
  text: string;
  option: "encode" | "decode";
}

export interface Base64Response {
  answer: string;
  error?: string | null;
}

export interface EntropyRequest {
  password: string;
}

export interface EntropyResponse {
  entropy: number;
  estimate_brute_force: string;
}

export interface HashIdentifierRequest {
  hash: string;
}

export interface HashIdentifierResponse {
  estimate: string;
}

export interface GenerateRandomKeyResponse {
  random_key: string;
}

export interface JwtRequest {
  token: string;
}

export interface JwtResponse {
  answer: string;
  error: string;
}

export interface CryptoRequest {
  text: string;
  password: string;
}

export interface CryptoResponse {
  result: string;
  error: string;
}

export interface JsonRequest {
  text: string;
}

export interface JsonResponse {
  result: string;
  error: string;
}

export interface PasswordRequest {
  password: string;
}

export interface PasswordResponse {
  is_common: boolean;
}

export interface SuggestionInput {
  email?: string;
  message: string;
}

export class WebfryClient {
  private readonly baseApiUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private apiKey?: string;

  constructor(options: WebfryClientOptions = {}) {
    const baseUrl = options.baseUrl ?? "https://webfry.dev";
    const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.baseApiUrl = normalized.endsWith("/api") ? normalized : `${normalized}/api`;
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 15_000;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  clearApiKey(): void {
    this.apiKey = undefined;
  }

  async getApiKey(body: ApiKeyRequest): Promise<ApiKeyResponse> {
    return this.requestJson<ApiKeyResponse>("/get_api_key", {
      method: "POST",
      body: JSON.stringify(body),
      headers: this.jsonHeaders(false),
    });
  }

  async rotateApiKey(): Promise<ApiKeyResponse> {
    return this.requestJson<ApiKeyResponse>("/new_api_key", {
      method: "POST",
      headers: this.jsonHeaders(true),
    });
  }

  async userInfo(): Promise<UserInfoResponse> {
    return this.requestJson<UserInfoResponse>("/user_info", {
      method: "POST",
      headers: this.jsonHeaders(true),
    });
  }

  async passwordCheck(body: PasswordCheckBody): Promise<StrengthResult> {
    return this.requestJson<StrengthResult>("/password_check", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async hashLookup(body: HashLookupBody): Promise<HashLookupOutput> {
    return this.requestJson<HashLookupOutput>("/hash_lookup", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async hashLookupSite(body: HashLookupBody): Promise<HashLookupOutput> {
    return this.requestJson<HashLookupOutput>("/hash_lookup_site", {
      method: "POST",
      headers: this.jsonHeaders(false),
      body: JSON.stringify(body),
    });
  }

  async hashGenerator(body: HashGeneratorRequest): Promise<HashGeneratorResponse> {
    return this.requestJson<HashGeneratorResponse>("/hash_generator", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async base64(body: Base64Request): Promise<Base64Response> {
    return this.requestJson<Base64Response>("/base64", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async entropy(body: EntropyRequest): Promise<EntropyResponse> {
    return this.requestJson<EntropyResponse>("/entropy", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async hashIdentifier(body: HashIdentifierRequest): Promise<HashIdentifierResponse> {
    return this.requestJson<HashIdentifierResponse>("/hash_identifier", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async generateRandomKey(): Promise<GenerateRandomKeyResponse> {
    return this.requestJson<GenerateRandomKeyResponse>("/generate_random_key", {
      method: "POST",
      headers: this.jsonHeaders(true),
    });
  }

  async jwtDecoder(body: JwtRequest): Promise<JwtResponse> {
    return this.requestJson<JwtResponse>("/jwt_decoder", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async secureEncrypt(body: CryptoRequest): Promise<CryptoResponse> {
    return this.requestJson<CryptoResponse>("/secure_encrypt", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async secureDecrypt(body: CryptoRequest): Promise<CryptoResponse> {
    return this.requestJson<CryptoResponse>("/secure_decrypt", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async jsonFormat(body: JsonRequest): Promise<JsonResponse> {
    return this.requestJson<JsonResponse>("/json_format", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async jsonMinify(body: JsonRequest): Promise<JsonResponse> {
    return this.requestJson<JsonResponse>("/json_minify", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async commonPassword(body: PasswordRequest): Promise<PasswordResponse> {
    return this.requestJson<PasswordResponse>("/common_pwd", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  async suggestion(body: SuggestionInput): Promise<string> {
    return this.requestText("/suggestion", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  /**
   * Endpoint exists but is currently under construction (RELEASE_V2 gate).
   */
  async ipInfo(body: { ip_string: string }): Promise<unknown> {
    return this.requestJson<unknown>("/ip_info", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  /**
   * Endpoint exists but is currently under construction (RELEASE_V2 gate).
   */
  async dataBreach(body: { ip_string: string }): Promise<unknown> {
    return this.requestJson<unknown>("/data_breach", {
      method: "POST",
      headers: this.jsonHeaders(true),
      body: JSON.stringify(body),
    });
  }

  private jsonHeaders(requireApiKey: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requireApiKey) {
      if (!this.apiKey) {
        throw new Error("API key is required for this endpoint. Use setApiKey() first.");
      }
      headers["X-API-Key"] = this.apiKey;
    }

    return headers;
  }

  private async requestJson<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.request(path, init);
    const raw = await response.text();
    const payload = raw.length > 0 ? safeJsonParse(raw) : null;

    if (!response.ok) {
      throw new WebfryApiError(errorMessageFromPayload(payload, response.statusText), response.status, payload);
    }

    return payload as T;
  }

  private async requestText(path: string, init: RequestInit): Promise<string> {
    const response = await this.request(path, init);
    const text = await response.text();

    if (!response.ok) {
      const payload = safeJsonParse(text);
      throw new WebfryApiError(errorMessageFromPayload(payload, response.statusText), response.status, payload ?? text);
    }

    return text;
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      return await this.fetchImpl(`${this.baseApiUrl}${path}`, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function errorMessageFromPayload(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const maybeError = (payload as { error?: unknown }).error;
    if (typeof maybeError === "string" && maybeError.length > 0) {
      return maybeError;
    }

    const maybeMessage = (payload as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
      return maybeMessage;
    }
  }

  return fallback || "Request failed";
}
