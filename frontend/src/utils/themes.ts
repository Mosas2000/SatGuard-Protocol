export const themes = {
    light: {
        primary: '#F7931A',
        background: '#FFFFFF',
        text: '#000000',
        border: '#E5E7EB',
    },
    dark: {
        primary: '#F7931A',
        background: '#1F2937',
        text: '#FFFFFF',
        border: '#374151',
    },
    blue: {
        primary: '#3B82F6',
        background: '#EFF6FF',
        text: '#1E3A8A',
        border: '#BFDBFE',
    },
};

export type ThemeName = keyof typeof themes;
