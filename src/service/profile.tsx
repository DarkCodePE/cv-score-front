// services/profileService.ts
import axios from 'axios';

const PROFILE_SERVER = process.env.PROFILE_SERVER || 'http://localhost:8094';

export interface Profile {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    headline: string;
    about: string;
    location: any;
    contact_info: {
        email: string;
        phone?: string;
    };
    skills: string[];
    languages: Array<{
        language: string;
        proficiency: string;
    }>;
    experiences: Array<{
        company_name: string;
        position: string;
        location?: string;
        start_date: string;
        end_date?: string;
        current: boolean;
        description?: string;
    }>;
    education: Array<{
        institution_name: string;
        degree: string;
        field_of_study?: string;
        start_date: string;
        end_date?: string;
        description?: string;
    }>;
    created_at?: string;
    updated_at?: string;
}

export const profileService = {
    async getProfile(userId: string): Promise<Profile | null> {
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

    async updateProfile(profile: Partial<Profile>) {
        const { data } = await axios.put(
            `${PROFILE_SERVER}/profile/${profile.user_id}`,
            profile
        );
        return data;
    },
};