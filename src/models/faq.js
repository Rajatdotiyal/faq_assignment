const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to get translated content
faqSchema.methods.getTranslation = function(language) {
  if (language === 'en') {
    return {
      question: this.question,
      answer: this.answer
    };
  }
  
  return this.translations.get(language) || {
    question: this.question,
    answer: this.answer
  };
};

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;