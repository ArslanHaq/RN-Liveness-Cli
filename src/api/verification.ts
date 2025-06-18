import axios from "axios";
import {ApiRoutes, BackendService} from "../constants/Constants.ts";

export const verificationWithPicture = async (
    id_number: string,
    imageUri: string,
    live: boolean
) => {
    const formData = new FormData();

    // Append ID
    formData.append('id_number', id_number);

    // Append image
    formData.append('img', {
        uri: imageUri,
        name: 'face.jpg',
        type: 'image/jpeg',
    } as any);

    // Append boolean (will still go as string, but backend should treat "true"/"false" correctly)
    formData.append('live', live ? 'true' : 'false');

    const response = await axios.post(
        `${BackendService.REGISTRATION_SERVICE}/${ApiRoutes.VERIFY}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data, headers) => {
                return data; // ensures FormData is passed raw without stringifying
            },
        }
    );

    return response.data;
};
