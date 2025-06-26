export const BackendService = {
    REGISTRATION_SERVICE: 'https://alpha.idnmo.com'
}

export const ApiRoutes = {
    WITH_PICTURE: 'register',
    WITH_ID_CARD: 'register_card',
    VERIFY: 'verify',
}


export type RootStackParamList = {
    Home: undefined;
    RegisterPicture: { cnic: string };
    RegisterIdCard: { cnic: string };
    VerifyPicture: { cnic : string ,faceImages: string }; // ✅ Expecting image URI
    Liveness: { cnic: string }; // Optional if you're passing cnic
};