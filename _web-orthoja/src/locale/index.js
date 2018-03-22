// Store
import { store } from "../redux";
// Language support (redux actions to dispatch)
import { initialize as localeInitialize, addTranslationForLanguage } from 'react-localize-redux';
// ====================================================================================================
// LOCALIZATION CONFIGURATION
// --------------------------------------------------------------------------------
export const languages = [
    { name: 'English (US)', code: 'en-us' },
    { name: 'English (UK)', code: 'en-uk' },
    { name: 'Italiano', code: 'it' }
];

// Associate translation files.
const englishUSTranslationFile = require('./en-us.json');
const englishUKTranslationFile = require('./en-uk.json');
const italianTranslationFile = require('./it.json');

// Missing translation message
const missingTranslationMessage = '\uFFFD';

export const initializeLocale = () => {
    store.dispatch(localeInitialize(languages, { missingTranslationMsg: missingTranslationMessage }));

    store.dispatch(addTranslationForLanguage(englishUSTranslationFile, 'en-us'));
    store.dispatch(addTranslationForLanguage(englishUKTranslationFile, 'en-uk'));
    store.dispatch(addTranslationForLanguage(italianTranslationFile, 'it'));
}