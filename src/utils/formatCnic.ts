export const formatCnic = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 13);
    if (cleaned.length > 12) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
    } else if (cleaned.length > 5) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    } else {
        return cleaned;
    }
};
