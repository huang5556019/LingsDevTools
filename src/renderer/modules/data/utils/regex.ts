/**
 * Test regular expression against text
 * @param pattern - Regular expression pattern
 * @param text - Text to test against
 * @param flags - Regular expression flags
 * @returns Match results
 */
export function testRegex(pattern: string, text: string, flags: string = 'g'): { matches: Array<{ text: string; index: number }>; groups: any } {
  try {
    // Create regex with timeout
    const regex = new RegExp(pattern, flags);
    const matches: Array<{ text: string; index: number }> = [];
    let match;

    // Use a timeout to prevent catastrophic backtracking
    const startTime = Date.now();
    const timeout = 3000; // 3 seconds

    while ((match = regex.exec(text)) !== null) {
      // Check for timeout
      if (Date.now() - startTime > timeout) {
        throw new Error('Regex matching timed out');
      }

      matches.push({
        text: match[0],
        index: match.index
      });

      // Prevent infinite loops for zero-length matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    return { matches, groups: null };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid regular expression')) {
        throw new Error('Invalid regular expression');
      }
      throw error;
    }
    throw new Error('An error occurred');
  }
}

/**
 * Replace regular expression matches in text
 * @param pattern - Regular expression pattern
 * @param text - Text to replace in
 * @param replacement - Replacement text
 * @param flags - Regular expression flags
 * @returns Replaced text
 */
export function replaceRegex(pattern: string, text: string, replacement: string, flags: string = 'g'): string {
  try {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replacement);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid regular expression')) {
        throw new Error('Invalid regular expression');
      }
      throw error;
    }
    throw new Error('An error occurred');
  }
}

/**
 * Highlight regex matches in text
 * @param text - Original text
 * @param matches - Match results
 * @returns Text with highlighted matches
 */
export function highlightMatches(text: string, matches: Array<{ text: string; index: number }>): string {
  if (matches.length === 0) {
    return text;
  }

  // Sort matches by index
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
  
  let result = '';
  let lastIndex = 0;

  for (const match of sortedMatches) {
    // Add text before match
    result += text.slice(lastIndex, match.index);
    // Add highlighted match
    result += `<span class="bg-yellow-200">${match.text}</span>`;
    // Update last index
    lastIndex = match.index + match.text.length;
  }

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}
