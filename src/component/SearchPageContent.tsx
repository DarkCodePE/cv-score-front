import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    VStack,
    Spinner,
    HStack,
    Text,
    Button,
    Flex,
    Icon,
    Tooltip,
    Divider, useToast,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hook/useSearch';
import { applicationService } from '@/service/search';
import { AuthState } from '@/types/user';
import { Job } from '@/types/search';
import { ProfileSchema } from '@/types/profile';
import {Award, Bookmark, Briefcase, Building, Check, Clock, DollarSign, Globe, MapPin} from "lucide-react";

interface SearchPageContentProps {
    authState: AuthState;
}

const SearchPageContent: React.FC<SearchPageContentProps> = ({ authState }) => {
    const searchParams = useSearchParams();
    const toast = useToast();

    const [profileData, setProfileData] = useState<ProfileSchema | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const {
        searchTerm,
        location,
        filters,
        results,
        isLoading,
        setSearchTerm,
        setLocation,
        performSearch
    } = useSearch();

    useEffect(() => {
        // Load profile data and applied jobs from localStorage on client side
        const savedProfile = localStorage.getItem('profileData');
        if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
        }

        const savedAppliedJobs = localStorage.getItem('appliedJobs');
        if (savedAppliedJobs) {
            setAppliedJobs(new Set(JSON.parse(savedAppliedJobs)));
        }
    }, []);

    useEffect(() => {
        const term = searchParams.get('q') || '';
        const loc = searchParams.get('location') || '';

        if (term !== searchTerm) setSearchTerm(term);
        if (loc !== location) setLocation(loc);

        if (term || loc) {
            performSearch(term, loc, filters);
        }
    }, [searchParams]);

    const handleApply = async () => {
        if (!selectedJob) {
            toast({
                title: "Error",
                description: "No se ha seleccionado ningún trabajo.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!authState || !profileData) {
            toast({
                title: "Error",
                description: "Debes iniciar sesión y completar tu perfil para aplicar.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            setIsApplying(true);
            const applicationRequest = {
                application_data: {
                    job_offer_id: selectedJob.id,
                    applicant_name: `${profileData.first_name} ${profileData.last_name}`,
                    applicant_email: profileData.contact_info?.email,
                },
                profile_data: profileData,
            };

            await applicationService.applyToJob(applicationRequest, authState.token || '');

            const newAppliedJobs = new Set(appliedJobs).add(selectedJob.id);
            setAppliedJobs(newAppliedJobs);
            localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));

            toast({
                title: "Aplicación Exitosa",
                description: "Has aplicado exitosamente a este empleo.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error al aplicar",
                description: "Ocurrió un error al aplicar a este empleo. Intenta nuevamente.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsApplying(false);
        }
    };

    const isJobApplied = selectedJob ? appliedJobs.has(selectedJob.id) : false;

    return (
        <Container maxW="container.xl" mt={6}>
            <Flex gap={6}>
                {/* Panel izquierdo mejorado */}
                <Box
                    flex="1"
                    bg="whiteAlpha.50"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="lg"
                    position="relative"
                >
                    {/* Header del panel */}
                    <Box p={4} borderBottom="1px" borderColor="whiteAlpha.200">
                        <Text fontSize="lg" fontWeight="bold">
                            {results.length} Empleos encontrados
                        </Text>
                    </Box>

                    {/* Lista de empleos con scroll */}
                    <Box maxH="calc(80vh - 60px)" overflowY="auto" p={2}>
                        {isLoading ? (
                            <VStack justify="center" py={12}>
                                <Spinner size="xl" color="brand.500"/>
                                <Text color="whiteAlpha.600">Buscando ofertas...</Text>
                            </VStack>
                        ) : results.length > 0 ? (
                            <VStack spacing={3}>
                                {results.map((job) => (
                                    <Box
                                        key={job.id}
                                        bg={selectedJob?.id === job.id ? "brand.900" : "whiteAlpha.100"}
                                        p={4}
                                        borderRadius="lg"
                                        cursor="pointer"
                                        w="full"
                                        transition="all 0.2s"
                                        _hover={{
                                            bg: selectedJob?.id === job.id ? "brand.800" : "whiteAlpha.200",
                                            transform: "translateY(-2px)",
                                        }}
                                        onClick={() => setSelectedJob(job)}
                                        border="1px solid"
                                        borderColor={selectedJob?.id === job.id ? "brand.500" : "transparent"}
                                    >
                                        <HStack justify="space-between" mb={2}>
                                            <Text fontSize="md" fontWeight="bold">{job.title}</Text>
                                            {appliedJobs.has(job.id) && (
                                                <Box color="green">
                                                    <Icon as={Check} mr={1} size={2}/>
                                                    Aplicado
                                                </Box>
                                            )}
                                        </HStack>

                                        <HStack spacing={4} mb={2}>
                                            <HStack color="whiteAlpha.600">
                                                <Icon as={Building} size={2}/>
                                                <Text fontSize="sm">{job.company}</Text>
                                            </HStack>
                                            <HStack color="whiteAlpha.600">
                                                <Icon as={MapPin} size={2}/>
                                                <Text fontSize="sm">{job.location}</Text>
                                            </HStack>
                                        </HStack>

                                        <HStack spacing={2} flexWrap="wrap">
                                            {job.is_remote && (
                                                <Box color="blue">
                                                    <Icon as={Globe} mr={1} size={2}/>
                                                    Remoto
                                                </Box>
                                            )}
                                            {job.job_type && (
                                                <Box color="teal.500">
                                                    <Icon as={Clock} mr={1} size={2}/>
                                                    {job.job_type}
                                                </Box>
                                            )}
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        ) : (
                            <VStack py={12} spacing={4}>
                                <Text fontSize="lg" color="whiteAlpha.600">
                                    No se encontraron resultados
                                </Text>
                                <Text fontSize="sm" color="whiteAlpha.400">
                                    Intenta con otros términos o ubicación
                                </Text>
                            </VStack>
                        )}
                    </Box>
                </Box>

                {/* Panel derecho mejorado */}
                <Box
                    flex="2"
                    bg="whiteAlpha.50"
                    p={6}
                    borderRadius="xl"
                    boxShadow="lg"
                >
                    {selectedJob ? (
                        <VStack align="stretch" spacing={6}>
                            {/* Encabezado del trabajo */}
                            <Box>
                                <HStack justify="space-between" mb={4}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {selectedJob.title}
                                        </Text>
                                        <Text fontSize="md" color="whiteAlpha.800">
                                            {selectedJob.company}
                                        </Text>
                                    </VStack>
                                    <HStack>
                                        <Tooltip label={isJobApplied ? "Ya has aplicado" : "Postular"}>
                                            <Button
                                                colorScheme={isJobApplied ? "green" : "brand"}
                                                leftIcon={isJobApplied ? <Check/> : <Briefcase/>}
                                                onClick={handleApply}
                                                isLoading={isApplying}
                                                isDisabled={isJobApplied}
                                            >
                                                {isJobApplied ? "Aplicado" : "Aplicar"}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip label="Guardar oferta">
                                            <Button
                                                variant="outline"
                                                leftIcon={<Bookmark/>}
                                            >
                                                Guardar
                                            </Button>
                                        </Tooltip>
                                    </HStack>
                                </HStack>

                                {/* Detalles del trabajo */}
                                <HStack spacing={6} mb={6} flexWrap="wrap">
                                    <HStack color="whiteAlpha.800">
                                        <Icon as={MapPin} size={2}/>
                                        <Text>{selectedJob.location}</Text>
                                    </HStack>
                                    {selectedJob.salary_range && (
                                        <HStack color="green.400">
                                            <Icon as={DollarSign} size={2}/>
                                            <Text>{selectedJob.salary_range}</Text>
                                        </HStack>
                                    )}
                                    <HStack color="whiteAlpha.800">
                                        <Icon as={Clock} size={2}/>
                                        <Text>{selectedJob.job_type}</Text>
                                    </HStack>
                                    {selectedJob.level && (
                                        <HStack color="whiteAlpha.800">
                                            <Icon as={Award} size={2}/>
                                            <Text>{selectedJob.level}</Text>
                                        </HStack>
                                    )}
                                </HStack>
                            </Box>

                            <Divider/>

                            {/* Descripción del trabajo */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                                    Descripción
                                </Text>
                                <Text color="whiteAlpha.800" whiteSpace="pre-line">
                                    {selectedJob.description || "Sin descripción disponible."}
                                </Text>
                            </Box>

                            <Divider/>

                            {/* Requisitos */}
                            {selectedJob.requirements?.length > 0 && (
                                <Box>
                                    <Text fontSize="lg" fontWeight="semibold" mb={4}>
                                        Requisitos
                                    </Text>
                                    <VStack align="start" spacing={2}>
                                        {selectedJob.requirements.map((req, index) => (
                                            <HStack key={index}>
                                                <Icon as={Check} color="brand.500" size={2}/>
                                                <Text color="whiteAlpha.800">{req}</Text>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Box>
                            )}

                            {/* Botones de acción al final */}
                            <Box mt={4}>
                                <HStack justify="flex-end" spacing={4}>
                                    {isJobApplied ? (
                                        <Box color="green" px={6} py={2}>
                                            <HStack>
                                                <Icon as={Check} size={2}/>
                                                <Text>Postulación enviada</Text>
                                            </HStack>
                                        </Box>
                                    ) : (
                                        <Button
                                            size="lg"
                                            colorScheme="brand"
                                            leftIcon={<Briefcase/>}
                                            onClick={handleApply}
                                            isLoading={isApplying}
                                        >
                                            Postular ahora
                                        </Button>
                                    )}
                                </HStack>
                            </Box>
                        </VStack>
                    ) : (
                        <VStack
                            justify="center"
                            h="full"
                            spacing={4}
                            color="whiteAlpha.600"
                        >
                            <Icon as={Briefcase} size={2}/>
                            <Text fontSize="lg">
                                Selecciona un empleo para ver los detalles
                            </Text>
                        </VStack>
                    )}
                </Box>
            </Flex>
        </Container>
    );
};

export default SearchPageContent;
