# Security Best Practices for Element Plus Applications

## Overview

This guide covers comprehensive security best practices for Element Plus applications, including authentication, authorization, data protection, secure coding practices, and vulnerability management.

## Authentication and Authorization

### JWT Token Management

```typescript
// src/utils/auth/token-manager.ts
import { jwtDecode } from 'jwt-decode'
import CryptoJS from 'crypto-js'

export interface TokenPayload {
  sub: string
  iat: number
  exp: number
  roles: string[]
  permissions: string[]
  sessionId: string
}

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private static readonly ENCRYPTION_KEY = process.env.VITE_TOKEN_ENCRYPTION_KEY || 'default-key'
  private static readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes
  
  private static refreshPromise: Promise<string> | null = null
  
  /**
   * Securely store encrypted token
   */
  public static setTokens(accessToken: string, refreshToken: string): void {
    try {
      const encryptedAccessToken = this.encryptToken(accessToken)
      const encryptedRefreshToken = this.encryptToken(refreshToken)
      
      // Use secure storage with httpOnly flag simulation
      this.setSecureItem(this.ACCESS_TOKEN_KEY, encryptedAccessToken)
      this.setSecureItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken)
      
      // Set automatic refresh
      this.scheduleTokenRefresh(accessToken)
    } catch (error) {
      console.error('Failed to store tokens:', error)
      throw new Error('Token storage failed')
    }
  }
  
  /**
   * Get decrypted access token
   */
  public static getAccessToken(): string | null {
    try {
      const encryptedToken = this.getSecureItem(this.ACCESS_TOKEN_KEY)
      if (!encryptedToken) return null
      
      const token = this.decryptToken(encryptedToken)
      
      // Validate token before returning
      if (this.isTokenValid(token)) {
        return token
      }
      
      // Token is invalid, attempt refresh
      this.refreshTokenIfNeeded()
      return null
    } catch (error) {
      console.error('Failed to retrieve access token:', error)
      this.clearTokens()
      return null
    }
  }
  
  /**
   * Get decrypted refresh token
   */
  public static getRefreshToken(): string | null {
    try {
      const encryptedToken = this.getSecureItem(this.REFRESH_TOKEN_KEY)
      if (!encryptedToken) return null
      
      return this.decryptToken(encryptedToken)
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error)
      this.clearTokens()
      return null
    }
  }
  
  /**
   * Clear all tokens
   */
  public static clearTokens(): void {
    this.removeSecureItem(this.ACCESS_TOKEN_KEY)
    this.removeSecureItem(this.REFRESH_TOKEN_KEY)
    
    // Clear any scheduled refresh
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  }
  
  /**
   * Validate token structure and expiration
   */
  public static isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const now = Date.now() / 1000
      
      // Check expiration with buffer
      return decoded.exp > now + 60 // 1 minute buffer
    } catch (error) {
      return false
    }
  }
  
  /**
   * Get token payload
   */
  public static getTokenPayload(): TokenPayload | null {
    const token = this.getAccessToken()
    if (!token) return null
    
    try {
      return jwtDecode<TokenPayload>(token)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }
  
  /**
   * Check if token needs refresh
   */
  public static shouldRefreshToken(): boolean {
    const token = this.getAccessToken()
    if (!token) return true
    
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const now = Date.now() / 1000
      const timeUntilExpiry = (decoded.exp - now) * 1000
      
      return timeUntilExpiry <= this.TOKEN_REFRESH_THRESHOLD
    } catch (error) {
      return true
    }
  }
  
  /**
   * Refresh token if needed
   */
  public static async refreshTokenIfNeeded(): Promise<string | null> {
    if (!this.shouldRefreshToken()) {
      return this.getAccessToken()
    }
    
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }
    
    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }
  
  private static async performTokenRefresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearTokens()
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        credentials: 'same-origin'
      })
      
      if (!response.ok) {
        throw new Error('Token refresh failed')
      }
      
      const data = await response.json()
      this.setTokens(data.accessToken, data.refreshToken)
      
      return data.accessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
      
      // Emit logout event
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { reason: 'token_refresh_failed' }
      }))
      
      throw error
    }
  }
  
  private static refreshTimeout: NodeJS.Timeout | null = null
  
  private static scheduleTokenRefresh(token: string): void {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const now = Date.now() / 1000
      const timeUntilRefresh = Math.max(
        (decoded.exp - now - this.TOKEN_REFRESH_THRESHOLD / 1000) * 1000,
        0
      )
      
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout)
      }
      
      this.refreshTimeout = setTimeout(() => {
        this.refreshTokenIfNeeded()
      }, timeUntilRefresh)
    } catch (error) {
      console.error('Failed to schedule token refresh:', error)
    }
  }
  
  private static encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.ENCRYPTION_KEY).toString()
  }
  
  private static decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }
  
  private static setSecureItem(key: string, value: string): void {
    // In a real application, consider using secure storage
    // For now, using localStorage with encryption
    localStorage.setItem(key, value)
  }
  
  private static getSecureItem(key: string): string | null {
    return localStorage.getItem(key)
  }
  
  private static removeSecureItem(key: string): void {
    localStorage.removeItem(key)
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
// src/utils/auth/rbac.ts
import { TokenManager } from './token-manager'

export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface Role {
  name: string
  permissions: Permission[]
  inherits?: string[]
}

export class RBACManager {
  private static roles: Map<string, Role> = new Map()
  private static userRoles: string[] = []
  private static userPermissions: Permission[] = []
  
  /**
   * Initialize RBAC with user roles and permissions
   */
  public static initialize(): void {
    const payload = TokenManager.getTokenPayload()
    if (payload) {
      this.userRoles = payload.roles || []
      this.loadUserPermissions()
    }
  }
  
  /**
   * Check if user has specific permission
   */
  public static hasPermission(
    resource: string,
    action: string,
    context?: Record<string, any>
  ): boolean {
    return this.userPermissions.some(permission => {
      if (permission.resource !== resource || permission.action !== action) {
        return false
      }
      
      // Check conditions if provided
      if (permission.conditions && context) {
        return this.evaluateConditions(permission.conditions, context)
      }
      
      return true
    })
  }
  
  /**
   * Check if user has any of the specified roles
   */
  public static hasRole(roles: string | string[]): boolean {
    const rolesToCheck = Array.isArray(roles) ? roles : [roles]
    return rolesToCheck.some(role => this.userRoles.includes(role))
  }
  
  /**
   * Check if user has all specified roles
   */
  public static hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.userRoles.includes(role))
  }
  
  /**
   * Get user's effective permissions
   */
  public static getUserPermissions(): Permission[] {
    return [...this.userPermissions]
  }
  
  /**
   * Get user's roles
   */
  public static getUserRoles(): string[] {
    return [...this.userRoles]
  }
  
  /**
   * Check if user can access a route
   */
  public static canAccessRoute(routeMeta: any): boolean {
    // Check authentication requirement
    if (routeMeta.requiresAuth && !TokenManager.getAccessToken()) {
      return false
    }
    
    // Check role requirements
    if (routeMeta.roles && !this.hasRole(routeMeta.roles)) {
      return false
    }
    
    // Check permission requirements
    if (routeMeta.permissions) {
      return routeMeta.permissions.every((perm: any) => 
        this.hasPermission(perm.resource, perm.action, perm.context)
      )
    }
    
    return true
  }
  
  private static loadUserPermissions(): void {
    this.userPermissions = []
    
    // Load permissions from token payload
    const payload = TokenManager.getTokenPayload()
    if (payload?.permissions) {
      this.userPermissions = payload.permissions.map(perm => {
        const [resource, action] = perm.split(':')
        return { resource, action }
      })
    }
    
    // Load role-based permissions
    this.userRoles.forEach(roleName => {
      const role = this.roles.get(roleName)
      if (role) {
        this.userPermissions.push(...role.permissions)
        
        // Handle role inheritance
        if (role.inherits) {
          role.inherits.forEach(inheritedRole => {
            const inherited = this.roles.get(inheritedRole)
            if (inherited) {
              this.userPermissions.push(...inherited.permissions)
            }
          })
        }
      }
    })
    
    // Remove duplicates
    this.userPermissions = this.userPermissions.filter(
      (perm, index, self) => 
        index === self.findIndex(p => 
          p.resource === perm.resource && p.action === perm.action
        )
    )
  }
  
  private static evaluateConditions(
    conditions: Record<string, any>,
    context: Record<string, any>
  ): boolean {
    return Object.entries(conditions).every(([key, value]) => {
      const contextValue = context[key]
      
      if (typeof value === 'object' && value !== null) {
        // Handle operators like { $eq: 'value' }, { $in: ['val1', 'val2'] }
        return Object.entries(value).every(([operator, operandValue]) => {
          switch (operator) {
            case '$eq':
              return contextValue === operandValue
            case '$ne':
              return contextValue !== operandValue
            case '$in':
              return Array.isArray(operandValue) && operandValue.includes(contextValue)
            case '$nin':
              return Array.isArray(operandValue) && !operandValue.includes(contextValue)
            case '$gt':
              return contextValue > operandValue
            case '$gte':
              return contextValue >= operandValue
            case '$lt':
              return contextValue < operandValue
            case '$lte':
              return contextValue <= operandValue
            default:
              return false
          }
        })
      }
      
      return contextValue === value
    })
  }
  
  /**
   * Register role definitions
   */
  public static registerRoles(roles: Role[]): void {
    roles.forEach(role => {
      this.roles.set(role.name, role)
    })
  }
}

// Vue directive for permission-based rendering
export const vPermission = {
  mounted(el: HTMLElement, binding: any) {
    const { resource, action, context } = binding.value
    
    if (!RBACManager.hasPermission(resource, action, context)) {
      el.style.display = 'none'
      el.setAttribute('data-permission-hidden', 'true')
    }
  },
  
  updated(el: HTMLElement, binding: any) {
    const { resource, action, context } = binding.value
    
    if (!RBACManager.hasPermission(resource, action, context)) {
      el.style.display = 'none'
      el.setAttribute('data-permission-hidden', 'true')
    } else {
      el.style.display = ''
      el.removeAttribute('data-permission-hidden')
    }
  }
}

// Vue directive for role-based rendering
export const vRole = {
  mounted(el: HTMLElement, binding: any) {
    const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
    
    if (!RBACManager.hasRole(roles)) {
      el.style.display = 'none'
      el.setAttribute('data-role-hidden', 'true')
    }
  },
  
  updated(el: HTMLElement, binding: any) {
    const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
    
    if (!RBACManager.hasRole(roles)) {
      el.style.display = 'none'
      el.setAttribute('data-role-hidden', 'true')
    } else {
      el.style.display = ''
      el.removeAttribute('data-role-hidden')
    }
  }
}
```

## Input Validation and Sanitization

### Secure Form Validation

```typescript
// src/utils/validation/secure-validator.ts
import DOMPurify from 'dompurify'
import validator from 'validator'

export interface ValidationRule {
  required?: boolean
  type?: 'string' | 'number' | 'email' | 'url' | 'phone' | 'date' | 'boolean'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  sanitize?: boolean
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: any
}

export class SecureValidator {
  private static readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi
  ]
  
  private static readonly SQL_INJECTION_PATTERNS = [
    /('|(\-\-)|(;)|(\||\|)|(\*|\*))/gi,
    /(exec(\s|\+)+(s|x)p\w+)/gi,
    /union[\s\w]*select/gi,
    /select[\s\w]*from/gi,
    /insert[\s\w]*into/gi,
    /delete[\s\w]*from/gi,
    /update[\s\w]*set/gi,
    /drop[\s\w]*table/gi
  ]
  
  /**
   * Validate and sanitize input value
   */
  public static validate(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = []
    let sanitizedValue = value
    
    // Required validation
    if (rules.required && this.isEmpty(value)) {
      errors.push('This field is required')
      return { isValid: false, errors }
    }
    
    // Skip further validation if value is empty and not required
    if (this.isEmpty(value)) {
      return { isValid: true, errors: [], sanitizedValue: value }
    }
    
    // Sanitize input if requested
    if (rules.sanitize) {
      sanitizedValue = this.sanitizeInput(value, rules)
    }
    
    // Type validation
    if (rules.type) {
      const typeValidation = this.validateType(sanitizedValue, rules.type)
      if (!typeValidation.isValid) {
        errors.push(...typeValidation.errors)
      }
    }
    
    // Length validation for strings
    if (typeof sanitizedValue === 'string') {
      if (rules.minLength && sanitizedValue.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`)
      }
      
      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`)
      }
    }
    
    // Numeric range validation
    if (typeof sanitizedValue === 'number') {
      if (rules.min !== undefined && sanitizedValue < rules.min) {
        errors.push(`Minimum value is ${rules.min}`)
      }
      
      if (rules.max !== undefined && sanitizedValue > rules.max) {
        errors.push(`Maximum value is ${rules.max}`)
      }
    }
    
    // Pattern validation
    if (rules.pattern && typeof sanitizedValue === 'string') {
      if (!rules.pattern.test(sanitizedValue)) {
        errors.push('Invalid format')
      }
    }
    
    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(sanitizedValue)
      if (typeof customResult === 'string') {
        errors.push(customResult)
      } else if (!customResult) {
        errors.push('Invalid value')
      }
    }
    
    // Security checks
    const securityValidation = this.validateSecurity(sanitizedValue)
    if (!securityValidation.isValid) {
      errors.push(...securityValidation.errors)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    }
  }
  
  /**
   * Validate multiple fields
   */
  public static validateFields(
    data: Record<string, any>,
    rules: Record<string, ValidationRule>
  ): { isValid: boolean; errors: Record<string, string[]>; sanitizedData: Record<string, any> } {
    const errors: Record<string, string[]> = {}
    const sanitizedData: Record<string, any> = {}
    
    Object.entries(rules).forEach(([field, rule]) => {
      const result = this.validate(data[field], rule)
      
      if (!result.isValid) {
        errors[field] = result.errors
      }
      
      sanitizedData[field] = result.sanitizedValue
    })
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    }
  }
  
  private static isEmpty(value: any): boolean {
    return value === null || 
           value === undefined || 
           value === '' || 
           (Array.isArray(value) && value.length === 0)
  }
  
  private static validateType(value: any, type: string): ValidationResult {
    const errors: string[] = []
    
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push('Must be a string')
        }
        break
        
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push('Must be a valid number')
        }
        break
        
      case 'email':
        if (typeof value === 'string' && !validator.isEmail(value)) {
          errors.push('Must be a valid email address')
        }
        break
        
      case 'url':
        if (typeof value === 'string' && !validator.isURL(value)) {
          errors.push('Must be a valid URL')
        }
        break
        
      case 'phone':
        if (typeof value === 'string' && !validator.isMobilePhone(value)) {
          errors.push('Must be a valid phone number')
        }
        break
        
      case 'date':
        if (!validator.isISO8601(String(value))) {
          errors.push('Must be a valid date')
        }
        break
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push('Must be a boolean value')
        }
        break
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  private static sanitizeInput(value: any, rules: ValidationRule): any {
    if (typeof value !== 'string') {
      return value
    }
    
    // Basic HTML sanitization
    let sanitized = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: rules.allowedTags || [],
      ALLOWED_ATTR: rules.allowedAttributes ? 
        Object.keys(rules.allowedAttributes) : [],
      KEEP_CONTENT: true
    })
    
    // Additional sanitization
    sanitized = validator.escape(sanitized)
    sanitized = validator.trim(sanitized)
    
    return sanitized
  }
  
  private static validateSecurity(value: any): ValidationResult {
    const errors: string[] = []
    
    if (typeof value === 'string') {
      // Check for XSS patterns
      for (const pattern of this.XSS_PATTERNS) {
        if (pattern.test(value)) {
          errors.push('Potentially malicious content detected')
          break
        }
      }
      
      // Check for SQL injection patterns
      for (const pattern of this.SQL_INJECTION_PATTERNS) {
        if (pattern.test(value)) {
          errors.push('Potentially malicious SQL content detected')
          break
        }
      }
      
      // Check for path traversal
      if (value.includes('../') || value.includes('..\\')) {
        errors.push('Path traversal attempt detected')
      }
      
      // Check for null bytes
      if (value.includes('\0')) {
        errors.push('Null byte detected')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Element Plus form validation integration
export const createSecureRules = (rules: Record<string, ValidationRule>) => {
  const elementRules: Record<string, any[]> = {}
  
  Object.entries(rules).forEach(([field, rule]) => {
    elementRules[field] = [
      {
        validator: (rule: any, value: any, callback: Function) => {
          const result = SecureValidator.validate(value, rules[field])
          
          if (result.isValid) {
            callback()
          } else {
            callback(new Error(result.errors[0]))
          }
        },
        trigger: 'blur'
      }
    ]
    
    if (rule.required) {
      elementRules[field].unshift({
        required: true,
        message: 'This field is required',
        trigger: 'blur'
      })
    }
  })
  
  return elementRules
}
```

## Content Security Policy (CSP)

### CSP Configuration

```typescript
// src/utils/security/csp.ts
export interface CSPConfig {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'font-src'?: string[]
  'connect-src'?: string[]
  'media-src'?: string[]
  'object-src'?: string[]
  'child-src'?: string[]
  'frame-src'?: string[]
  'worker-src'?: string[]
  'manifest-src'?: string[]
  'base-uri'?: string[]
  'form-action'?: string[]
  'frame-ancestors'?: string[]
  'report-uri'?: string
  'report-to'?: string
  'upgrade-insecure-requests'?: boolean
  'block-all-mixed-content'?: boolean
}

export class CSPManager {
  private static config: CSPConfig = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Only for development
      "'unsafe-eval'", // Only for development
      'https://cdn.jsdelivr.net',
      'https://unpkg.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ],
    'connect-src': [
      "'self'",
      'https://api.example.com',
      'wss://ws.example.com'
    ],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'child-src': ["'self'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true,
    'block-all-mixed-content': true
  }
  
  /**
   * Generate CSP header value
   */
  public static generateCSPHeader(): string {
    const directives: string[] = []
    
    Object.entries(this.config).forEach(([directive, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          directives.push(directive)
        }
      } else if (typeof value === 'string') {
        directives.push(`${directive} ${value}`)
      } else if (Array.isArray(value)) {
        directives.push(`${directive} ${value.join(' ')}`)
      }
    })
    
    return directives.join('; ')
  }
  
  /**
   * Apply CSP to current page
   */
  public static applyCSP(): void {
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = this.generateCSPHeader()
    document.head.appendChild(meta)
  }
  
  /**
   * Update CSP configuration
   */
  public static updateConfig(newConfig: Partial<CSPConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
  
  /**
   * Add source to directive
   */
  public static addSource(directive: keyof CSPConfig, source: string): void {
    const current = this.config[directive]
    if (Array.isArray(current)) {
      if (!current.includes(source)) {
        current.push(source)
      }
    }
  }
  
  /**
   * Remove source from directive
   */
  public static removeSource(directive: keyof CSPConfig, source: string): void {
    const current = this.config[directive]
    if (Array.isArray(current)) {
      const index = current.indexOf(source)
      if (index > -1) {
        current.splice(index, 1)
      }
    }
  }
  
  /**
   * Generate nonce for inline scripts/styles
   */
  public static generateNonce(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }
  
  /**
   * Add nonce to CSP
   */
  public static addNonce(directive: 'script-src' | 'style-src', nonce: string): void {
    this.addSource(directive, `'nonce-${nonce}'`)
  }
}

// CSP violation reporting
export class CSPReporter {
  private static endpoint = '/api/security/csp-violations'
  
  /**
   * Initialize CSP violation reporting
   */
  public static initialize(): void {
    document.addEventListener('securitypolicyviolation', this.handleViolation)
  }
  
  private static handleViolation = (event: SecurityPolicyViolationEvent): void => {
    const violation = {
      documentURI: event.documentURI,
      referrer: event.referrer,
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      effectiveDirective: event.effectiveDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      statusCode: event.statusCode,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    
    // Send violation report
    this.sendViolationReport(violation)
  }
  
  private static async sendViolationReport(violation: any): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(violation)
      })
    } catch (error) {
      console.error('Failed to send CSP violation report:', error)
    }
  }
}
```

## Secure HTTP Client

```typescript
// src/utils/http/secure-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { TokenManager } from '../auth/token-manager'
import { RateLimiter } from './rate-limiter'
import { RequestSigner } from './request-signer'

export interface SecureClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  rateLimitConfig?: {
    maxRequests: number
    windowMs: number
  }
  enableRequestSigning?: boolean
  enableCSRFProtection?: boolean
  trustedDomains?: string[]
}

export class SecureHTTPClient {
  private instance: AxiosInstance
  private rateLimiter: RateLimiter
  private requestSigner?: RequestSigner
  private config: SecureClientConfig
  
  constructor(config: SecureClientConfig) {
    this.config = config
    
    // Initialize rate limiter
    this.rateLimiter = new RateLimiter(
      config.rateLimitConfig?.maxRequests || 100,
      config.rateLimitConfig?.windowMs || 60000
    )
    
    // Initialize request signer
    if (config.enableRequestSigning) {
      this.requestSigner = new RequestSigner()
    }
    
    // Create axios instance
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // Rate limiting
        if (!this.rateLimiter.allowRequest()) {
          throw new Error('Rate limit exceeded')
        }
        
        // Add authentication token
        const token = TokenManager.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add CSRF token
        if (this.config.enableCSRFProtection) {
          const csrfToken = this.getCSRFToken()
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken
          }
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId()
        
        // Add timestamp
        config.headers['X-Timestamp'] = Date.now().toString()
        
        // Sign request if enabled
        if (this.requestSigner) {
          const signature = await this.requestSigner.signRequest(config)
          config.headers['X-Signature'] = signature
        }
        
        // Validate URL against trusted domains
        if (!this.isTrustedDomain(config.url || '')) {
          throw new Error('Untrusted domain')
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Validate response headers
        this.validateResponseHeaders(response)
        
        // Log successful requests
        this.logRequest(response.config, response.status)
        
        return response
      },
      async (error) => {
        // Handle token refresh
        if (error.response?.status === 401) {
          try {
            await TokenManager.refreshTokenIfNeeded()
            // Retry the original request
            return this.instance.request(error.config)
          } catch (refreshError) {
            // Redirect to login
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
        
        // Log failed requests
        this.logRequest(error.config, error.response?.status || 0, error.message)
        
        return Promise.reject(error)
      }
    )
  }
  
  private validateResponseHeaders(response: AxiosResponse): void {
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ]
    
    requiredHeaders.forEach(header => {
      if (!response.headers[header]) {
        console.warn(`Missing security header: ${header}`)
      }
    })
  }
  
  private isTrustedDomain(url: string): boolean {
    if (!this.config.trustedDomains) {
      return true // Allow all if no trusted domains specified
    }
    
    try {
      const urlObj = new URL(url, this.config.baseURL)
      return this.config.trustedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      )
    } catch {
      return false
    }
  }
  
  private getCSRFToken(): string | null {
    // Get CSRF token from meta tag or cookie
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (metaToken) return metaToken
    
    // Fallback to cookie
    const cookies = document.cookie.split(';')
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null
  }
  
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private logRequest(config: any, status: number, error?: string): void {
    const logData = {
      method: config.method?.toUpperCase(),
      url: config.url,
      status,
      timestamp: new Date().toISOString(),
      requestId: config.headers?.['X-Request-ID'],
      error
    }
    
    if (error) {
      console.error('HTTP Request Failed:', logData)
    } else {
      console.log('HTTP Request:', logData)
    }
  }
  
  // Public API methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }
  
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }
  
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }
  
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }
  
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }
}

// Rate limiter implementation
class RateLimiter {
  private requests: number[] = []
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}
  
  allowRequest(): boolean {
    const now = Date.now()
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    // Check if we can make a new request
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true
    }
    
    return false
  }
}

// Request signer implementation
class RequestSigner {
  private async signRequest(config: any): Promise<string> {
    const payload = {
      method: config.method,
      url: config.url,
      timestamp: config.headers['X-Timestamp'],
      data: config.data ? JSON.stringify(config.data) : ''
    }
    
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(payload))
    
    // In a real implementation, use a proper signing key
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('your-signing-key'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, data)
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
  }
}
```

This comprehensive security guide provides robust protection mechanisms for Element Plus applications, covering authentication, authorization, input validation, CSP, and secure HTTP communications.