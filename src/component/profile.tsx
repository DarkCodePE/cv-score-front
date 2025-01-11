import React, { useState } from 'react';
import {
    Box,
    Container,
    HStack,
    VStack,
    Text,
    Button,
    Avatar,
    Icon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    useToast,
} from '@chakra-ui/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Download,
    Edit2,
    Plus,
    Trash2,
    Camera,
    Calendar,
} from 'lucide-react';

interface ProfileDocument {
    file_name: string;
    file_url: string;
    parsed_data: any;
}

interface Profile {
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
        location: string | null;
        start_date: string;
        end_date?: string;
        current: boolean;
        description: string | null;
    }>;
    education: Array<{
        institution_name: string;
        degree: string;
        field_of_study: string | null;
        start_date: string;
        end_date?: string;
        description: string | null;
    }>;
    documents: ProfileDocument[];
}

interface ProfileComponentProps {
    profileData: Profile;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profileData }) => {
    const [activeTab, setActiveTab] = useState('experience');
    const toast = useToast();

    if (!profileData) {
        return (
            <Container maxW="7xl" py={8}>
                <Text>No se encontró información del perfil</Text>
            </Container>
        );
    }
    const handleTabChange = (index: number) => {
        // Mapear índices a valores de string
        const tabs = ['experience', 'education', 'profile'];
        setActiveTab(tabs[index]);
    };

    const handleDownloadCV = () => {
        const lastDocument = profileData.documents?.[profileData.documents.length - 1];
        if (lastDocument?.file_url) {
            window.open(lastDocument.file_url, '_blank');
        } else {
            toast({
                title: 'Error',
                description: 'No se encontró el CV para descargar',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <Container maxW="7xl" py={8}>
            <HStack align="flex-start" spacing={8}>
                {/* Left Column - Personal Info */}
                <Box w="350px">
                    <VStack spacing={8}>
                        {/* Profile Card */}
                        <Box
                            bg="gray.800"
                            borderRadius="xl"
                            p={6}
                            w="full"
                            boxShadow="xl"
                        >
                            {/* Profile Header */}
                            <HStack justify="space-between" mb={4}>
                                <Box position="relative">
                                    <Avatar
                                        size="xl"
                                        name={`${profileData.first_name} ${profileData.last_name}`}
                                        bg="brand.500"
                                    />
                                    <Button
                                        size="sm"
                                        position="absolute"
                                        bottom="0"
                                        right="0"
                                        rounded="full"
                                        colorScheme="brand"
                                    >
                                        <Icon as={Camera} size={16} />
                                    </Button>
                                </Box>
                                <HStack>
                                    {profileData.documents?.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleDownloadCV}
                                        >
                                            <Icon as={Download} />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm">
                                        <Icon as={Edit2} />
                                    </Button>
                                </HStack>
                            </HStack>

                            {/* Name and Title */}
                            <VStack align="start" spacing={1} mb={6}>
                                <Text fontSize="xl" fontWeight="bold">
                                    {profileData.first_name} {profileData.last_name}
                                </Text>
                                {profileData.headline && (
                                    <Text color="gray.400">
                                        {profileData.headline}
                                    </Text>
                                )}
                            </VStack>

                            {/* Contact Info */}
                            <VStack align="start" spacing={4}>
                                <Text fontWeight="semibold" color="gray.300">
                                    Datos de contacto
                                </Text>
                                <VStack align="start" spacing={3} w="full">
                                    {profileData.contact_info?.phone && (
                                        <HStack>
                                            <Icon as={Phone} color="gray.400" />
                                            <Text>{profileData.contact_info.phone}</Text>
                                        </HStack>
                                    )}
                                    {profileData.contact_info?.email && (
                                        <HStack>
                                            <Icon as={Mail} color="gray.400" />
                                            <Text>{profileData.contact_info.email}</Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </VStack>

                            {profileData.documents?.length > 0 && (
                                <Button
                                    w="full"
                                    colorScheme="blue"
                                    mt={6}
                                    onClick={handleDownloadCV}
                                >
                                    Descargar mi CV
                                </Button>
                            )}
                        </Box>

                        {/* Skills Section */}
                        {profileData.skills?.length > 0 && (
                            <Box
                                bg="gray.800"
                                borderRadius="xl"
                                p={6}
                                w="full"
                                boxShadow="xl"
                            >
                                <HStack justify="space-between" mb={4}>
                                    <Text fontWeight="semibold" color="gray.300">
                                        Habilidades
                                    </Text>
                                    <Button size="sm" variant="ghost">
                                        <Icon as={Edit2} />
                                    </Button>
                                </HStack>
                                <VStack align="start" spacing={2}>
                                    {profileData.skills.map((skill, index) => (
                                        <Text key={index} fontSize="sm">
                                            {skill}
                                        </Text>
                                    ))}
                                </VStack>
                            </Box>
                        )}

                        {/* Languages Section */}
                        {profileData.languages?.length > 0 && (
                            <Box
                                bg="gray.800"
                                borderRadius="xl"
                                p={6}
                                w="full"
                                boxShadow="xl"
                            >
                                <HStack justify="space-between" mb={4}>
                                    <Text fontWeight="semibold" color="gray.300">
                                        Idiomas
                                    </Text>
                                    <Button size="sm" variant="ghost">
                                        <Icon as={Edit2} />
                                    </Button>
                                </HStack>
                                <VStack align="start" spacing={2}>
                                    {profileData.languages.map((lang, index) => (
                                        <HStack key={index} justify="space-between" w="full">
                                            <Text>{lang.language}</Text>
                                            <Text color="gray.400">{lang.proficiency}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </Box>

                {/* Right Column - Main Content */}
                <Box flex={1}>
                    <Tabs colorScheme="brand" onChange={handleTabChange}>
                        <TabList>
                            <Tab>Experiencia</Tab>
                            <Tab>Educación</Tab>
                            <Tab>Perfil</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Experience Tab */}
                            <TabPanel>
                                <VStack align="stretch" spacing={6}>
                                    <HStack justify="space-between">
                                        <Text fontSize="xl" fontWeight="bold">
                                            Experiencia laboral
                                        </Text>
                                        <Button
                                            leftIcon={<Plus size={16} />}
                                            colorScheme="brand"
                                            variant="ghost"
                                        >
                                            Añadir experiencia
                                        </Button>
                                    </HStack>

                                    {profileData.experiences?.map((exp, index) => (
                                        <Box
                                            key={index}
                                            p={6}
                                            bg="gray.800"
                                            borderRadius="xl"
                                            boxShadow="sm"
                                        >
                                            <HStack justify="space-between" mb={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text fontSize="lg" fontWeight="bold">
                                                        {exp.position}
                                                    </Text>
                                                    <Text color="gray.400">
                                                        {exp.company_name}
                                                    </Text>
                                                    <HStack color="gray.500" fontSize="sm">
                                                        <Calendar size={14} />
                                                        <Text>
                                                            {formatDate(exp.start_date)} - {
                                                            exp.current ? 'Actual' : formatDate(exp.end_date)
                                                        }
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                                <HStack>
                                                    <Button variant="ghost" size="sm">
                                                        <Icon as={Edit2} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" colorScheme="red">
                                                        <Icon as={Trash2} />
                                                    </Button>
                                                </HStack>
                                            </HStack>
                                            {exp.description && (
                                                <Text color="gray.300">
                                                    {exp.description}
                                                </Text>
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </TabPanel>

                            {/* Education Tab */}
                            <TabPanel>
                                <VStack align="stretch" spacing={6}>
                                    <HStack justify="space-between">
                                        <Text fontSize="xl" fontWeight="bold">
                                            Educación
                                        </Text>
                                        <Button
                                            leftIcon={<Plus size={16} />}
                                            colorScheme="brand"
                                            variant="ghost"
                                        >
                                            Añadir educación
                                        </Button>
                                    </HStack>

                                    {profileData.education?.map((edu, index) => (
                                        <Box
                                            key={index}
                                            p={6}
                                            bg="gray.800"
                                            borderRadius="xl"
                                            boxShadow="sm"
                                        >
                                            <HStack justify="space-between" mb={4}>
                                                <VStack align="start" spacing={1}>
                                                    <Text fontSize="lg" fontWeight="bold">
                                                        {edu.degree}
                                                    </Text>
                                                    <Text color="gray.400">
                                                        {edu.institution_name}
                                                    </Text>
                                                    <HStack color="gray.500" fontSize="sm">
                                                        <Calendar size={14} />
                                                        <Text>
                                                            {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                                        </Text>
                                                    </HStack>
                                                    {edu.field_of_study && (
                                                        <Text color="gray.500" fontSize="sm">
                                                            {edu.field_of_study}
                                                        </Text>
                                                    )}
                                                </VStack>
                                                <HStack>
                                                    <Button variant="ghost" size="sm">
                                                        <Icon as={Edit2} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" colorScheme="red">
                                                        <Icon as={Trash2} />
                                                    </Button>
                                                </HStack>
                                            </HStack>
                                            {edu.description && (
                                                <Text color="gray.300">
                                                    {edu.description}
                                                </Text>
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </TabPanel>

                            {/* Profile Tab */}
                            <TabPanel>
                                <VStack align="stretch" spacing={6}>
                                    <Box
                                        p={6}
                                        bg="gray.800"
                                        borderRadius="xl"
                                        boxShadow="sm"
                                    >
                                        <HStack justify="space-between" mb={4}>
                                            <Text fontSize="xl" fontWeight="bold">
                                                Sobre mí
                                            </Text>
                                            <Button variant="ghost" size="sm">
                                                <Icon as={Edit2} />
                                            </Button>
                                        </HStack>
                                        <Text color="gray.300">
                                            {profileData.about}
                                        </Text>
                                    </Box>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </HStack>
        </Container>
    );
};

export default ProfileComponent;