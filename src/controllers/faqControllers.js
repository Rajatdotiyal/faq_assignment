const FAQ = require('../models/faq');
const CacheService = require('../services/cacheService');

class FAQController {
  static async list(req, res, next) {
    try {
      // Get language from query parameter, default to 'en'
      const lang = req.query.lang || 'en';
      
      // Validate language
      const supportedLanguages = ['en', 'hi', 'bn'];
      if (!supportedLanguages.includes(lang)) {
        return res.status(400).json({ 
          error: 'Unsupported language',
          supportedLanguages 
        });
      }

      const faqs = await FAQ.find({ isActive: true });

      
      const translatedFAQs = await Promise.all(
        faqs.map(async (faq) => {
          const translation = faq.getTranslation(lang);
          return {
            id: faq._id,
            question: translation.question,
            answer: translation.answer,
            language: lang
          };
        })
      );

      res.json({
        language: lang,
        count: translatedFAQs.length,
        faqs: translatedFAQs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'en';

      // Validate language
      const supportedLanguages = ['en', 'hi', 'bn'];
      if (!supportedLanguages.includes(lang)) {
        return res.status(400).json({ 
          error: 'Unsupported language',
          supportedLanguages 
        });
      }

      const cacheKey = `faq:${id}:${lang}`;
      const cachedFAQ = await CacheService.get(cacheKey);
      
      if (cachedFAQ) {
        return res.json({
          language: lang,
          faq: cachedFAQ
        });
      }

      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      const translation = faq.getTranslation(lang);
      const translatedFAQ = {
        id: faq._id,
        question: translation.question,
        answer: translation.answer,
        language: lang
      };

      await CacheService.set(cacheKey, translatedFAQ);

      res.json({
        language: lang,
        faq: translatedFAQ
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { question, answer } = req.body;
      
      // Create FAQ with English content first
      const faq = new FAQ({
        question,
        answer,
        translations: new Map()
      });

      // Generate translations for Hindi and Bengali
      const languages = ['hi', 'bn'];
      for (const lang of languages) { 
        const translatedQuestion = await req.translate(question, lang);
        const translatedAnswer = await req.translate(answer, lang);
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      }

      await faq.save();
      res.status(201).json({
        message: 'FAQ created successfully',
        faq: {
          id: faq._id,
          question: faq.question,
          answer: faq.answer,
          translations: Object.fromEntries(faq.translations)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;

      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      faq.question = question;
      faq.answer = answer;

      // Update translations for Hindi and Bengali
      const languages = ['hi', 'bn'];
      for (const lang of languages) {
        const translatedQuestion = await req.translate(question, lang);
        const translatedAnswer = await req.translate(answer, lang);
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      }

      await faq.save();
      
      // Invalidate cache for all languages
      const language = ['en', 'hi', 'bn'];
      for (const lang of language) {
        const cacheKey = `faq:${id}:${lang}`;
        await CacheService.client.del(cacheKey);
      }

      res.json({
        message: 'FAQ updated successfully',
        faq: {
          id: faq._id,
          question: faq.question,
          answer: faq.answer,
          translations: Object.fromEntries(faq.translations)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FAQController;