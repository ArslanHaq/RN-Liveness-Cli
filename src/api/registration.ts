import axios from 'axios';
import {ApiRoutes, BackendService} from "../constants/Constants.ts";


export const registration = async (id_number: string, imageUri: string) => {
    const formData = new FormData();

    formData.append('id_number', id_number);
    formData.append('img', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
    } as any); // 'as any' needed for React Native FormData

    const response = await axios.post(`${BackendService.REGISTRATION_SERVICE}/${ApiRoutes.WITH_PICTURE}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log('Registration response:', response);

    return response.data;
};

export const registerFaceWithIdCard = async (id_number: string, imageUri: string) => {
    const formData = new FormData();

    formData.append('id_number', id_number);
    formData.append('card_img', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
    } as any); // 'as any' needed for React Native FormData

    const response = await axios.post(`${BackendService.REGISTRATION_SERVICE}/${ApiRoutes.WITH_ID_CARD}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};


