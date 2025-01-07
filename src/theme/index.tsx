// src/theme/index.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Definir los colores como constantes
const colors = {
    brand: {
        50: '#fce4ef',
        100: '#f9b9d7',
        200: '#f68dbe',
        300: '#f262a6',
        400: '#ef378d',
        500: '#e43c8e',    // color primario
        600: '#d62d7f',
        700: '#c71e70',
        800: '#b80f61',
        900: '#a90052',
    },
    teal: {
        50: '#e6f7f8',
        100: '#c0ebee',
        200: '#97dfe3',
        300: '#6dd3d9',
        400: '#56bec4',    // color secundario
        500: '#3fa9af',
        600: '#2c949a',
        700: '#197f85',
        800: '#066a70',
        900: '#00555b',
    },
    background: {
        900: '#221f1f',    // color de fondo
    }
};

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    colors,
    styles: {
        global: {
            body: {
                bg: 'background.900',
                color: 'white',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                _hover: {
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s',
                },
            },
            variants: {
                solid: {
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.400',
                        _disabled: {
                            bg: 'brand.500',
                        },
                    },
                },
                outline: {
                    borderColor: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'whiteAlpha.200',
                    },
                },
                ghost: {
                    color: 'white',
                    _hover: {
                        bg: 'whiteAlpha.200',
                    },
                },
            },
            defaultProps: {
                variant: 'solid',
            },
        },
        Input: {
            variants: {
                filled: {
                    field: {
                        bg: 'whiteAlpha.100',
                        color: 'white',
                        _hover: {
                            bg: 'whiteAlpha.200',
                        },
                        _focus: {
                            bg: 'whiteAlpha.200',
                            borderColor: 'brand.500',
                        },
                        _placeholder: {
                            color: 'whiteAlpha.500',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'filled',
            },
        },
        Heading: {
            baseStyle: {
                color: 'white',
            },
        },
        Text: {
            baseStyle: {
                color: 'white',
            },
        },
    },
});

export default theme;