const ALLOWED_TAGS = ['a', 'strong', 'em', 'br', 'span', 'b', 'i'];
const ALLOWED_ATTRS: Record<string, string[]> = {
    a: ['href', 'target', 'rel', 'class'],
    span: ['class'],
};

/**
 * Strips dangerous HTML patterns from a string while allowing safe tags.
 * Removes script tags, event handlers, and javascript: URLs.
 */
export function sanitizeHtml(html: string): string {
    // Remove script/style tags and their content
    let sanitized = html.replace(
        /<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
        '',
    );

    // Remove self-closing dangerous tags
    sanitized = sanitized.replace(
        /<\s*(script|style|iframe|object|embed|form)[^>]*\/?>/gi,
        '',
    );

    // Remove event handler attributes (on*)
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

    // Remove javascript: and data: URLs from attributes
    sanitized = sanitized.replace(
        /(href|src|action)\s*=\s*(?:"(?:javascript|data):[^"]*"|'(?:javascript|data):[^']*')/gi,
        '',
    );

    // Remove tags not in the allowlist
    sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*\/?>/gi, (match, tag) => {
        const lowerTag = tag.toLowerCase();
        if (!ALLOWED_TAGS.includes(lowerTag)) {
            return '';
        }

        // For closing tags, return clean closing tag
        if (match.startsWith('</')) {
            return `</${lowerTag}>`;
        }

        // For allowed tags, strip attributes not in the allowlist
        const allowedAttrs = ALLOWED_ATTRS[lowerTag] || [];
        if (allowedAttrs.length === 0) {
            return `<${lowerTag}>`;
        }

        const keptAttrs: string[] = [];
        match.replace(
            /\s+([a-z][a-z0-9-]*)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
            (attrMatch, attrName) => {
                if (allowedAttrs.includes(attrName.toLowerCase())) {
                    keptAttrs.push(attrMatch);
                }
                return '';
            },
        );

        return `<${lowerTag}${keptAttrs.join('')}>`;
    });

    return sanitized;
}
