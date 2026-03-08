declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'production';
            CLOUD_RUN?: string;
        }
    }
}

export {};
