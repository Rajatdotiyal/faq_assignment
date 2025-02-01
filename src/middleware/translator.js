const TranslationService = require('../services/translationService');

const translatorMiddleware = () => {
  // Create a single instance of TranslationService to be shared across requests
  const translationService = new TranslationService();
  let isServiceValidated = false;

  return async (req, res, next) => {
    try {
      // Validate service on first request only
      if (!isServiceValidated) {
        const isValid = await translationService.validateSetup();
        if (!isValid) {
          throw new Error('Translation service failed validation');
        }
        isServiceValidated = true;
      }

      // Add translation helper to the request object
      req.translate = async (text, targetLanguage) => {
        if (!text || !targetLanguage || targetLanguage === 'en') {
          return text;
        }

        try {
          return await translationService.translateText(text, targetLanguage);
        } catch (error) {
          console.error('Translation middleware error:', error);
          // Log additional error details for debugging
          console.error('Failed text:', text);
          console.error('Target language:', targetLanguage);
          return text; // Fallback to original text
        }
      };

      // Add bulk translation helper with improved error handling and validation
      req.translateBulk = async (items, targetLanguage, fields) => {
        if (!items || !Array.isArray(items) || !fields || !Array.isArray(fields)) {
          throw new Error('Invalid input: items and fields must be arrays');
        }

        if (!targetLanguage || targetLanguage === 'en') {
          return items;
        }

        try {
          const translatedItems = await Promise.all(
            items.map(async (item, index) => {
              const translatedItem = { ...item };
              
              try {
                await Promise.all(
                  fields.map(async (field) => {
                    if (item[field]) {
                      translatedItem[field] = await translationService.translateText(
                        item[field],
                        targetLanguage
                      );
                    }
                  })
                );
              } catch (fieldError) {
                console.error(`Error translating item ${index}, falling back to original:`, fieldError);
                return item; // Fallback to original item on individual translation failure
              }
              
              return translatedItem;
            })
          );

          return translatedItems;
        } catch (error) {
          console.error('Bulk translation error:', error);
          console.error('Failed items count:', items.length);
          console.error('Target language:', targetLanguage);
          console.error('Fields to translate:', fields);
          return items; // Fallback to original items
        }
      };

      // Add FAQ translation helper
      req.translateFAQ = async (faq, targetLanguage) => {
        if (!faq || !targetLanguage || targetLanguage === 'en') {
          return faq;
        }

        try {
          return await translationService.translateFAQ(faq, targetLanguage);
        } catch (error) {
          console.error('FAQ translation error:', error);
          return faq; // Fallback to original FAQ
        }
      };

      // Add bulk FAQ translation helper
      req.translateFAQBulk = async (faqs, targetLanguage) => {
        if (!Array.isArray(faqs)) {
          throw new Error('FAQs must be an array');
        }

        if (!targetLanguage || targetLanguage === 'en') {
          return faqs;
        }

        try {
          return await Promise.all(
            faqs.map(async (faq) => req.translateFAQ(faq, targetLanguage))
          );
        } catch (error) {
          console.error('Bulk FAQ translation error:', error);
          return faqs; // Fallback to original FAQs
        }
      };

      next();
    } catch (error) {
      console.error('Translation middleware initialization error:', error);
      // Don't fail the request if translation service is unavailable
      req.translate = async (text) => text;
      req.translateBulk = async (items) => items;
      req.translateFAQ = async (faq) => faq;
      req.translateFAQBulk = async (faqs) => faqs;
      next();
    }
  };
};

module.exports = translatorMiddleware;