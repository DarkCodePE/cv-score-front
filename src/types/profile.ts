export interface ProfileSchema {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    headline: string;
    about: string;
    location: null | {
        city?: string;
        country?: string;
    };
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
        location: string | null;  // Cambiado de string | undefined a string | null
        start_date: string;
        end_date?: string;
        current: boolean;
        description: string | null;  // Cambiado de string | undefined a string | null
    }>;
    education: Array<{
        institution_name: string;
        degree: string;
        field_of_study: string | null;
        start_date: string;
        end_date?: string;
        description: string | null;
    }>;
    documents: Array<{
        file_name: string;
        file_url: string;
        parsed_data: any;
    }>;
}