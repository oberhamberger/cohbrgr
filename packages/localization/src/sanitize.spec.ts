import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
    it('allows safe anchor tags with href', () => {
        const input = '<a href="https://example.com">Link</a>';
        expect(sanitizeHtml(input)).toBe(input);
    });

    it('allows strong and em tags', () => {
        expect(sanitizeHtml('<strong>bold</strong>')).toBe(
            '<strong>bold</strong>',
        );
        expect(sanitizeHtml('<em>italic</em>')).toBe('<em>italic</em>');
    });

    it('allows br tags', () => {
        expect(sanitizeHtml('line1<br>line2')).toBe('line1<br>line2');
    });

    it('strips script tags and their content', () => {
        expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('');
        expect(sanitizeHtml('before<script>evil()</script>after')).toBe(
            'beforeafter',
        );
    });

    it('strips iframe tags', () => {
        expect(sanitizeHtml('<iframe src="evil.html"></iframe>')).toBe('');
    });

    it('strips event handler attributes', () => {
        expect(sanitizeHtml('<a href="#" onclick="alert(1)">click</a>')).toBe(
            '<a href="#">click</a>',
        );
        expect(sanitizeHtml('<span onmouseover="evil()">text</span>')).toBe(
            '<span>text</span>',
        );
    });

    it('strips javascript: URLs', () => {
        expect(sanitizeHtml('<a href="javascript:alert(1)">xss</a>')).toBe(
            '<a>xss</a>',
        );
    });

    it('strips disallowed tags but keeps content', () => {
        expect(sanitizeHtml('<div>content</div>')).toBe('content');
        expect(sanitizeHtml('<p>paragraph</p>')).toBe('paragraph');
    });

    it('strips disallowed attributes from allowed tags', () => {
        expect(sanitizeHtml('<a href="ok" style="color:red">link</a>')).toBe(
            '<a href="ok">link</a>',
        );
    });

    it('handles plain text without tags', () => {
        expect(sanitizeHtml('just plain text')).toBe('just plain text');
    });

    it('handles empty string', () => {
        expect(sanitizeHtml('')).toBe('');
    });
});
