declare module 'animated-placeholder' {
  /**
   * A config object allowing you to specify certain aspects of `usePlaceholder`
   */
  export interface PlaceholderConfig {
    initialDelay?: number; // default = 0
    iterationCount?: number; // default = Infinity
    typingSpeed?: number; // default = 263
    typingVariation?: number; // default = 75
    backspaceSpeed?: number; // default = 60
    cursorFlashRate?: number; // default = 500
    displayCursor?: boolean; // default = true
    delayBetweenPhrases?: number; // default = 2000
    cursorCharacter?: string; // default = '|'
    prefixString?: string; // default = ''
    staticText?: string; // default = ''
  }

  /**
   * A custom React Hook that animates an input placeholder
   */
  export function usePlaceholder(
    placeholders: string[],
    config?: PlaceholderConfig
  ): string;
}
