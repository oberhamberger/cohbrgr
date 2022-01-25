export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Query = {
    __typename?: 'Query';
    translation?: Maybe<Translation>;
    allTranslations?: Maybe<Array<Maybe<Translations>>>;
    getTranslations?: Maybe<Array<Maybe<Translations>>>;
};

export type QueryTranslationArgs = {
    id: Scalars['ID'];
    lang?: InputMaybe<Language>;
};

export type QueryAllTranslationsArgs = {
    lang?: InputMaybe<Language>;
};

export type QueryGetTranslationsArgs = {
    ids: Array<InputMaybe<Scalars['ID']>>;
    lang?: InputMaybe<Language>;
};

export enum Language {
    En = 'en',
    De = 'de',
}

export type Translation = {
    __typename?: 'Translation';
    Language?: Maybe<Scalars['String']>;
};

export type Translations = {
    __typename?: 'Translations';
    ID?: Maybe<Translation>;
};
