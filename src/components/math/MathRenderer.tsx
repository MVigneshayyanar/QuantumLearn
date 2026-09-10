'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * MathRenderer — Parses text containing LaTeX delimiters and renders
 * beautiful typeset mathematics using KaTeX.
 *
 * Supports:
 *   - Inline math: $...$
 *   - Display math: $$...$$
 *   - Plain text segments between math expressions
 */

interface MathRendererProps {
  /** The text containing LaTeX math delimiters ($...$ or $$...$$) */
  text: string;
  /** Additional CSS classes */
  className?: string;
  /** If true, render the entire string as a single display-mode equation */
  displayMode?: boolean;
}

interface ParsedSegment {
  type: 'text' | 'inline-math' | 'display-math';
  content: string;
}

/**
 * Parse a string into segments of plain text, inline math ($...$),
 * and display math ($$...$$).
 */
function parseMathSegments(input: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let remaining = input;

  while (remaining.length > 0) {
    // Check for display math first ($$...$$)
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    // Check for inline math ($...$) — but not $$
    const inlineMatch = remaining.match(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/);

    let nextMatch: { index: number; length: number; content: string; type: 'inline-math' | 'display-math' } | null = null;

    if (displayMatch && displayMatch.index !== undefined) {
      nextMatch = {
        index: displayMatch.index,
        length: displayMatch[0].length,
        content: displayMatch[1],
        type: 'display-math'
      };
    }

    if (inlineMatch && inlineMatch.index !== undefined) {
      if (!nextMatch || inlineMatch.index < nextMatch.index) {
        nextMatch = {
          index: inlineMatch.index,
          length: inlineMatch[0].length,
          content: inlineMatch[1],
          type: 'inline-math'
        };
      }
    }

    if (!nextMatch) {
      // No more math — rest is plain text
      if (remaining.length > 0) {
        segments.push({ type: 'text', content: remaining });
      }
      break;
    }

    // Add text before the math
    if (nextMatch.index > 0) {
      segments.push({ type: 'text', content: remaining.substring(0, nextMatch.index) });
    }

    // Add the math segment
    segments.push({ type: nextMatch.type, content: nextMatch.content });

    // Move past the matched segment
    remaining = remaining.substring(nextMatch.index + nextMatch.length);
  }

  return segments;
}

/**
 * Render a single LaTeX string to HTML using KaTeX.
 * Returns raw HTML string for dangerouslySetInnerHTML.
 */
function renderKatex(latex: string, displayMode: boolean): string {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      output: 'htmlAndMathml',
      macros: {
        '\\ket': '|#1\\rangle',
        '\\bra': '\\langle #1|',
        '\\braket': '\\langle #1|#2\\rangle',
        '\\tr': '\\operatorname{Tr}',
      }
    });
    return `<span class="notranslate" translate="no">${html}</span>`;
  } catch {
    // Fallback: return the raw LaTeX in a code element
    return `<code class="text-red-600 bg-red-50 px-1 rounded notranslate" translate="no">${latex}</code>`;
  }
}

/**
 * MathRenderer component — renders text with embedded LaTeX math
 */
export function MathRenderer({ text, className = '', displayMode = false }: MathRendererProps) {
  const rendered = useMemo(() => {
    if (displayMode) {
      // Render the entire string as one display-mode equation
      return renderKatex(text, true);
    }

    const segments = parseMathSegments(text);

    return segments
      .map((seg, idx) => {
        if (seg.type === 'text') {
          // Escape HTML in text segments
          let content = seg.content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

          // Parse markdown bold (**text** or __text__)
          content = content.replace(/\*\*([\s\S]+?)\*\*/g, '<strong class="font-bold text-dark-900">$1</strong>');
          content = content.replace(/__([\s\S]+?)__/g, '<strong class="font-bold text-dark-900">$1</strong>');

          // Parse markdown italic (*text*)
          content = content.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, '<em class="italic">$1</em>');

          // Remove any stray orphaned asterisks left from stripped headers
          content = content.replace(/\*\*/g, '');

          // Convert raw Dirac kets like |0⟩, |1⟩, |+⟩, |-⟩, |−⟩, |00⟩, |11⟩, |i⟩, |-i⟩
          content = content.replace(/\|([01\+\-−i\w]+)[⟩>]/g, (_, state) => {
            const cleanState = state.replace('−', '-');
            return renderKatex(`|${cleanState}\\rangle`, false);
          });

          // Convert common quantum trace notation: Tr(ρ²)
          content = content.replace(/Tr\(ρ²\)|Tr\(rho\^2\)/g, () => {
            return renderKatex('\\operatorname{Tr}(\\rho^2)', false);
          });

          // Convert trigonometric exponents: cos²(x), sin²(x)
          content = content.replace(/(cos|sin)²\(([^\)]+)\)/g, (_, func, arg) => {
            const cleanArg = arg.replace(/θ/g, '\\theta').replace(/φ/g, '\\phi');
            return renderKatex(`\\${func}^2(${cleanArg})`, false);
          });

          // Convert qubit subscript labels: q0, q1, Q0, Q1 when standalone or formatted
          content = content.replace(/\b([qQ])_?([0-9])\b/g, (_, q, idx) => {
            return renderKatex(`${q.toLowerCase()}_{${idx}}`, false);
          });

          // Parse inline code (`code`) — protect variables from translation
          content = content.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-dark-100 text-primary-700 font-mono text-[11px] notranslate" translate="no">$1</code>');

          return content;
        } else if (seg.type === 'inline-math') {
          return `<span class="notranslate" translate="no">${renderKatex(seg.content, false)}</span>`;
        } else {
          return `<span class="notranslate" translate="no">${renderKatex(seg.content, true)}</span>`;
        }
      })
      .join('');
  }, [text, displayMode]);

  return (
    <span
      className={`math-rendered ${displayMode ? 'notranslate' : ''} ${className}`}
      {...(displayMode ? { translate: 'no' } : {})}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

/**
 * MathBlock — Renders a standalone display-mode equation block
 * with a styled container (used in the math walkthrough sections).
 */
interface MathBlockProps {
  equation: string;
  className?: string;
}

export function MathBlock({ equation, className = '' }: MathBlockProps) {
  const html = useMemo(() => renderKatex(equation, true), [equation]);

  return (
    <div
      className={`math-block-container notranslate overflow-x-auto ${className}`}
      translate="no"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
