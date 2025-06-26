import axios from "axios";
import {ApiRoutes, BackendService} from "../constants/Constants.ts";

export const verificationWithPicture = async (
    id_number: string,
    imageUri: string,
    live: boolean
) => {
    const formData = new FormData();
    console.log("Preparing verification request with ID:", id_number, "and image URI:", imageUri);

    formData.append('id_number', id_number);
    formData.append('img', {
        uri: imageUri,
        name: 'face.jpg',
        type: 'image/jpeg',
    } as any);
    formData.append('live', live ? 'true' : 'false');

    try {
        const response = await axios.post(
            `${BackendService.REGISTRATION_SERVICE}/${ApiRoutes.VERIFY}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data, headers) => data,
            }
        );

        console.log("✅ Verification response:", response);
        return response.data;
    } catch (error: any) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("❌ Server responded with an error:", {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                    body: error.response,
                });
            } else if (error.request) {
                console.error("❌ No response received from server:", error.request);
            } else {
                console.error("❌ Axios setup error:", error.message);
            }
        } else {
            console.error("❌ Unknown error:", error);
        }
        throw error;
    }
};

