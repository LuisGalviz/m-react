import { formatCurrency, getInitials } from '@/lib/utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(250000)).toBe('$250,000');
      expect(formatCurrency(1500)).toBe('$1,500');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('handles large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
    });
  });

  describe('getInitials', () => {
    it('returns initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
    });

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('limits to two characters', () => {
      expect(getInitials('John Paul Smith')).toBe('JP');
    });

    it('converts to uppercase', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });
});
