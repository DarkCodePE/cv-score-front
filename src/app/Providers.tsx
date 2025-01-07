// app/Providers.tsx
'use client';

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";


interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ChakraProvider theme={theme}>
            {children}
        </ChakraProvider>
    );
}
