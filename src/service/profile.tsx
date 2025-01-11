// services/profileService.ts
import axios from 'axios';
import {ProfileSchema} from "@/types/profile";

const PROFILE_SERVER = process.env.PROFILE_SERVER || 'http://localhost:8094';


export const profileService = {
    async getProfile(userId: string): Promise<ProfileSchema | null> {
        try {
            const { data } = await axios.get(`${PROFILE_SERVER}/profile/${userId}`);
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null; // Perfil no encontrado
            }
            throw error;
        }
    },

    async uploadCV(file: File, userId: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const { data } = await axios.post(
            `${PROFILE_SERVER}/profile/upload-cv`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data;
    },

    async updateProfile(profile: Partial<ProfileSchema>) {
        const { data } = await axios.put(
            `${PROFILE_SERVER}/profile/${profile.user_id}`,
            profile
        );
        return data;
    },
};