// services/searchService.ts
import axios from 'axios';
import {SearchFilters, SearchResponse, Job, JobApplicationCreate, ApplicationRequest} from '@/types/search';

const API_URL = process.env.NEXT_PUBLIC_JOB_SERVER || 'http://localhost:8091';  // Ajusta al puerto de tu backend

export const searchService = {
    async searchJobs(
        searchTerm: string,
        location: string,
        filters: SearchFilters,
        page = 1,
        limit = 10
    ): Promise<SearchResponse> {
        try {
            const { data } = await axios.get<SearchResponse>(`${API_URL}/jobs/search/val`, {
                params: {
                    q: searchTerm,
                    location,
                    ...filters,
                    page,
                    limit
                }
            });

            // Asegurarnos de que los tipos coincidan con la interfaz Job
            const formattedJobs: Job[] = data.jobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company,
                description: job.description,
                requirements: job.requirements,
                job_type: job.job_type,
                level: job.level,
                salary_range: job.salary_range,
                location: job.location,
                is_remote: job.is_remote,
                active: job.active,
                created_at: job.created_at,
                updated_at: job.updated_at,
                source_url: job.source_url,
                source: job.source,
                processed_at: job.processed_at,
                raw_job_id: job.raw_job_id,
                creator_id: job.creator_id
            }));

            return {
                jobs: formattedJobs,
                total: data.total,
                page: data.page,
                totalPages: data.totalPages
            };
        } catch (error) {
            console.error('Error searching jobs:', error);
            throw error;
        }
    },

    async getSuggestedLocations(query: string): Promise<string[]> {
        try {
            const { data } = await axios.get<string[]>(`${API_URL}/locations/suggest`, {
                params: { q: query }
            });
            return data;
        } catch (error) {
            console.error('Error getting location suggestions:', error);
            return [];
        }
    },

    async getSuggestedTerms(query: string): Promise<string[]> {
        try {
            const { data } = await axios.get<string[]>(`${API_URL}/jobs/suggest`, {
                params: { q: query }
            });
            return data;
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            return [];
        }
    }
};

export const applicationService = {
    async applyToJob(applicationRequest: ApplicationRequest, token: string): Promise<void> {
        try {
            await axios.post(
                `${API_URL}/jobs/apply`,
                applicationRequest, // El request debe incluir application_data y profile_data
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            console.error('Error applying to job:', error);
            throw error;
        }
    },
};