const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const path = require('path');

class TranslationService {
  constructor() {
    try {
      const credentialsPath = path.resolve(process.cwd(), 'credentials.json');
      
      this.translate = new Translate({
        keyFilename: credentialsPath,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    } catch (error) {
      throw error;
    }
  }

  async validateSetup() {
    try {
      const [translation] = await this.translate.translate('Hello', 'es');
     
      return true;
    } catch (error) {
      return false;
    }
  }

  async translateText(text, targetLanguage) {
    try {
      if (!text || !targetLanguage) {
        throw new Error('Text and target language are required');
      }

      const [translation] = await this.translate.translate(text, targetLanguage);
      return translation;
    } catch (error) {
      throw error; 
    }
  }

  async translateFAQ(faq, targetLanguage) {
    try {
      if (!faq?.question || !faq?.answer || !targetLanguage) {
        throw new Error('FAQ object must contain question and answer, and target language is required');
      }

      const [translatedQuestion, translatedAnswer] = await Promise.all([
        this.translateText(faq.question, targetLanguage),
        this.translateText(faq.answer, targetLanguage)
      ]);

      return {
        question: translatedQuestion,
        answer: translatedAnswer
      };
    } catch (error) {
      throw error;
    }
  }
}


module.exports = TranslationService;