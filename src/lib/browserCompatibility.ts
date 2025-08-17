/**
 * Browser Compatibility Detection and Fallback Management
 */

export interface BrowserCapabilities {
  webgl: boolean;
  webgl2: boolean;
  serviceWorker: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  webAnimations: boolean;
  cssGrid: boolean;
  cssCustomProperties: boolean;
  es6Modules: boolean;
  webAssembly: boolean;
  webRTC: boolean;
  geolocation: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webWorkers: boolean;
  sharedArrayBuffer: boolean;
  bigInt: boolean;
  dynamicImport: boolean;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
  capabilities: BrowserCapabilities;
  supportLevel: 'full' | 'partial' | 'minimal';
}

class BrowserCompatibilityManager {
  private capabilities: BrowserCapabilities;
  private browserInfo: BrowserInfo;

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.browserInfo = this.detectBrowserInfo();
  }

  private detectCapabilities(): BrowserCapabilities {
    if (typeof window === 'undefined') {
      // Server-side rendering - assume modern capabilities
      return this.getDefaultCapabilities();
    }

    return {
      webgl: this.hasWebGL(),
      webgl2: this.hasWebGL2(),
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      resizeObserver: 'ResizeObserver' in window,
      webAnimations: 'animate' in document.createElement('div'),
      cssGrid: this.hasCSSGrid(),
      cssCustomProperties: this.hasCSSCustomProperties(),
      es6Modules: this.hasES6Modules(),
      webAssembly: 'WebAssembly' in window,
      webRTC: 'RTCPeerConnection' in window,
      geolocation: 'geolocation' in navigator,
      localStorage: this.hasLocalStorage(),
      sessionStorage: this.hasSessionStorage(),
      indexedDB: 'indexedDB' in window,
      webWorkers: 'Worker' in window,
      sharedArrayBuffer: 'SharedArrayBuffer' in window,
      bigInt: typeof BigInt !== 'undefined',
      dynamicImport: this.hasDynamicImport(),
    };
  }

  private detectBrowserInfo(): BrowserInfo {
    if (typeof window === 'undefined') {
      return this.getDefaultBrowserInfo();
    }

    const userAgent = navigator.userAgent;
    const browserInfo = this.parseBrowserInfo(userAgent);
    
    return {
      ...browserInfo,
      capabilities: this.capabilities,
      supportLevel: this.calculateSupportLevel(),
    };
  }

  private hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  private hasWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGL2RenderingContext &&
        canvas.getContext('webgl2')
      );
    } catch {
      return false;
    }
  }

  private hasCSSGrid(): boolean {
    try {
      return CSS.supports('display', 'grid');
    } catch {
      return false;
    }
  }

  private hasCSSCustomProperties(): boolean {
    try {
      return CSS.supports('--custom-property', 'value');
    } catch {
      return false;
    }
  }

  private hasES6Modules(): boolean {
    try {
      return 'noModule' in document.createElement('script');
    } catch {
      return false;
    }
  }

  private hasLocalStorage(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private hasSessionStorage(): boolean {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private hasDynamicImport(): boolean {
    try {
      return typeof (import as any) === 'function';
    } catch {
      return false;
    }
  }

  private parseBrowserInfo(userAgent: string): Omit<BrowserInfo, 'capabilities' | 'supportLevel'> {
    // Simplified browser detection - in production, consider using a library like bowser
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);

    let name = 'Unknown';
    let engine = 'Unknown';

    if (isChrome) {
      name = 'Chrome';
      engine = 'Blink';
    } else if (isFirefox) {
      name = 'Firefox';
      engine = 'Gecko';
    } else if (isSafari) {
      name = 'Safari';
      engine = 'WebKit';
    } else if (isEdge) {
      name = 'Edge';
      engine = 'Blink';
    }

    return {
      name,
      version: this.extractVersion(userAgent, name),
      engine,
      platform: navigator.platform,
      mobile: isMobile,
    };
  }

  private extractVersion(userAgent: string, browserName: string): string {
    const patterns: Record<string, RegExp> = {
      Chrome: /Chrome\/(\d+\.\d+)/,
      Firefox: /Firefox\/(\d+\.\d+)/,
      Safari: /Version\/(\d+\.\d+)/,
      Edge: /Edg\/(\d+\.\d+)/,
    };

    const pattern = patterns[browserName];
    if (pattern) {
      const match = userAgent.match(pattern);
      return match ? match[1] : 'Unknown';
    }
    return 'Unknown';
  }

  private calculateSupportLevel(): 'full' | 'partial' | 'minimal' {
    const criticalFeatures = [
      'webgl',
      'serviceWorker',
      'intersectionObserver',
      'cssGrid',
      'es6Modules',
    ];

    const supportedCritical = criticalFeatures.filter(
      feature => this.capabilities[feature as keyof BrowserCapabilities]
    ).length;

    const supportRatio = supportedCritical / criticalFeatures.length;

    if (supportRatio >= 0.8) return 'full';
    if (supportRatio >= 0.5) return 'partial';
    return 'minimal';
  }

  private getDefaultCapabilities(): BrowserCapabilities {
    return {
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      intersectionObserver: true,
      resizeObserver: true,
      webAnimations: true,
      cssGrid: true,
      cssCustomProperties: true,
      es6Modules: true,
      webAssembly: true,
      webRTC: true,
      geolocation: true,
      localStorage: true,
      sessionStorage: true,
      indexedDB: true,
      webWorkers: true,
      sharedArrayBuffer: false, // Conservative default
      bigInt: true,
      dynamicImport: true,
    };
  }

  private getDefaultBrowserInfo(): BrowserInfo {
    return {
      name: 'Unknown',
      version: 'Unknown',
      engine: 'Unknown',
      platform: 'Unknown',
      mobile: false,
      capabilities: this.getDefaultCapabilities(),
      supportLevel: 'full',
    };
  }

  // Public API
  public getCapabilities(): BrowserCapabilities {
    return { ...this.capabilities };
  }

  public getBrowserInfo(): BrowserInfo {
    return { ...this.browserInfo };
  }

  public hasFeature(feature: keyof BrowserCapabilities): boolean {
    return this.capabilities[feature];
  }

  public getSupportLevel(): 'full' | 'partial' | 'minimal' {
    return this.browserInfo.supportLevel;
  }

  public shouldUsePolyfill(feature: keyof BrowserCapabilities): boolean {
    return !this.capabilities[feature];
  }

  public getRecommendedFallbacks(): string[] {
    const fallbacks: string[] = [];

    if (!this.capabilities.webgl) {
      fallbacks.push('Use Canvas 2D instead of WebGL');
    }
    if (!this.capabilities.intersectionObserver) {
      fallbacks.push('Use scroll event listeners with throttling');
    }
    if (!this.capabilities.serviceWorker) {
      fallbacks.push('Disable offline functionality');
    }
    if (!this.capabilities.cssGrid) {
      fallbacks.push('Use Flexbox layouts');
    }
    if (!this.capabilities.webAnimations) {
      fallbacks.push('Use CSS transitions and keyframes');
    }

    return fallbacks;
  }
}

// Singleton instance
export const browserCompatibility = new BrowserCompatibilityManager();

// Utility functions
export function isModernBrowser(): boolean {
  return browserCompatibility.getSupportLevel() === 'full';
}

export function requiresPolyfills(): boolean {
  return browserCompatibility.getSupportLevel() !== 'full';
}

export function getPolyfillsNeeded(): string[] {
  const capabilities = browserCompatibility.getCapabilities();
  const polyfills: string[] = [];

  if (!capabilities.intersectionObserver) {
    polyfills.push('intersection-observer');
  }
  if (!capabilities.resizeObserver) {
    polyfills.push('resize-observer-polyfill');
  }
  if (!capabilities.webAnimations) {
    polyfills.push('web-animations-js');
  }

  return polyfills;
}