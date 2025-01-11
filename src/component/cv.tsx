import React, { useState, useEffect } from 'react';
import {
    VStack,
    Text,
    Button,
    useToast,
    Progress,
    HStack,
} from '@chakra-ui/react';
import { Upload, WandSparkles } from 'lucide-react';

import { useRouter } from 'next/navigation';
import {profileService} from "@/service/profile";

interface CVUploadComponentProps {
    onProfileData: (data: any) => void;
    userId: string;  // Añadimos userId como prop requerida
    isProcessing: boolean;
}

const CVUploadComponent: React.FC<CVUploadComponentProps> = ({
                                                                 onProfileData,
                                                                 userId }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setSelectedFile(file);
        }
    };

    const validateFile = (file: File | undefined): boolean => {
        if (!file) return false;

        if (file.type !== 'application/pdf') {
            toast({
                title: 'Error',
                description: 'Por favor, sube un archivo PDF',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB límite
            toast({
                title: 'Error',
                description: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        return true;
    };

    const processCV = async () => {
        if (!selectedFile || isProcessing || !userId) return;

        setIsProcessing(true);
        try {
            const profileData = await profileService.uploadCV(selectedFile, userId);

            toast({
                title: 'CV Procesado',
                description: 'Tu CV ha sido procesado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            if (onProfileData) {
                onProfileData(profileData);
            }

        } catch (error) {
            console.error('Error processing CV:', error);
            toast({
                title: 'Error',
                description: 'Error al procesar el CV. Por favor, intenta nuevamente.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Limpiar estado al desmontar
    useEffect(() => {
        return () => {
            setIsProcessing(false);
            setSelectedFile(null);
        };
    }, []);

    return (
        <VStack spacing={4} p={6}>
            <VStack
                spacing={4}
                p={6}
                borderWidth={2}
                borderRadius="xl"
                borderStyle="dashed"
                borderColor={isDragging ? "brand.500" : "whiteAlpha.300"}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                minH="200px"
                justify="center"
                w="full"
                transition="all 0.2s"
                _hover={{
                    borderColor: "brand.500",
                }}
            >
                {!selectedFile ? (
                    <>
                        <Upload size={48} className="text-brand-500" />
                        <Text>Arrastra y suelta tu CV aquí o haz clic para buscar</Text>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="cv-upload"
                        />
                        <Button
                            onClick={() => document.getElementById('cv-upload')?.click()}
                            colorScheme="brand"
                        >
                            Buscar archivo
                        </Button>
                    </>
                ) : (
                    <VStack spacing={4} w="full">
                        <Text>{selectedFile.name}</Text>
                        {isProcessing ? (
                            <VStack w="full" spacing={4}>
                                <Progress
                                    size="sm"
                                    isIndeterminate
                                    w="full"
                                    colorScheme="brand"
                                />
                                <Text>Procesando tu CV con IA...</Text>
                            </VStack>
                        ) : (
                            <HStack>
                                <Button
                                    onClick={processCV}
                                    colorScheme="brand"
                                    leftIcon={<WandSparkles size={20} />}
                                    isDisabled={!selectedFile}
                                >
                                    Procesar con IA
                                </Button>
                                <Button
                                    onClick={() => setSelectedFile(null)}
                                    variant="ghost"
                                >
                                    Eliminar
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                )}
            </VStack>

            <Text fontSize="sm" color="gray.400" textAlign="center">
                Formatos aceptados: PDF (máx. 10MB)
            </Text>
        </VStack>
    );
};

export default CVUploadComponent;