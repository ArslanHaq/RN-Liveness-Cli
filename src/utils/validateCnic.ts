export const validateCnic = (cnic: string) => {
    return /^\d{13}$/.test(cnic);
};
