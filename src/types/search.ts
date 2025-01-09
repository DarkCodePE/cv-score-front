// types/search.ts

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' | 'NOT_SPECIFIED';
export type ExperienceLevel = 'TRAINEE' | 'JUNIOR' | 'MID' | 'SENIOR' | 'EXPERT' | 'NOT_SPECIFIED';

export interface Job {
    id: string;
    title: string;
    company: string;
    description: string | null;
    requirements: string[];
    job_type: JobType;
    level: string;
    salary_range: string | null;
    location: string;
    is_remote: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
    source_url: string | null;
    source: string | null;
    processed_at: string | null;
    raw_job_id: string | null;
    creator_id: string;
}

export interface SearchFilters {
    jobType?: JobType;
    level?: ExperienceLevel;
    isRemote?: boolean;
    page?: number;
    limit?: number;
}

export interface SearchResponse {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
}

// Estado del store
export interface SearchState {
    searchTerm: string;
    location: string;
    filters: SearchFilters;
    results: Job[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalResults: number;
    totalPages: number;
}

// class JobApplicationCreate(BaseModel):
// job_offer_id: str
// applicant_name: str
// applicant_email: EmailStr
export interface JobApplicationCreate {
    job_offer_id: string;
    applicant_name: string;
    applicant_email: string;
}
/*
class ApplicationRequest(BaseModel):
application_data: JobApplicationCreate
profile_data: ProfileData*/

export interface ApplicationRequest {
    application_data: JobApplicationCreate;
    profile_data: any;
}