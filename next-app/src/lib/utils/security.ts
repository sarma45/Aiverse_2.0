/**
 * Sanitizes user input to prevent common prompt injection patterns.
 * This is a basic implementation and should be extended with more robust 
 * patterns or specialized models for production.
 */
export function sanitizePrompt(input: string): string {
  if (!input) return "";

  let sanitized = input;

  // 1. Remove common "jailbreak" or "instruction override" keywords
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system override/gi,
    /you are now a/gi,
    /bypass safety/gi,
    /as an unrestricted/gi,
    /forget what i said/gi
  ];

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, "[FILTERED]");
  });

  // 2. Escape potential markdown or script delimiters if needed
  // (Mostly relevant if the LLM output is rendered directly)
  
  // 3. Limit length to prevent buffer/token exhaustion attacks
  const MAX_PROMPT_LENGTH = 4000;
  if (sanitized.length > MAX_PROMPT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_PROMPT_LENGTH);
  }

  return sanitized;
}
